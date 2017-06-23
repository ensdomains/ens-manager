import React from 'react'
import SearchReverseName from '../components/SearchReverseName'
import ReverseNodeDetails from '../components/ReverseNodeDetails'
import ReverseNodes from '../components/ReverseNodes'
import Header from '../components/Header'

export default () =>
  <div className="reverse-record">
    <Header>
      <SearchReverseName />
    </Header>
    <ReverseNodeDetails />
    <ReverseNodes />
  </div>
