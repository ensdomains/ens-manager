import React from 'react'
import { db } from 'redaxe'
import { selectNode, switchTab } from '../updaters/nodeDetails'
import { removeSubDomain } from '../updaters/nodes'
import Blockies from './Blockies'
import classNames from 'classnames'
import Loader from './Loader'

const handleSelectNode = (event, data) => {
  switchTab('nodeDetails')
  selectNode(data)
  event.stopPropagation()
}

const handleRemoveNode = (data) => {
  let split = data.get('name').split('.')
  removeSubDomain(split[1], split[0])
}

const isSelected = (selected, name) => {
  if(selected.split('.').length === name.split('.').length) {
    return selected === name
  } else {
    let query = new RegExp(name);
    return selected.match(query) ? true : false
  }
}

const alphabeticalSort = (a, b) => a.get('name').localeCompare(b.get('name'))

const Node = ({ data }) => {
  let childNodes = null
  let selected = isSelected(db.get('selectedNode'), data.get('name'))
  let classes = classNames({
    node: true,
    selected
  })
  let removeNode = null
  let loading = data.get('fetchingSubdomains') ? <Loader /> : null
  if(selected) {
    childNodes = <div className="child-nodes">
      {data.get('nodes').size > 0 ? data.get('nodes').sort(alphabeticalSort).map(node => <Node key={node.get('labelHash') + name} data={node} />) : ''}
    </div>
  }

  if(data.get('name').split('.').length == 2){
    removeNode = <div onClick={() => handleRemoveNode(data)}>x</div>
  }

  return <div className={classes}>
    <div onClick={(e) => handleSelectNode(e, data.get('name'))} className="node-details"><Blockies className="node-blockies" imageSize={25} address={data.get('owner')} />
      {data.get('name')}
      {loading}
      {removeNode}
    </div>
    {childNodes}
  </div>
}


const Nodes = () => (
  <div className="nodes-root">
    <div className="nodes-inner">
      {db.get('nodes').sort(alphabeticalSort).map(node => <Node key={node.get('name')} data={node} />)}
    </div>
  </div>
)

export default Nodes
