const LocalStorage = window.localStorage
import Immutable from 'immutable'

const isImmutable = Immutable.Iterable.isIterable

const syncData = (props) => {
  return data => {
    let propData = props.map(prop => LocalStorage.getItem(prop))
    let obj = props.reduce((acc, c, i) => {
      acc[c] = propData[i]
      return acc
    }, {})
    
    return {
      ...data,
      ...obj
    }
  }
}

const localStorageMiddleware = props =>
  state => {
    props.forEach(prop => LocalStorage.setItem(prop, state[prop]))
    return state
  }

const localStorageMiddlewareImmutable = props =>
  state => {
    props.forEach(prop => {
      let data = state.get(prop)
      return LocalStorage.setItem(prop, isImmutable(data) ? data.toJS() : data)
    })
    return state
  }

export {
  syncData,
  localStorageMiddleware,
  localStorageMiddlewareImmutable
}
