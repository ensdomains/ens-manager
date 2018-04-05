import React from 'react'

const NodesLayout = ({ db, NodeItem, alphabeticalSort }) => (
  <div className="nodes-root">
    <div className="nodes-inner">
      {db
        .get('nodes')
        .sort(alphabeticalSort)
        .map(node => <NodeItem key={node.get('name')} data={node} />)}
    </div>
  </div>
)

export default NodesLayout
