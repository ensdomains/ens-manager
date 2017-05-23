import app from './App'
import Immutable from 'immutable'
import { getSubdomains, getOwner, getResolver } from './api/registry'

export function updateAddress(value) {
  app.update(
    app.db.set('rootName', value)
  )
  getOwner(value).then(owner =>
    app.update(app.db.set('rootAddress', owner))
  )
}

export function updateForm(formName, data) {
  app.update(
    app.db.setIn(['updateForm', formName], data)
  )
}

export function getNodeDetails(name, address) {
  //TODO: event log for subdomains

  getSubdomains(name).then(data =>
    app.update(
      app.db.set('nodes', data)
    )
  )

  getResolver(name).then(data =>
    app.update(
      app.db.set('resolver', data)
    )
  )

}

export function selectNode(data) {
  app.update(
    app.db.set('selectedNode', data)
  )
}
