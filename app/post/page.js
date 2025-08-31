
'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function PostPage() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [loc, setLoc] = useState('');
  const [tip, setTip] = useState('');
  const router = useRouter();

  const handlePost = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if(!user) return alert('Login first');
    const paise = Math.round((Number(tip) || 0) * 100);
    const { error } = await supabase.from('tasks').insert([{
      title, description: desc, location: loc, tip: paise, author: user.id
    }]);
    if(error) return alert(error.message);
    router.push('/feed');
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Post a Task</h2>
        <input className="border p-2 w-full mb-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="border p-2 w-full mb-2" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
        <input className="border p-2 w-full mb-2" placeholder="Location" value={loc} onChange={e=>setLoc(e.target.value)} />
        <input className="border p-2 w-full mb-2" placeholder="Tip (₹)" value={tip} onChange={e=>setTip(e.target.value)} />
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-slate-200 rounded" onClick={()=>history.back()}>Cancel</button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={handlePost}>Post</button>
        </div>
      </div>
    </div>
  );
}
