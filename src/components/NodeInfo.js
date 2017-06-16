import React from 'react'
import { db } from 'redaxe'
import {
  setNewOwner,
  setSubnodeOwner,
  checkSubDomain,
  setResolver,
  createSubDomain,
  deleteSubDomain
} from '../api/registry'
import {
  appendSubDomain,
  updateNode,
  resolveUpdatePath,
  removeSubDomain,
  getNodeInfoSelector as getNodeInfo
} from '../updaters/nodes'
import {
  updateForm,
  switchTab
} from '../updaters/nodeDetails'
import { watchEvent, stopWatching } from '../api/watchers'
import { getNamehash } from '../api/ens'
import { addNotification, addActionNotification } from '../updaters/notifications'
import getWeb3 from '../api/web3'
import { getEtherScanAddr } from '../lib/utils'
import classnames from 'classnames'

import ResolverInfo from './ResolverInfo'

function handleUpdateOwner(name, newOwner){
  updateForm('newOwner', '')
  let domainArray = name.split('.')
  if(domainArray.length > 2) {
    setSubnodeOwner(domainArray[0], domainArray.slice(1).join('.'), newOwner)
      .then(txId => {
        console.log(txId)
        watch(name)
      })
  } else {
    setNewOwner(name, newOwner).then(txId => {
      console.log(txId)
      watch(name)
    })
  }

  function watch(){
    watchEvent('Transfer', name, (error, log, event) => {
      console.log(log)
      console.log(event)
      updateNode(name, 'owner', log.args.owner)
      addNotification(`New owner found for ${name}`)
      stopWatching(event, db.getIn(['watchers', event.event]) === 0)
    })
  }
}

function handleSetDefaultResolver(){
  updateForm('newResolver', db.get('publicResolver'))
}

function handleSetResolver(name, newResolver) {
  updateForm('newResolver', '')
  setResolver(name, newResolver).then(txId => {
    addActionNotification({
      message: `New Resolver tx sent for ${name}`,
      action: 'View Tx',
      onClick: async () => {
        let etherscanAddr = await getEtherScanAddr()
        let txLink = `${etherscanAddr}/tx/${txId}`
        console.log(txLink)
        window.open(`${etherscanAddr}/tx/${txId}`, "_blank");
      },
      dismissAfter: false
    })
    watchEvent('NewResolver', name, (error, log, event) => {
      updateNode(name, 'resolver', log.args.resolver)
      addActionNotification({
        message: `New Resolver for ${name} confirmed!`,
        action: 'View Tx',
        onClick: async () => {
          let etherscanAddr = await getEtherScanAddr()
          let txLink = `${etherscanAddr}/tx/${txId}`
          console.log(txLink)
          window.open(`${etherscanAddr}/tx/${txId}`,"_blank");
        },
        dismissAfter: false
      })
      event.stopWatching()
    })
  })
}

function handleCheckSubDomain(subDomain, domain){
  updateForm('subDomain', '')
  checkSubDomain(subDomain, domain).then(address => {
    if(address !== "0x0000000000000000000000000000000000000000"){
      appendSubDomain(subDomain, domain, address)
    } else {
      console.log('no subdomain with that name')
    }
  })
}

function handleCreateSubDomain(subDomain, domain){
  updateForm('newSubDomain', '')
  checkSubDomain(subDomain, domain).then(address => {
    console.log('here', subDomain, domain, address)
    if(address !== "0x0000000000000000000000000000000000000000"){
      console.log('subdomain already exists!')
    } else {
      createSubDomain(subDomain, domain).then(({ owner, txId }) => {
        watchEvent('NewOwner', domain,  async (error, log, event) => {
          //TODO check if this subdomain really is the same one submitted
          // if it is cancel event
          let { web3 } = await getWeb3()
          let labelHash = web3.sha3(subDomain)
          if(log.args.owner === owner && labelHash === log.args.label) {
            appendSubDomain(subDomain, domain, log.args.owner)
            event.stopWatching()
          }
        })
      })
    }
  })
}

