"use client"
import '@styles/globals.css';
import SideNav from '@components/admin/SideNav';
import { createContext, useState } from 'react';
export const CountReportContext = createContext()
const RootAdminLayout = ({children}) => {
  const [countReport, setCountReport] = useState(0)
  const updateValue = (newValue) => {
    setCountReport(newValue)
  }
  return (
    <html lang="en">
      <body>
        <CountReportContext.Provider value={{ countReport, updateValue }}>
            <div className='flex bg-gray-700'>
                <SideNav></SideNav>
                <div className='px-10 pt-10 w-full'>{children}</div>
            </div>
        </CountReportContext.Provider>
      </body>
    </html>
  )
}

export default RootAdminLayout
