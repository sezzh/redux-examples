import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider, connect } from 'react-redux'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

(function () {
  let nextTodoId = 0

  /** START REDUCERS */

  // todo reducer function
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

  // todo list reducer function
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

  // filter reducer function
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

/** END REDUCERS */

/** STARTS React functionality containers */
  /**
   * This is a container.
   * In the render method it calculates if the link component should be
   *    available to click. It also sends the functionality to dispatch an
   *    action for the onClick method of the link component.
   */
  class FilterLink extends React.Component {
    componentDidMount () {
      const { store } = this.context
      this.unsubscribe = store.subscribe(() => {
        this.forceUpdate()
      })
    }

    componentWillUnmount () {
      this.unsubscribe()
    }

    render () {
      const props = this.props
      const { store } = this.context
      const state = store.getState()
      return (
        <Link
          active={props.filter === state.visibilityFilter}
          onFilterClick={() => {
            store.dispatch({
              type: 'SET_VISIBILITY_FILTER',
              filter: props.filter
            })
          }} >
          {props.children}
        </Link>
      )
    }
  }
  FilterLink.contextTypes = {store: React.PropTypes.object}

  const mapStateToProps = (state) => {
    return {
      todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
  }

  const mapDispatchToProps = (dispatch) => {
    return {
      onTodoClick: (id) => {
        dispatch({
          type: 'TOGGLE_TODO',
          id: id
        })
      }
    }
  }

/**
  class VisibleTodoList extends React.Component {
    componentDidMount () {
      const { store } = this.context
      this.unsubscribe = store.subscribe(() => {
        this.forceUpdate()
      })
    }

    componentWillUnmount () {
      this.unsubscribe()
    }

    render () {
      const props = this.props
      const { store } = this.context
      const state = store.getState()
      return (
        <TodoList
          todos={}
          onTodoClick={} />
      )
    }
  }
  VisibleTodoList.contextTypes = {store: React.PropTypes.object}
*/
  /**
  // providing store via context
  class Provider extends React.Component {
    getChildContext () {
      return { store: this.props.store }
    }
    render () {
      // this will return whatever its child is.
      return this.props.children
    }
  }
  // this is necesary to get the context in the children.
  Provider.childContextTypes = {store: React.PropTypes.object}
*/
/** ENDS React functionality containers */
/** STARTS PRESENTATIONAL COMPONENTS */

  // This is another react component but so much simple!
  const Link = ({active, children, onFilterClick}) => {
    if (active) {
      return (<span>{children}</span>)
    }
    return (
      <a href='#' onClick={(event) => {
        event.preventDefault()
        onFilterClick()
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

  const AddTodo = (props, {store}) => { // could be (props, context) => {}
    let input
    return (
      <div>
        <input ref={(node) => {
          input = node
        }} />
        <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: input.value
          })
          input.value = ''
        }}>
        Add Todo
        </button>
      </div>
    )
  }
  AddTodo.contextTypes = {store: React.PropTypes.object}

  const Footer = () => (
    <p>
      Show: {' '}
      <FilterLink
        filter='SHOW_ALL'>
        all
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_ACTIVE'>
        active
      </FilterLink>
      {' '}
      <FilterLink
        filter='SHOW_COMPLETED'>
        completed
      </FilterLink>
    </p>
  )

  const TodoApp = () => {
    return (
      <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
      </div>
    )
  }

/** ENDS PRESENTATIONAL COMPONENTS */

  // Filter function
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

  // this equals to a react.Component instance Container.
  // this is part of the react-redux lib bind.
  const VisibleTodoList = connect(
    mapStateToProps,
    mapDispatchToProps
  )(TodoList)

  /**
  // Creating the REDUX store.
  const store = createStore(
    todoApp,
    // Setting up the redux dev tools.

  )
  */
  // Injecting store through the provider component.
  ReactDOM.render(
    <Provider store={createStore(todoApp)}>
      <TodoApp />
    </Provider>, document.querySelector('#foo')
  )
  /**
  // Rendering for the first time the app.
  ReactDOM.render(
    // Render the TodoApp component to the <dev> with id 'root'
    <TodoApp
      store={
        createStore(
          todoApp,
          window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )} />,
        document.querySelector('#foo')
  )
/**
  // just a little store sub for the console.
  store.subscribe(() => {
    console.log('Current state: ')
    console.log(store.getState())
  })
*/
})()
