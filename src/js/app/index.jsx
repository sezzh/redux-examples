import { createStore, combineReducers } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

(function () {
  let nextTodoId = 0

  // This is another react component but so much simple!
  const FilterLink = ({filter, currentFilter, children, onFilterClick}) => {
    if (filter === currentFilter) {
      return (<span>{children}</span>)
    }
    return (
      <a href='#' onClick={(event) => {
        event.preventDefault()
        onFilterClick(filter)
      }}>{children}</a>
    )
  }

  const Todo = ({onClick, completed, text}) => (
    <li
      onClick={onClick}
      style={{
        textDecoration: completed ? 'line-through' : 'none'
      }}>{text}</li>
  )

  const TodoList = ({todos, onTodoClick}) => (
    <ul>
      {todos.map(todo =>
        <Todo
          key={todo.id}
          {...todo}
          onClick={() => { onTodoClick(todo.id) }} />
      )}
    </ul>
  )

  const AddTodo = ({onAddClick}) => {
    let input
    return (
      <div>
        <input ref={(node) => {
          input = node
        }} />
        <button onClick={() => {
          onAddClick(input.value)
          input.value = ''
        }}>
        Add Todo
        </button>
      </div>
    )
  }

  const Footer = ({visibilityFilter, onFilterClick}) => (
    <p>
      Show: {' '}
      <FilterLink
        filter='SHOW_ALL'
        currentFilter={visibilityFilter}
        onFilterClick={onFilterClick}>
        all
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_ACTIVE'
        currentFilter={visibilityFilter}
        onFilterClick={onFilterClick}>
        active
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_COMPLETED'
        currentFilter={visibilityFilter}
        onFilterClick={onFilterClick}>
        completed
      </FilterLink>
    </p>
  )

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
          <AddTodo
            onAddClick={(text) => {
              store.dispatch({
                type: 'ADD_TODO',
                id: nextTodoId++,
                text: text
              })
            }}
          />
          <TodoList
            todos={visibleTodos} onTodoClick={(id) => {
              store.dispatch({
                type: 'TOGGLE_TODO',
                id: id
              })
            }}
          />
          <Footer
            visibilityFilter={this.props.visibilityFilter}
            onFilterClick={(filter) => {
              store.dispatch({
                type: 'SET_VISIBILITY_FILTER',
                filter: filter
              })
            }} />
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
  const store = createStore(
    todoApp,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
  store.subscribe(render)
  store.subscribe(() => {
    console.log('Current state: ')
    console.log(store.getState())
  })
  render()
})()
