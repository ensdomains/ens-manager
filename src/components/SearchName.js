import React from 'react'
import { db } from 'redaxe'
import { connect } from 'react-redaxe'
import classnames from 'classnames'

import { updateAddress, setNodeDetails } from '../updaters/nodes'
import { addNotification } from '../updaters/notifications'
import { getOwner } from '../api/registry'
import Blockies from './Blockies'

function handleSetNodeDetails(name){
  getOwner(name).then(owner => {
    if(parseInt(owner, 16) === 0) {
      addNotification(`${name} does not have an owner!`)
    } else {
      setNodeDetails(name)
    }
  })
}

export const SearchName = ({ handleSetNodeDetails }) => {
  let owner,
      getDetails,
      address = db.get('rootAddress'),
      addressExists = address !== '0x0000000000000000000000000000000000000000'

  return <div className="search-name">
    <div className="search-box">
      <input className={classnames({'has-owner': addressExists})} type="text" id="address" placeholder="vitalik.eth" onChange={(e) => updateAddress(e.target.value)} />
    </div>
    <button className="get-details" onClick={() => handleSetNodeDetails(db.get('rootName'))}>Get Details</button>
  </div>
}

export default connect({ handleSetNodeDetails: handleSetNodeDetails })(SearchName)
