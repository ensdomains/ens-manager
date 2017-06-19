import React from 'react'
import DomainManager from './pages/DomainManager'
import ReverseRecord from './pages/ReverseRecord'
import Header from './components/Header'
import Notifications from './components/Notifications'

import { db } from 'redaxe'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

const Main = () => {
  return <div className="App">
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={DomainManager}/>
        <Route path="/reverse-record" component={ReverseRecord}/>
      </div>
    </Router>
    <Notifications />
  </div>
}

export default Main;
