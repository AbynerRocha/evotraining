'use client'

import { ExerciseData } from '@/@types/Exercise/Index'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/lib/ui/modal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/lib/ui/popover'
import { api } from '@/utils/api'
import { MoreVertical, Pencil, RotateCcw, Search, Trash, X, XCircle } from 'lucide-react'
import { useCookies } from 'next-client-cookies'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ReactLoading from 'react-loading'
import { animated as Animated, useSpring } from '@react-spring/web'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/lib/ui/pagination'

type Filters = {
  type: 'muscle' | 'creator',
  value: string,
  name?: string
}

export default function Exercises() {
  const cookies = useCookies()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const page = parseInt(searchParams.get('page') ?? '1')

  const [refreshToken, setRefreshToken] = useState('')
  const [authToken, setAuthToken] = useState('')
  const [exercises, setExercises] = useState<ExerciseData[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState({ error: '', message: '' })
  const [numberOfPages, setNumberOfPages] = useState(10)
  const [searchTerms, setSearchTerms] = useState('')
  const [searchFilters, setSearchFilters] = useState<Filters[]>([])

  const [refreshBtnSprings, apiRefreshBtn] = useSpring(() => ({
    from: {
      rotate: 0
    }
  }))

  useEffect(() => fetchExercises(page), [page])

  function fetchExercises(page?: number) {
    setIsFetching(true)

    api.get(`/exercise`, {
      params: {
        li: 10,
        p: page
      },
      headers: {
        'auth-token': authToken,
        'refresh-token': refreshToken
      }
    })
      .then((res) => {
        setExercises(res.data.exercises)
        setNumberOfPages(res.data.numberOfPages)
      })
      .catch((err) => {
        setError({
          error: err.response.data.error,
          message: err.response.data.message,
        })
        return
      })
      .finally(() => setIsFetching(false))
  }

  function handleDelete(id?: string) {
    if (!id) throw new Error('ID not found')

    api.delete(`/exercise?id=${id}`)
      .then(() => {
        setIsOpen(false)
        fetchExercises(page)
      })
      .catch((err) => {
        setError({ error: 'modal', message: 'Não foi possivel realizar esta ação neste momento. Tente novamente mais tarde' })
      })
  }

  function handleAddSearchFilter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === ' ' && searchTerms.includes(':')) {
      if(searchFilters.length >= 5) return 
      
      const filterRegex = /\b\w+:\w+\b/
      const match = searchTerms.match(filterRegex)

      if (match) {
        const filter = match[0].split(':')

        if (searchFilters.find(f => f.value === filter[1])) {
          setSearchTerms((t) => t.replace(match[0], ''))
          return
        }

        switch (filter[0].toLowerCase()) {
          case 'musculo':
            setSearchFilters((v) => [...v, { type: 'muscle', value: filter[1].trim().replace('_', ' '), name: match[0] }])
            break
          case 'autor':
            setSearchFilters((v) => [...v, { type: 'creator', value: filter[1].trim().replace('_', ' '), name: match[0]  }])
            break
        }
        console.log(searchFilters)
        setSearchTerms((t) => t.replace(match[0], '').trim())
      }
    }
  }

  function handleRemoveFilter(index: number) {
    const filtered = searchFilters.filter(f => f !== searchFilters[index])

    setSearchFilters(filtered)
  }

  function handleSearch() {
    if (searchTerms === '' && searchFilters.length === 0) return
    setIsFetching(true)

    const muscleFilters = searchFilters.filter(f => f.type === 'muscle')
    const creatorFilters = searchFilters.filter(f => f.type === 'creator')

    const muscleParams = muscleFilters.map((mf, index) => `muscleName[${index}]=${mf.value}`).join('&')
    const creatorParams = creatorFilters.map((cf, index) => `creatorName[${index}]=${cf.value}`).join('&')

    api.get(`/exercise?${muscleParams + '&' + creatorParams}`, {
      params: {
        name: searchTerms,
      },
    })
      .then((res) => {
        setExercises(res.data.exercises)
        setNumberOfPages(res.data.numberOfPages)
      })
      .catch((err) => console.error(err))
      .finally(() => setIsFetching(false))
  }

  function renderPagination() {
    let JSX: React.ReactNode[] = []

    if (numberOfPages > 4) {

      for (let i = page - 1; i < page + 3 && i < numberOfPages; i++) {
        if (i + 1 === numberOfPages) break
        JSX.push(<PaginationItem className={(i + 1 === page ? 'border border-gray-900 rounded-xl' : '')}>
          <PaginationLink href={`${pathname}?page=${i + 1}`}>{i + 1}</PaginationLink>
        </PaginationItem>)
      }

      if (numberOfPages - page > 3) JSX.push(
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )

      JSX.push(
        <PaginationItem className={(numberOfPages === page ? 'border border-gray-900 rounded-xl' : '')}>
          <PaginationLink href={`${pathname}?page=${numberOfPages}`}>{numberOfPages}</PaginationLink>
        </PaginationItem>
      )

      return JSX
    }

    for (let i = page - 1; i < numberOfPages; i++) {
      JSX.push(<PaginationItem className={(i + 1 === page ? 'border border-gray-900 rounded-xl' : '')}>
        <PaginationLink href={`${pathname}?page=${i + 1}`}>{i + 1}</PaginationLink>
      </PaginationItem>)
    }
    return JSX
  }

  if (isFetching) return <div className='h-full w-full flex items-center justify-center'>
    <ReactLoading type='spin' height={50} width={50} color='black' />
  </div>

  return (
    <div className='flex flex-col flex-1 overflow-x-hidden overflow-y-auto'>
      <div className='w-full h-16 flex flex-row items-center justify-between'>
        <div>
          <button
            className='bg-blue-700 p-3 rounded-xl text-gray-50 hover:bg-blue-800 active:bg-blue-700 hover:transition hover:duration-100 hover:ease-linear'
            onClick={() => router.push('/admin/dashboard/exercises/create')}
          >
            Adicionar
          </button>
        </div>
        <div className='flex flex-col space-y-2 w-[30rem] h-fit'>
          <div className='flex flex-row items-center space-x-2'>
            <input
              type="text"
              className='border border-gray-300 p-3 text-sm text-gray-800 w-96 h-10 outline-none rounded-lg placeholder:text-gray-500'
              placeholder='Procure aqui'
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              onKeyUp={handleAddSearchFilter}
            />
            <button
              className='w-fit h-10 p-3 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 hover:ease-linear transition-all duration-200 active:bg-gray-300'
              onClick={handleSearch}
            >
              <Search size={20} />
            </button>
          </div>

          {searchFilters.length > 0 && <div className={`flex flex-wrap flex-row w-[30rem] ${searchFilters.length > 3 ? 'h-20 pb-5' : 'h-fit'} whitespace-nowrap space-x-2`}>
            {searchFilters.map((filter, idx) => (
              <span
                key={idx}
                className='bg-transprent cursor-pointer text-sm border border-gray-300 flex items-center justify-between w-fit px-3 h-8 rounded-xl text-gray-900 hover:bg-blue-700 hover:text-gray-50 hover:ease-linear duration-200 transition-all'
                onClick={() => handleRemoveFilter(idx)}
              >
                <span className='flex flex-row space-x-1'>
                  <span className='font-medium'>
                    {filter.name?.split(':')[0]}:
                  </span>
                  <span>
                    {filter.value}
                  </span>
                </span>
                <X size={15} color='white' className='ml-2' />
              </span>
            ))}
          </div>}
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

              fetchExercises(page)

            }}
          >
            <RotateCcw size={20} color='black' />
          </Animated.button>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
        <table className="w-full text-sm text-left rtl:text-right text-gray-400 bg-gray-700">
          <thead className="text-xs uppercasebg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Músculo
              </th>
              <th scope="col" className="px-6 py-3">
                Dificuldade
              </th>
              <th scope="col" className="px-6 py-3">
                Criado Por
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Editar</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise, idx) => {
              return (<>
                <tr key={idx} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                    {exercise.name}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white space-x-2">
                    {exercise.muscles?.map((muscle, idx, array) => (
                      <span key={idx}>{muscle.name}{(array.length >= 2 && idx !== (array.length - 1) ? ',' : '')}</span>
                    ))}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                    {exercise.difficulty}
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                    {exercise.createdBy.name}
                  </th>
                  <td className="px-6 py-4 text-right">
                    <Popover>
                      <PopoverTrigger className='w-full h-full flex items-center justify-end'>
                        <MoreVertical size={18} className='text-gray-50' />
                      </PopoverTrigger>
                      <PopoverContent
                        className='bg-gray-100 border border-gray-300 w-36 h-fit mr-6 p-0 py-1'
                      >
                        <div className='w-full h-full flex-col space-y-1'>
                          <div className='flex flex-row items-center space-x-1 px-4 mx-1 rounded-lg hover:bg-gray-300/70 hover:transition ease-linear duration-150'>
                            <div>
                              <Pencil size={15} className='flil-black' />
                            </div>
                            <div className='flex flex-1'>
                              <button
                                className='bg-transparent w-full flex items-start justify-start px-3 py-1 text-sm'
                                onClick={() => router.push(`/admin/dashboard/exercises/edit/${exercise._id}`)}
                              >
                                Editar
                              </button>
                            </div>
                          </div>
                          <div className='w-full h-0.5 bg-gray-300' />
                          <div className='flex flex-row items-center space-x-1 px-4 mx-1 rounded-lg hover:bg-gray-300/70 hover:transition ease-linear duration-150 hover:text-red-500'>
                            <div>
                              <Trash size={15} />
                            </div>
                            <div className='flex flex-1'>
                              <Dialog
                                open={isOpen}
                                onOpenChange={setIsOpen}
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
                                    <span>Deletar {exercise.name}</span>
                                  </DialogHeader>
                                  <DialogTitle>Você realmente quer deletar este exercício?</DialogTitle>
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
                                        onClick={() => handleDelete(exercise._id)}
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
      <div className="flex items-center justify-center w-full h-20 mb-2 mt-2">
        <Pagination>
          <PaginationContent>
            {page > 1 && <PaginationItem>
              <PaginationPrevious href={`${pathname}?page=${page - 1}`} />
            </PaginationItem>}
            {renderPagination()}
            {(numberOfPages > 1 && numberOfPages !== page) && <PaginationItem>
              <PaginationNext href={`${pathname}?page=${page + 1}`} />
            </PaginationItem>}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
