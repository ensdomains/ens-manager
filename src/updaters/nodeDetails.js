import { db, update } from 'redaxe'

export const switchTabReducer = tab =>
  db.set('currentTab', tab)

export function switchTab(tab){
  update(switchTabReducer(tab))
}

export const updateFormReducer = (formName, value) =>
  db.setIn(['updateForm', formName], value)

export function updateForm(formName, value) {
  update(updateFormReducer(formName, value))
}

export const updateReverseFormReducer = (formName, value) =>
  db.setIn(['reverseUpdateForm', formName], value)

export function updateReverseForm(formName, value) {
  update(updateReverseFormReducer(formName, value))
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
