
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function FeedPage() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) console.error(error);
    else setTasks(data);
  };

  useEffect(()=>{ fetchTasks(); }, []);

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Open Tasks</h2>
          <Link href="/post"><button className="bg-indigo-600 text-white px-3 py-1 rounded">Post</button></Link>
        </div>
        <div className="space-y-3">
          {tasks.length===0 && <div className="text-slate-500">No tasks yet.</div>}
          {tasks.map(t=>(
            <div key={t.id} className="bg-white p-4 rounded shadow">
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-slate-600">{t.description}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-xs text-slate-500">{t.location}</div>
                <div className="text-sm font-medium">{new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR'}).format(t.tip/100)}</div>
              </div>
              <div className="mt-2 flex gap-2">
                <Link href={`/chat/${t.id}`}><button className="px-2 py-1 border rounded">Chat / Accept</button></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
