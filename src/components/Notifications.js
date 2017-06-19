import React from 'react'
import { NotificationStack } from 'react-notification'
import { removeNotification } from '../updaters/notifications'
import { db } from 'redaxe'

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

const Notifications = () =>
  <NotificationStack
    notifications={db.get('notifications').toJS()}
    onDismiss={(notifcation) => removeNotification(notifcation.key)}
    barStyleFactory={barStyleFactory}
    activeBarStyleFactory={activeBarStyleFactory}
  />

export default Notifications
