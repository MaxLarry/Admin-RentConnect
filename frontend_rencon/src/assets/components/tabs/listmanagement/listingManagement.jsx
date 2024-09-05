import React from 'react'
import Table_list from "./Table_list"
import TabsButton from './TabsButton';

function ListingManagement() {
  return (
    <div className=' p-4 sm:ml-64 h-full block gap-2 flex-col lg:flex-row translate-all
    duration-300 mt-14'>
      <h1 className='font-bold text-2xl p-4'>Listing Management</h1>
    <TabsButton/>
    <Table_list/>
      
    </div>
  )
}

export default ListingManagement;
