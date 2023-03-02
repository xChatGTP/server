import express from 'express'

import GTPMachine from './gtp-machine'

const app = express()
const port = 8080

app.get('/generate', async (req, res) => {
  const prompt = req.query.prompt as string
  if (!prompt) {
    res.status(422).send('Missing prompt')
    return
  }

  try {
    // const gtpRes = await GTPMachine.generate(prompt)
    const gtpRes = GTPMachine.generateExample()
    res.status(200).send(gtpRes)
  } catch (e) {
    console.log(e)
    res.status(500).send('Server error')
  }
})

app.listen(port, () => {
  console.log(`ChatGTP server listening on port ${port}`)
})
