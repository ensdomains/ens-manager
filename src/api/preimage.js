import 'whatwg-fetch'

const rootUrl = 'http://preimagedb.appspot.com/keccak256'

export function decryptHash(hash) {
  let trimmedHash = hash.slice(2)
  return fetch(`${rootUrl}/${trimmedHash}`)
    .then(res => res.text())
    .catch(error => error)
}
