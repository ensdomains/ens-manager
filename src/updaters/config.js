import { db, update } from 'redaxe'
import { fromJS } from 'immutable'

export const setCurrentAccountsReducer = (db, accounts) =>
  db.set('accounts', fromJS(accounts))

export function setCurrentAccounts(accounts) {
  update(setCurrentAccountsReducer(db, accounts))
}
