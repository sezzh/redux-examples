import { createStore } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

(function () {
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

  const todos = (state = [], action) => {
    if (action.type === 'ADD_TODO') {
      return [
        ...state,
        todo(undefined, action)
      ]
    } else if (action.type === 'TOGGLE_TODO') {
      return state.map((t) => todo(t, action))
    } else {
      return state
    }
  }

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
