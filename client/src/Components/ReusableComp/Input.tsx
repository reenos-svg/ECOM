import { FC, memo } from 'react'

interface InputProps {
    placeholder : string,
}

const Input:FC<InputProps> = memo(({placeholder}) => {
  return (
    <div className='flex flex-row items-center border-2 border-white rounded-full w-96 justify-between h-14 p-4'>
        <input type="text" className='h-10 w-72 bg-orange-700 outline-none placeholder-white font-ubuntu' placeholder={placeholder}/>
    </div>
  )
})

export default Input