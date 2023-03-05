export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ZERO_CONFIG = '0x0000000000000000000000000000000000000000000000000000000000000000'

export const CHAIN_IDS: { [key: string]: number } = {
  ethereum: 5,
  polygon: 80001,
  avalanche: 43114,
  moonbase: 1287,
}

export const TOKENS: { [key: string]: { [k: string]: string } } = {
  ethereum: {
    ETH: ZERO_ADDRESS,
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    MATIC: '0x7c9f4C87d911613Fe9ca58b579f737911AAD2D43', // wrapped wormhole MATIC
    // axelar (mumbai)
    // AUSDC: '0x254d06f33bDc5b8ee05b2ea472107E300226659A',
  },
  polygon: {
    // mainnet
    // MATIC: ZERO_ADDRESS,
    // WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    DAI: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    ETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', // placeholder for wrapped
    // WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    // testnet
    MATIC: ZERO_ADDRESS,
    WMATIC: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    WDEV: '0xb6a2f51C219A66866263Cb18DD41EE6C51B464cB',
    WETH: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    // axelar (mumbai)
    AUSDC: '0x2c852e740B62308c46DD29B982FBb650D063Bd07',
  },
  avalanche: {
    AVAX: ZERO_ADDRESS,
    WAVAX: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    USDC: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', // official USDC
    USDCe: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664', // core-bridged USDC
    ETH: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab', // placeholder for WETH.e
    WETH: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab', // placeholder for WETH.e
    WETHe: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
    // axelar (fuji)
    AUSDC: '0x57F1c63497AEe0bE305B8852b354CEc793da43bB',
  },
  moonbase: {
    WDEV: '0x1436aE0dF0A8663F18c0Ec51d7e2E46591730715',
    MATIC: '0xde3db4fd7d7a5cc7d8811b7bafa4103fd90282f3', // same as WMATIC
    WMATIC: '0xde3db4fd7d7a5cc7d8811b7bafa4103fd90282f3', // axelar-wrapped WMATIC
    // axelar
    AUSDC: '0xD1633F7Fb3d716643125d6415d4177bC36b7186b',
  },
}

export const NATIVE_TOKENS: { [key: string]: string } = {
  ethereum: TOKENS.ethereum.WETH,
  polygon: TOKENS.polygon.WMATIC,
  avalanche: TOKENS.avalanche.WAVAX,
  moonbase: TOKENS.moonbase.WDEV,
}

export const HANDLERS: { [key: string]: { [k: string]: string } } = {
  ethereum: {
    inject: '0x',
    uniswap: '0x',
  },
  polygon: { // mumbai
    funds: '0xf0Ec636d1Ab91CD2D7c683713bffd74d8fbBFfAf', // hfunds - inject, send, etc.
    uniswap: '0x71766C5B91D00e303A345124f4EBf542595c7749',
  },
  avalanche: {
    inject: '0x',
    uniswap: '0x',
  },
  moonbase: {
    funds: '0xBD1869806cf43d90589D27d28af5eDCB3C84FFf4', // hfunds - inject, send, etc.
  }
}

export const FN_SIGS: { [key: string]: { [key: string]: string } } = {
  funds: {
    inject: 'd0797f84',
    send: '18248f2a',
  },
  // uniswap: {
  //   exactInputSingleToEther: ''
  // },
}
