import React, { Component } from 'react'
import './Navbar.css'
import INavbarButton from '../../models/navbar_button.interface'

interface NavbarProps {
    buttons: INavbarButton[],
}

export default class Navbar extends Component<NavbarProps> {
  render() {
    return (
      <div className='navbar'>
        {this.props.buttons.map((btn: INavbarButton) => {
            return (
                <button className={btn.className} onClick={btn.onClick}>
                    <img src={btn.icon}></img>
                    <span>{btn.text}</span>
                </button>
            )
        })}
      </div>
    )
  }
}
