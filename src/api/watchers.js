import { getNamehash, getENSEvent, watchENSEvent} from './ens'

export async function watchEvent(eventName, name, callback) {
  let namehash = await getNamehash(name)
  let event = await watchENSEvent(eventName, {node: namehash}, {fromBlock: 'latest'}, callback)
  return event
}
