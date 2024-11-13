'use client'

import { useRoom } from '@/store/useStore';
import React from 'react'
import Select from 'react-select';

const SelectInp = () => {
  const setRoom = useRoom((state: any) => state.setRoom);

  function handleChange(e: any) {
    setRoom(e.value);
  }

  const options = [
    { value: 'living room', label: 'Living Room' },
    { value: 'bedroom', label: 'Bedroom' },
    { value: 'bathroom', label: 'Bathroom' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'dining room', label: 'Dining Room' },
    { value: 'home office', label: 'Home Office' },
    { value: 'basement', label: 'Basement' },
    { value: 'outdoor patio', label: 'Outdoor Patio' }
  ];

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'white',
      color: 'black',
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'white',
      maxHeight: 'none',  // Remove max height constraint
      height: 'auto',     // Allow the menu to grow based on content
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: 'none',  // Remove max height constraint
    }),
    option: (provided: any, state: { isSelected: any; }) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : 'white',
      color: state.isSelected ? 'white' : 'black',
      '&:hover': {
        backgroundColor: '#bfdbfe',
        color: 'black',
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: 'black',
    }),
  };

  return (
    <div className='w-full'>
      <Select
        onChange={handleChange}
        options={options}
        defaultValue={options[0]}
        styles={customStyles}
        instanceId="unique-id" 
      />
    </div>
  )
}

export default SelectInp;