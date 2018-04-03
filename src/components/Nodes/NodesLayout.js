import React from 'react'
import NodeContainer from './NodeContainer'

const NodesLayout = ({ db, NodeItem, alphabeticalSort }) => (
  <div className="nodes-root">
    <div className="nodes-inner">
      {db
        .get('nodes')
        .sort(alphabeticalSort)
        .map(node => <NodeContainer key={node.get('name')} data={node} />)}
    </div>
  </div>
)

export default NodesLayout
