'use client'
import { useRouter } from 'next/navigation' 

import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const handleLogin = async () => {
    try {
      const res = await fetch('http://94.131.118.165:3020/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (data?.data?.access_token) {
        document.cookie = `token=${data.data.access_token}; path=/; max-age=86400`
        document.cookie = `username=${data.data.username}; path=/; max-age=86400`
        document.cookie = `role=${data.data.role}; path=/; max-age=86400`
        document.cookie = `id=${data.data.id}; path=/; max-age=86400`

        router.push('/dashboard')
      } else {
        alert('Login failed!')
      }

    } catch (err) {
      console.error(err)
      alert('Server error!')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-xl font-bold">Login</h1>

        <input
          className="mb-3 w-full rounded border p-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="mb-4 w-full rounded border p-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full rounded bg-black p-2 text-white"
        >
          Login
        </button>
      </div>
    </div>
  )
}
