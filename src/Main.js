import React from 'react'
import DomainManager from './pages/DomainManager'
import ReverseRecord from './pages/ReverseRecord'
import Notifications from './components/Notifications'
//import Tracker from '../components/Tracker'

import createHistory from 'history/createBrowserHistory'

import ReactGA from 'react-ga';

import { db } from 'redaxe'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

ReactGA.initialize('UA-101611202-1');

const history = createHistory()
history.listen((location, action) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

const Main = () => {
  return <div className="App">
    <Router history={history}>
      <div>
        <Route exact path="/" component={DomainManager}/>
        <Route path="/reverse-record" component={ReverseRecord}/>
      </div>
    </Router>
    <Notifications />
  </div>
}

export default Main;
