import React from 'react'
import { db } from 'redaxe'
import {
  setAddr,
  setContent
} from '../api/registry'
import { resolveQueryPath, getNodeInfo, updateNode } from '../updaters/nodes'
import { updateForm} from '../updaters/nodeDetails'
import { watchResolverEvent } from '../api/watchers'
import { addActionNotification, addNotification } from '../updaters/notifications'
import { getEtherScanAddr } from '../lib/utils'

function handleSetAddr(name, resolverAddr, addr){
  setAddr(name, addr).then(async txId => {
    updateForm('newAddr', '')
    let etherscanAddr = await getEtherScanAddr()
    let sentComponent = <span>New address <a className="tx-link" href={`${etherscanAddr}tx/${txId}`}>Transaction</a> for {name} sent!</span>
    addNotification(sentComponent, false)
    watchResolverEvent('AddrChanged', resolverAddr, name, async (error, log, event) => {
      updateNode(name, 'addr', log.args.a)
      let confirmedComponent = <span>New address <a className="tx-link" href={`${etherscanAddr}tx/${txId}`}>Transaction</a> for {name} confirmed!</span>
      addNotification(confirmedComponent, false)
      event.stopWatching()
    })
  })
}

function handleSetContent(name, resolverAddr, content){
  setContent(name, content).then(async txId => {
    updateForm('newContent', '')
    let etherscanAddr = await getEtherScanAddr()
    let sentComponent = <span>New Content <a className="tx-link" href={`${etherscanAddr}tx/${txId}`}>Transaction</a> for {name} sent!</span>
    addNotification(sentComponent, false)
    watchResolverEvent('ContentChanged', resolverAddr, name, async (error, log, event) => {
      updateNode(name, 'content', log.args.hash)
      let confirmedComponent = <span>New content <a className="tx-link" href={`${etherscanAddr}tx/${txId}`}>Transaction</a> for {name} confirmed!</span>
      addNotification(confirmedComponent, false)
      event.stopWatching()
    })
  })
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
      <button placeholder="0x..." onClick={() =>
        handleSetAddr(
          getNodeInfo(selectedNode, 'name'),
          getNodeInfo(selectedNode, 'resolver'),
          db.getIn(['updateForm', 'newAddr'])
        )}>Set Addr</button>
    </div>
    <div className="input-group">
      <input
        type="text"
        name="resolver"
        value={db.getIn(['updateForm', 'newContent'])}
        onChange={(e)=> handleOnChange('newContent', e.target.value)}
      />
      <button placeholder="0x..." onClick={() =>
        handleSetContent(
          getNodeInfo(selectedNode, 'name'),
          getNodeInfo(selectedNode, 'resolver'),
          db.getIn(['updateForm', 'newContent'])
        )}>Set Content</button>
    </div>
  </div>
}

export default ResolverDetails
