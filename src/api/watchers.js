import { getNamehash, watchEvent} from './ens'

export async function watchRegistryEvent(eventName, name, callback) {
  let namehash = await getNamehash(name)
  let event = await watchEvent('ENS',eventName, {node: namehash}, {fromBlock: 'latest'}, callback)
  return event
}

export async function watchResolverEvent(eventName, name, callback) {
  let namehash = await getNamehash(name)
  let event = await watchEvent('Resolver', eventName, {node: namehash}, {fromBlock: 'latest'}, callback)
  return event
}
