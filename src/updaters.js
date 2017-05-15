import app from './App'
import { getAddr } from './lib/ensutils'

export function updateAddress(value) {
  app.update(
    app.db.set('rootName', value)
          .set('rootAddress', getAddr(value))
  )
}
