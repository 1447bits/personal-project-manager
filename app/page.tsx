
'use client'

import axios from "axios"
import { useState } from "react"

export default function Home() {

  const [data, setData] = useState("")

  const handleGET = () => {
    axios.get("api/task").then(async (res) => {
      const data = await res.data
      setData(JSON.stringify(data))
    })
  }

  const createUser = () => {
    axios.post("api/user", { email: "a@a.com", name: "some" }).then((res) => {
      console.log(res.data)
    })
  }

  const handleSEND = () => {
    axios.post("api/task", { title: "title", description: "desc", userId: 1 }).then((res) => {
      console.log(res.data)
    })
  }

  return <div>
    <button className="p-2 rounded-md bg-gray-500 m-2" onClick={handleSEND}>send</button>
    <button className="p-2 rounded-md bg-gray-500 m-2" onClick={handleGET}>get</button>
    <button className="p-2 rounded-md bg-gray-500 m-2" onClick={createUser}>create</button>

    <>{data}</>
  </div>
}
