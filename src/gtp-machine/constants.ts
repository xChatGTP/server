export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const ZERO_CONFIG = '0x0000000000000000000000000000000000000000000000000000000000000000'

export const CHAIN_IDS: { [key: string]: number } = {
  ethereum: 1,
  polygon: 137,
}

export const TOKENS: { [key: string]: { [k: string]: string } } = {
  ethereum: {
    ETH: ZERO_ADDRESS,
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    MATIC: '0x7c9f4C87d911613Fe9ca58b579f737911AAD2D43', // wrapped wormhole MATIC
  },
  polygon: {
    MATIC: ZERO_ADDRESS,
    WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    DAI: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    ETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', // placement as wrapped
    WETH: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  }
}

export const NATIVE_TOKENS: { [key: string]: string } = {
  ethereum: TOKENS.ethereum.WETH,
  polygon: TOKENS.polygon.WMATIC,
}

export const HANDLERS: { [key: string]: { [k: string]: string } } = {
  ethereum: {
    inject: '0x',
    uniswap: '0x',
  },
  polygon: {
    inject: '0x',
    uniswap: '0x',
  },
}

export const FN_SIGS: { [key: string]: { [key: string]: string } } = {
  inject: {
    inject: 'd0797f84',
  },
  // uniswap: {
  //   exactInputSingleToEther: ''
  // },
}
