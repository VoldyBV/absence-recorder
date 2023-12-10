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
import UpdateIcon from '../../icons/edit.svg';
import DeleteIcon from '../../icons/delete.svg';
import FilterIcon from '../../icons/filter.svg';

interface MemberProps {
  user: Realm.User,
  inherited_data: IMember[],
  go_back: () => void,
  saveData: (new_data: IMember[]) => void
}
interface MemberState {
  data: IMember[],
  navbar_btns: INavbarButton[],
  selected_record: IMember,
  last_filter?: IMember, 
  isInsertFormOpen: boolean,
  isUpdateFormOpen: boolean,
  isFilterFormOpen: boolean,
}
export default class Member extends Component<MemberProps, MemberState> {
  constructor(props: MemberProps) {
    super(props)
    
    this.generateTable =this.generateTable.bind(this);
    this.generateMemberForm =this.generateMemberForm.bind(this);
    this.selectRecord = this.selectRecord.bind(this);
    this.toggleInsertForm = this.toggleInsertForm.bind(this);
    this.toggleUpdateForm = this.toggleUpdateForm.bind(this);
    this.toggleFilterForm = this.toggleFilterForm.bind(this);
    this.insertMember = this.insertMember.bind(this);
    this.updateMember = this.updateMember.bind(this);
    this.deleteMember = this.deleteMember.bind(this);
    this.filterMembers = this.filterMembers.bind(this);

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
        },
        {
          icon: UpdateIcon,
          text: 'Edit member',
          className: "update",
          onClick: this.toggleUpdateForm
        },
        {
          icon: DeleteIcon,
          text: 'Delete member',
          className: "delete",
          onClick: this.deleteMember
        },
        {
          icon: FilterIcon,
          text: 'Filter members',
          className: "filter",
          onClick: this.toggleFilterForm
        }
      ],
      selected_record: props.inherited_data[0],
      isInsertFormOpen: false,
      isUpdateFormOpen: false,
      isFilterFormOpen: false
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
                let style = item._id === this.state.selected_record._id ? 'selected-record' : '';
                return(
                    <tr 
                      className={`level-2 ${style}`}
                      key={item._id} 
                      id={item._id} 
                      onClick={this.selectRecord}
                    >
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
  // this method generates MemberForm 
  generateMemberForm(): React.ReactNode | '' {
    if(this.state.isInsertFormOpen) {
      return <MemberForm 
        isOpen={this.state.isInsertFormOpen} 
        form_name='insert-member' 
        type='insert'
        onSubmit={this.insertMember}
        onCancel={this.toggleInsertForm}
      ></MemberForm>
    }
    if(this.state.isUpdateFormOpen) {
      return <MemberForm 
        isOpen={this.state.isUpdateFormOpen} 
        form_name='update-member' 
        type='update'
        data={this.state.selected_record}
        onSubmit={this.updateMember}
        onCancel={this.toggleUpdateForm}
      ></MemberForm>
    }
    if(this.state.isFilterFormOpen) {
      return <MemberForm 
        isOpen={this.state.isFilterFormOpen} 
        form_name='filter-member'
        data={this.state.last_filter}
        type='filter'
        onSubmit={this.filterMembers}
        onCancel={this.toggleFilterForm}
      ></MemberForm>
    }
    return '';
  }
  // this method selects a record
  selectRecord(e: React.MouseEvent) {
    var selected = document.querySelector(".selected-record")!;
    var tr = e.currentTarget;
    var _id = tr.id;

    for (const member of this.state.data) {
      if(member._id != _id) continue
      tr.classList.toggle("selected-record");
      selected.classList.toggle("selected-record");
      this.setState({
        selected_record: member
      });
      break;
    }
  }
  // this method hides/shows Insert Member Form
  toggleInsertForm() {
    var isInsertFormOpen = !this.state.isInsertFormOpen;
    this.setState({
      isInsertFormOpen
    })
  }
  // this method hides/shows Update Member Form
  toggleUpdateForm() {
    var isUpdateFormOpen = !this.state.isUpdateFormOpen;
    this.setState({
      isUpdateFormOpen
    })
  }
  // this method hides/shows Filter Members Form
  toggleFilterForm() {
    var isFilterFormOpen = !this.state.isFilterFormOpen;
    this.setState({
      isFilterFormOpen
    })
  }
  // this method inserts new record into database
  async insertMember(data: IMember): Promise<void> {
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
      this.props.saveData(new_data);
      this.setState({
        data: new_data,
        selected_record: new_data[0],
      })

      setTimeout(() => {
        success_screen.style.display = "none"
      }, 1499);
    }
    catch(error: any) {
      fail_screen.style.display = "flex";
      fail_screen.querySelector("span")!.innerText = error;
      console.log(error);
    }
  }
  // this method saves changes made on selected record
  async updateMember(data: IMember): Promise<void> {
    var waiting_screen = document.querySelector(".waiting-screen")! as HTMLDivElement;
    var success_screen = document.querySelector(".success-screen")! as HTMLDivElement;
    var fail_screen = document.querySelector(".fail-screen")! as HTMLDivElement;
    try{

      waiting_screen.style.display = "flex";
      waiting_screen.querySelector("span")!.innerText = "Saving changes..."
      console.log(data);
      
      var response: IDataBaseResponse = await this.props.user.functions.UpdateMember(data);

      waiting_screen.style.display = "none"

      if(!response.isSuccess) throw response.message;
      
      var new_data = response.data as IMember[];

      success_screen.style.display = "flex";
      success_screen.querySelector("span")!.innerText = response.message;
        this.props.saveData(new_data);
        this.setState({
          data: new_data,
          selected_record: new_data[0],
        })
      this.toggleUpdateForm();
      setTimeout(() => {
        success_screen.style.display = "none"
      }, 1499);
    }
    catch(error: any) {
      fail_screen.style.display = "flex";
      fail_screen.querySelector("span")!.innerText = error;
      console.log(error);
    }
  }
  // this method deletes record from database
  async deleteMember(): Promise<void> {
    if(!window.confirm("Do you really want to delete this record?\nPlease note that this action is irreversible")) return;

    var waiting_screen = document.querySelector(".waiting-screen")! as HTMLDivElement;
    var success_screen = document.querySelector(".success-screen")! as HTMLDivElement;
    var fail_screen = document.querySelector(".fail-screen")! as HTMLDivElement;
    try{

      waiting_screen.style.display = "flex";
      waiting_screen.querySelector("span")!.innerText = "Deleting record..."

      var response: IDataBaseResponse = await this.props.user.functions.DeleteMember(this.state.selected_record._id?.toString());

      waiting_screen.style.display = "none"

      if(!response.isSuccess) throw response.message;
      
      var new_data = response.data as IMember[];

      success_screen.style.display = "flex";
      success_screen.querySelector("span")!.innerText = response.message;
        this.props.saveData(new_data);
        this.setState({
          data: new_data,
          selected_record: new_data[0],
        })
      
      setTimeout(() => {
        success_screen.style.display = "none"
      }, 1499);
    }
    catch(error: any) {
      fail_screen.style.display = "flex";
      fail_screen.querySelector("span")!.innerText = error;
      console.log(error);
    }
  }
  // this method saves changes made on selected record
  async filterMembers(data: IMember): Promise<void> {
    var waiting_screen = document.querySelector(".waiting-screen")! as HTMLDivElement;
    var fail_screen = document.querySelector(".fail-screen")! as HTMLDivElement;
    try{

      waiting_screen.style.display = "flex";
      waiting_screen.querySelector("span")!.innerText = "Aplying filter..."
      
      var response: IDataBaseResponse = await this.props.user.functions.FilterMembers(data);

      waiting_screen.style.display = "none"

      if(!response.isSuccess) throw response.message;
      
      var new_data = response.data as IMember[];
      
      this.props.saveData(new_data)
      this.setState({
        last_filter: data,
        data: new_data,
        selected_record: new_data[0],
      })

      this.toggleFilterForm();
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
        {this.generateMemberForm()}
      </div>
    )
  }
}
