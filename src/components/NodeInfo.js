import React from 'react'
import app from '../App'
import { setNewOwner, setSubnodeOwner, checkSubDomain, setResolver } from '../api/registry'
import { updateForm, appendSubDomain, updateNode, resolveUpdatePath } from '../updaters/nodes'
import { watchResolverEvent } from '../api/watchers'
import { addNotification } from '../updaters/notifications'

function handleUpdateOwner(name, newOwner){
  let domainArray = name.split('.')
  if(domainArray.length > 2) {
    setSubnodeOwner(domainArray[0], domainArray.slice(1), newOwner).then(console.log)
  }

  setNewOwner(name, newOwner).then(console.log)
}

function setDefaultResolver(){
  updateForm('newResolver', app.db.get('publicResolver'))
}

function handleSetResolver(name, newResolver) {
  watchResolverEvent(name).then(log => {
    console.log(log)
    updateNode(name, 'resolver', log.args.resolver)
    addNotification(`New resolver found for ${name}`)
  })
  setResolver(name, newResolver).then(values => console.log('TX ID', values))

}

function handleCheckSubDomain(subDomain, domain){
  checkSubDomain(subDomain, domain).then(address => {
    console.log('here', subDomain, domain, address)
    if(address !== "0x0000000000000000000000000000000000000000"){
      appendSubDomain(subDomain, domain, address)
    } else {
      console.log('no subdomain with that name')
    }
  })
}

function handleOnChange(formName, newOwner){
  updateForm(formName, newOwner)
}

function getNodeInfo(name, prop) {
  let updatePath = ['nodes', 0],
      domainArray = name.split('.')
  if(domainArray.length > 2) {
    let domainArraySliced = domainArray.slice(0, domainArray.length - 2)
    updatePath = resolveUpdatePath(domainArraySliced, updatePath, app.db)
  }
  let path = [...updatePath, prop]
  return app.db.getIn(path)
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
          <button onClick={() => handleCheckSubDomain(db.getIn(['updateForm', 'subDomain']), getNodeInfo(selectedNode, 'name'))}>Check For Subdomain</button>
        </div>
        <button>Delete Node</button>
      </div>
    )
  }

  return (
    <div className="node-info">
      {content}
    </div>
  )
}
