'use client'

import Error from 'next/error'
import { redirect, useSearchParams } from 'next/navigation'
import React from 'react'

export default function RedirectToApp() {
  const searchParams = useSearchParams()

  const token = searchParams.get('tkn')
  const type = searchParams.get('ty')

  // const appScheme = 'exp://evotraining.abrocha.8081.exp.direct/--'
  const appScheme = 'evotraining://'

  if(!token || !type) {
    return <h1>Missing data</h1>
  }

  switch(type) {
    case 'rkp': 
      redirect(`${appScheme}/(auth)/recoverypass/${token}`)
    case 've': 
      redirect(`${appScheme}/(auth)/verifyemail/${token}`)
    case 'wrkot': 
      redirect(`${appScheme}/workout/${token}`)
    default:
      new Error({ statusCode: 404 })
      break
  }


  return (
    <div></div>
  )
}
