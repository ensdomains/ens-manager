import ReactDOM from 'react-dom'
import React from 'react'
import render from './App'
import './css/main.css'
import { setupWeb3 } from './api/web3'
import { getAddr, getContent, getName } from './api/registry'
import { setPublicResolver, setReverseRecordDetails } from './updaters/nodes'
import { getCurrentAccount } from './api/web3'
import { setCurrentAccount } from './updaters/config'
import { selectReverseNode } from './updaters/nodeDetails'
import Main from './Main'


async function setupDefaults() {
  const defaultResolver = "resolver.eth";
  let resolverAddressPromise = getAddr(defaultResolver)
  let currentAccountPromise = getCurrentAccount()

  Promise.all([resolverAddressPromise, currentAccountPromise]).then(([resolverAddress, currentAccount]) => {
    setPublicResolver(resolverAddress)
    setCurrentAccount(currentAccount)


    getName(currentAccount)
      .then(({name, resolverAddr}) => {
        setReverseRecordDetails({
          address: currentAccount,
          name,
          resolver: resolverAddr
        })
        selectReverseNode(currentAccount)
      })
      .catch(err => {
        console.log(err)
        setReverseRecordDetails({
          address: currentAccount,
          name: '0x',
          resolverAddr: '0x'
        })
        selectReverseNode(currentAccount)
      })
  })
}

render(() => ReactDOM.render(<Main />, document.getElementById('root')))


window.addEventListener('load', function() {
  setupWeb3().then(()=>{
    setupDefaults()
  })
})
