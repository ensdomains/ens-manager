export default function RedaxImmutableLogger (prevState, nextState) {
  console.log('previousState')
  console.log(prevState.toJS())
  console.log('currentState')
  console.log(nextState.toJS())
  return nextState
}
