export const mSwapNBridge = [
  {
    fn: 'exactInputSingleToEther(address,uint24,uint256,uint256,uint160)',
    selector: 'e473efd3',
    args: {
      tokenIn: '0x000000000000000000000000A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      fee: '0x0000000000000000000000000000000000000000000000000000000000000064',
      amountIn: '0x0000000000000000000000000000000000000000000000000000000005f5e100',
      amountOutMinimum: '0x0000000000000000000000000000000000000000000000000000000000000001',
      sqrtPriceLimitX96: '0x0000000000000000000000000000000000000000000000000000000000000000'
    },
    argsOrder: [
      'tokenIn',
      'fee',
      'amountIn',
      'amountOutMinimum',
      'sqrtPriceLimitX96'
    ],
    calldata: '0xe473efd3000000000000000000000000A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB4800000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000005f5e10000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
    readable: {
      action: 'swap',
      chain: { origin: 'ethereum', dest: 'ethereum' },
      tokens: [
        {
          name: 'USDC',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          relation: 'from'
        },
        {
          name: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          relation: 'to'
        }
      ],
      platform: 'uniswap'
    }
  },
  {
    fn: 'bridge',
    selector: '00000000',
    readable: {
      chain: { origin: 'ethereum', dest: 'polygon' },
      action: 'bridge',
      platform: 'bridge',
      tokens: [
        {
          name: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          relation: 'from'
        },
        {
          name: 'ETH',
          address: '0x0000000000000000000000000000000000000000',
          relation: 'to'
        }
      ]
    }
  }
]

export const mDependentSwaps = [
  {
    fn: 'exactInputSingleToEther(address,uint24,uint256,uint256,uint160)',
    selector: 'e473efd3',
    args: {
      tokenIn: '0x000000000000000000000000A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      fee: '0x0000000000000000000000000000000000000000000000000000000000000064',
      amountIn: '0x0000000000000000000000000000000000000000000000000000000005f5e100',
      amountOutMinimum: '0x0000000000000000000000000000000000000000000000000000000000000001',
      sqrtPriceLimitX96: '0x0000000000000000000000000000000000000000000000000000000000000000'
    },
    argsOrder: [
      'tokenIn',
      'fee',
      'amountIn',
      'amountOutMinimum',
      'sqrtPriceLimitX96'
    ],
    calldata: '0xe473efd3000000000000000000000000A0b86991c6218b36c1d19D4a2e9Eb0cE3606eB4800000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000005f5e10000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
    readable: {
      action: 'swap',
      chain: { origin: 'ethereum', dest: 'ethereum' },
      tokens: [
        {
          name: 'USDC',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          relation: 'from'
        },
        {
          name: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          relation: 'to'
        }
      ],
      platform: 'uniswap'
    }
  },
  {
    fn: 'exactInputSingleFromEther(address,uint24,uint256,uint256,uint160)',
    selector: '8aa5b89b',
    args: {
      tokenOut: '0x0000000000000000000000007c9f4C87d911613Fe9ca58b579f737911AAD2D43',
      fee: '0x0000000000000000000000000000000000000000000000000000000000000064',
      amountIn: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
      amountOutMinimum: '0x0000000000000000000000000000000000000000000000000000000000000001',
      sqrtPriceLimitX96: '0x0000000000000000000000000000000000000000000000000000000000000000'
    },
    argsOrder: [
      'tokenOut',
      'fee',
      'amountIn',
      'amountOutMinimum',
      'sqrtPriceLimitX96'
    ],
    calldata: '0x8aa5b89b0000000000000000000000007c9f4C87d911613Fe9ca58b579f737911AAD2D43000000000000000000000000000000000000000000000000000000000000006411579208923731619542357098500868790785326998466564056403945758400791312963993500000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000',
    readable: {
      action: 'swap',
      chain: { origin: 'ethereum', dest: 'ethereum' },
      tokens: [
        {
          name: 'ETH',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          relation: 'from'
        },
        {
          name: 'MATIC',
          address: '0x7c9f4C87d911613Fe9ca58b579f737911AAD2D43',
          relation: 'to'
        }
      ],
      platform: 'uniswap'
    }
  }
]
