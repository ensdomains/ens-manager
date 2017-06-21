import React from 'react'
import SearchName from './SearchName'
import Nav from './Nav'

export default ({ children }) =>
  <div className="header">
    <h1>ENS Manager</h1>
    {children}
    <Nav />
  </div>
