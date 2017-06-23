import { db, update } from 'redaxe'

export const switchTabReducer = tab =>
  db.set('currentTab', tab)

export function switchTab(tab){
  update(switchTabReducer(tab))
}

export const updateFormReducer = (formName, data) =>
  db.setIn(['updateForm', formName], data)

export function updateForm(formName, data) {
  update(updateFormReducer(formName, data))
}

export const selectNodeReducer = name =>
  db.set('selectedNode', name)

export function selectNode(name) {
  update(selectNodeReducer(name))
}

export const selectReverseNodeReducer = address =>
  db.set('selectedReverseNode', address)

export function selectReverseNode(address) {
  update(selectReverseNodeReducer(address))
}
