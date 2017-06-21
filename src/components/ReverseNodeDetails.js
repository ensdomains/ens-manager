import React from 'react'
import { connect } from 'react-redaxe'

const ReverseNodeDetails = () => {
  return <div className="reverse-node-details node-info">
    <div className="info-container">
      <div className="current-node info"><strong>Name:</strong> </div>
      <div className="current-owner info"><strong>Owner:</strong></div>
      <div className="current-resolver info"><strong>Resolver:</strong></div>
    </div>
  </div>
}

export default ReverseNodeDetails
