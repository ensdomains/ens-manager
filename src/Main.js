import React from 'react'
import DomainManager from './pages/DomainManager'
import ReverseRecord from './pages/ReverseRecord'
import Header from './components/Header'
import { NotificationStack } from 'react-notification'
import { removeNotification } from './updaters/notifications'
import app from './App'

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
    <NotificationStack
      notifications={app.db.get('notifications').toJS()}
      onDismiss={(notifcation) => removeNotification(notifcation.key)}
    />
  </div>
)

export default Main;
