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

const syncDataImmutable = (props, data, { fromJS }) => {
  let propData = props.map(prop => {

    // if(Array.isArray(prop)) {
      // let recordInfo = {
      //   recordTypes: {}
      // }
      // console.log(prop)
      // console.log(prop[0])
      // console.log(prop[0] + 'Record')
      // recordInfo[prop[0] + 'Record'] = prop[1]
    //   let dt1 = hydrate(LocalStorage.getItem(prop[0]), recordInfo)
    //   console.log(dt1)
    //   return dt1
    //
    // } else {
      return hydrate(LocalStorage.getItem(prop))
//    }
  })

  console.log(propData)

  let newData = props.reduce((acc, prop, i) => {
    if(propData[i] !== null) {
      return acc.set(prop, propData[i])
    }
    return acc
  }, data)

  return data.merge(newData)
}

const localStorageMiddleware = props =>
  state => {
    props.forEach(prop => LocalStorage.setItem(prop, serialize(state[prop])))
    return state
  }

const localStorageMiddlewareImmutable = (props, Immutable) =>
  state => {
    const isImmutable = Immutable.Iterable.isIterable
    props.forEach(prop => {
      // let data
      let serialized
      // console.log(prop)
      // if(Array.isArray(prop)) {
      //   data = state.get(prop[0])
      //   serialized = serialize(data)
      //   console.log(serialized)
      //   LocalStorage.setItem(prop[0], serialized)
      //
      // } else {
        serialized = dehydrate(state.get(prop))
        console.log(serialized)
        LocalStorage.setItem(prop, serialized)
      // }
    })
    return state
  }

export {
  syncData,
  syncDataImmutable,
  localStorageMiddleware,
  localStorageMiddlewareImmutable,
}
