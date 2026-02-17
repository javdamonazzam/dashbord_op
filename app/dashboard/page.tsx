'use client'
import { useEffect, useState } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

type Service = {
  id: number;
  name: string;
  expir_date: string;
  info: string;
  title: string;
  status: boolean;
};

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  // Helper: get cookie by name
  const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Fetch services on client
  useEffect(() => {
    if (typeof window === 'undefined') return; // فقط client

    const accessToken = getCookie('token');
    const id = localStorage.getItem('id');

    if (!accessToken || !id) {
      console.log('No token or id found');
      return;
    }

    async function fetchServices() {
      try {
        const res = await fetch(
          `http://94.131.118.165:3020/service/find?user_id=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await res.json();
        setServices(data.data.result || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }

    fetchServices();
  }, []);

  const downloadOvpn = (info: string, title: string) => {
    const blob = new Blob([info], { type: 'application/x-openvpn-profile' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.ovpn`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const createItem = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const id = localStorage.getItem('id');

    if (!accessToken || !id) {
      alert('ابتدا وارد شوید!');
      return;
    }

    try {
      const res = await fetch('http://94.131.118.165:3020/service/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, date, id }),
      });
      const data = await res.json();

      // اضافه کردن سرویس جدید به state
      setServices((prev) => [...prev, data.data]);

      // دانلود OVPN
      downloadOvpn(data.data.config, data.data.title);

      // ریست فرم
      setName('');
      setDate('');
      setShowPopup(false);
    } catch (err) {
      console.error('Server error:', err);
      alert('Server error!');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => setShowPopup(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          اکانت جدید
        </button>
      </div>

      {/* SERVICES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            <h2 className="font-bold text-lg">{item.name}</h2>
            <p className="mb-2">تاریخ پایان سرویس: {item.expir_date}</p>

            <div className="mt-auto flex gap-1">
              <button
                onClick={() => downloadOvpn(item.info, item.title)}
                className="flex-1 rounded bg-blue-500 hover:bg-blue-600 text-white p-2 flex items-center justify-center"
                title="دانلود"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>

              <button
                className={`flex-1 rounded p-2 ${item.status ? 'bg-green-700' : 'bg-red-500'} text-white`}
              >
                {item.status ? 'روشن' : 'خاموش'}
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
  );
}
