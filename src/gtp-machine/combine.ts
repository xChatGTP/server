import {
  constants,
  utils,
} from 'ethers'

import {
  CHAIN_IDS,
  FN_SIGS,
  HANDLERS,
  NATIVE_TOKENS,
  TOKENS,
  ZERO_ADDRESS,
  ZERO_CONFIG,
} from './constants'
import {
  GTPCombineReturn,
  GTPMappingReturn,
  MapSwapReturn,
} from './types'
import { strip0x } from './utils'

export default class GTPCombine {
  static combine(gtpRes: GTPMappingReturn[]): GTPCombineReturn {
    const res: GTPCombineReturn = {
      tos: [],
      datas: [],
      configs: [],
    }

    let firstTxRes = gtpRes[0]
    const { action: firstTxAction } = firstTxRes.readable

    // Inject for swap
    if (firstTxAction === 'swap') {
      const fromToken = firstTxRes.readable.tokens?.filter(t => t.relation === 'from')[0]
      if (!fromToken) throw new Error('Invalid from token for the first tx!')

      // No need to inject for native to token swap
      if (fromToken.address !== ZERO_ADDRESS) {
        const chain = (firstTxRes.readable.chain as { origin: string }).origin.toLowerCase()
        const { args: { amountIn } } = firstTxRes as MapSwapReturn
        if (!amountIn) throw new Error('Invalid amountIn for the first tx!')

        let data = `0x${FN_SIGS.funds.inject}`
        data += strip0x(utils.hexZeroPad(utils.hexlify(64), 32)) // 00...040
        data += strip0x(utils.hexZeroPad(utils.hexlify(128), 32)) // 00...080

        data += strip0x(utils.hexZeroPad(utils.hexlify(1), 32)) // one deposit token
        data += strip0x(utils.hexZeroPad(fromToken.address, 32)) // deposit token addr

        data += strip0x(utils.hexZeroPad(utils.hexlify(1), 32)) // one amount data
        data += strip0x(amountIn) // deposit amount

        res.tos.push(HANDLERS[chain].funds) // inject addr
        res.configs.push(ZERO_CONFIG) // no config for inject
        res.datas.push(data) // inject calldata
      }
    }

    let curConfig = ZERO_CONFIG, nextConfig = ZERO_CONFIG, nextNextConfig = ZERO_CONFIG
    for (let i = 0; i < gtpRes.length; i++) {
      const nextTx = i < gtpRes.length - 1 ? gtpRes[i + 1] : undefined
      const curAction = gtpRes[i].readable.action
      const nextAction = nextTx ? nextTx.readable.action : undefined

      const fnSig = gtpRes[i].selector
      const chain = gtpRes[i].readable.chain as { origin: string, dest: string }
      const platform = gtpRes[i].readable.platform as string
      const fromToken = gtpRes[i].readable.tokens?.filter(t => t.relation === 'from')[0]
      const toToken = gtpRes[i].readable.tokens?.filter(t => t.relation === 'to')[0]
      chain.origin = chain.origin.toLowerCase()
      chain.dest = chain.dest.toLowerCase()

      // Config cases (only proceed if nothing from previous tx)
      if (curConfig === ZERO_CONFIG) {
        let nextNextAction
        if (nextAction === 'bridge' && i < gtpRes.length - 2) {
          const nextNextTx = i < gtpRes.length - 2 ? gtpRes[i] : undefined
          nextNextAction = nextNextTx ? nextNextTx.readable.action : undefined
        }
        console.log(curAction)
        console.log(nextAction)
        console.log(nextNextAction)

        if (curAction === 'swap') {
          if (nextAction === 'bridge' && !nextNextAction) {
            // Bridge after swap, and no next tx
            curConfig = '0x0001000000000000000000000000000000000000000000000000000000000000'
            nextConfig = '0x0100000000000000000100ffffffffffffffffffffffffffffffffffffffffff'
            nextNextConfig = ZERO_CONFIG
          } else if (nextAction === 'addLiquidityETH' || nextAction === 'addLiquidity') {
            // 00 01 0000000000000000 00000000000000000000000000000000000000000000
            // 01 00 0000000000000001 00ffffffffffffffffffffffffffffffffffffffffff
            curConfig = '0x0001000000000000000000000000000000000000000000000000000000000000'
            nextConfig = '0x0100000000000000000100ffffffffffffffffffffffffffffffffffffffffff'
            nextNextConfig = ZERO_CONFIG
          } else if (nextAction === 'bridge' && (nextNextAction === 'addLiquidityETH' || nextNextAction === 'addLiquidity')) {
            curConfig = '0x0001000000000000000000000000000000000000000000000000000000000000'
            nextConfig = ZERO_CONFIG
            nextNextConfig = '0x0100000000000000000100ffffffffffffffffffffffffffffffffffffffffff'
          } else if (nextAction === 'swap') {
            const nextFromToken = nextTx?.readable.tokens?.filter(t => t.relation === 'from')[0]
            // If the next swap uses the output token of the current swap (using the "all" value)
            if (
              fromToken?.name === nextFromToken?.name &&
              (nextTx as MapSwapReturn)?.args?.amountIn === constants.MaxUint256.toString()
            ) {
              curConfig = '0x0001000000000000000000000000000000000000000000000000000000000000'
              nextConfig = '0x0100000000000000000100ffffffffffffffffffffffffffffffffffffffffff'
              nextNextConfig = ZERO_CONFIG
            }
          } else if (nextAction === 'bridge' && nextNextAction === 'swap') {
            const bridgedToken = nextTx?.readable.tokens?.filter(t => t.relation === 'from')[0]
            if (toToken?.name !== bridgedToken?.name) throw new Error('You must bridge the output token of the previous tx!')
            // Bridge all after swap
            curConfig = '0x0001000000000000000000000000000000000000000000000000000000000000'
            nextConfig = '0x0100000000000000000100ffffffffffffffffffffffffffffffffffffffffff'

            const nextNextTx = i < gtpRes.length - 2 ? gtpRes[i + 2] : undefined
            // If the next swap uses the output token of the current swap (using the "all" value)
            if ((nextNextTx as MapSwapReturn)?.args?.amountIn === constants.MaxUint256.toString()) {
              nextConfig = '0x0101000000000000000100ffffffffffffffffffffffffffffffffffffffffff'
              nextNextConfig = '0x0100000000000000000100ffffffffffffffffffffffffffffffffffffffffff'
            }
          }
        }
      }

      // Push: address
      if (curAction !== 'bridge') {
        console.log(chain.origin, platform)
        res.tos.push(HANDLERS[chain.origin][platform])
      } else {
        res.tos.push(ZERO_ADDRESS)
      }

      // Push: data
      if (curAction !== 'bridge') {
        const curData = strip0x((gtpRes[i] as { calldata: string }).calldata)
        res.datas.push(`0x${fnSig}${curData}`)
      } else {
        // Bridge call data is the chain ID of the destination chain
        const { origin, dest } = chain
        if (!CHAIN_IDS[origin] || !CHAIN_IDS[dest]) throw new Error('Invalid chain origin/dest')
        const chainOrigin = strip0x(utils.hexZeroPad(utils.hexlify(CHAIN_IDS[origin]), 4)) // 4 bytes (8 hex)
        const chainDest = strip0x(utils.hexZeroPad(utils.hexlify(CHAIN_IDS[dest]), 4))
        const bridgedToken = strip0x(
          (gtpRes[i].readable.tokens as { relation: string, address: string }[]).filter(t => t.relation === 'from')[0].address
        )
        res.datas.push(`0x${fnSig}${chainOrigin}${chainDest}${bridgedToken}`)
      }

      // Push: config
      res.configs.push(curConfig)

      curConfig = nextConfig
      nextConfig = nextNextConfig
      nextNextConfig = ZERO_CONFIG
    }

    return res
  }
}
