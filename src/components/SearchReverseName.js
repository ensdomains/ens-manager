import React from 'react'
import { db } from 'redaxe'
import { connect } from 'react-redaxe'
import { updateReverseAddress, setReverseRecordDetails } from '../updaters/nodes'
import { getName } from '../api/registry'
import { addNotification } from '../updaters/notifications'
import { checkAddress } from '../api/web3'
import { selectReverseNode } from '../updaters/nodeDetails'

async function handleGetReverseRecord(rawAddress){
  let lowerCaseAddr = rawAddress.toLowerCase()
  let address = lowerCaseAddr.substring(0,2) === "0x" ? lowerCaseAddr : "0x" + lowerCaseAddr
  let isAddress = await checkAddress(address)

  if(isAddress){
    getName(address)
      .then(({name, resolverAddr}) => {
        setReverseRecordDetails({
          address,
          name,
          resolver: resolverAddr
        })
        addNotification(`Reverse record found for ${address}`)
        selectReverseNode(address)
      })
      .catch(err => {
        setReverseRecordDetails({address, name: '0x', resolverAddr: '0x'})
        selectReverseNode(address)
        addNotification('No reverse name record found at this address')
      })
  } else {
    addNotification("Not a valid Ethereum address")
  }
}

export const SearchReverseName = ({ handleGetReverseRecord, reverseRecordSearch }) => {

  return <div className="search-name">
    <div className="search-box">
      <input type="text" id="address" placeholder="0xfb12g53s..." onChange={(e) => updateReverseAddress(e.target.value)} />
    </div>
    <button className="get-details" onClick={() => handleGetReverseRecord(reverseRecordSearch)}>Search for reverse record</button>
  </div>
}

export default connect(db => ({
  handleGetReverseRecord,
  reverseRecordSearch: db.get('reverseRecordSearch')
}))(SearchReverseName)
