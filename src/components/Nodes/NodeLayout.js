import React from 'react'
import classNames from 'classnames'
import Loader from '../Loader'
import styled from 'styled-components'

const lightBlue = '#2C7DD3'
const lightBlueHigh = '#419BFC'

const NodeWrapper = styled.div`
  position: relative;
  color: white;
  display: flex;
  height: 45px;

  .node-blockies {
    border-radius: 50%;
  }

  .remove-node {
    position: absolute;
    font-size: 16px;
    color: #fff;
    top: 0;
    right: 0;
    margin-top: -6px;
    margin-right: -8px;
    display: none;
    z-index: 1000;
    width: 20px;
    height: 20px;
    background: #000;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    border: solid 1px #000;
  }

  .node-details {
    padding: 10px;
    width: 300px;
    position: relative;
    display: flex;
    align-content: center;
    .ethereum-address-icon {
      margin-right: 10px;
    }

    .selected > .node-details {
      background: ${lightBlue};
    }

    &:hover {
      background: ${lightBlueHigh};
      cursor: pointer;
      .remove-node {
        display: flex;
      }
    }
  }

  &.reverse-nodes-root .node-details.node-details {
    width: 100%;
  }
`

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
    <NodeWrapper className={classes}>
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
    </NodeWrapper>
  )
}
export default NodeLayout
