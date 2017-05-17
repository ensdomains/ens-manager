import app from './App'
import { getAddr } from './lib/ensutils'
import Immutable from 'immutable'
import { getSubdomains, getOwner } from './api/registry'

export function updateAddress(value) {
  app.update(
    app.db.set('rootName', value)
  )
  getOwner(value).then(owner =>
    app.update(app.db.set('rootAddress', owner))
  )
}

export function getNodeDetails(name) {
  //TODO: event log for subdomains
  console.log(name)
  let data = getSubdomains(name)

  app.update(
    app.db.set('nodes', data)
  )
}

export function selectNode(data) {
  app.update(
    app.db.set('selectedNode', data)
  )
}
