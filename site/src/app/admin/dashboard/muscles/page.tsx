'use client'

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/lib/ui/modal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/lib/ui/popover'
import { api } from '@/utils/api'
import { MoreVertical, Pencil, RotateCcw, Trash, XCircle } from 'lucide-react'
import { useCookies } from 'next-client-cookies'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ReactLoading from 'react-loading'
import { animated as Animated, useSpring } from '@react-spring/web'
import { MuscleData } from '@/@types/Muscle'
import { AxiosError } from 'axios'
import { UserData } from '@/@types/User'
import { getUser } from '@/utils/localStorage/user'

type Props = {

}

type MuscleFetchData = MuscleData & { numberOfExercises: number }

export default function Muscles() {
  const cookies = useCookies()
  const router = useRouter()

  const [muscles, setMuscles] = useState<MuscleFetchData[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isOpen, setIsOpen] = useState({ delete: false, edit: false })
  const [error, setError] = useState({ error: '', message: '' })
  const [page, setPage] = useState(1)
  const [newMuscleName, setNewMuscleName] = useState('')
  const [muscleName, setMuscleName] = useState('')
  const [dialogMuscleOpen, setDialogMuscleOpen] = useState(false)
  const [user, setUser] = useState<UserData>()
  const [refreshBtnSprings, apiRefreshBtn] = useSpring(() => ({
    from: {
      rotate: 0
    }
  }))

  const [clickEnabled, setClickEnabled] = useState(false)

  useEffect(() => {
    const localStoragedUserData = getUser()

    if (localStoragedUserData === null) {
      router.replace('/admin/login')
      return
    }

    setUser(localStoragedUserData)

    fetchMuscles(page)
  }, [])

  function fetchMuscles(page: number) {
    setIsFetching(true)

    api.get('/muscle', { params: { li: 10 }})
      .then((res) => {
        setMuscles(res.data.muscles)
      })
      .catch((err) => {
        console.log(err.response?.data);

        setError({
          error: err.response?.data.error,
          message: err.response?.data.message,
        })
        return
      })
      .finally(() => setIsFetching(false))
  }

  function handleDelete(id?: string) {
    if (!id) throw new Error('ID not found')

    api.delete(`/muscle?id=${id}`)
      .then(() => {
        setIsOpen({ edit: false, delete: false })
        fetchMuscles(page)
      })
      .catch((err) => {
        setError({ error: 'modal', message: 'Não foi possivel realizar esta ação neste momento. Tente novamente mais tarde' })
      })
  }

  function handleEditMuscle(muscleId: string, oldName: string) {
    if (newMuscleName === '' || newMuscleName === oldName) return

    api.put(`/muscle?i=${muscleId}&nn=${newMuscleName}`)
      .then(() => {
        setIsOpen({ edit: false, delete: false })
        fetchMuscles(page)
      })
      .catch((err: AxiosError<any>) => {
        console.log(err.response?.data.error);

        setError({ error: 'modal', message: err.response?.data.message })
      })
  }

  function handleCreateMuscle() {
    if (muscleName === '') return

    api.post('/muscle', { name: muscleName, createdBy: user?._id })
      .then((res) => {
        api.get('/muscle')
          .then((res) => {
            fetchMuscles(page)
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

  if (isFetching) return <div className='h-full w-full flex items-center justify-center'>
    <ReactLoading type='spin' height={50} width={50} color='black' />
  </div>

  return (
    <div className='flex flex-col flex-1'>
      <div className='w-full h-16 flex flex-row items-center justify-between'>
        <div>
          <Dialog
            open={dialogMuscleOpen}
            onOpenChange={setDialogMuscleOpen}
          >
            <DialogTrigger className='flex flex-row items-center justify-start'>
              <button
                className='bg-blue-800 p-3 rounded-xl text-gray-50 hover:bg-blue-700 active:bg-blue-800 hover:transition hover:duration-100 hover:ease-linear'
              >
                Adicionar
              </button>
            </DialogTrigger>

            <DialogContent className='bg-gray-50'>
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

        <div className='mr-5'>
          <Animated.button
            style={{ ...refreshBtnSprings }}
            className='bg-transparent p-3'
            onClick={() => {
              if (isFetching) return

              apiRefreshBtn.start({
                from: {
                  rotate: 0
                },
                to: {
                  rotate: 360
                },
                config: {
                  duration: 400,
                  velocity: 1.5
                }
              })

              fetchMuscles(page)

            }}
          >
            <RotateCcw size={20} color='black' />
          </Animated.button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Criado Por
              </th>
              <th scope="col" className="px-6 py-3">
                Número de exercícios
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Editar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {muscles.map((muscle, idx) => {
              return (<>
                <tr 
                  key={idx}
                  className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600 hover:cursor-pointer"
                  onClick={() => {
                    if(!clickEnabled) return 
                    
                    router.push(`/admin/dashboard/muscles/${muscle._id}`)
                  }}
                >
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                    {muscle._id}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                    {muscle.name}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                    {muscle.createdBy.name}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                    {muscle.numberOfExercises}
                  </th>
                  <td className="px-6 py-4 text-right">
                    <Popover onOpenChange={(open) => setClickEnabled(!open)}>
                      <PopoverTrigger className='w-full h-full flex items-center justify-end'>
                        <MoreVertical size={18} className='text-gray-50' />
                      </PopoverTrigger>
                      <PopoverContent
                        className='bg-gray-100 border border-gray-300 w-36 h-fit mr-6 p-0 py-1'
                      >
                        <div className='w-full h-full flex-col space-y-1'>
                          <Dialog
                            open={isOpen.edit}
                            onOpenChange={(v) => { setIsOpen((e) => ({ ...e, edit: v })) }}
                          >
                            <DialogTrigger className='flex flex-row items-center'>
                              <div className='flex flex-row items-center space-x-1 px-4 mx-1 rounded-lg hover:bg-gray-300/70 hover:transition ease-linear duration-150'>
                                <div>
                                  <Pencil size={15} className='flil-black' />
                                </div>
                                <div className='flex flex-1'>
                                  <button
                                    className='bg-transparent w-full flex items-start justify-start px-3 py-1 text-sm'
                                  >
                                    Editar
                                  </button>
                                </div>

                              </div>
                            </DialogTrigger>
                            <DialogContent className='bg-gray-50'>
                              <DialogTitle>Editar {muscle.name}</DialogTitle>

                              <div className='flex flex-col space-y-2 justify-center'>
                                <label htmlFor='muscle-name' className='text-sm font-medium text-gray-700'>Nome</label>
                                <input
                                  className='border border-gray-300 rounded-xl p-3 focus:outline-gray-300 placeholder:text-gray-400'
                                  placeholder='Digite aqui'
                                  id='muscle-name'
                                  defaultValue={muscle.name}
                                  onChange={(e) => setNewMuscleName(e.target.value)}
                                />
                              </div>
                              {error.error === 'modal' && <div
                                className='bg-red-500 p-3 rounded-lg text-gray-50 font-medium space-x-2 flex flex-row items-center'
                              >
                                <span>
                                  <XCircle size={18} color='white' />
                                </span>
                                <span className='flex flex-1 break-words'>
                                  {error.message}
                                </span>
                              </div>}
                              <DialogFooter>
                                {error.error !== 'modal' ? <>
                                  <DialogClose>
                                    <button className='bg-red-500 p-3 h-fit w-20 rounded-lg text-gray-50 font-medium hover:bg-red-600 active:bg-red-500 hover:transition hover:duration-100 hover:ease-linea'>Não</button>
                                  </DialogClose>
                                  <button
                                    className='bg-blue-700 p-3 h-fit w-20 rounded-lg text-gray-50 font-medium hover:bg-blue-600 active:bg-blue-800 hover:transition hover:duration-100 hover:ease-linea'
                                    onClick={() => handleEditMuscle(muscle._id, muscle.name)}
                                  >
                                    Editar
                                  </button>
                                </> : <DialogClose>
                                  <button
                                    className='bg-red-500 p-3 h-fit w-20 rounded-lg text-gray-50 font-medium hover:bg-red-600 active:bg-red-500 hover:transition hover:duration-100 hover:ease-linea'
                                    onClick={() => setError({ error: '', message: '' })}
                                  >
                                    Fechar
                                  </button>
                                </DialogClose>}
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <div className='w-full h-0.5 bg-gray-300' />
                          <div className='flex flex-row items-center space-x-1 px-4 mx-1 rounded-lg hover:bg-gray-300/70 hover:transition ease-linear duration-150 hover:text-red-500'>
                            <div>
                              <Trash size={15} />
                            </div>
                            <div className='flex flex-1'>
                              <Dialog
                                open={isOpen.delete}
                                onOpenChange={(v) => { setIsOpen((e) => ({ ...e, delete: v })) }}
                              >
                                <DialogTrigger>
                                  <button
                                    className='bg-transparent w-full flex items-start justify-start px-3 py-1 text-sm'
                                    onClick={() => setError({ error: '', message: '' })}
                                  >
                                    Apagar
                                  </button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <span>Remover {muscle.name}</span>
                                  </DialogHeader>
                                  <DialogTitle>Você realmente quer remover este músculo?</DialogTitle>
                                  {error.error === 'modal' && <div
                                    className='bg-red-500 p-3 rounded-lg text-gray-50 font-medium space-x-2 flex flex-row items-center'
                                  >
                                    <span>
                                      <XCircle size={18} color='white' />
                                    </span>
                                    <span className='flex flex-1 break-words'>
                                      {error.message}
                                    </span>
                                  </div>}
                                  <DialogFooter>
                                    {error.error !== 'modal' ? <>
                                      <DialogClose>
                                        <button className='bg-red-500 p-3 h-fit w-20 rounded-lg text-gray-50 font-medium hover:bg-red-600 active:bg-red-500 hover:transition hover:duration-100 hover:ease-linea'>Não</button>
                                      </DialogClose>
                                      <button
                                        className='bg-blue-700 p-3 h-fit w-20 rounded-lg text-gray-50 font-medium hover:bg-blue-600 active:bg-blue-800 hover:transition hover:duration-100 hover:ease-linea'
                                        onClick={() => handleDelete(muscle._id)}
                                      >
                                        Sim
                                      </button>
                                    </> : <DialogClose>
                                      <button className='bg-red-500 p-3 h-fit w-20 rounded-lg text-gray-50 font-medium hover:bg-red-600 active:bg-red-500 hover:transition hover:duration-100 hover:ease-linea'>Fechar</button>
                                    </DialogClose>}
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              </>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}
