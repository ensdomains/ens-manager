import { db, update } from 'redaxe'
import uuid from 'uuid/v4'
import { fromJS } from 'immutable'

export const addNotificationReducer = (db, params) => {
  return db.set('notifications', db.get('notifications').push(fromJS(params))
  )
}

export function addNotification(message, time = 3000){
  let id = uuid()

  update(addNotificationReducer(db,{
    message: message,
    key: id,
    action: 'Dismiss',
    onClick: (notification, deactivate) => {
      deactivate();
      removeNotification(id);
    },
    dismissAfter: time
  }))
}

// export function addActionNotification(params){
//   let id = uuid()
//
//   update(addNotificationReducer(db, {
//     ...params,
//     onClick: (notification, deactivate) => {
//       if(typeof params.onClick === 'Function') {
//         params.onClick()
//       }
//       deactivate();
//       removeNotification(id);
//     },
//     key: id
//   }))
// }

export const removeNotificationReducer = (db, id) => {
  const index = db.get('notifications').findIndex(notif => notif.get('key') === id)
  return db.set('notifications', db.get('notifications').delete(index))
}

export function removeNotification(id){
  update(removeNotificationReducer(db, id))
}
