import { createStore, combineReducers } from 'redux'
import React from 'react'
import ReactDOM from 'react-dom'
import expect from 'expect'
import deepFreeze from 'deep-freeze'

(function () {

  class InputContainer extends React.Component {
    constructor () {
      super()
    }

    render () {
      return (
        <label>{this.props.tuvalor}</label>
      )
    }
  }

  class ButtonComponent extends React.Component {
    constructor() {
      super()
      this.accionBoton = this.accionBoton.bind(this)
    }

    accionBoton () {
      var mensaje = 'hola soy fabiola'
      this.props.handleButton(mensaje)
    }

    render() {
      return (
        <button onClick={this.accionBoton}>{this.props.value}</button>
      )
    }
  }

  class HelloComponent extends React.Component {
    constructor () {
      super()
      this.botoncitoBorra = this.botoncitoBorra.bind(this)
      this.state = {
        'inputValue': 'hola escribe tu nombre',
        'btnlabel1': 'activar',
        'btnlabel2': 'borrar'
      }
    }

    componentDidMount () {
      debugger
      this.setState({'inputValue': 'otro mensaje'})
    }

    botoncitoBorra (mensaje) {
      this.setState({'inputValue': mensaje})
    }

    render () {
      return (
        <div>
          <InputContainer tuvalor={this.state.inputValue} />
          <button>{this.state.btnlabel1}</button>
          <ButtonComponent handleButton={this.botoncitoBorra} value={this.state.btnlabel2} />
        </div>
      )
    }
  }

  ReactDOM.render(<HelloComponent/>, document.querySelector('#foo'))

})()
