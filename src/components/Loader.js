import React from 'react'
import ReactLoader from 'react-loader'

export default (...props) =>
  <ReactLoader type="spinningBubbles" color="#ffffff" length={8} width={1} radius={5} {...props} />
