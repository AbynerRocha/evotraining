import { ArrowDown, ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function CreateExercise() {
  const { register, formState: { errors }, setError } = useForm()

  const [muscleList, setMuscleList] = useState([
    { name: 'Peito', value: 'peito' },
    { name: 'Bicpes', value: 'Bicpes' },
    { name: 'Superior de costas', value: 'upperback' },
    { name: '   ', value: 'peito' },
  ])

  return (
    <div className='flex flex-1 mt-4'>
      <form className='space-y-2 w-full'>
        <div className='flex flex-col space-y-1'>
          <label htmlFor="name" className='text-sm '>Nome do exercício</label>
          <input
            {...register('name')}
            id='name'
            className='border border-gray-400 p-3 h-12 w-56 rounded-xl text-sm focus:outline-none'
            placeholder='Digite aqui'
          />
        </div>
        <div className='flex flex-col space-y-1'>
          <label htmlFor="muscle" className='text-sm '>Músculo</label>
          <button
            className='bg-blue-700 h-12 w-56 rounded-xl '
          >

            <ChevronDown size={18} color='white'/>
          </button>
        </div>
      </form>
    </div>
  )
}
