import 'whatwg-fetch'

const rootUrl = 'http://preimagedb.appspot.com/keccak256'

export function checkHash(hash) {
  return fetch(`${rootUrl}/${hash}`)
}

//checkHash('9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658')
