import React from 'react'
import app from '../App'
import { selectNode } from '../updaters/nodes'
import classNames from 'classnames'

const handleSelectNode = (event, data) => {
  selectNode(data)
  event.stopPropagation()
}

const Node = ({ data }) => {

  let classes = classNames({
    node: true,
    selected: data.get('name') === app.db.getIn(['selectedNode', 'name'])
  })

  return <div className={classes}>
    <div onClick={(e) => handleSelectNode(e, data)} className="node-details">{data.get('name')}</div>

    <div className="child-nodes">
      {data.get('nodes').size > 0 ? data.get('nodes').map(node => <Node key={node.get('name')} data={node} />) : ''}
    </div>
  </div>
}


const Nodes = () => (
  <div className="nodes-root">
    <div className="nodes-inner">
      {app.db.get('nodes').map(node => <Node key={node.get('owner')} data={node} />)}
    </div>
  </div>
)

export default Nodes
