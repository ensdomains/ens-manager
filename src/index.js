import ReactDOM from 'react-dom'
import React from 'react'
import './App'
import './css/main.css'
import { setupWeb3 } from './api/web3'
import { getAddr, getContent } from './api/registry'
import { updatePublicResolver } from './updaters/nodes'
import { render } from 'redaxe'
import Main from './Main'


async function setupDefaults() {
  const defaultResolver = "resolver.eth";
  let resolverAddress = await getAddr(defaultResolver)
  updatePublicResolver(resolverAddress)
}

render(() => ReactDOM.render(<Main />, document.getElementById('root')))


window.addEventListener('load', function() {
  setupWeb3().then(()=>{
    setupDefaults()
  })
})
