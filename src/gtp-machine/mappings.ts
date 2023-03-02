import { default as bnjs } from 'bignumber.js'
import { BigNumber, utils } from 'ethers'

import { NATIVE_TOKENS, TOKENS, ZERO_ADDRESS } from './constants'
import { GTPResponse } from './types'

enum MapSwapAction {
  NATIVE_TO_TOKEN,
  TOKEN_TO_NATIVE,
  TOKEN_TO_TOKEN,
}

type MapSwapUniswapFee = 100 | 500 | 3000 | 10000 // 0.01%, 0.05%, 0.3%, 1%

interface MapSwapReturn {
  fn: string,
  selector: string,
  args: {
    // path?: [string[], MapSwapUniswapFee[]],
    path?: string, // encoded version of above
    amountIn?: string,
    amountInMaximum?: string,
    amountOut?: string,
    amountOutMinimum?: string,
    tokenIn?: string,
    fee?: string,
    sqrtPriceLimitX96?: string,
  },
  argsOrder: string[],
  calldata: string,
  readable: {
    chain?: string,
    action?: string,
    platform?: string,
    tokens?: {
      name: string,
      address: string,
      relation: string,
    }[],
  },
}

export type GTPMappingReturn = MapSwapReturn

export default class GTPMapping {
  private static supportedChains = {
    swap: ['ethereum', 'polygon']
  }

  private static supportedPlatforms = {
    swap: ['uniswap']
  }

  private static supportedTokens = {
    swap: ['ETH', 'MATIC', 'USDC']
  }

  public static mapActions(inp: GTPResponse): GTPMappingReturn {
    if (inp.action === 'swap') return this.mapSwap(inp)
    throw new Error('Invalid action!')
  }

  private static mapSwap(inp: GTPResponse): MapSwapReturn {
    const { relations } = inp
    const platform = inp.platform.toLowerCase()
    const chain = inp.chain.toLowerCase()

    if (!(this.supportedChains.swap.includes(chain))) throw new Error('Invalid swap chain!')
    if (!(this.supportedPlatforms.swap.includes(platform))) throw new Error('Invalid swap platform!')

    const from = relations.find(r => r.relation === 'from')
    const to = relations.find(r => r.relation === 'to')
    if (!from || !to) throw new Error('Invalid swap relations!')

    const [fromEntity, toEntity] = [from.entity.toUpperCase(), to.entity.toUpperCase()]
    // @ts-ignore
    let [fromToken, toToken] = [TOKENS[chain][fromEntity], TOKENS[chain][toEntity]]
    if (!fromToken || !toToken) throw new Error('Invalid swap tokens!')

    // Native token check
    if (fromToken === ZERO_ADDRESS && toToken === ZERO_ADDRESS) throw new Error('Invalid swap tokens, both native!')
    if (fromToken === ZERO_ADDRESS) fromToken = this.getWrappedNativeToken(chain)
    else if (toToken === ZERO_ADDRESS) toToken = this.getWrappedNativeToken(chain)

    // console.log(platform)
    // console.log(fromToken)
    // console.log(toToken)

    let action = MapSwapAction.TOKEN_TO_TOKEN
    if (this.isWrappedNativeToken(fromToken, chain)) action = MapSwapAction.NATIVE_TO_TOKEN
    else if (this.isWrappedNativeToken(toToken, chain)) action = MapSwapAction.TOKEN_TO_NATIVE

    const decimals = this.getDecimals(from.entity.toUpperCase())

    const ret: MapSwapReturn = {
      fn: '',
      selector: '',
      args: {},
      argsOrder: [],
      calldata: '0x',
      readable: {
        action: 'swap',
        chain,
        tokens: [
          {
            name: fromEntity,
            address: fromToken,
            relation: 'from',
          },
          {
            name: toEntity,
            address: toToken,
            relation: 'to',
          },
        ]
      },
    }

    if (platform == 'uniswap') {
      ret.readable.platform = 'uniswap'

      if (action === MapSwapAction.NATIVE_TO_TOKEN) {
        ret.fn = 'exactInputFromEther(bytes,uint256,uint256)'
        ret.selector = 'b5619b55'
        ret.argsOrder = ['path', 'amountIn', 'amountOutMinimum']
        // TODO: dynamic fee based to toToken (for Uniswap)
        ret.args.path = this.encodePath([fromToken, toToken], [500])
        ret.args.amountIn = this.zeroPadHex(this.decimalNumber(from.value, decimals), 32)
        ret.args.amountOutMinimum = this.zeroPadHex('1', 32) // set to min, 1 (incl decimals)
      } else if (action === MapSwapAction.TOKEN_TO_NATIVE) {
        ret.fn = 'exactInputSingleToEther(address,uint24,uint256,uint256,uint160)'
        ret.selector = 'e473efd3'
        ret.argsOrder = ['tokenIn', 'fee', 'amountIn', 'amountOutMinimum', 'sqrtPriceLimitX96']
        ret.args.tokenIn = utils.hexZeroPad(fromToken, 32) // zero-pad to 32 bytes for our customer uniswap handler
        // TODO: dynamic fee based on fromToken (pool dependent)
        ret.args.fee = this.zeroPadHex('100', 32) // 0.01% fee
        ret.args.amountIn = this.zeroPadHex(this.decimalNumber(from.value, decimals), 32)
        ret.args.amountOutMinimum = this.zeroPadHex('1', 32) // set to min, 1 (incl decimals)
        ret.args.sqrtPriceLimitX96 = this.zeroPadHex('0', 32)
      }

      ret.calldata += this.combineArgs(ret.argsOrder, ret.args)
    }

    return ret
  }

