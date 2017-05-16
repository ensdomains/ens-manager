import React, { Component } from 'react'
import DomainManager from './pages/DomainManager'
import ReverseRecord from './pages/ReverseRecord'
import Nav from './components/Nav'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Main = () => (
  <div className="App">
    <div>ENS Management</div>
    <Router>
      <div>
        <Nav />
        <Route exact path="/" component={DomainManager}/>
        <Route path="/reverse-record" component={ReverseRecord}/>
      </div>
    </Router>
  </div>
)

export default Main;
