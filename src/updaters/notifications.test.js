import {
  addNotificationReducer,
  removeNotificationReducer
} from './notifications'
import { db, update } from 'redaxe'
import uuid from 'uuid/v4'
import { fromJS, toJS } from 'immutable'

it('Adds a notification to db', () => {
  let id = uuid()
  let testDb = fromJS({
    notifications: []
  })
  expect(
    JSON.stringify(
      addNotificationReducer(testDb, 'hello there!', 1000, id).toJS()
    )
  ).toEqual(
    JSON.stringify({
      notifications: [
        {
          message: 'hello there!',
          key: id,
          action: 'Dismiss',
          onClick: (notification, deactivate) => {
            deactivate()
            removeNotification(id)
          },
          dismissAfter: 1000
        }
      ]
    })
  )
})

it('Removes a notification', () => {
  let id = uuid()
  let testDb = fromJS({
    notifications: [
      {
        message: 'hello there!',
        key: id,
        action: 'Dismiss',
        dismissAfter: 1000
      }
    ]
  })
  expect(removeNotificationReducer(testDb, id).toJS()).toEqual({
    notifications: []
  })
})
