import { createStore, combineReducers } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

(function () {
  let nextTodoId = 0

  // This is another react component but so much simple!
  const FilterLink = ({filter, children}) => {
    return (
      <a href='#' onClick={e => {
        e.preventDefault()
        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter
        })
      }}>{children}</a>
    )
  }

  class TodoApp extends React.Component {
    constructor () {
      super()
      this.input = ''
      this.getInputData = this.getInputData.bind(this)
    }

    getInputData (node) {
      console.log('node value:')
      console.log(node.value)
      this.input = node
    }

    render () {
      const visibleTodos = getVisibleTodos(
        this.props.todos,
        this.props.visibilityFilter
      )
      return (
        <div>
          <input ref={this.getInputData} />
          <button onClick={() => {
            console.log(this.input.value)
            store.dispatch({
              type: 'ADD_TODO',
              text: this.input.value,
              id: nextTodoId++
            })
            this.input.value = ''
          }}>
            Add Todo
          </button>
          <ul>
            {visibleTodos.map((todo) => {
              return <li
                key={todo.id}
                onClick={() => {
                  store.dispatch({
                    type: 'TOGGLE_TODO',
                    id: todo.id
                  })
                }}
                style={{
                  textDecoration: todo.completed ? 'line-through' : 'none'
                }}>{todo.text}</li>
            })}
          </ul>
          <p>
            Show: {' '}
            <FilterLink filter='SHOW_ALL'>
              all
            </FilterLink>
            {' '}
            <FilterLink filter='SHOW_ACTIVE'>
              active
            </FilterLink>
            {' '}
            <FilterLink filter='SHOW_COMPLETED'>
              completed
            </FilterLink>
          </p>
        </div>
      )
    }
  }

  const getVisibleTodos = (todos, filter) => {
    switch (filter) {
      case 'SHOW_ALL':
        return todos
      case 'SHOW_COMPLETED':
        return todos.filter(t => t.completed)
      case 'SHOW_ACTIVE':
        return todos.filter(t => !t.completed)
      default:
        return todos

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

  const render = () => {
    ReactDOM.render(
      // Render the TodoApp component to the <dev> with id 'root'
      <TodoApp
        todos={store.getState().todos}
        visibilityFilter={store.getState().visibilityFilter} />,
      document.querySelector('#foo')
    )
  }
  const store = createStore(todoApp)
  store.subscribe(render)
  store.subscribe(() => {
    console.log('Current state: ')
    console.log(store.getState())
  })
  render()
})()
