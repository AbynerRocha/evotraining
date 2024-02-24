'use client'

import { ExerciseData } from "@/@types/Exercise/Index"
import { MuscleData } from "@/@types/Muscle"
import { UserData } from "@/@types/User"
import { api } from "@/utils/api"
import { getUser } from "@/utils/localStorage/user"
import { ArrowRight, XCircle } from "lucide-react"
import Error from "next/error"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ReactLoading from "react-loading"

type Props = {
  params: {
    id: string
  }
}

type ExerciseProps = {
  muscle: MuscleData
}


function Exercises({ muscle }: ExerciseProps) {
  const [exercises, setExercises] = useState<ExerciseData[]>([])
  const [isFetching, setIsFetching] = useState(true)
  const [exercisePage, setExercisePage] = useState(1)
  const router = useRouter()

  useEffect(() => fetchExercises(), [])

  function fetchExercises() {
    api.get(`/exercise?p=${exercisePage}&muscle=${muscle?._id}`)
      .then((res) => {
        setExercises(res.data.exercises)

        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setIsFetching(false))
  }

  if (isFetching) return <div className='h-full w-full flex items-center justify-center'>
    <ReactLoading type='spin' height={50} width={50} color='black' />
  </div>

  return exercises.map((exercise,idx) => {
    return <div 
      key={idx} 
      className="w-56 h-12 p-3 flex flex-row  items-center justify-between rounded-xl truncate border-gray-300 border mx-3 hover:transition hover:duration-300 hover:ease-linear hover:border-gray-400 hover:cursor-pointer"
      onClick={() => router.push(`/admin/dashboard/exercises/edit/${exercise._id}`)}
    >
      <span className="">{exercise.name.length > 18 ? exercise.name.slice(0,18) + '...' : exercise.name}</span>
      <ArrowRight size={15} color="black" />
    </div>
  })
}

export default function MuscleInfo({ params }: Props) {
  const router = useRouter()

  const { id } = params
  const [muscle, setMuscle] = useState<MuscleData>()
  const [user, setUser] = useState<UserData>()
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const localStoragedUserData = getUser()

    if (localStoragedUserData === null) {
      router.replace('/admin/login')
      return
    }

    setUser(localStoragedUserData)

    fetchMuscleData()
  }, [])

  function fetchMuscleData() {
    api.get(`/muscle?id=${id}`)
      .then((res) => {
        setMuscle(res.data.muscle)
      })
      .finally(() => setIsFetching(false))
  }

  if (isFetching) return <div className='h-full w-full flex items-center justify-center'>
    <ReactLoading type='spin' height={50} width={50} color='black' />
  </div>

  if (!muscle) return <Error statusCode={404} />

  return (
    <div className="flex flex-row h-full w-full justify-between">
      <div className="w-full h-full">
        <h2 className="text-2xl font-semibold">{muscle.name}</h2>
      </div>
      <div className="w-0.5 h-full bg-gray-300" />
      <div className="flex flex-col mx-3 w-72 h-full">
        <h3 className="text-lg font-semibold text-center mb-4">Exercícios de {muscle.name}</h3>
        <div className="overflow-y-auto overflow-x-hidden space-y-3">
          <Exercises muscle={muscle} />
        </div>
      </div>
    </div>
  )
}