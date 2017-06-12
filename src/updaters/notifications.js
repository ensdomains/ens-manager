import app from '../App'
import uuid from 'uuid/v4'
import { fromJS } from 'immutable'

export function addNotification(message, time = 3000){
  let id = uuid()
  app.update(
    app.db.set('notifications', app.db.get('notifications').push(fromJS({
        message: message,
        key: id,
        action: 'Dismiss',
        onClick: (notification, deactivate) => {
          deactivate();
          removeNotification(id);
        },
        dismissAfter: time
      }))
    )
  )
}

export function removeNotification(id){

  const db = app.db

  const index = db.get('notifications').findIndex(notif => {
    return notif.get('key') === id;
  });

  app.update(
    db.set('notifications', db.get('notifications').delete(index))
  )

}
