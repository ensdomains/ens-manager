import React from 'react'
import DomainManager from './pages/DomainManager'
import ReverseRecord from './pages/ReverseRecord'
import Header from './components/Header'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

const Main = () => (
  <div className="App">
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={DomainManager}/>
        <Route path="/reverse-record" component={ReverseRecord}/>
      </div>
    </Router>
  </div>
)

export default Main;