  private static getDecimals(token: string): number {
    if (token === 'USDC') return 6
    return 18
  }

  private static getWrappedNativeToken(chain: string): string {
    // @ts-ignore
    return NATIVE_TOKENS[chain] as string
  }

  private static isWrappedNativeToken(token: string, chain: string): boolean {
    return token === this.getWrappedNativeToken(chain)
  }

  private static decimalNumber(num: string | number, decimals: number): string {
    return (new bnjs(num)).times(new bnjs(10).pow(decimals)).toString()
  }

  /**
   * Encodes a path and fee array into a single hex string for Uniswap
   * @param path
   * @param fees Fee array, no fee for the last token (output)
   * @private
   */
  private static encodePath(path: string[], fees: MapSwapUniswapFee[]) {
    if (path.length != fees.length + 1) throw new Error('path-fee lengths do not match')

    let encoded = '0x'
    for (let i = 0; i < fees.length; i++) {
      // bytes.concat(
      //     bytes20(address(weth)),
      //     bytes3(uint24(60)),
      //     bytes20(address(usdc)),
      //     bytes3(uint24(10)),
      //     bytes20(address(usdt)),
      //     bytes3(uint24(60)),
      //     bytes20(address(wbtc))
      // );
      console.log(this.strip0x(String(path[i])), this.uniswapFeeToHex(fees[i]))
      encoded += this.strip0x(path[i]) // 20 byte encoding of the address (no 12 byte of 0-padding)
      encoded += this.uniswapFeeToHex(fees[i]) // 3 byte encoding of the fee
    }
    // encode the final token
    encoded += this.strip0x(path[path.length - 1])

    return encoded.toLowerCase()
  }

  /**
   * Converts a fee to a 3 byte hex string, where the first three hex is 000 (default padding)
   * @param fee
   * @private
   */
  private static uniswapFeeToHex(fee: MapSwapUniswapFee): string {
    return fee.toString(16).padStart(6, '0') // 3 hex, 3 0's default prepend
  }

  private static strip0x(str: string): string {
    return str.slice(0, 2) === '0x' ? str.slice(2) : str
  }

  private static combineArgs(argsOrder: string[], args: { [key: string]: any }): string {
    let ret = '' // don't prepend 0x
    for (const argName of argsOrder) ret += this.strip0x(args[argName])
    return ret
  }

  private static zeroPadHex(inp: string, length: number): string {
    return utils.hexZeroPad(utils.hexlify(BigNumber.from(inp).toHexString()), length)
  }
}
