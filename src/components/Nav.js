import React from 'react'
import { Link } from 'react-router-dom'

export default () =>
  <nav className="nav">
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/reverse-record">Reverse Record</Link></li>
    </ul>
    <hr/>
  </nav>
