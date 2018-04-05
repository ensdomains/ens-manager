import { db } from 'redaxe'
import { withProps, compose } from 'recompose'
import NodesLayout from './NodesLayout'
import React from 'react'
import NodeContainer from './NodeContainer'

const alphabeticalSort = (a, b) => a.get('name').localeCompare(b.get('name'))

const NodesContainer = compose(
  withProps(props => ({ db, alphabeticalSort, NodeItem: NodeContainer }))
)(NodesLayout)

export default NodesContainer
