import React from 'react'
import app from '../App'
import { setNewOwner } from '../api/registry'
import { updateForm } from '../updaters'

function handleUpdateOwner(name, newOwner){
  //contract api call updateOwner
  //updateform
  //

  setNewOwner(name, newOwner).then(console.log)
}

function setDefaultResolver(){

}

function handleOnChange(formName, newOwner){
  updateForm(formName, newOwner)
}

export default () => {
  const db = app.db
  const selectedNode = db.get('selectedNode')
  return <div className="node-info">
    Current Owner: {selectedNode.get('address')}
    <input type="text" name="newOwner"
      value={db.getIn(['updateForm', 'newOwner'])}
      onChange={(e)=> handleOnChange('newOwner', e.target.value)}/>
    <button
      onClick={(e)=> handleUpdateOwner(db.getIn(['selectedNode', 'name']), db.getIn(['updateForm', 'newOwner']))}>Update owner</button>
    <input type="text" name="resolver"/><button>Update resolver</button>
    <button onClick={() => setDefaultResolver()}>Use default resolver</button>
    <input type="text" name="deleteNode"/><button>Delete Node</button>
  </div>
}
