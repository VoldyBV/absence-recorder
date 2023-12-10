import React, { Component } from 'react'
import './MemberForm.css'
import IMember from '../../../models/member.interface'
//icons
import CancelIcon from '../../../icons/cancel.svg'
import SubmitIcon from '../../../icons/approve.svg'

interface MemberFormProps {
    isOpen: boolean,
    data?: IMember,
    form_name: string,
    type: 'insert' | 'update' | 'filter',
    onSubmit: (data: IMember) => Promise<void>,
    onCancel: () => void,
}
interface MemberFormState {
    _id?: string,
    full_name: string,
    group: string,
    phone: string,
    grade: string
}

export default class MemberForm extends Component<MemberFormProps, MemberFormState> {
  constructor(props: MemberFormProps) {
    super(props)

    this.full_name_onChange = this.full_name_onChange.bind(this);
    this.phone_onChange = this.phone_onChange.bind(this);
    this.grade_onChange = this.grade_onChange.bind(this);
    this.group_onChange = this.group_onChange.bind(this);
    this.form_onSubmit = this.form_onSubmit.bind(this);
    this.validateData = this.validateData.bind(this);
    
    let data_container: any = !!props.data ? props.data : {};

    this.state = {
        _id: data_container._id || undefined,
        full_name: data_container.full_name || '',
        group: data_container.group || (props.type == 'filter' ? '' : 'podmladak'),
        phone: data_container.phone || '',
        grade: data_container.grade || '',
    }
  }
  form_onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if(!this.validateData()) return;
    let data: IMember = {
        _id: this.state._id?.toString(),
        full_name: this.state.full_name,
        group: this.state.group,
        phone: this.state.phone,
        grade: this.state.grade,
    };
    this.props.onSubmit(data);
    this.setState({
        _id: undefined,
        full_name: '',
        group: this.props.type == 'filter' ? '' : 'podmladak',
        phone: '',
        grade: '',
    })
  }
  form_onCancel() {
    this.setState({
        _id: undefined,
        full_name: '',
        group: '',
        phone: '',
        grade: '',
    })
  }
  full_name_onChange(e: React.ChangeEvent) {
    let input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    let full_name = input.value.toLowerCase();

    this.setState({
        full_name
    })
  }
  phone_onChange(e: React.ChangeEvent) {
    let input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    let phone = input.value.toLowerCase();

    this.setState({
        phone
    })
  }
  grade_onChange(e: React.ChangeEvent) {
    let input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    let grade = input.value.toLowerCase();

    this.setState({
        grade
    })
  }
  group_onChange(e: React.ChangeEvent) {
    var input: HTMLInputElement = e.currentTarget as HTMLInputElement;
    if(!input.checked) return;

    let group = input.value.toLowerCase();

    this.setState({
        group
    })
  }
  validateData(): boolean {
    if(this.props.type == 'filter') return true;

    let full_name = this.state.full_name;
    let phone = this.state.phone;
    let grade = this.state.grade;

    // validating full_name field
    if(!!!full_name) {
        alert("Filed 'Full Name' must not be empty!");
        return false;
    }

    // validating phone
    let pattern1 = /[0-9]{3}\/[0-9]{3}-[0-9]{3}/
    let pattern2 = /[0-9]{3}\/[0-9]{3}-[0-9]{3}-[0-9]{1}/
    let match1 = phone.match(pattern1)?.toString();
    let match2 = phone.match(pattern2)?.toString();

    if(!((phone == match1) || (phone == match2))) {
        alert("Phone number must be written in one of following formats:\nFormat 1: 000/000-000\nFormat2: 000/000-000-0");
        return false;
    }

    // validating grade
    if(Number(grade) <= 0 && grade !== ''){
        alert("Number in field 'Grade' must be grater than 0\nNote: you can leave it empty")
        return false;
    }
    if(Number(grade) > 9){
        alert("Number in field 'Grade' must be less than 10\nNote: you can leave it empty")
        return false;
    }
    if(Number(grade) == 5){
        alert("Number in field 'Grade' can not be equal to 5\nNote: you can leave it empty")
        return false;
    }


    return true
  }
  render() {
    return (
      <div className='member-form' style={{display: this.props.isOpen ? 'flex' : 'none'}}>
        <form onSubmit={this.form_onSubmit}>
            <span className='text-box-label'>{'Full name:'}</span>
            <input 
                type='text' 
                name={`${this.props.form_name}-full_name`} 
                className='text-box'
                value={this.state.full_name}
                onChange={this.full_name_onChange}
            ></input>
            <span className='text-box-label'>{'phone:'}</span>
            <input 
                type='tel' 
                name={`${this.props.form_name}-phone`}
                className='text-box'
                value={this.state.phone}
                onChange={this.phone_onChange}
            ></input>
            <span className='text-box-label'>{'grade:'}</span>
            <input 
                type='number'
                name={`${this.props.form_name}-grade`}
                className='text-box'
                value={this.state.grade}
                onChange={this.grade_onChange}
            ></input>
            <span className='text-box-label'>{'Group:'}</span>
            <div className="radio-btns-container">
                <label style={{display: this.props.type == 'filter' ? 'flex' : 'none'}}>
                    <input 
                        type="radio"
                        name={`${this.props.form_name}-group`}
                        value={''}
                        checked={this.state.group == ''}
                        onChange={this.group_onChange}
                    ></input>
                    <span>{'Any'}</span>
                </label>
                <label>
                    <input 
                        type="radio"
                        name={`${this.props.form_name}-group`}
                        value={'podmladak'}
                        checked={this.state.group == 'podmladak'}
                        onChange={this.group_onChange}
                    ></input>
                    <span>{'Podmladak'}</span>
                </label>
                <label>
                    <input 
                        type="radio"
                        name={`${this.props.form_name}-group`}
                        value={'omladina'}
                        checked={this.state.group == 'omladina'}
                        onChange={this.group_onChange}
                    ></input>
                    <span>{'Omladina'}</span>
                </label>
            </div>
            <div className='form-buttons-container'>
                <button type='button' className='cancel' onClick={this.props.onCancel}>
                    <img src={CancelIcon} />
                    <span>{'Cancel'}</span>
                </button>
                <button type='submit' className='submit'>
                    <img src={SubmitIcon} />
                    <span>{'Submit'}</span>
                </button>
            </div>
        </form>
      </div>
    )
  }
}
