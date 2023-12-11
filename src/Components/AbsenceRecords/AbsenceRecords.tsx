import React, { Component } from 'react'
import './AbsenceRecords.css'
// interfaces
import IAbsenceRecord from '../../models/absence_record.interface'
import IMember from '../../models/member.interface'
import INavbarButton from '../../models/navbar_button.interface'
import IDataBaseResponse from '../../models/database_response.interface'
//components
import Navbar from '../Navbar/Navbar'
//icons
import GoBackIcon from '../../icons/go-back.svg'
import InsertIcon from '../../icons/create.svg'
import UpdateIcon from '../../icons/edit.svg';
import DeleteIcon from '../../icons/delete.svg';
import FilterIcon from '../../icons/filter.svg';

interface AbsenceRecordsProps {
  user: Realm.User,
  inherited_data: IAbsenceRecord[],
  members: IMember[],
  go_back: () => void,
//   saveData: (new_data: IMember[]) => void
}
interface AbsenceRecordsState {
  data: IAbsenceRecord[],
  navbar_btns: INavbarButton[],
  selected_record: IAbsenceRecord,
}

export default class AbsenceRecords extends Component<AbsenceRecordsProps, AbsenceRecordsState> {
  constructor(props: AbsenceRecordsProps) {
    super(props)

    this.generateTable = this.generateTable.bind(this);
    this.selectRecord = this.selectRecord.bind(this);
  
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
          text: 'Add record',
          className: "insert",
          onClick: this.comming_soon
        },
        {
          icon: UpdateIcon,
          text: 'Edit record',
          className: "update",
          onClick: this.comming_soon
        },
        {
          icon: DeleteIcon,
          text: 'Delete record',
          className: "delete",
          onClick: this.comming_soon
        },
        {
          icon: FilterIcon,
          text: 'Filter records',
          className: "filter",
          onClick: this.comming_soon
        }
      ],
      selected_record: props.inherited_data[0]
    }
  }
  generateTable(): React.ReactNode {
    var data = this.state.data;
    return(
        <table className='table'>
            <thead>
                <tr className='level-0'>
                    <th colSpan={5}>{'Absence records'}</th>
                </tr>
                <tr className='level-1'>
                    <th>{'date'}</th>
                    <th>{'name'}</th>
                    <th>{'group'}</th>
                    <th>{'excussed'}</th>
                    <th>{'notes'}</th>
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
                            <td>{item.date.split('-').reverse().join('.')}</td>
                            <td>{item.member.full_name}</td>
                            <td>{item.member.group}</td>
                            <td>{item.isExcused === 'true' ? <>&#10004;</> : <>&#10008;</>}</td>
                            <td>{item.notes}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
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
  render() {
    return (
      <div className='absence-records'>
        <Navbar buttons={this.state.navbar_btns}></Navbar>
        {this.generateTable()}
      </div>
    )
  }
  // for delete
  comming_soon(): void {
    alert("Comming soon...")
  }
}
