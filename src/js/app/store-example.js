/**
 * This is a simple example of how the "redux store" can be created.
 */
const createStore = (reducer) => {
  let state
  let listeners = []

  const getState = () => state

  const dispatch = (action) => {
    state = reducer(state, action)
    listeners.forEach((listener) => {
      listener()
    })
  }

  const subscribe = (listener) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }

  // this create the initial state of the reducer.
  dispatch({})

  return { getState, dispatch, subscribe }
}

export default createStore
