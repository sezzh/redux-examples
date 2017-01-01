import { createStore } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

(function () {
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
    console.log('Current state of visibilityFilter:')
    console.dir(state)
    if (action.type === 'SET_VISIBILITY_FILTER') {
      return action.filter
    } else {
      return state
    }
  }

  // reducer function
  const todoApp = (state = {}, action) => {
    return {
      // Call the `todos()` reducer from last section
      todos: todos(state.todos, action),
      visibilityFilter: visibilityFilter(state.visibilityFilter, action)
    }
  }

  const store = createStore(todoApp)
  console.log('Initial state:')
  console.log(store.getState())
  console.log('-------------')

  console.log('dispatching ADD_TODO:')
  store.dispatch({
    type: 'ADD_TODO',
    id: 0,
    text: 'Learn Redux'
  })

  console.log('Current state:')
  console.log(store.getState())
  console.log('-------------')

  console.log('dispatching ADD_TODO:')
  store.dispatch({
    type: 'ADD_TODO',
    id: 1,
    text: 'Go shopping'
  })

  console.log('Current state:')
  console.log(store.getState())
  console.log('-------------')

  console.log('Dispatching TOGGLE_TODO')
  store.dispatch({
    type: 'TOGGLE_TODO',
    id: 0
  })

  console.log('Current state:')
  console.log(store.getState())
  console.log('-------------')

  console.log('Dispatching SET_VISIBILITY_FILTER')
  store.dispatch({
    type: 'SET_VISIBILITY_FILTER',
    filter: 'SHOW_COMPLETED'
  })

  console.log('Current state:')
  console.log(store.getState())
  console.log('-------------')

  const testAddTodo = () => {
    const stateBefore = []

    const action = {
      type: 'ADD_TODO',
      id: 0,
      text: 'Learn Redux'
    }

    const stateAfter = [
      {
        id: 0,
        text: 'Learn Redux',
        completed: false
      }
    ]

    deepFreeze(stateBefore)
    deepFreeze(action)

    expect(
      todos(stateBefore, action)
    ).toEqual(stateAfter)
  }

  const testToggleTodo = () => {
    const stateBefore = [
      {
        id: 0,
        text: 'Learn Redux',
        completed: false
      },
      {
        id: 1,
        text: 'Go shopping',
        completed: false
      }
    ]

    const action = {
      type: 'TOGGLE_TODO',
      id: 1
    }

    const stateAfter = [
      {
        id: 0,
        text: 'Learn Redux',
        completed: false
      },
      {
        id: 1,
        text: 'Go shopping',
        completed: true
      }
    ]

    deepFreeze(stateBefore)
    deepFreeze(action)

    expect(
      todos(stateBefore, action)
    ).toEqual(stateAfter)
  }

  testAddTodo()
  testToggleTodo()
  console.log('All test passed')
})()
