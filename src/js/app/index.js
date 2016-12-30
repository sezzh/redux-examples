import { createStore } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

(function () {
  const todos = (state = [], action) => {
    if (action.type === 'ADD_TODO') {
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ]
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

  testAddTodo()
  console.log('All test passed')
})()
