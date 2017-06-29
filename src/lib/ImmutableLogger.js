export default function RedaxImmutableLogger (state) {
  console.log('currentState')
  console.log(state)
  console.log(state.toJS())
  return state
}
