import { createStore } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'

  // this is the reducer function.
function counter (state = 0, action) {
  if (action.type === 'INCREMENT') {
    return state + 1
  } else if (action.type === 'DECREMENT') {
    return state - 1
  } else {
    return state
  }
}

(function () {
  const Counter = ({ value, onIncrement, onDecrement }) => (
    <div>
      <h1>{value}</h1>
      <button onClick={onIncrement}>+</button>
      <button onClick={onDecrement}>-</button>
    </div>
  )
  const render = () => {
    ReactDOM.render(
      <Counter
        value={store.getState()}
        onIncrement={() => {
          store.dispatch({ type: 'INCREMENT' })
        }}
        onDecrement={() => {
          store.dispatch({ type: 'DECREMENT' })
        }} />,
      document.querySelector('#foo')
    )
  }
  let store = createStore(counter)
  store.subscribe(render)
  render()
})()
