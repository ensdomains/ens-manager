import app from '../App'
import { fromJS } from 'immutable'

export function incrementWatchers(event){
  console.log(event)
  console.log(app.db.getIn(['watchers', event]))
  app.update(
    app.db.updateIn(['watchers', event], counter => counter + 1)
  )
}

export function decrementWatchers(event){
  app.update(
    app.db.updateIn(['watchers', event], counter => counter - 1)
  )
}