function handleDeleteSubDomain(subDomain, domain){
  checkSubDomain(subDomain, domain).then(address => {
    console.log('here', subDomain, domain, address)
    if(address === "0x0000000000000000000000000000000000000000"){
      addNotification('subdomain already deleted!')
    } else {
      deleteSubDomain(subDomain, domain).then(txId => {
        watchEvent('NewOwner', domain, async (error, log, event) => {
          let { web3 } = await getWeb3()
          let labelHash = web3.sha3(subDomain)
          if(parseInt(log.args.owner, 16) === 0 && log.args.label === labelHash){
            removeSubDomain(subDomain, domain)
            addNotification('subdomain ' + subDomain + '.' + domain + ' deleted')
            event.stopWatching()
          }
        })
      })
    }
  })
}

function handleOnChange(formName, newOwner){
  updateForm(formName, newOwner)
}

function handleSwitchTab(tab){
  switchTab(tab)
}

const Tabs = ({ selectedNode, currentTab }) => {
  let resolverTab,
      hasResolver = parseInt(getNodeInfo(selectedNode, 'resolver'), 16) !== 0

  function handleResolverTabSwitch(){
    if(hasResolver){
      handleSwitchTab('resolverDetails')
    } else {
      addNotification('Please add a resolver first')
    }
  }

  return <div className="tabs">
    <h2 className={classnames('tab', {current: currentTab === "nodeDetails"})} onClick={() => handleSwitchTab('nodeDetails')}>Node Details</h2>
    <h2 className={classnames('tab', {current: currentTab === "resolverDetails", "has-resolver": hasResolver})} onClick={handleResolverTabSwitch}>Resolver Details</h2>
  </div>
}

const NodeDetails = ({ selectedNode }) => <div>
  <div className="input-group">
    <input placeholder="0x..." type="text" name="newOwner"
      value={db.getIn(['updateForm', 'newOwner'])}
      onChange={(e)=> handleOnChange('newOwner', e.target.value)}/>
    <button
      onClick={(e)=> handleUpdateOwner(getNodeInfo(selectedNode, 'name'), db.getIn(['updateForm', 'newOwner']))}>Update owner</button>
  </div>
  <div className="input-group">
    <input
      type="text"
      name="resolver"
      value={db.getIn(['updateForm', 'newResolver'])}
      onChange={(e)=> handleOnChange('newResolver', e.target.value)}
    />
    <button placeholder="0x..." onClick={() => handleSetResolver(getNodeInfo(selectedNode, 'name'), db.getIn(['updateForm', 'newResolver']))}>Set Resolver</button>
  </div>
  <button onClick={() => handleSetDefaultResolver()}>Use default resolver</button>
  <div className="input-group">
    <input type="text" name="subDomain" value={db.getIn(['updateForm', 'subDomain'])} onChange={(e)=> handleOnChange('subDomain', e.target.value)} />
    <button onClick={() => handleCheckSubDomain(db.getIn(['updateForm', 'subDomain']), getNodeInfo(selectedNode, 'name'))}>Check for subdomain</button>
  </div>
  <div className="input-group">
    <input type="text" name="subDomain" value={db.getIn(['updateForm', 'newSubDomain'])} onChange={(e)=> handleOnChange('newSubDomain', e.target.value)} />
    <button onClick={() => handleCreateSubDomain(db.getIn(['updateForm', 'newSubDomain']), getNodeInfo(selectedNode, 'name'))}>Create new subdomain</button>
  </div>
  <button onClick={() => handleDeleteSubDomain(getNodeInfo(selectedNode, 'label'), getNodeInfo(selectedNode, 'node'))}>Delete Node</button>
</div>

export default () => {
  const selectedNode = db.get('selectedNode')
  let content = <div>Search and select a domain to start managing your domains!</div>,
      tabContent = null,
      currentTab = db.get('currentTab')

  if(selectedNode.length > 0){
    switch(currentTab) {
      case 'nodeDetails':
        tabContent = <NodeDetails selectedNode={selectedNode} />
        break
      case 'resolverDetails':
        tabContent = <ResolverInfo selectedNode={selectedNode} handleOnChange={handleOnChange} />
        break
    }

    content = (
      <div>
        <Tabs selectedNode={selectedNode} currentTab={currentTab} />
        <div className="info-container">
          <div className="current-node info">{getNodeInfo(selectedNode, 'name')}</div>
          <div className="current-owner info">Owner: {getNodeInfo(selectedNode, 'owner')}</div>
          <div className="current-resolver info">Resolver: {getNodeInfo(selectedNode, 'resolver')}</div>
        </div>
        {tabContent}
      </div>
    )
  }

  return (
    <div className="node-info">
      {content}
    </div>
  )
}
