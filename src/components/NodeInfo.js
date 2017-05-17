import React from 'react'
import app from '../App'

function handleUpdateOwner(){
  //contract api call updateOwner
  //updateform
  //
}

function setDefaultResolver(){

}

export default () => {
  const selectedNode = app.db.get('selectedNode')
  return <div className="node-info">
    Current Owner: {selectedNode.get('address')}
    <input type="text" name="newOwner" /><button onClick={()=> handleUpdateOwner()}>Update owner</button>
    <input type="text" name="resolver"/><button>Update resolver</button>
    <button onClick={() => setDefaultResolver()}>Use default resolver</button>
    <input type="text" name="deleteNode"/><button>Delete Node</button>
  </div>
}
