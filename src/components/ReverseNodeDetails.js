import React from 'react'
import { connect } from 'react-redaxe'
import { db } from 'redaxe'
import {
  getReverseNodeInfoSelector as getNodeInfo,
  updateReverseNode
} from '../updaters/nodes'
import {
  updateReverseForm
} from '../updaters/nodeDetails'
import { addNotification } from '../updaters/notifications'
import { watchReverseRegistryEvent, watchReverseResolverEvent } from '../api/watchers'
import { claimReverseRecord, setReverseRecordName } from '../api/registry'
import TxLink from './TxLink'
import { getEtherScanAddr } from '../lib/utils'
import getWeb3 from '../api/web3'

function handleOnChange(formName, newOwner){
  updateReverseForm(formName, newOwner)
}

function handleSetName(address, resolver, newName){
  setReverseRecordName(address, resolver, newName).then(async txId => {
    let etherscanAddr = await getEtherScanAddr()
    let sentComponent = <span>New Name <TxLink addr={etherscanAddr} txId={txId}/> for {`${address}.addr.reverse`} sent!</span>
    updateReverseForm('newName', '')
    addNotification(sentComponent, false)
    watchReverseResolverEvent('NameChanged', resolver, `${address}.addr.reverse`, (error, log, event) => {
      if(log.args.name === newName) {
        updateReverseNode(address, 'name', log.args.name)
        let confirmedComponent = <span>New Name <TxLink addr={etherscanAddr} txId={txId}/> for {`${address}.addr.reverse`} confirmed!</span>
        addNotification(confirmedComponent, false)
        event.stopWatching()
      }
    })
  })
}

async function handleSetReverseResolver(address, newResolver){
  let { web3 } = await getWeb3()
  if(address === db.accounts.get(0)) {
    claimReverseRecord(newResolver).then(async (txId) => {
      let etherscanAddr = await getEtherScanAddr()
      let sentComponent = <span>New Reverse Resolver <TxLink addr={etherscanAddr} txId={txId}/> for {`${address}.addr.reverse`} sent!</span>
      updateReverseForm('newResolverAddr', '')
      addNotification(sentComponent, false)
      watchReverseRegistryEvent('NewResolver', `${address}.addr.reverse`, (error, log, event) => {
        if(log.args.resolver === newResolver) {
          updateReverseNode(address, 'resolver', log.args.resolver)
          let confirmedComponent = <span>New Reverse Resolver <TxLink addr={etherscanAddr} txId={txId}/> for {`${address}.addr.reverse`} confirmed!</span>
          addNotification(confirmedComponent, false)
          event.stopWatching()
        }
      })
    })
  } else {
    addNotification(`You are not currently logged in as ${address} and aren't authorised to update this record`)
  }
}

function handleSetDefaultReverseResolver(){
  updateReverseForm('newResolverAddr', db.get('publicResolver'))
}

const ReverseNodeDetails = () => {
  let selectedNode = db.selectedReverseNode
  let content
  let setNameForm

  if(selectedNode){
    let hasResolver = parseInt(getNodeInfo(selectedNode, 'resolver'), 16)
    if(hasResolver) {
      setNameForm = <div className="input-group">
        <input placeholder="awesome.eth" type="text" name="newOwner"
          value={db.getIn(['reverseUpdate', 'newName'])}
          onChange={(e)=> handleOnChange('newName', e.target.value)}/>
        <button
          onClick={(e)=> handleSetName(getNodeInfo(selectedNode, 'address'), getNodeInfo(selectedNode, 'resolver'), db.reverseUpdateForm.newName)}>Set Name</button>
      </div>
    } else {
      setNameForm = <div>Please set a resolver first to set your reverse record</div>
    }
    content = <div className="reverse-node-details">
      <h2>Reverse Node Record Details</h2>
      <div className="info-container">
        <div className="current-node info"><strong>Address </strong>{getNodeInfo(selectedNode, 'address')}</div>
        <div className="current-owner info"><strong>Name: </strong>{getNodeInfo(selectedNode, 'name')}</div>
        <div className="current-resolver info"><strong>Resolver: </strong>{getNodeInfo(selectedNode, 'resolver')}</div>
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
