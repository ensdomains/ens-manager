export function nodeTransformer(db) {
  let nodes = db.get('nodes')
  let updatePath = ['nodes']
  
  recursiveSet(nodes, updatePath)

  function recursiveSet(nodes, updatePath){
    nodes.forEach((node, index) => {
      db = db.setIn([...updatePath, index, 'refreshed'], false)
             .setIn([...updatePath, index, 'fetchingSubdomains'], false)
      if(nodes.size > 0) {
        let nextUpdatePath = [...updatePath, index, 'nodes']
        let nextNodes = db.getIn(nextUpdatePath)
        recursiveSet(nextNodes, nextUpdatePath)
      }
    })
  }

  return db
}