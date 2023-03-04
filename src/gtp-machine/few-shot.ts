// bridge "all" => 100% of previous output
const fewShotPrompt = `
Prompt: Swap 100 DAI to MATIC on Ethereum
Analyze in JSON format: 
{
  "platform": "Uniswap",
  "chain": {
    "origin": "Ethereum",
    "dest": "Ethereum"
  },
  "action": "swap",
  "relations": [
    {
      "relation": "from",
      "entity": "DAI",
      "value": "100"
    },
    {
      "relation": "to",
      "entity": "MATIC",
      "value": "null"
    }
  ]
}
########
Prompt: Convert 1 AVAX to USDC using Pangolin on Avalanche
Analyze in JSON format: 
{
  "platform": "Pangolin",
  "chain": {
    "origin": "Avalanche",
    "dest": "Avalanche"
  },
  "action": "swap",
  "relations": [
    {
      "relation": "from",
      "entity": "AVAX",
      "value": "1"
    },
    {
      "relation": "to",
      "entity": "USDC",
      "value": "null"
    }
  ]
}
########
Prompt: Swap all bridged MATIC to USDC on Ethereum
Analyze in JSON format: 
{
  "platform": "Uniswap",
  "chain": {
    "origin": "Ethereum",
    "dest": "Ethereum"
  },
  "action": "swap",
  "relations": [
    {
      "relation": "from",
      "entity": "MATIC",
      "value": "all"
    },
    {
      "relation": "to",
      "entity": "USDC",
      "value": "null"
    }
  ]
}
########
Prompt: Bridge all swapped MATIC from Ethereum to Polygon
Analyze in JSON format:
{
  "platform": "Bridge",
  "chain": {
    "origin": "Ethereum",
    "dest": "Polygon"
  },
  "action": "bridge",
  "relations": [
    {
      "relation": "from",
      "entity": "MATIC",
      "value": "all"
    },
    {
      "relation": "to",
      "entity": "null",
      "value": "null"
    }
  ]
}
########
Prompt: LP all MATIC and USDC on Uniswap on Polygon
Analyze in JSON format:
{
  "platform": "Uniswap",
  "chain": {
    "origin": "Polygon",
    "dest": "Polygon"
  },
  "action": "liquidity provide",
  "relations": [
    {
      "relation": "from",
      "entity": "MATIC",
      "value": "all"
    },
    {
      "relation": "from",
      "entity": "USDC",
      "value": "all"
    }
  ]
}
########
`

export function generateFewShotPrompt(prompt: string): string {
  return `${fewShotPrompt}\nPrompt: ${prompt}\nAnalyze in JSON format:`
}
