import React from 'react'
import { db } from 'redaxe'
import {
  setNewOwner,
  setSubnodeOwner,
  checkSubDomain,
  setResolver,
  createSubDomain,
  deleteSubDomain,
  getResolver,
  getResolverDetails
} from '../api/registry'
import {
  appendSubDomain,
  updateNode,
  resolveQueryPath,
  removeSubDomain,
  getNodeInfo,
  getParentNode
} from '../updaters/nodes'
import {
  updateForm,
  switchTab
} from '../updaters/nodeDetails'
import { watchRegistryEvent, watchResolverEvent, stopWatching } from '../api/watchers'
import { getNamehash } from '../api/ens'
import { addNotification } from '../updaters/notifications'
import getWeb3 from '../api/web3'
import { getEtherScanAddr } from '../lib/utils'
import classnames from 'classnames'

import ResolverDetails from './ResolverDetails'
import TxLink from './TxLink'

async function handleUpdateOwner(name, newOwner){
  let etherscanAddr = await getEtherScanAddr()
  let domainArray = name.split('.')
  if(domainArray.length > 2) {
    let node = domainArray.slice(1).join('.')
    setSubnodeOwner(domainArray[0], domainArray.slice(1).join('.'), newOwner)
      .then(txId => {
        updateForm('newOwner', '')
        let sentComponent = <span>New owner <TxLink addr={etherscanAddr} txId={txId}/> for {name} sent!</span>
        addNotification(sentComponent, false)
        watchRegistryEvent('NewOwner', node, (error, log, event) => {
          console.log(log)
          console.log(event)
          updateNode(name, 'owner', log.args.owner)
          let confirmedComponent = <span>New owner <TxLink addr={etherscanAddr} txId={txId}/> for {node} confirmed!</span>
          addNotification(confirmedComponent, false)
          event.stopWatching()
        })
      })
  } else {
    setNewOwner(name, newOwner).then(txId => {
      let sentComponent = <span>New owner <TxLink addr={etherscanAddr} txId={txId}/> for {name} sent!</span>
      addNotification(sentComponent, false)
      watchRegistryEvent('Transfer', name, (error, log, event) => {
        updateNode(name, 'owner', log.args.owner)
        let confirmedComponent = <span>New owner <TxLink txId={txId}/> for {name} confirmed!</span>
        addNotification(confirmedComponent, false)
        event.stopWatching()
      })
    })
  }
}

function handleSetDefaultResolver(){
  updateForm('newResolver', db.get('publicResolver'))
}

function handleSetResolver(name, newResolver) {
  setResolver(name, newResolver).then(async txId => {
    updateForm('newResolver', '')
    let etherscanAddr = await getEtherScanAddr()
    let sentComponent = <span>New Resolver <TxLink addr={etherscanAddr} txId={txId}/> for {name} sent!</span>
    addNotification(sentComponent, false)
    watchRegistryEvent('NewResolver', name, (error, log, event) => {
      updateNode(name, 'resolver', log.args.resolver)
      let confirmedComponent = <span>New Resolver <TxLink addr={etherscanAddr} txId={txId}/> for {name} confirmed!</span>
      addNotification(confirmedComponent, false)
      event.stopWatching()
    })
  })
}

function handleCheckSubDomain(label, node){
  updateForm('subDomain', '')
  checkSubDomain(label, node).then(async owner => {
    console.log(owner)
    if(owner !== "0x0000000000000000000000000000000000000000"){
      let { web3 } = await getWeb3()
      let labelHash = web3.sha3(label)
      let resolver = await getResolver(label + '.' +  node)
      let subDomain = {
        resolver,
        labelHash,
        owner,
        label,
        node,
        name: label + '.' + node
      }
      console.log(subDomain)
      if(parseInt(resolver, 16) === 0) {
        appendSubDomain(subDomain)
      } else {
        let resolverAndNode = await getResolverDetails(subDomain)
        console.log(resolverAndNode)
        appendSubDomain(resolverAndNode)
      }
      addNotification(label + '.' + node +  ' subdomain found')
    } else {
      addNotification('no subdomain with that name')
    }
  }).catch(err =>
    console.error('in catch', err)
  )
}

