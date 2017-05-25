import React from 'react'
import app from '../App'
import { selectNode } from '../updaters/nodes'

const handleSelectNode = (event, data) => {
  selectNode(data)
  event.stopPropagation()
}

const Node = ({ data }) =>
  <div className="node">
    <div onClick={(e) => handleSelectNode(e, data)} className="node-details">{data.get('name')}</div>

    <div className="child-nodes">
      {data.get('nodes').size > 0 ? data.get('nodes').map(node => <Node key={node.get('name')} data={node} />) : ''}
    </div>
  </div>

const Nodes = () => (
  <div className="nodes-root">
    <div className="nodes-inner">
      {app.db.get('nodes').map(node => <Node key={node.get('owner')} data={node} />)}
    </div>
  </div>
)

export default Nodes
