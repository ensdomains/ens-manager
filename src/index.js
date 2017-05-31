import app from './App'
import './css/main.css'
import { setupWeb3 } from './api/web3'
import { getAddr, getContent } from './api/registry'
import { updatePublicResolver } from './updaters/nodes'

async function setupDefaults() {
  const defaultResolver = "resolver.eth";
  let resolverAddress = await getAddr(defaultResolver)
  updatePublicResolver(resolverAddress)
}

window.addEventListener('load', function() {
  setupWeb3().then(()=>{
    setupDefaults()
  })
})

app.render()
