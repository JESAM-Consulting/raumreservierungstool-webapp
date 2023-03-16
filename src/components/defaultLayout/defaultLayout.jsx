import React from 'react'
import Footer from '../layout/footer';
import Header from '../layout/header/header'
import Sidebar from '../layout/sidebar/sidebar'
import './defaultLayout.scss';
export default function DefaultLayout({ children }) {
    return (
        <>
        <div className='defalut-layout'>
            <div className='sidebar-layout'>
            <Sidebar />
            </div>
            <div className='children-layout'>
            <Header />
          {children}
          <Footer/>
            </div>
        </div>
           
        </>
    )
}
