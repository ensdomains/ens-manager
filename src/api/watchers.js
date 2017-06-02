import { watchENSEvent, getNamehash,getENSEvent} from './ens'
import { incrementWatchers } from '../updaters/config'

export async function watchResolverEvent(name) {
  let namehash = await getNamehash(name)
  incrementWatchers('NewResolver')
  let { log, event, eventName } = await watchENSEvent('NewResolver', {node: namehash}, {fromBlock: 'latest'})
  return { log, event }
}

export async function watchTransferEvent(name) {
  let namehash = await getNamehash(name)
  incrementWatchers('Transfer')
  let { log, event, eventName } = await watchENSEvent('Transfer', {node: namehash}, {fromBlock: 'latest'})
  return { log, event }
}

export async function watchNewOwnerEvent(name) {
  let namehash = await getNamehash(name)
  incrementWatchers('NewOwner')
  let { log, event, eventName } = await watchENSEvent('NewOwner', {node: namehash}, {fromBlock: 'latest'})
  return { log, event }
}

export function stopWatching(event, watchers){
  if(watchers === 0) {
    event.stopWatching()
    console.log('stopped watching')
    return true
  } else {
    console.log('still watching')
    return false
  }
}
