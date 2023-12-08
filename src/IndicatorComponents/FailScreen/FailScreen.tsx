import React, { Component } from 'react'
import './FailScreen.css';
import Image from './x.svg'

export default class FailScreen extends Component {
  hide_screen(e: React.MouseEvent) {
    e.preventDefault();
    var div: HTMLDivElement = document.querySelector(".fail-screen")!;

    div.style.display = "none";
  }
  render() {
    return (
      <div className='fail-screen'>
        <img src={Image}></img>
        <span>{'(error message)'}</span>
        <a onClick={(event) => { this.hide_screen(event) }}>(click here to hide this)</a>
      </div>
    )
  }
}
