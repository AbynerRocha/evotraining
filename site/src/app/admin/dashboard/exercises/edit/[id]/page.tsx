'use client'

import { ExerciseData } from '@/@types/Exercise/Index'
import { MuscleData } from '@/@types/Muscle'
import { UserData } from '@/@types/User'
import { Dialog, DialogClose, DialogTitle, DialogTrigger, DialogContent, DialogFooter } from '@/components/lib/ui/modal'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/lib/ui/popover'
import { api } from '@/utils/api'
import { getUser } from '@/utils/localStorage/user'
import { useSpring, animated as Animated, to } from '@react-spring/web'
import { AxiosError } from 'axios'
import { ArrowDown, Check, ChevronDown, ChevronUp, Plus, X, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import ReactLoading from 'react-loading'
import isURL from 'validator/lib/isURL'

type Fields = {
  name: string
  image: string
}

type Props = {
  params: {
    id: string
  }
}

type Muscle = {
  _id: string,
  name: string
}

export default function CreateExercise({ params }: Props) {
  const { id } = params

  const [user, setUser] = useState<UserData>()
  const [showDropdown, setShowDropdown] = useState(false)
  const [muscles, setMuscles] = useState<MuscleData[]>([])
  const [difficulty, setDifficulty] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [exercise, setExercise] = useState<ExerciseData>()
  const [muscleList, setMuscleList] = useState<MuscleData[]>()
  const [dialogMuscleOpen, setDialogMuscleOpen] = useState(false)
  const [muscleName, setMuscleName] = useState('')


  const { register, handleSubmit, formState: { errors }, setError, setValue } = useForm<Fields>({
    defaultValues: {
      name: exercise?.name,
      image: exercise?.image
    }
  })
  const [isFetching, setIsFetching] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const localStoragedUserData = getUser()

    if (localStoragedUserData === null) {
      router.replace('/admin/login')
      return
    }

    setUser(localStoragedUserData)

    api.get('/muscle')
      .then((res) => {
        const fetchedMuscles: MuscleData[] = res.data.muscles

        setMuscleList(fetchedMuscles)

        api.get(`/exercise?id=${id}`)
          .then((res) => {
            const exercise: ExerciseData = res.data.exercise

            setExercise(exercise)
            setMuscles(res.data.exercise.muscles)
            setDifficulty(exercise.difficulty)

            setValue('name', exercise.name)
            setValue('image', exercise.image)
          })
          .catch((err) => {
            console.error(err)
          })
          .finally(() => {
            setIsFetching(false)
          })
      })
      .catch((err) => {
        return <div className='absolute top-0 h-full w-full flex items-center justify-center flex-col'>
          <XCircle size={50} color='red' />
          <span className='text-md font-medium'>{err.response.data.message}</span>
        </div>
      })

  }, [])


  const [springsArrow, apiArrow] = useSpring(() => ({
    from: { rotate: 0 }
  }))

  const [springsDropdown, apiDropdown] = useSpring(() => ({
    from: {
      opacity: 0,
      y: -3
    }
  }))

  const [springsError, apiError] = useSpring(() => ({
    from: {
      opacity: 0,
    }
  }))

  useEffect(() => {
    apiError.start({
      from: {
        opacity: 0
      },
      to: {
        opacity: 1
      },
      config: {
        duration: 300
      }
    })
  }, [errors.root])

  function getUpdatedValues(data: Fields) {
    if (!exercise) return

    const updatedValues: any = {}

    const newData: any = { ...data, muscle: muscles.map((v) => v._id), difficulty }
    const { createdBy, _id, ...oldData }: any = exercise

    for (const key in oldData) {
      if (oldData.hasOwnProperty(key) && newData.hasOwnProperty(key)) {
        if (newData[key] !== oldData[key]) {
          updatedValues[key] = newData[key]
        }
      }
    }

    return updatedValues
  }

  function handleDropdownSelect(selected: MuscleData) {
    const hasSelected = muscles.find(m => m._id === selected._id)

    if (hasSelected) {
      const filtered = muscles.filter(m => m._id !== hasSelected._id)

      setMuscles(filtered)
      return
    }

    setMuscles((v) => [...v, { ...selected }])
  }

  function handleRemoveMuscle(id: string) {
    const hasSelected = muscles.find(m => m._id === id)

    if (hasSelected) {
      const filtered = muscles.filter(m => m._id !== hasSelected._id)

      setMuscles(filtered)
      return
    }
  }

  function handleSelectDifficulty(level: number) {
    if (difficulty === level) {
      setDifficulty(0)
      return
    }

    setDifficulty(level)
  }



  function handleEdit(data: Fields) {
    return new Promise((resolve, reject) => {
      const { name, image } = data
      if (muscles.length === 0) {
        setError('root', { message: 'Você precisa selecionar pelo menos um músculo.' })
        reject()
        return
      }

      if (difficulty === 0) {
        setError('root', { message: 'Você precisa selecionar uma dificuldade.' })
        reject()
        return
      }

      const updatedData = getUpdatedValues(data)

      api.post(`/exercise/edit`, { newData: updatedData, id: exercise?._id }).then((res) => {
        router.replace('/admin/dashboard/exercises')
        resolve(true)
      })
        .catch((err: AxiosError<any>) => {
          switch (err.response?.data.error) {
            case 'THIS_EXERCISE_ALREADY_EXISTS':
              setError('name', { message: err.response?.data.message })
              break
            default:
              setError('root', { message: err.response?.data.message })
              break
          }
          reject()
        })
    })
  }

  function handleCreateMuscle() {
    if (muscleName === '') return

    api.post('/muscle', { name: muscleName, createdBy: user })
      .then((res) => {
        api.get('/muscle')
          .then((res) => {
            const muscles = res.data.muscles

            setMuscleList(muscles)
            setDialogMuscleOpen(false)
          })
          .catch((err) => {
            return <div className='absolute top-0 h-full w-full flex items-center justify-center flex-col'>
              <XCircle size={50} color='red' />
              <span className='text-md font-medium'>{err.response.data.message}</span>
            </div>
          })
      })
  }

  function onSubmit(data: Fields) {
    setIsLoading(true)

    handleEdit(data)
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (isFetching) return <div className='h-full w-full flex items-center justify-center'>
    <ReactLoading type='spin' height={50} width={50} color='black' />
  </div>

  return (
    <div className='flex flex-1 flex-col mt-4'>
      <h1 className='text-3xl font-medium mb-4'>Editar {exercise?.name}</h1>
      <form
        method='POST'
        className='space-y-5 w-full'
      >
        <div className='flex flex-col space-y-1'>
          <label htmlFor="name" className='text-sm '>Nome do exercício</label>
          <input
            {...register('name', {
              validate: {
                isRequired: (v) => v.length < 0 || v.trim() === '' ? 'Este campo é obrigatório.' : true
              }
            })}
            id='name'
            className='border border-gray-300 p-3 h-12 w-56 rounded-xl text-sm focus:outline-none'
            placeholder='Digite aqui'
          />
          {errors.name && <p className='text-sm text-red-500 my-2'>{errors.name.message}</p>}
        </div>
        <div className='flex flex-col space-y-1 w-56'>
          <label htmlFor="muscle" className='text-sm '>Músculo</label>
          <div className='h-fit w-fit mb-3'>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type='button'
                  className={'bg-transparent border h-8 w-fit max-w-72 overflow-hidden rounded-xl flex flex-row items-center justify-between p-3 ' + (showDropdown ? 'border-gray-400' : 'border-gray-300')}
                  onClick={() => {
                    apiArrow.start({
                      from: {
                        rotate: 180
                      },
                      to: {
                        rotate: 360
                      },
                      config: {
                        duration: 300
                      }
                    })

                    apiDropdown.start({
                      from: {
                        opacity: 0,
                        y: -3
                      },
                      to: {
                        opacity: 1,
                        y: 1
                      },
                      config: {
                        duration: 200
                      }
                    })

                    setShowDropdown((v) => v ? false : true)
                  }}
                >
                  <span className='space-x-2 flex flex-row items-center'>
                    <span>Adicionar</span>
                    <Plus size={15} />
                  </span>
                  {/* <Animated.div
                    style={{ ...springsArrow }}
                    className='ml-2'
                  >
                    {showDropdown ? <ChevronUp size={18} color='black' /> : <ChevronDown size={18} color='black' />}
                  </Animated.div> */}
                </button>
              </PopoverTrigger>

              <PopoverContent className='bg-gray-100 border border-gray-300'>
                <div className='pb-2 font-medium text-sm'>
                  <span>Músculos</span>
                </div>
                <div className='bg-gray-300 h-0.5 w-full mb-2' />

                <div className=''>
                  {muscleList?.map((muscle, idx) => {
                    return <div key={idx} className='m-1 rounded-md p-1 flex flex-row items-center justify-start hover:bg-gray-300/70 hover:transition ease-linear duration-150'>
                      <div className='w-6 h-6 flex items-center justify-center'>
                        {muscles.find(m => m._id === muscle._id) && <Check size={15} className='mr-1' color='black' />}
                      </div>
                      <button
                        type='button'
                        className='font-medium text-sm flex flex-1'
                        onClick={() => handleDropdownSelect(muscle)}
                      >
                        {muscle.name}
                      </button>
                    </div>
                  })}
                  <div className='bg-gray-300 h-0.5 w-full' />
                  <div className='m-1 rounded-md p-1 flex flex-row items-center justify-start hover:bg-gray-300/70 hover:transition ease-linear duration-150'>
                    <Dialog
                      open={dialogMuscleOpen}
                      onOpenChange={setDialogMuscleOpen}
                    >
                      <DialogTrigger className='flex flex-row items-center justify-start'>
                        <div className='w-6 h-6 flex items-center justify-center'>
                          <Plus size={15} className='mr-1' color='black' />
                        </div>
                        <button
                          type='button'
                          className='font-medium text-sm flex flex-1'
                        >
                          Criar
                        </button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogTitle>Criar novo músculo</DialogTitle>
                        <div className='flex flex-col space-y-2 justify-center'>
                          <label htmlFor='muscle-name' className='text-sm font-medium text-gray-700'>Nome</label>
                          <input
                            className='border border-gray-300 rounded-xl p-3 focus:outline-gray-300 placeholder:text-gray-400'
                            placeholder='Digite aqui'
                            id='muscle-name'
                            onChange={(e) => setMuscleName(e.target.value)}
                          />
                        </div>

                        <DialogFooter>
                          <DialogClose>
                            <button className='bg-red-500 text-gray-50 font-semibold w-24 h-10 rounded-xl hover:bg-red-600 active:bg-red-500'>Cancelar</button>
                          </DialogClose>
                          <button
                            className='bg-blue-700 text-gray-50 font-semibold w-24 h-10 rounded-xl hover:bg-blue-600 active:bg-blue-700'
                            onClick={handleCreateMuscle}
                          >
                            Criar
                          </button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className='flex flex-row w-60 h-fit space-x-2'>
            {muscles.map((muscle, idx) => (
              <div 
                key={idx} 
                className='h-8 w-fit border border-gray-300 p-3 flex flex-row items-center justify-between cursor-pointer rounded-xl whitespace-nowrap hover:text-gray-50 hover:bg-blue-700 hover:transition-all hover:ease-linear duration-200'
                onClick={() => handleRemoveMuscle(muscle._id)}
              >
                <span>{muscle.name}</span>
                <span className={`ml-2 transition-all duration-300 ease-linear`}>
                  <X size={13} color='white' />
                </span>
              </div>
            ))}
          </div>

        </div>

        <div className='flex flex-col space-y-1'>
          <label htmlFor="difficulty" className='text-sm'>Dificuldade</label>
          <div className='flex flex-col space-y-2'>
            <div className='flex flex-row justify-between w-60 h-fit text-xs text-gray-500'>
              <span>Fácil</span>
              <span>Difícil</span>
            </div>
            <div className='space-x-3 flex flex-row items-center'>
              <button
                type='button'
                className={'border rounded-lg p-3 h-10 w-10 flex items-center justify-center ' + (difficulty === 1 ? 'bg-blue-600 border-blue-800 text-gray-50 transition duration-150 ease-in-out' : 'bg-gray-100 border-gray-300 text-gray-950 transition duration-150 ease-in-out')}
                onClick={() => handleSelectDifficulty(1)}
              >
                1
              </button>
              <button
                type='button'
                className={'border rounded-lg p-3 h-10 w-10 flex items-center justify-center ' + (difficulty === 2 ? 'bg-blue-600 border-blue-800 text-gray-50 transition duration-150 ease-in-out' : 'bg-transparent border-gray-300 text-gray-950 transition duration-150 ease-in-out')}
                onClick={() => handleSelectDifficulty(2)}
              >
                2
              </button>
              <button
                type='button'
                className={'border rounded-lg p-3 h-10 w-10 flex items-center justify-center ' + (difficulty === 3 ? 'bg-blue-600 border-blue-800 text-gray-50 transition duration-150 ease-in-out' : 'bg-transparent border-gray-300 text-gray-950 transition duration-150 ease-in-out')}
                onClick={() => handleSelectDifficulty(3)}
              >
                3
              </button>
              <button
                type='button'
                className={'border rounded-lg p-3 h-10 w-10 flex items-center justify-center ' + (difficulty === 4 ? 'bg-blue-600 border-blue-800 text-gray-50 transition duration-150 ease-in-out' : 'bg-transparent border-gray-300 text-gray-950 transition duration-150 ease-in-out')}
                onClick={() => handleSelectDifficulty(4)}
              >
                4
              </button>
              <button
                type='button'
                className={'border rounded-lg p-3 h-10 w-10 flex items-center justify-center ' + (difficulty === 5 ? 'bg-blue-600 border-blue-800 text-gray-50 transition duration-150 ease-in-out' : 'bg-transparent border-gray-300 text-gray-950 transition duration-150 ease-in-out')}
                onClick={() => handleSelectDifficulty(5)}
              >
                5
              </button>
            </div>
          </div>
        </div>

        <div className='flex flex-col space-y-1'>
          <label htmlFor="image" className='text-sm '>Imagem</label>
          <input
            {...register('image', {
              validate: {
                isRequired: (v) => v.length < 0 || v.trim() === '' ? 'Este campo é obrigatório.' : true,
                url: (v) => isURL(v) ? true : 'Este campo tem que conter uma url.'
              }
            })}
            id='image'
            className='border border-gray-300 p-3 h-12 w-56 rounded-xl text-sm focus:outline-none'
            placeholder='Digite aqui'
          />
          {errors.image && <p className='text-sm text-red-500 my-2'>{errors.image.message}</p>}
        </div>

        <button
          disabled={isLoading}
          onClick={handleSubmit(onSubmit)}
          type='submit'
          className='w-60 h-fit bg-blue-700 text-gray-50 text-center rounded-lg p-2 font-medium flex items-center justify-center hover:bg-blue-600 active:bg-blue-700'
        >
          {isLoading ? <ReactLoading type='spin' height={24} width={24} color='white' /> : 'Editar'}
        </button>

        {errors.root && <Animated.div
          className='bg-red-500 p-3 rounded-lg w-60 h-fit break-words text-gray-50 flex flex-row items-center justify-around space-x-4'
          style={{ ...springsError }}
        >
          <span>
            <XCircle size={18} color='white' />
          </span>
          <span>

            {errors.root.message}
          </span>
        </Animated.div>}
      </form>
    </div>
  )
}


