import React from 'react'
import { db } from 'redaxe'
import { selectReverseNode, switchTab } from '../updaters/nodeDetails'
import Blockies from './Blockies'
import classNames from 'classnames'

const handleSelectNode = (event, address) => {
  selectReverseNode(address)
  event.stopPropagation()
}

const Node = ({ data }) => {
  let childNodes = null
  let selected = db.selectedReverseNode === data.address
  let classes = classNames({
    node: true,
    selected
  })

  return <div className={classes}>
    <div onClick={(e) => handleSelectNode(e, data.address)} className="node-details"><Blockies className="node-blockies" imageSize={25} address={data.get('address')} /> {data.get('address')}</div>
    {childNodes}
  </div>
}


const Nodes = () => (
  <div className="nodes-root reverse-nodes-root">
    <div className="nodes-inner">
      {db.reverseNodes.map(node => <Node key={node.address} data={node} />)}
    </div>
  </div>
)

export default Nodes
