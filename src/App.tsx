import React, { Component } from 'react'
import './App.css';
import Preloader from './Components/Preloader/Preloader';

interface AppProps {

}
interface AppState {
  currently_active: any,
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
  
    this.state = {
      currently_active: <Preloader></Preloader>
    }
  }
  render() {
    return (
      <div className='App'>
        {this.state.currently_active}
      </div>
    )
  }
}
