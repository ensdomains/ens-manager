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
      addNotification(`Node details set for ${name}`)
    }
  })
}

export const SearchName = ({ handleGetNodeDetails, nameSearch }) => {
  return <form className="search-name" onSubmit={(event) => { event.preventDefault(); handleGetNodeDetails(nameSearch) }}>
    <div className="search-box">
      <input type="text" id="address" placeholder="vitalik.eth" onChange={(e) => updateSearchName(e.target.value)} />
    </div>
    <button className="get-details">Get Details</button>
  </form>
}

export default connect(db => ({ nameSearch: db.get('nameSearch'), handleGetNodeDetails }))(SearchName)
