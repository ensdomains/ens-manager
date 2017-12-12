import { db, update } from 'redaxe'
import { fromJS } from 'immutable'

export const setCurrentAccountReducer = (db, account) =>
  db.set('currentAccount', account)

export function setCurrentAccount(account){
  update(setCurrentAccountReducer(db, account))
}

export const setCurrentAccountsReducer = (db, accounts) =>
  db.set('accounts', fromJS(accounts))

export function setCurrentAccounts(accounts) {
  update(setCurrentAccountsReducer(db, accounts))
}
