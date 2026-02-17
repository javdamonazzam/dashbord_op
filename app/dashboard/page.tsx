'use client'
import { useEffect, useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
type Card = {
  id: number
  name: string
  date: string
}

export default function Dashboard() {
  const [cards, setCards] = useState<Card[]>([])
  const [showPopup, setShowPopup] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [services, setServices] = useState<any[]>([]);

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return null;
  }


  useEffect(() => {
    console.log("start");
    const accessToken = getCookie('token');
    console.log(accessToken);
    // if (!accessToken) {
    //   window.location.href = '/login'
    // }
    const id = localStorage.id;
    async function list() {
      try {
        console.log("before fetch");
        console.log();

        const res = await fetch(
          `http://94.131.118.165:3020/service/find?user_id=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        console.log(res, "<<<<<<<<<<<<<<<<<<");
        const data = await res.json();
        setServices(data.data.result);
      } catch (error) {
        console.log("error", error);
      }
    }
    list(),
      // { Authorization: `Bearer ${getToken()}` }
      //     { filter: { user_id: getTokenInfo().id } },
      setCards([])
  }, [])

  // const toggleStatus = (id: number) => {
  //   setCards(cards.map(c =>
  //     // c.id === id ? { ...c, status: !c.status } : c
  //   ))
  // }

  const deleteCard = (id: number) => {
    // setCards(cards.filter(c => c.id !== id))
  }

  // const editCard = (id: number) => {
  //   const newName = prompt('New name:')
  //   if (!newName) return

  //   setCards(cards.map(c =>
  //     // c.id === id ? { ...c, name: newName } : c
  //   ))
  // }

  const downloadOvpn = (info: string, title: string) => {
    const ovpnText = info; // یا data.data یا هر key که سرور برمی‌گرداند

    // ساخت Blob
    const blob = new Blob([ovpnText], { type: 'application/x-openvpn-profile' });

    // ساخت لینک دانلود
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.ovpn`; // اسم فایل برای کاربر
    document.body.appendChild(link);
    link.click();
    link.remove();

  }

  const createItem = async () => {
    console.log(1);
    const accessToken = localStorage.accessToken;
    const id = localStorage.id;
    const newCard: Card = {
      name,
      date,
      id: 0
    }
    try {
      console.log("start login");

      if (!accessToken) {
        alert('ایتدا وارد شوید!')
      }
      const res = await fetch('http://94.131.118.165:3020/service/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, date, id }),
      })
      const data = await res.json(); // این JSON body را می‌خواند
      console.log(data);

      const ovpnText = data.data.config; // یا data.data یا هر key که سرور برمی‌گرداند

      // ساخت Blob
      const blob = new Blob([ovpnText], { type: 'application/x-openvpn-profile' });

      // ساخت لینک دانلود
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${data.data.title}.ovpn`; // اسم فایل برای کاربر
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err)
      alert('Server error!')
    }
    setCards([...cards, newCard])
    setShowPopup(false)
    setName('')
    setDate('')
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          اکانت جدبد
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            <h2 className="font-bold text-lg">{item.name}</h2>

            <p className="mb-2">تاریخ پایان سرویس: {item.expir_date}</p>
            <div className="mt-auto flex gap-1">
              <button
                onClick={() => downloadOvpn(item.info, item.title)}
                className="flex-1 rounded p-2  p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition flex items-center justify-center"
                title="دانلود"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
              <button
                // onClick={() => toggleStatus(item.id)}
                className={`flex-1 rounded p-2 ${item.status
                  ? "bg-green-700 text-white"
                  : "bg-red-500 text-white"
                  }`}
              >
                {item.status ? ' روشن' : 'خاموش'}
              </button>


            </div>
            <div className="mt-2 flex gap-1">
              <button
                // onClick={() => editCard(item.id)}
                className="flex-1 rounded bg-violet-500 hover:bg-violet-600 p-2 text-white transition"
              >
                ویرایش
              </button>

              <button
                onClick={() => deleteCard(item.id)}
                className="flex-1 rounded bg-red-400 p-2 text-white hover:bg-red-600 p-2 text-white transition"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg p-6 w-80 shadow">
            <h2 className="text-lg font-bold mb-4">Create Item</h2>

            <input
              className="border w-full p-2 rounded mb-4"
              placeholder="Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="date"
              className="border w-full p-2 rounded mb-4"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={createItem}
                className="flex-1 bg-green-600 text-white p-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-gray-400 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


