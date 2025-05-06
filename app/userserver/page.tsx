import React from 'react'
import { getSession } from '@/lib/getSession'

const page = async () => {
  const session = await getSession();
  return (
    <div>Session {JSON.stringify(session)}</div>
  )
}

export default page