import { db, update } from 'redaxe'
import uuid from 'uuid/v4'
import { fromJS } from 'immutable'

export function addNotification(message, time = 3000){
  let id = uuid()
  update(
    db.set('notifications', db.get('notifications').push(fromJS({
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

  const db = db

  const index = db.get('notifications').findIndex(notif => {
    return notif.get('key') === id;
  });

  update(
    db.set('notifications', db.get('notifications').delete(index))
  )

}
