import React from 'react'

const Title = ( { title , subTitle } ) => {
  return (
    <div>
        <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        <p className='text-sm text-gray-500'>{subTitle}</p>
    </div>
  )
}

export default Title