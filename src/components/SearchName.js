import React from 'react'
import { connect } from 'react-redaxe'
import { db } from 'redaxe'
import classnames from 'classnames'

import { updateSearchName, setNodeDetails } from '../updaters/nodes'
import { addNotification } from '../updaters/notifications'
import { getOwner } from '../api/registry'
import Blockies from './Blockies'

function handleGetNodeDetails(name){
  getOwner(name).then(owner => {
    if(parseInt(owner, 16) === 0) {
      addNotification(`${name} does not have an owner!`)
    } else {
      setNodeDetails(name)
    }
  })
}

export const SearchName = ({ handleGetNodeDetails, nameSearch }) => {
  return <div className="search-name">
    <div className="search-box">
      <input type="text" id="address" placeholder="vitalik.eth" onChange={(e) => updateSearchName(e.target.value)} />
    </div>
    <button className="get-details" onClick={() => handleGetNodeDetails(nameSearch)}>Get Details</button>
  </div>
}

export default connect(db => ({ rootName: db.get('nameSearch'), handleGetNodeDetails }))(SearchName)
