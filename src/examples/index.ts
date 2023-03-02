import { swapPrompt, swapRes } from './swap'

import GTPMapping from '../gtp-machine/mappings'

function main() {
  console.log(swapRes)
  const action = GTPMapping.mapActions(swapRes)
  console.log(action)
}

main()
