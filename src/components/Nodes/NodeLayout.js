import React from 'react'
import classNames from 'classnames'
import Loader from '../Loader'

const NodeLayout = props => {
  const {
    data,
    db,
    handleRemoveNode,
    handleSelectNode,
    isSelected,
    alphabeticalSort,
    Blockies
  } = props
  console.log(props)
  let childNodes = null
  let selected = isSelected(db.get('selectedNode'), data.get('name'))
  let classes = classNames({
    node: true,
    selected
  })
  let removeNode = null
  let loading = data.get('fetchingSubdomains') ? <Loader /> : null
  if (selected) {
    childNodes = (
      <div className="child-nodes">
        {data.get('nodes').size > 0
          ? data
              .get('nodes')
              .sort(alphabeticalSort)
              .map(node => (
                <Node key={node.get('labelHash') + name} data={node} />
              ))
          : ''}
      </div>
    )
  }

  if (data.get('name').split('.').length === 2) {
    removeNode = (
      <div
        title="Remove node from list"
        className="remove-node"
        onClick={event => handleRemoveNode(event, data)}
      >
        &#10006;
      </div>
    )
  }

  return (
    <div className={classes}>
      <div onClick={e => handleSelectNode(e, data)} className="node-details">
        <Blockies
          className="node-blockies"
          imageSize={25}
          address={data.get('owner')}
        />
        {data.get('name')}
        {loading}
        {removeNode}
      </div>
      {childNodes}
    </div>
  )
}
export default NodeLayout
