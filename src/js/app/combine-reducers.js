const combineReducersScratch = (reducers) => {
  return (state = {}, action) => {

    // Reduce all the keys for reducers from 'todos' and 'visibilityFilter'
    return Object.keys(reducers).reduce((nextState, key) => {
      // Call the corresponding reducer function for a given key
      nextState[key] = reducers[key](state[key], action)
      return nextState
    }, {} // Here will be the results of every keys inside the reducers'es object
  )
  }
}
