import { db, update} from 'redaxe'

export const addLabelToPreImageDBReducer = (db, labelHash, label) =>
  db.setIn(['preImageDB', labelHash], label)

export function addLabelToPreImageDB(labelHash, label) {
  update(addLabelToPreImageDBReducer(db, labelHash, label))
}

export const checkLabelHash = labelHash =>
  db.getIn(['preImageDB', labelHash])
