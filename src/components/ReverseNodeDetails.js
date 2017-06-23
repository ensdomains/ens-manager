import React from 'react'
import { connect } from 'react-redaxe'
import { db } from 'redaxe'
import {
  getReverseNodeInfoSelector as getNodeInfo
} from '../updaters/nodes'
import {
  updateReverseForm
} from '../updaters/nodeDetails'
import { addNotification } from '../updaters/notifications'
import { claimReverseRecord } from '../api/registry'
import getWeb3 from '../api/web3'

function handleOnChange(formName, newOwner){
  updateReverseForm(formName, newOwner)
}

function handleSetName(address, newName){

}

async function handleSetReverseResolver(address, newResolver){
  let { web3 } = await getWeb3()
  if(address === web3.eth.accounts[0]) {
    claimReverseRecord(newResolver).then((txId) => {
      console.log(txId)
    })
  } else {
    addNotification(`You are not currently logged in as ${address} and aren't authorised to update this record`)
  }
}

function handleSetDefaultReverseResolver(){
  updateReverseForm('newResolverAddr', db.get('publicResolver'))
}

const ReverseNodeDetails = () => {
  let selectedNode = db.selectedReverseNode,
      content,
      setNameForm
  console.log('selectedNode', selectedNode)
  if(selectedNode){
    let hasResolver = parseInt(getNodeInfo(selectedNode, 'resolverAddr'), 16)
    if(hasResolver) {
      setNameForm = <div className="input-group">
        <input placeholder="awesome.eth" type="text" name="newOwner"
          value={db.getIn(['reverseUpdate', 'newName'])}
          onChange={(e)=> handleOnChange('newName', e.target.value)}/>
        <button
          onClick={(e)=> handleSetName(getNodeInfo(selectedNode, 'address'), db.reverseUpdateForm.newName)}>Set Name</button>
      </div>
    } else {
      setNameForm = <div>Please set a resolver first to set your reverse record</div>
    }
    content = <div className="reverse-node-details">
      <h2>Reverse Node Record Details</h2>
      <div className="info-container">
        <div className="current-node info"><strong>Address </strong>{getNodeInfo(selectedNode, 'address')}</div>
        <div className="current-owner info"><strong>Name: </strong>{getNodeInfo(selectedNode, 'name')}</div>
        <div className="current-resolver info"><strong>Resolver: </strong>{getNodeInfo(selectedNode, 'resolverAddr')}</div>
      </div>
      <div className="input-group">
        <input
          type="text"
          name="resolver"
          value={db.reverseUpdateForm.newResolverAddr}
          onChange={(e)=> handleOnChange('newResolverAddr', e.target.value)}
        />
        <button placeholder="0x..." onClick={() => handleSetReverseResolver(getNodeInfo(selectedNode, 'address'), db.reverseUpdateForm.newResolverAddr)}>Set Resolver</button>
      </div>
      <button onClick={() => handleSetDefaultReverseResolver()}>Use default reverse record resolver</button>
      {setNameForm}
    </div>
  } else {
    content = <div>Search an address to view reverse records</div>
  }
  return <div className="reverse-node-details node-info">
    {content}
  </div>
}

export default ReverseNodeDetails
