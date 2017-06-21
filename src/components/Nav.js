import React from 'react'
import { NavLink } from 'react-router-dom'

export default () =>
  <nav className="nav">
    <ul>
      <li><NavLink to="/" activeClassName="current" exact>Domain Manager</NavLink></li>
      <li><NavLink to="/reverse-record" activeClassName="current">Reverse Record</NavLink></li>
    </ul>
  </nav>
