import React from 'react'

export default function Logo() {
    return (
        <div>
            <div className='flex flex-row justify-center items-center p-2 rounded-xl w-full'>
                <div className='bg-blue-800 py-1 px-3 w-fit rounded-xl'>
                    <span className='text-gray-50 text-2xl font-bold italic'>Evo</span>
                </div>
                <span className='text-gray-950 font-bold italic text-2xl'>Training</span>
            </div>
        </div>
    )
}
