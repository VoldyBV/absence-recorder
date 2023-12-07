import React, { Component } from 'react'
import Image from './animation.svg';
import './Preloader.css'

export default class Preloader extends Component {
  render() {
    return (
      <div className='preloader'>
        <img src={Image}></img>
        <span id='preloader-message'>Some message</span>
      </div>
    )
  }
}
