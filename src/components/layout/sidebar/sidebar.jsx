import React from 'react'
import './sidebar.scss';
import Logo from '../../../assets/logo/logo.svg';
import Icon from '../../../assets/icons/icon.svg';
export default function Sidebar() {
  return (
    <div>
      <div className='sidebar'>
        <div className='logo'>
          <img src={Logo} alt="Logo"/>
        </div>
        <div className='menu'>
          <div>
            <img src={Icon}alt="Icon"/>
          </div>
          <div>
            <span>Raumreservierung</span>
          </div>
        </div>
      </div>
    </div>
  )
}
