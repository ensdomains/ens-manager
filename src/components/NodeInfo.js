import React from 'react'
import { db } from 'redaxe'
import { setNewOwner, setSubnodeOwner, checkSubDomain, setResolver, createSubDomain, deleteSubDomain } from '../api/registry'
import { updateForm, appendSubDomain, updateNode, resolveUpdatePath, removeSubDomain } from '../updaters/nodes'
import { watchEvent, stopWatching } from '../api/watchers'
import { getNamehash } from '../api/ens'
import { addNotification } from '../updaters/notifications'
import getWeb3 from '../api/web3'

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

function setDefaultResolver(){
  updateForm('newResolver', db.get('publicResolver'))
}

function handleSetResolver(name, newResolver) {
  updateForm('newResolver', '')
  setResolver(name, newResolver).then(txId => {
    watchEvent('NewResolver', name, (error, log, event) => {

      updateNode(name, 'resolver', log.args.resolver)
      addNotification(`New resolver found for ${name}`)
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

function getNodeInfo(name, prop) {
  const domainArray = name.split('.')
  let indexOfNode,
      updatePath = ['nodes', 0]

  if(domainArray.length > 2) {
    let domainArraySliced = domainArray.slice(0, domainArray.length - 2)
    updatePath = resolveUpdatePath(domainArraySliced, updatePath, db)
  }

  updatePath = [...updatePath, prop]
  return db.getIn(updatePath)
}

function handleSetAddr(name, addr){

}

function handleSetContent(){

}

export default () => {
  const selectedNode = db.get('selectedNode')
  let content = <div>Select a node to continue</div>,
      resolver = null

  if(parseInt(getNodeInfo(selectedNode, 'resolver'), 16) !== 0) {
    resolver = <div className="resolver-details">
      <div className="addr">{getNodeInfo(selectedNode, 'addr')}</div>
      <div className="input-group">
        <input
          type="text"
          name="resolver"
          value={db.getIn(['updateForm', 'newAddr'])}
          onChange={(e)=> handleOnChange('newAddr', e.target.value)}
        />
        <button placeholder="0x..." onClick={() => handleSetAddr(getNodeInfo(selectedNode, 'name'), db.getIn(['updateForm', 'newAddr']))}>Set Addr</button>
      </div>
      <div className="content">{getNodeInfo(selectedNode, 'content')}</div>
    </div>
  }

  if(selectedNode.length > 0){
    content = (
      <div>
        <div className="current-node">Current Node: {getNodeInfo(selectedNode, 'name')}</div>
        <div className="current-owner">Owner: {getNodeInfo(selectedNode, 'owner')}</div>
        <div className="current-resolver">Resolver: {getNodeInfo(selectedNode, 'resolver')}</div>
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
        <button onClick={() => setDefaultResolver()}>Use default resolver</button>
        <div className="input-group">
          <input type="text" name="subDomain" value={db.getIn(['updateForm', 'subDomain'])} onChange={(e)=> handleOnChange('subDomain', e.target.value)} />
          <button onClick={() => handleCheckSubDomain(db.getIn(['updateForm', 'subDomain']), getNodeInfo(selectedNode, 'name'))}>Check for subdomain</button>
        </div>
        <div className="input-group">
          <input type="text" name="subDomain" value={db.getIn(['updateForm', 'newSubDomain'])} onChange={(e)=> handleOnChange('newSubDomain', e.target.value)} />
          <button onClick={() => handleCreateSubDomain(db.getIn(['updateForm', 'newSubDomain']), getNodeInfo(selectedNode, 'name'))}>Create new subdomain</button>
        </div>
        <button onClick={() => handleDeleteSubDomain(getNodeInfo(selectedNode, 'label'), getNodeInfo(selectedNode, 'node'))}>Delete Node</button>
        {resolver}
      </div>
    )
  }

  return (
    <div className="node-info">
      {content}
    </div>
  )
}
