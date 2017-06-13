import { db, update } from 'redaxe'
import uuid from 'uuid/v4'
import { fromJS } from 'immutable'

export const addNotificationReducer = (db, message, time, id) => {
  return db.set('notifications', db.get('notifications').push(fromJS({
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
}

export function addNotification(message, time = 3000){
  let id = uuid()
  update(addNotificationReducer(db, message, time, id))
}

export const removeNotificationReducer = (db, id) => {
  const index = db.get('notifications').findIndex(notif => notif.get('key') === id)
  return db.set('notifications', db.get('notifications').delete(index))
}

export function removeNotification(id){
  update(removeNotificationReducer(db, id))
}
