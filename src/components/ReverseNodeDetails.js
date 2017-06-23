import React from 'react'
import { connect } from 'react-redaxe'
import { db } from 'redaxe'
import {
  getReverseNodeInfoSelector as getNodeInfo
} from '../updaters/nodes'

const ReverseNodeDetails = () => {
  let selectedNode = db.selectedReverseNode
  console.log('selectedNode', selectedNode)
  return <div className="reverse-node-details node-info">
    <div className="info-container">
      <div className="current-node info"><strong>Address </strong>{getNodeInfo(selectedNode, 'address')}</div>
      <div className="current-owner info"><strong>Name: </strong>{getNodeInfo(selectedNode, 'name')}</div>
      <div className="current-resolver info"><strong>Resolver: </strong>{getNodeInfo(selectedNode, 'resolverAddr')}</div>
    </div>
  </div>
}

export default ReverseNodeDetails
