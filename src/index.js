import ReactDOM from 'react-dom'
import React from 'react'
import render from './App'
import './css/main.css'
import { setupWeb3 } from './api/web3'
import { getAddr, getContent, getName } from './api/registry'
import { setPublicResolver, setReverseRecordDetails } from './updaters/nodes'
import { getAccounts } from './api/web3'
import { setCurrentAccounts } from './updaters/config'
import { selectReverseNode } from './updaters/nodeDetails'
import { addNotification } from './updaters/notifications'
import Main from './Main'


async function setupDefaults() {
  const defaultResolver = "resolver.eth";
  let resolverAddressPromise = getAddr(defaultResolver)
  let accountsPromise = getAccounts()

  Promise.all([resolverAddressPromise, accountsPromise]).then(([resolverAddress, accounts]) => {
    let hasAccounts = accounts.length > 0
    setPublicResolver(resolverAddress)

    if(hasAccounts) {
      setCurrentAccounts(accounts)
      getName(accounts[0])
        .then(({name, resolverAddr}) => {
          setReverseRecordDetails({
            address: accounts[0],
            name,
            resolver: resolverAddr
          })

          selectReverseNode(accounts[0])
        })
        .catch(err => {
          console.log(err)
          setReverseRecordDetails({
            address: accounts[0],
            name: '0x',
            resolverAddr: '0x'
          })
          selectReverseNode(accounts[0])
        })
    } else {
      addNotification('No account connected. Please connect account to make changes')
    }

  })
}

render(() => ReactDOM.render(<Main />, document.getElementById('root')))


window.addEventListener('load', function() {
  setupWeb3().then(()=>{
    setupDefaults()
  })
})
