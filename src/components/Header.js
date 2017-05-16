import React from 'react'
import { NavLink } from 'react-router-dom'

export default () =>
  <div className="header">
    <h1>ENS Manager</h1>
    <nav className="nav">
      <ul>
        <li><NavLink to="/" activeClassName="current" exact>Domain Manager</NavLink></li>
        <li><NavLink to="/reverse-record" activeClassName="current">Reverse Record</NavLink></li>
      </ul>
    </nav>
  </div>
