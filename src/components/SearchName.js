import React from 'react'
import { updateAddress, getNodeDetails } from '../updaters'
import app from '../App'

export default () => {
  let owner = <div>&nbsp;</div>,
      getDetails,
      addressExists = app.db.get('rootAddress') !== '0x0000000000000000000000000000000000000000'
  if(addressExists) {
    owner = <div className="owner">Owner address: {app.db.get('rootAddress')}</div>
  } else if(app.db.get('rootName').length > 0 ) {
    owner = <div>No owner found</div>
  }

  getDetails = addressExists ? <button className="get-details" onClick={() => getNodeDetails(app.db.get('rootName'),app.db.get('rootAddress'))}>Get Details</button> : null

  return <div className="search-name">
    <div className="instructions">Search an ethereum name</div>
    <input type="text" id="address" placeholder="vitalik.eth" onChange={(e) => updateAddress(e.target.value)} />

    {owner}
    {getDetails}
  </div>
}
