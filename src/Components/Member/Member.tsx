import React, { Component } from 'react'
import './Member.css'
//interfaces
import IMember from '../../models/member.interface'
import INavbarButton from '../../models/navbar_button.interface'
//components
import Navbar from '../Navbar/Navbar'
//subcomponents
//icons
import GoBackIcon from '../../icons/go-back.svg'

interface MemberProps {
    inherited_data: IMember[],
    go_back: () => void
}
interface MemberState {
    data: IMember[],
    navbar_btns: INavbarButton[]
}
export default class Member extends Component<MemberProps, MemberState> {
  constructor(props: MemberProps) {
    super(props)
    
   this.generateTable =this.generateTable.bind(this);

    this.state = {
      data: props.inherited_data,
      navbar_btns: [
        {
          icon: GoBackIcon,
          text: "Go back",
          className: "main-menu",
          onClick: props.go_back,
        }
      ]
    }
  }
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
  render() {
    return (
      <div className='member'>
        <Navbar buttons={this.state.navbar_btns}></Navbar>
        {this.generateTable()}
      </div>
    )
  }
}
