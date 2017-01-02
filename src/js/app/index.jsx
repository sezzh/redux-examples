import { createStore, combineReducers } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

(function () {
  let nextTodoId = 0

  class TodoApp extends React.Component {
    constructor () {
      super()
      this.addTodo = this.addTodo.bind(this)
      this.updateView = this.updateView.bind(this)
      this.state = {
        todos: []
      }
    }

    addTodo () {
      store.dispatch({
        type: 'ADD_TODO',
        text: 'Test',
        id: nextTodoId++
      })
    }

    componentDidMount () {
      store.subscribe(this.updateView)
    }

    updateView () {
      this.setState({ todos: store.getState().todos })
    }

    render () {
      return (
        <div>
          <button onClick={this.addTodo}>
            Add Todo
          </button>
          <ul>
            {this.state.todos.map((todo) => {
              return <li key={todo.id}>{todo.text}</li>
            })}
          </ul>
        </div>
      )
    }
  }
  // reducer function
  const todo = (state, action) => {
    if (action.type === 'ADD_TODO') {
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    } else if (action.type === 'TOGGLE_TODO') {
      if (state.id !== action.id) {
        return state
      }
      return Object.assign({}, state, { completed: !state.completed })
    } else {
      return state
    }
  }

  // reducer function
  const todos = (state = [], action) => {
    if (action.type === 'ADD_TODO') {
      return [
        ...state,
        todo(state, action)
      ]
    } else if (action.type === 'TOGGLE_TODO') {
      return state.map((t) => todo(t, action))
    } else {
      return state
    }
  }

  // reducer function
  const visibilityFilter = (state = 'SHOW_ALL', action) => {
    if (action.type === 'SET_VISIBILITY_FILTER') {
      return action.filter
    } else {
      return state
    }
  }

  // Principal Reducer function.
  const todoApp = combineReducers({ // This is a good practice.
    todos,
    visibilityFilter
  })

  const store = createStore(todoApp)
  ReactDOM.render(
    // Render the TodoApp component to the <dev> with id 'root'
    <TodoApp />,
    document.querySelector('#foo')
  )
})()
