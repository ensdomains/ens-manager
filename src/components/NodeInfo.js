import React from 'react'
import app from '../App'
import { setNewOwner, setSubnodeOwner, checkSubDomain, setResolver, createSubDomain, deleteSubDomain } from '../api/registry'
import { updateForm, appendSubDomain, updateNode, resolveUpdatePath, removeSubDomain } from '../updaters/nodes'
import { watchResolverEvent, watchTransferEvent, watchNewOwnerEvent, stopWatching } from '../api/watchers'
import { getNamehash } from '../api/ens'
import { addNotification } from '../updaters/notifications'
import { decrementWatchers } from '../updaters/config'
import getWeb3 from '../api/web3'

function handleUpdateOwner(name, newOwner){
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
    watchTransferEvent(name).then(({ log, event }) => {
      console.log(log)
      console.log(event)
      updateNode(name, 'owner', log.args.owner)
      decrementWatchers(log.event)
      addNotification(`New owner found for ${name}`)
      stopWatching(event, app.db.getIn(['watchers', event.event]) === 0)
    })
  }
}

function setDefaultResolver(){
  updateForm('newResolver', app.db.get('publicResolver'))
}

function handleSetResolver(name, newResolver) {
  setResolver(name, newResolver).then(txId => {
    watchResolverEvent(name).then(({ log, event }) => {

      updateNode(name, 'resolver', log.args.resolver)
      decrementWatchers(event.event)
      addNotification(`New resolver found for ${name}`)
      // stopWatching(event, app.db.getIn(['watchers', log.event]))
    })
  })
}

function handleCheckSubDomain(subDomain, domain){
  checkSubDomain(subDomain, domain).then(address => {
    if(address !== "0x0000000000000000000000000000000000000000"){
      appendSubDomain(subDomain, domain, address)
    } else {
      console.log('no subdomain with that name')
    }
  })
}

function handleCreateSubDomain(subDomain, domain){
  checkSubDomain(subDomain, domain).then(address => {
    console.log('here', subDomain, domain, address)
    if(address !== "0x0000000000000000000000000000000000000000"){
      console.log('subdomain already exists!')
    } else {
      createSubDomain(subDomain, domain).then(({ owner, txId }) => {
        watchNewOwnerEvent(domain).then(async ({ log, event }) => {
          //TODO check if this subdomain really is the same one submitted
          // if it is cancel event
          let { web3 } = await getWeb3()
          console.log(web3)
          let labelHash = web3.sha3(subDomain)


          console.log(labelHash, log.args.label)
          console.log('LOG OWNER', log.args.owner, 'ACTUAL: OWNER', owner)
          console.log(event)
          if(log.args.owner === owner && labelHash === log.args.label) {
            appendSubDomain(subDomain, domain, log.args.owner)
            decrementWatchers(log.event)
            //stopWatching(event, app.db.getIn(['watchers', log.event]))
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
      console.log('subdomain already exists!')
    } else {
      deleteSubDomain(subDomain, domain).then(txId => {
        watchNewOwnerEvent(domain).then(async ({ log, event }) => {
          console.log(log)
          //TODO check if this subdomain really is the same one submitted
          // if it is cancel event
          // if()
          console.log(event)
          let { web3 } = await getWeb3()
          let labelHash = web3.sha3(subDomain)
          // console.log(labelHash, log.args.label)
          // appendSubDomain(subDomain, domain, address)
          console.log(log.args.label, labelHash)
          if(parseInt(log.args.owner, 16) === 0 && log.args.label === labelHash){
            removeSubDomain(subDomain, domain)
            decrementWatchers(log.event)
            //stopWatching(event, app.db.getIn(['watchers', log.event]))
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
    updatePath = resolveUpdatePath(domainArraySliced, updatePath, app.db)
  }

  updatePath = [...updatePath, prop]
  return app.db.getIn(updatePath)
}

export default () => {
  const db = app.db
  const selectedNode = db.get('selectedNode')
  var content = <div>Select a node to continue</div>

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
          <input type="text" name="subDomain" onChange={(e)=> handleOnChange('subDomain', e.target.value)} />
          <button onClick={() => handleCheckSubDomain(db.getIn(['updateForm', 'subDomain']), getNodeInfo(selectedNode, 'name'))}>Check for subdomain</button>
        </div>
        <div className="input-group">
          <input type="text" name="subDomain" onChange={(e)=> handleOnChange('newSubDomain', e.target.value)} />
          <button onClick={() => handleCreateSubDomain(db.getIn(['updateForm', 'newSubDomain']), getNodeInfo(selectedNode, 'name'))}>Create new subdomain</button>
        </div>
        <button onClick={() => handleDeleteSubDomain(getNodeInfo(selectedNode, 'label'), getNodeInfo(selectedNode, 'node'))}>Delete Node</button>
      </div>
    )
  }

  return (
    <div className="node-info">
      {content}
    </div>
  )
}
