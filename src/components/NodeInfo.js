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
  var content = <div>Select a node to continue</div>

  if(selectedNode.get('address')){
    content = (
      <div>
        <div className="current-owner">Current Owner: {selectedNode.get('address')}</div>
        <div className="input-group">
          <input placeholder="0x..." type="text" name="newOwner"
            value={db.getIn(['updateForm', 'newOwner'])}
            onChange={(e)=> handleOnChange('newOwner', e.target.value)}/>
          <button
            onClick={(e)=> handleUpdateOwner(db.getIn(['selectedNode', 'name']), db.getIn(['updateForm', 'newOwner']))}>Update owner</button>
        </div>
        <div className="input-group">
          <input type="text" name="resolver"/><button>Update resolver</button>
          <button onClick={() => setDefaultResolver()}>Use default resolver</button>
        </div>
        <input type="text" name="deleteNode"/><button>Delete Node</button>
      </div>
    )
  }

  return (
    <div className="node-info">
      {content}
    </div>
  )
}
