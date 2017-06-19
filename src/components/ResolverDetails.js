import React from 'react'
import { db } from 'redaxe'
import {
  setAddr,
  setContent
} from '../api/registry'
import { resolveUpdatePath, getNodeInfoSelector as getNodeInfo } from '../updaters/nodes'

function handleSetAddr(name, addr){
  setAddr(name, addr).then(txId => console.log(txId))
}

function handleSetContent(name, content){
  setContent(name, content).then(txId => console.log(txId))
}

const ResolverDetails = ({ selectedNode, handleOnChange }) => {
  return <div className="resolver-details">
    <div className="input-group">
      <input
        type="text"
        name="resolver"
        value={db.getIn(['updateForm', 'newAddr'])}
        onChange={(e)=> handleOnChange('newAddr', e.target.value)}
      />
      <button placeholder="0x..." onClick={() => handleSetAddr(getNodeInfo(selectedNode, 'name'), db.getIn(['updateForm', 'newAddr']))}>Set Addr</button>
    </div>
    <div className="input-group">
      <input
        type="text"
        name="resolver"
        value={db.getIn(['updateForm', 'newContent'])}
        onChange={(e)=> handleOnChange('newContent', e.target.value)}
      />
      <button placeholder="0x..." onClick={() => handleSetContent(getNodeInfo(selectedNode, 'name'), db.getIn(['updateForm', 'newContent']))}>Set Content</button>
    </div>
  </div>
}

export default ResolverDetails
