const LocalStorage = window.localStorage
import { dehydrateImmutable as dehydrate, hydrateImmutable as hydrate} from 'immutable-stringify'
import { serialize, deserialize } from 'json-immutable'

const syncData = (props, data) => {
  let propData = props.map(prop => deserialize(LocalStorage.getItem(prop)))
  let obj = props.reduce((acc, c, i) => {
    acc[c] = propData[i]
    return acc
  }, {})

  return {
    ...data,
    ...obj
  }
}

const syncDataImmutable = (props, data, transformers = [], { fromJS }) => {
  let propData = props.map(prop => {

    if(Array.isArray(prop)) {
      let recordInfo = {
        recordTypes: {}
      }
      recordInfo.recordTypes[prop[0] + 'Record'] = prop[1]
      return deserialize(LocalStorage.getItem(prop[0]), recordInfo)
    } else {
      return deserialize(LocalStorage.getItem(prop))
    }
  })

  let newData = props.reduce((acc, prop, i) => {
    let key = Array.isArray(prop) ? prop[0] : prop

    if(propData[i] === null || propData[i] === 'null') {
      return acc
    } else {
      return acc.set(key, propData[i])
    }

  }, data)

  let mergedData = data.merge(newData)
  let transformedData = transformers.reduce((data, transformer) => transformer(data), mergedData)

  return transformedData
}

const localStorageMiddleware = props =>
  state => {
    props.forEach(prop => LocalStorage.setItem(prop, serialize(state[prop])))
    return state
  }

const localStorageMiddlewareImmutable = (props, Immutable) =>
  (prevState, state) => {
    const isImmutable = Immutable.Iterable.isIterable
    props.forEach(prop => {
      if(prevState.get(prop) === state.get(prop)) {
        return state
      }

      console.log(`syncing ${prop} to localstorage`)

      let serialized
      let key

      key = Array.isArray(prop) ? prop[0] : prop
      serialized = serialize(state.get(key))
      LocalStorage.setItem(key, serialized)
    })
    return state
  }

export {
  syncData,
  syncDataImmutable,
  localStorageMiddleware,
  localStorageMiddlewareImmutable,
}
