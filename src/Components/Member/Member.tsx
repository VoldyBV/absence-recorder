import React, { Component } from 'react'
import './Member.css'
//interfaces
import IMember from '../../models/member.interface'
import INavbarButton from '../../models/navbar_button.interface'
import IDataBaseResponse from '../../models/database_response.interface'
//components
import Navbar from '../Navbar/Navbar'
import MemberForm from './MemberForm/MemberForm'
//icons
import GoBackIcon from '../../icons/go-back.svg'
import InsertIcon from '../../icons/create.svg'

interface MemberProps {
  user: Realm.User,
  inherited_data: IMember[],
  go_back: () => void,
  saveData: (new_data: IMember[]) => void
}
interface MemberState {
  data: IMember[],
  navbar_btns: INavbarButton[],
  isInsertFormOpen: boolean,
}
export default class Member extends Component<MemberProps, MemberState> {
  constructor(props: MemberProps) {
    super(props)
    
    this.generateTable =this.generateTable.bind(this);
    this.toggleInsertForm = this.toggleInsertForm.bind(this);
    this.insert = this.insert.bind(this);

    this.state = {
      data: props.inherited_data,
      navbar_btns: [
        {
          icon: GoBackIcon,
          text: "Go back",
          className: "main-menu",
          onClick: props.go_back,
        },
        {
          icon: InsertIcon,
          text: 'Add member',
          className: "insert",
          onClick: this.toggleInsertForm
        }
      ],
      isInsertFormOpen: false,
    }
  }
  // this method generates table populated with data from database
  generateTable(): React.ReactNode {
    var data = this.state.data;
    return(
      <table className='table'>
        <thead>
          <tr className='level-0'>
            <th colSpan={4}>{'Members'}</th>
          </tr>
          <tr className='level-1'>
            <th>{'name'}</th>
            <th>{'group'}</th>
            <th>{'phone'}</th>
            <th>{'grade'}</th>
          </tr>
        </thead>
        <tbody>
            {data.map((item) => {
                return(
                    <tr className='level-2' key={item._id} id={item._id}>
                        <td>{item.full_name}</td>
                        <td>{item.group}</td>
                        <td>{item.phone}</td>
                        <td>{item.grade}</td>
                    </tr>
                )
            })}
        </tbody>
      </table>
    )
  }
  // this method hides/shows Insert Member Form
  toggleInsertForm() {
    var isInsertFormOpen = !this.state.isInsertFormOpen;
    this.setState({
      isInsertFormOpen
    })
  }
  // this method inserts new record into database
  async insert(data: IMember): Promise<void> {
    var waiting_screen = document.querySelector(".waiting-screen")! as HTMLDivElement;
    var success_screen = document.querySelector(".success-screen")! as HTMLDivElement;
    var fail_screen = document.querySelector(".fail-screen")! as HTMLDivElement;
    try{

      waiting_screen.style.display = "flex";
      waiting_screen.querySelector("span")!.innerText = "Adding member to database..."

      var response: IDataBaseResponse = await this.props.user.functions.InsertMember(data);

      waiting_screen.style.display = "none"

      if(!response.isSuccess) throw response.message;
      
      var new_data = response.data as IMember[];

      success_screen.style.display = "flex";
      success_screen.querySelector("span")!.innerText = response.message;

      setTimeout(() => {
        success_screen.style.display = "none"
        this.props.saveData(new_data);
        this.setState({
          data: new_data
        })
      }, 1499);
    }
    catch(error: any) {
      fail_screen.style.display = "flex";
      fail_screen.querySelector("span")!.innerText = error;
      console.log(error);
    }
  }
  render() {
    return (
      <div className='member'>
        <Navbar buttons={this.state.navbar_btns}></Navbar>
        {this.generateTable()}
        <MemberForm 
          isOpen={this.state.isInsertFormOpen} 
          form_name='insert-member' 
          type='insert'
          onSubmit={this.insert}
          onCancel={this.toggleInsertForm}
        ></MemberForm>
      </div>
    )
  }
}
