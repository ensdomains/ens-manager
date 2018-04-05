import React from 'react'
import { db } from 'redaxe'
import { selectNode, switchTab } from '../../updaters/nodeDetails'
import { removeRootDomain, setNodeDetails } from '../../updaters/nodes'
import Blockies from '..//Blockies'
import classNames from 'classnames'
import Loader from '../Loader'
import { withHandlers, withProps, compose } from 'recompose'

import NodeLayout from './NodeLayout'

const handleSelectNode = (event, node) => {
  let name = node.get('name')
  switchTab('nodeDetails')
  selectNode(name)
  if (node.get('refreshed') === false) {
    setNodeDetails(name)
  }
  event.stopPropagation()
}

const handleRemoveNode = (event, data) => {
  let name = data.get('name')
  selectNode('')
  removeRootDomain(name)
  event.stopPropagation()
}

const isSelected = (selected, name) => {
  if (selected.split('.').length === name.split('.').length) {
    return selected === name
  } else {
    let query = new RegExp(name)
    return selected.match(query) ? true : false
  }
}

const alphabeticalSort = (a, b) => a.get('name').localeCompare(b.get('name'))

export default compose(
  withProps({
    db,
    handleRemoveNode,
    handleSelectNode,
    isSelected,
    alphabeticalSort,
    Blockies
  })
)(NodeLayout)
