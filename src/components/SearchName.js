import React from 'react'
import { updateAddress, getNodeDetails } from '../updaters'
import app from '../App'

export default () => {
  let owner = <div>No owner found</div>,
      getDetails,
      addressExists = app.db.get('rootAddress') !== '0x0000000000000000000000000000000000000000'
  if(addressExists) {
    owner = <div>Owner address: {app.db.get('rootAddress')}</div>
  }

  getDetails = addressExists ? <button onClick={() => getNodeDetails(app.db.get('rootAddress'))}>Get Details</button> : null

  return <div className="search-name">
    <input type="text" id="address" onChange={(e) => updateAddress(e.target.value)} />

    {owner}
    {getDetails}
  </div>
}
