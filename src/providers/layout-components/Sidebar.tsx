import React, { useState } from 'react'
import MenuItems from './MenuItems'
import { Menu } from 'lucide-react'
import { Drawer } from 'antd';

function Sidebar() {
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  return (
    <div className='overflow-hidden'>
        <div className='bg-info px-5 py-2 lg:hidden'>
         <Menu className='cursor-pointer hover:bg-white hover:text-gray-800' size={24} color="white" onClick={()=>{
            setShowMobileSidebar(!showMobileSidebar);
         }}/>
         <Drawer open={showMobileSidebar} onClose={()=>{
            setShowMobileSidebar(false);
         }}
         placement='left'
         >
           <MenuItems/>
         </Drawer>
        </div>
        <div className="hidden lg:flex">
        <MenuItems/>
        </div>
    </div>
  )
}

export default Sidebar