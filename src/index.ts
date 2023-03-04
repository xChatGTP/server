import cors from 'cors'
import express from 'express'

import GTPMachine from './gtp-machine'
import { GTPMappingReturn } from './gtp-machine/types'

const app = express()
const port = 8080

app.use(cors())
app.use(express.json()) // express.urlencoded()

app.get('/generate', async (req, res) => {
  const prompt = req.query.prompt as string
  if (!prompt) {
    res.status(422).send('Missing prompt')
    return
  }

  try {
    const gtpRes = await GTPMachine.generate(prompt)
    // const gtpRes = GTPMachine.generateExample()
    res.status(200).send(gtpRes)
  } catch (e) {
    console.log(e)
    res.status(500).send('Server error')
  }
})

app.post('/combine', (req, res) => {
  console.log(req.body)
  const gtpRes = req.body.gtpResponses as GTPMappingReturn[]
  if (!gtpRes.length) {
    res.status(422).send('Missing GTP Responses')
    return
  }

  try {
    const combinedData = GTPMachine.combine(gtpRes)
    res.status(200).send(combinedData)
  } catch (e) {
    console.log(e)
    res.status(500).send('Server error')
  }
})

app.listen(port, () => {
  console.log(`ChatGTP server listening on port ${port}`)
})
