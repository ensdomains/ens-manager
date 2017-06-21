import React from 'react'
import { db } from 'redaxe'
import { connect } from 'react-redaxe'
import { updateReverseAddress } from '../updaters/nodes'

function handleGetReverseRecord(name){

}

export const SearchReverseName = ({ handleSetNodeDetails, reverseRecordSearch }) => {

  return <div className="search-name">
    <div className="search-box">
      <input type="text" id="address" placeholder="vitalik.eth" onChange={(e) => updateReverseAddress(e.target.value)} />
    </div>
    <button className="get-details" onClick={() => handleSetNodeDetails(reverseRecordSearch)}>Search for record</button>
  </div>
}

export default connect(db => ({
  handleGetReverseRecord,
  reverseRecordSearch: db.get('reverseRecordSearch')
}))(SearchReverseName)
