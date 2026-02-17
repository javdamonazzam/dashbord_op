'use client'
import { useRouter } from 'next/navigation'

import { useState } from 'react'

export default function AdminPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [account_price, setPrice] = useState(0)
    const router = useRouter()


    function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift();
        }
        return null;
    }
    const accessToken = getCookie('token');

    const handCreate = async () => {
        try {
            const res = await fetch('http://94.131.118.165:3020/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ username, password, account_price }),
            })

            const data = await res.json()

            alert(`با موفقیت ساخته شد${username}`)
        } catch (err) {
            console.error(err)
            alert('Server error!')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-100">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow">
                <h1 className="mb-6 text-xl font-bold">ثبت نام </h1>

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
                <input
                    type='number'
                    className="mb-4 w-full rounded border p-2"
                    placeholder="account_price"
                    value={account_price}
                    onChange={(e) => setPrice(Number(e.target.value))}

                />

                <button
                    onClick={handCreate}
                    className="w-full rounded bg-black p-2 text-white"
                >
                    ثبت نام
                </button>
            </div>
        </div>
    )
}
