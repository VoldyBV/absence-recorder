import React, { Component } from 'react'
import './AbsenceRecordForm.css'
//intefaces
import IMember from '../../../models/member.interface'
//icons
import CalendarIcon from '../../../icons/calendar.svg'
import CancelIcon from '../../../icons/cancel.svg'
import SubmitIcon from '../../../icons/approve.svg'

interface Props {
  form_name: string,
  members: IMember[],
  type: 'insert' | 'update' | 'filter'
}
interface State {
  date: string,
  member: string,
  isExcussed: string,
  notes: string
}

export default class AbsenceRecordForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.showDatePicker = this.showDatePicker.bind(this);
    this.date_onChange = this.date_onChange.bind(this);
    this.member_onChange = this.member_onChange.bind(this);
    this.isExcussed_onChange = this.isExcussed_onChange.bind(this);
    this.notes_onChange = this.notes_onChange.bind(this);

    this.state =  {
      date: '',
      member: '',
      isExcussed: 'false',
      notes: ''
    }
  }
  showDatePicker() {
    var input: HTMLInputElement = document.querySelector(".date-picker input")!;
    input.showPicker();
  }
  date_onChange(event: React.ChangeEvent) {
    var date = (event.currentTarget as HTMLInputElement).value;

    this.setState({
      date
    })
  }
  member_onChange(event: React.ChangeEvent) {
    var member = (event.currentTarget as HTMLInputElement).value;
    
    this.setState({
      member
    })
  }
  isExcussed_onChange(event: React.ChangeEvent) {
    var checked = (event.currentTarget as HTMLInputElement).checked

    if(!checked) return

    var isExcussed = (event.currentTarget as HTMLInputElement).value;
    
    this.setState({
      isExcussed
    })
  }
  notes_onChange(event: React.ChangeEvent) {
    var notes = (event.currentTarget as HTMLInputElement).value.toLowerCase();
    
    this.setState({
      notes
    })
  }
  render() {
    return (
      <div className='absence-record-form'>
        <form>
          <span className='text-box-label'>{'Date:'}</span>
          <div className='date-picker'>
            <button type='button' onClick={this.showDatePicker}>
              <span>{!!this.state.date ? this.state.date.split('-').reverse().join('.') : 'Pick a date...'}</span>
              <img src={CalendarIcon}></img>
            </button>
            <input 
              name={`${this.props.form_name}-date`} 
              type='date'
              value={this.state.date}
              onChange={this.date_onChange}
            ></input>
          </div>
          <span className='text-box-label'>{'member:'}</span>
          <select  
            name={`${this.props.form_name}-member`} 
            className='text-box'
            value={this.state.member}
            onChange={this.member_onChange}
          >
            <option value={''} style={{display: 'none'}}>{'select a member'}</option>
            {this.props.members.map((item) => {
              return <option key={item._id} value={item._id}>{item.full_name + " | " + item.group}</option>
            })}
          </select>
          <span className='text-box-label'>{'notes:'}</span>
          <textarea 
            name={`${this.props.form_name}-notes`} 
            className='text-box'
            value={this.state.notes}
            onChange={this.notes_onChange}
          ></textarea>
          <span className='text-box-label'>{'is excussed:'}</span>
          <div className="radio-btns-container">
                <label style={{display: this.props.type === 'filter' ? 'flex' : 'none'}}>
                    <input 
                        type="radio"
                        name={`${this.props.form_name}-isExcussed`}
                        value={''}
                        checked={this.state.isExcussed === ''}
                        onChange={this.isExcussed_onChange}
                    ></input>
                    <span>{'Any'}</span>
                </label>
                <label>
                    <input 
                        type="radio"
                        name={`${this.props.form_name}-isExcussed`}
                        value={'true'}
                        checked={this.state.isExcussed === 'true'}
                        onChange={this.isExcussed_onChange}
                    ></input>
                    <span>{'yes'}</span>
                </label>
                <label>
                    <input 
                        type="radio"
                        name={`${this.props.form_name}-isExcussed`}
                        value={'false'}
                        checked={this.state.isExcussed === 'false'}
                        onChange={this.isExcussed_onChange}
                    ></input>
                    <span>{'no'}</span>
                </label>
          </div>
          <div className='form-buttons-container'>
              <button type='button' className='cancel'>
                  <img src={CancelIcon} />
                  <span>{'Cancel'}</span>
              </button>
              <button type='button' className='submit'>
                  <img src={SubmitIcon} />
                  <span>{'Submit'}</span>
              </button>
          </div>
        </form>
      </div>
    )
  }
}
