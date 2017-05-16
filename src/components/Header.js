import React from 'react'
import { Link } from 'react-router-dom'

export default () =>
  <div className="header">
    <h1>ENS Manager</h1>
    <nav className="nav">
      <ul>
        <li><Link to="/">Domain Manager</Link></li>
        <li><Link to="/reverse-record">Reverse Record</Link></li>
      </ul>
    </nav>
  </div>
