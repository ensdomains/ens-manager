import React from 'react'
import { NavLink } from 'react-router-dom'
import About from './About'
import ReactModal from 'react-modal'
import { toggleAbout } from '../updaters/config'
import { db } from 'redaxe'

export default () =>
  <nav className="nav">
    <ul>
      <li><NavLink to="/" activeClassName="current" exact>Domain Manager</NavLink></li>
      <li><NavLink to="/reverse-record" activeClassName="current">Reverse Record</NavLink></li>
      <li><a href="#" onClick={toggleAbout}>About</a></li>
    </ul>
    <ReactModal isOpen={db.get('isAboutModalActive')}>
      <About />
    </ReactModal>
  </nav>
