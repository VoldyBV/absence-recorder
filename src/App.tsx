import React, { Component } from 'react'
import './App.css';
import { app, credentials } from './utilis/mongo.client';
import Preloader from './Components/Preloader/Preloader';
import IMember from './models/member.interface';
import IAbsenceRecord from './models/absence_record.interface';

interface AppProps {

}
interface AppState {
  currently_active: React.ReactNode,
  user?: Realm.User,
  members: IMember[],
  absence_records: IAbsenceRecord[],
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
  
    this.state = {
      members: [],
      absence_records: [],
      currently_active: <Preloader></Preloader>
    }
  }
  async componentDidMount() {
    var preloader_text: HTMLSpanElement = document.querySelector("#preloader-message")!
    
    preloader_text.innerText = "Connecting to database..."
    var user: Realm.User = await app.logIn(credentials);

    preloader_text.innerText = "Loading members...";
    var members: IMember[] = await user.functions.GetAllMembers();

    preloader_text.innerText = "Loading absence records..."
    var absence_records: IAbsenceRecord[] = await user.functions.GetAllAbsenceRecords();

    preloader_text.innerText = "Finishing up..."

    setTimeout(() => {
      this.setState({
        user,
        members,
        absence_records
      }, () => {console.log(this.state.members); console.log(this.state.absence_records)})
    }, 500);
  }
  render() {
    return (
      <div className='App'>
        {this.state.currently_active}
      </div>
    )
  }
}
