import 'whatwg-fetch'

const rootUrl = 'http://preimagedb.appspot.com/keccak256'

export function checkHash(hash) {
  return fetch(`${rootUrl}/${hash}`)
    .then(res => res.text())
}
