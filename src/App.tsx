import React, { Component } from 'react'
import './App.css';
//utilis
import * as SortingMethods from './utilis/sorting_functions'
import { app, credentials } from './utilis/mongo.client';
//interfaces
import IMember, { isMember } from './models/member.interface';
import IAbsenceRecord, { isAbsenceRecord } from './models/absence_record.interface';
//indicators
import Preloader from './IndicatorComponents/Preloader/Preloader';
import WaitingScreen from './IndicatorComponents/WaitingScreen/WaitingScreen';
import SuccessScreen from './IndicatorComponents/SuccessScreen/SuccessScreen';
import FailScreen from './IndicatorComponents/FailScreen/FailScreen';
//components
import ControlPanel from './Components/ControlPanel/ControlPanel';
import Member from './Components/Member/Member';
import AbsenceRecords from './Components/AbsenceRecords/AbsenceRecords';

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
  
    this.switchComponent = this.switchComponent.bind(this);
    this.saveMembers = this.saveMembers.bind(this)

    this.state = {
      members: [],
      absence_records: [],
      currently_active: <Preloader></Preloader>
    }
  }
  async componentDidMount() {
    // functions for sorting absence_records
    // sorting data here because it would take too much time to sort it in cloud
    // Function to compare dates
    var preloader_text: HTMLSpanElement = document.querySelector("#preloader-message")!
    
    preloader_text.innerText = "Connecting to database..."
    var user: Realm.User = await app.logIn(credentials);

    preloader_text.innerText = "Loading members...";
    var members: IMember[] = await user.functions.GetAllMembers();

    preloader_text.innerText = "Loading absence records..."
    var absence_records: IAbsenceRecord[] = await user.functions.GetAllAbsenceRecords();
    // sorting absence_records
    absence_records.sort(SortingMethods.SortAbsenceRecords)

    preloader_text.innerText = "Finishing up...";

    let waiting_screen = document.querySelector(".waiting-screen")! as HTMLDivElement;
    let success_screen = document.querySelector(".success-screen")! as HTMLDivElement;
    let fail_screen = document.querySelector(".fail-screen")! as HTMLDivElement;

    setTimeout(() => {
      this.setState({
        user,
        members,
        absence_records,
        currently_active: <ControlPanel switchComponent={this.switchComponent}></ControlPanel>
      });
    }, 1000);
  }
  // switchComponents is method that will be called from control panel component
  // It's purpose is to switch between components 
  // It will also called from other components so that application can return to control panel component
  switchComponent(component_name?: string) {
    var component: React.ReactNode;

    switch(component_name) {
      case 'members':
        component = 
          <Member 
            user={this.state.user!} 
            saveData={this.saveMembers} 
            inherited_data={this.state.members} 
            go_back={this.switchComponent}
          ></Member>; break;
      case 'absence-records':
        component = 
          <AbsenceRecords
            user={this.state.user!}
            inherited_data={this.state.absence_records}
            members={this.state.members}
            go_back={this.switchComponent}
          ></AbsenceRecords>; break
      default: component = <ControlPanel switchComponent={this.switchComponent}></ControlPanel>
    }

    this.setState({
      currently_active: component
    })
  }
  // this method saves data to global state
  saveMembers(new_data: IMember[]){
    this.setState({
      members: new_data
    })
  }
  render() {
    return (
      <div className='App'>
        {this.state.currently_active}
        <WaitingScreen></WaitingScreen>
        <SuccessScreen></SuccessScreen>
        <FailScreen></FailScreen>
      </div>
    )
  }
}
