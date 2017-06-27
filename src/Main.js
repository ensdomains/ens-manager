import React from 'react'
import DomainManager from './pages/DomainManager'
import ReverseRecord from './pages/ReverseRecord'
import Notifications from './components/Notifications'
import Tracker from './components/Tracker'

import { db } from 'redaxe'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

const Main = () => {
  return <div className="App">
    <Router>
      <div>
        <Route exact path="/" component={Tracker(DomainManager)}/>
        <Route path="/reverse-record" component={Tracker(ReverseRecord)}/>
      </div>
    </Router>
    <Notifications />
  </div>
}

export default Main;
