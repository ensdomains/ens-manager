import React from 'react'
import app from '../App'
import { selectNode } from '../updaters'

const handleSelectNode = (event, data) => {
  selectNode(data)
  event.stopPropagation()
}

const SearchSubDomain = () =>
  <div className="search-sub-domain-container">
    <input className="search-sub-domain" />
  </div>

const Node = ({ data }) =>
  <div className="node">
    <div onClick={(e) => handleSelectNode(e, data)} className="node-details">{data.get('name')}</div>

    <div className="child-nodes">
      {data.get('nodes') ? data.get('nodes').map(node => <Node key={node.get('address')} data={node} />) : ''}
    </div>
    <SearchSubDomain />
  </div>

const Nodes = () => (
  <div className="nodes-root">
    <div className="nodes-inner">
      {app.db.get('nodes').map(node => <Node key={node.get('address')} data={node} />)}
      <SearchSubDomain />
    </div>
  </div>
)

export default Nodes
