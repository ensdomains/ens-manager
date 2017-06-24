import { db, update } from 'redaxe'

export const setCurrentAccountReducer = (db, account) =>
  db.set('currentAccount', account)

export function setCurrentAccount(account) {
  update(setCurrentAccountReducer(db, account))
}
