export interface GTPResponse {
  platform: string,
  chain: {
    origin: string,
    dest: string,
  },
  action: string,
  relations: {
    relation: string,
    entity: string,
    value: string
  }[]
}

export enum MapSwapAction {
  NATIVE_TO_TOKEN,
  TOKEN_TO_NATIVE,
  TOKEN_TO_TOKEN,
}

export type MapSwapUniswapFee = 100 | 500 | 3000 | 10000 // 0.01%, 0.05%, 0.3%, 1%

export interface MapReadableReturn {
  fn: string,
  readable: {
    chain?: {
      origin: string,
      dest: string,
    }
    action?: string,
    platform?: string,
    tokens?: {
      name: string,
      address: string,
      relation: string,
    }[],
  },
}

export interface MapSwapReturn extends MapReadableReturn {
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
    tokenOut?: string,
    fee?: string,
    sqrtPriceLimitX96?: string,
  },
  argsOrder: string[],
  calldata: string,
}

export interface MapBridgeReturn extends MapReadableReturn {
  fn: string,
  selector: string,
}

export interface MapSendReturn extends MapReadableReturn {
  fn: string,
  selector: string,
  args: {
    token: string,
    to: string,
    amount: string,
  },
  calldata: string,
}

export type GTPMappingReturn = MapSwapReturn | MapBridgeReturn | MapSendReturn

export interface GTPCombineReturn {
  tos: string[],
  datas: string[],
  configs: string[],
}