function handleCreateSubDomain(subDomain, domain){
  let name = subDomain + '.'+ domain
  updateForm('newSubDomain', '')
  checkSubDomain(subDomain, domain).then(address => {
    if(address !== "0x0000000000000000000000000000000000000000"){
      addNotification('subdomain already exists!')
    } else {
      createSubDomain(subDomain, domain).then(async ({ owner, txId }) => {
        let etherscanAddr = await getEtherScanAddr()
        let sentComponent = <span>New Subdomain <TxLink addr={etherscanAddr} txId={txId}/> for {domain} sent!</span>
        addNotification(sentComponent, false)
        watchRegistryEvent('NewOwner', domain,  async (error, log, event) => {
          //TODO check if this subdomain really is the same one submitted
          // if it is cancel event
          let { web3 } = await getWeb3()
          let labelHash = web3.sha3(subDomain)
          if(log.args.owner === owner && labelHash === log.args.label) {
            let confirmedComponent = <span>New Subdomain <TxLink addr={etherscanAddr} txId={txId}/> for {domain} confirmed!</span>
            addNotification(confirmedComponent, false)
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
    if(address === "0x0000000000000000000000000000000000000000"){
      addNotification('subdomain already deleted!')
    } else {
      deleteSubDomain(subDomain, domain).then(txId => {
        watchRegistryEvent('NewOwner', domain, async (error, log, event) => {
          let { web3 } = await getWeb3()
          let labelHash = web3.sha3(subDomain)
          if(parseInt(log.args.owner, 16) === 0 && log.args.label === labelHash){
            console.log('inside if')
            removeSubDomain(subDomain, domain)
            let etherscanAddr = await getEtherScanAddr()
            let confirmedComponent = <span>Delete domain <TxLink addr={etherscanAddr} txId={txId}/> for {subDomain + '.' + domain} confirmed!</span>
            addNotification(confirmedComponent, false)
            event.stopWatching()
          }
        })
      })
    }
  })
}

function handleOnChange(formField, value){
  updateForm(formField, value)
}

function handleSwitchTab(tab){
  switchTab(tab)
}

function isOwnerOrParentIsOwner(account, name){
  let parent = getParentNode(name)
  if(parent) {
    return db.currentAccount === getParentNode(name).get('owner') || db.currentAccount === account
  }

  return db.currentAccount === account
}

function isOwner(account){
  return db.currentAccount === account
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

const NodeDetails = ({ selectedNode }) => {
  let newOwner = null
  let otherFormFields = null
  let nodeOwner = getNodeInfo(selectedNode, 'owner')

  if(isOwnerOrParentIsOwner(nodeOwner, selectedNode)) {
    newOwner = <div className="input-group">
      <input placeholder="0x..." type="text" name="newOwner"
        value={db.getIn(['updateForm', 'newOwner'])}
        onChange={(e)=> handleOnChange('newOwner', e.target.value)}/>
      <button
        onClick={(e)=> handleUpdateOwner(getNodeInfo(selectedNode, 'name'), db.getIn(['updateForm', 'newOwner']))}>Update owner</button>
    </div>
  }

  if(isOwner(nodeOwner)) {
    otherFormFields = <div>
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
      <button className="danger" onClick={() => handleDeleteSubDomain(getNodeInfo(selectedNode, 'label'), getNodeInfo(selectedNode, 'node'))}>Delete Node</button>
    </div>
  }

  return <div>
    {newOwner}
    {otherFormFields}
  </div>
}

export default () => {
  const selectedNode = db.get('selectedNode')
  let renderedContent = <div>Search and select a domain to start managing your domains!</div>
  let tabContent
  let addr
  let content
  let currentTab = db.get('currentTab')

  if(selectedNode){
    switch(currentTab) {
      case 'nodeDetails':
        tabContent = <NodeDetails selectedNode={selectedNode} />
        break
      case 'resolverDetails':
        if(isOwner(getNodeInfo(selectedNode, 'owner'))) {
          tabContent = <ResolverDetails selectedNode={selectedNode} handleOnChange={handleOnChange} />
        }
        addr = <div className="current-addr info"><strong>Address:</strong> {getNodeInfo(selectedNode, 'addr')}</div>
        content = <div className="current-content info"><strong>Content:</strong> {getNodeInfo(selectedNode, 'content')}</div>
        break
    }

    renderedContent = (
      <div>
        <Tabs selectedNode={selectedNode} currentTab={currentTab} />
        <div className="info-container">
          <div className="current-node info"><strong>Name:</strong> {getNodeInfo(selectedNode, 'name')}</div>
          <div className="current-owner info"><strong>Owner:</strong> {getNodeInfo(selectedNode, 'owner')}</div>
          <div className="current-resolver info"><strong>Resolver:</strong> {getNodeInfo(selectedNode, 'resolver')}</div>
          {addr}
          {content}
        </div>
        {tabContent}
      </div>
    )
  }

  return (
    <div className="node-info">
      {renderedContent}
    </div>
  )
}
