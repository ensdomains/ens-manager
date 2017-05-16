import React from 'react'
import DomainManagerHeader from '../components/DomainManagerHeader'
import Nodes from '../components/Nodes'

export default () =>
  <div className="domain-manager">
    <h2> Domain Manager</h2>
    <DomainManagerHeader />
    <Nodes />
  </div>
