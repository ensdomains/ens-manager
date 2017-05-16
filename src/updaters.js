import app from './App'
import { getAddr } from './lib/ensutils'
import Immutable from 'immutable'
import { getSubdomains } from './api/registry'

export function updateAddress(value) {
  app.update(
    app.db.set('rootName', value)
          .set('rootAddress', getAddr(value))
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
