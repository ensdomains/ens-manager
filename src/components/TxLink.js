import React from 'react'

import { getEtherScanAddr } from '../lib/utils'

const TxLink = ({ txId, addr }) => {
  return <a className="tx-link" target="_blank" href={`${addr}tx/${txId}`}>Transaction</a>
}

export default TxLink
