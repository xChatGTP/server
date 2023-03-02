import dotenv from 'dotenv'
import Joi from 'joi'
import * as path from 'path'
import { fileURLToPath } from 'url'

// @ts-ignore
// const dirname = path.dirname(fileURLToPath(import.meta.url))
const dirname = __dirname

const envFileName = process.env.NODE_ENV === 'production' ? '.env' : '.env.dev'

// dotenv.config({ path: path.join(dirname, `../../${envFileName}`) })
console.log(path.join(dirname, `../../${envFileName}`))
dotenv.config({ path: path.join(dirname, `../../${envFileName}`) })

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
    // PORT: Joi.number().default(8080),
    // PRIVATE_KEY: Joi.string().required(),
    OPENAI_API_KEY: Joi.string().required(),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,

  privateKey: envVars.PRIVATE_KEY,

  openAIKey: envVars.OPENAI_API_KEY,
}
