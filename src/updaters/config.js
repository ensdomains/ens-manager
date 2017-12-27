import { db, update } from 'redaxe'
import { fromJS } from 'immutable'

export const setCurrentAccountsReducer = (db, accounts) =>
  db.set('accounts', fromJS(accounts))

export function setCurrentAccounts(accounts) {
  update(setCurrentAccountsReducer(db, accounts))
}

export const toggleAboutReducer = (db) =>
  db.set('isAboutModalActive', !db.get('isAboutModalActive'))

export function toggleAbout() {
  update(toggleAboutReducer(db))
}
