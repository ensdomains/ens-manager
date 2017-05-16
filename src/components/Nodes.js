import React from 'react'
import app from '../App'
import { selectNode } from '../updaters'

const handleSelectNode = (event, data) => {
  selectNode(data)
  event.stopPropagation()
}

const Node = ({ data }) => (
  <div className="node" onClick={(e) => handleSelectNode(e, data)}>
    <div>{data.get('name')}</div>
    <div>{data.get('nodes') ? data.get('nodes').map(node => <Node key={node.get('address')} data={node} />) : ''}</div>
  </div>
)

const Nodes = () => (
  <div>{app.db.get('nodes').map(node => <Node key={node.get('address')} data={node} />)}</div>
)

export default Nodes
