import { Configuration, OpenAIApi } from 'openai'
import * as util from 'util'

import envVars from '../config/env-vars'
import { generateFewShotPrompt } from './few-shot'
import {
  GTPResponse,
  GTPMappingReturn,
  GTPCombineReturn,
} from './types'
import GTPMapping from './mappings'
import GTPCombine from './combine'
import { swapRes } from '../examples/swap'

const configuration = new Configuration({
  apiKey: envVars.openAIKey,
})

const openai = new OpenAIApi(configuration)

export type GTPGenerateResponse = GTPMappingReturn | { error: string }

export default class GTPMachine {

  /**
   * Generate a response from a prompt
   * @param prompt Example: "Swap 100 USDC to MATIC on Ethereum"
   */
  static async generate(prompt: string): Promise<GTPGenerateResponse> {
    const res = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: generateFewShotPrompt(prompt),
      temperature: 0.5,
      max_tokens: 768,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    // @ts-ignore
    const gptRes = res.data.choices[0].text as string
    console.log(prompt)
    console.log(gptRes)

    let parsedRes: GTPResponse
    try {
      parsedRes = JSON.parse(gptRes.replace('\n', '')) as GTPResponse
    } catch {
      throw new Error('Invalid JSON from GPT')
    }

    try {
      return GTPMapping.mapActions(parsedRes)
    } catch (e) {
      console.log(e)
      throw new Error('Error while mapping action')
    }
  }

  static generateExample(): GTPGenerateResponse {
    const parsedRes = swapRes as GTPResponse
    return GTPMapping.mapActions(parsedRes)
  }

  static combine(gtpRes: GTPMappingReturn[]): GTPCombineReturn {
    console.log(util.inspect(gtpRes, false, null, true))
    const res = GTPCombine.combine(gtpRes)
    console.log(util.inspect(res, false, null, true))
    return res
  }
}
