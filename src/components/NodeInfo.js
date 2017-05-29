import React from 'react'
import app from '../App'
import { setNewOwner, setSubnodeOwner, checkSubDomain } from '../api/registry'
import { updateForm, appendSubDomain } from '../updaters/nodes'

function handleUpdateOwner(name, newOwner){
  //contract api call updateOwner
  //updateform
  console.log('handle update owner')
  let domainArray = name.split('.')
  console.log(domainArray)
  //
  if(domainArray.length > 2) {
    setSubnodeOwner(domainArray[0], domainArray.slice(1), newOwner).then(console.log)
  }

  setNewOwner(name, newOwner).then(console.log)
}

function setDefaultResolver(){

}

function setResolver() {

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

export default () => {
  const db = app.db
  const selectedNode = db.get('selectedNode')
  var content = <div>Select a node to continue</div>

  if(selectedNode.get('name')){
    content = (
      <div>
        <div className="current-owner">Current Node: {selectedNode.get('name')}</div>
        <div className="current-owner">Owner: {selectedNode.get('owner')}</div>
        <div className="input-group">
          <input placeholder="0x..." type="text" name="newOwner"
            value={db.getIn(['updateForm', 'newOwner'])}
            onChange={(e)=> handleOnChange('newOwner', e.target.value)}/>
          <button
            onClick={(e)=> handleUpdateOwner(db.getIn(['selectedNode', 'name']), db.getIn(['updateForm', 'newOwner']))}>Update owner</button>
        </div>
        <div className="input-group">
          <input type="text" name="resolver"/>
          <button onClick={() => setResolver()}>Set Resolver</button>
        </div>
        <button onClick={() => setDefaultResolver()}>Use default resolver</button>
        <div className="input-group">
          <input type="text" name="subDomain" onChange={(e)=> handleOnChange('subDomain', e.target.value)} />
          <button onClick={() => handleCheckSubDomain(db.getIn(['updateForm', 'subDomain']), db.getIn(['selectedNode', 'name']))}>Check For Subdomain</button>
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
