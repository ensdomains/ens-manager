import React from 'react'
import DomainManager from './pages/DomainManager'
import ReverseRecord from './pages/ReverseRecord'
import Header from './components/Header'
import { NotificationStack } from 'react-notification'
import { removeNotification } from './updaters/notifications'
import { db } from 'redaxe'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

const Main = () => {
  console.log(db.toJS())
  const barStyleFactory = (index, style) => ({
   ...style,
   ...{
     bottom: `${2 + (index * 4)}rem`,
     left: 'auto',
     right: '-100%'
   }
  })
  const activeBarStyleFactory = (index, style) => ({
   ...style,
   ...{
     bottom: `${2 + (index * 4)}rem`,
     left: 'auto',
     right: '1rem'
   }
  })
  return <div className="App">
    <Router>
      <div>
        <Header />
        <Route exact path="/" component={DomainManager}/>
        <Route path="/reverse-record" component={ReverseRecord}/>
      </div>
    </Router>
    <NotificationStack
      notifications={db.get('notifications').toJS()}
      onDismiss={(notifcation) => removeNotification(notifcation.key)}
      barStyleFactory={barStyleFactory}
      activeBarStyleFactory={activeBarStyleFactory}
    />
  </div>
}

export default Main;
