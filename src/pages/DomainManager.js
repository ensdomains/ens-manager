import React from 'react'
import Nodes from '../components/Nodes'
import NodeDetails from '../components/NodeDetails'
import Header from '../components/Header'
import SearchName from '../components/SearchName'

export default () =>
  <div className="domain-manager">
    <Header>
      <SearchName />
    </Header>
    <NodeDetails />
    <Nodes />
  </div>
