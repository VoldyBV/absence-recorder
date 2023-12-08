import React, { Component } from 'react'
import './ControlPanel.css';

interface ControlPanelProps {
    switchComponent: (component_name?: string) => void
}

export default class ControlPanel extends Component<ControlPanelProps> {
  render() {
    return (
      <div className='control-panel'>
        <button onClick={() => {this.props.switchComponent('members')}}>{'Members'}</button>
        <button onClick={() => {this.props.switchComponent('absence-records')}}>{'Absence records'}</button>
        <button onClick={() => {this.props.switchComponent('reports')}}>{'Reports'}</button>
      </div>
    )
  }
}
