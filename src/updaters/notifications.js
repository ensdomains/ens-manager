import app from '../App'

export function addNotification(){
  app.update(
    app.db.set('notifications', app.db.get('notifications').push({
        message: `Notification ipsum...`,
        key: 'some UID',
        action: 'Dismiss',
        onClick: (notification, deactivate) => {
          deactivate();
          this.removeNotification('some UID');
        }
      })
    )
  )


  // app.db.update('notificationsHistory', notifications => notifications.push({
  //     message: `Notification ipsum...`,
  //     key: 'some UID',
  //     action: 'Dismiss',
  //     onClick: (notification, deactivate) => {
  //       deactivate();
  //       this.removeNotification('some UID');
  //     }
  //   })
  // })
}
