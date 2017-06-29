const LocalStorage = window.localStorage

const syncData = (props, data) => {
  let propData = props.map(prop => JSON.parse(LocalStorage.getItem(prop)))
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
  let propData = props.map(prop => fromJS(JSON.parse(LocalStorage.getItem(prop))))
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
    props.forEach(prop => LocalStorage.setItem(prop, state[prop]))
    return state
  }

const localStorageMiddlewareImmutable = (props, Immutable) =>
  state => {
    const isImmutable = Immutable.Iterable.isIterable
    props.forEach(prop => {
      let data = state.get(prop)
      console.log(data)
      console.log(JSON.stringify(data))
      return LocalStorage.setItem(prop, JSON.stringify(data))
    })
    return state
  }

export {
  syncData,
  syncDataImmutable,
  localStorageMiddleware,
  localStorageMiddlewareImmutable,
}
