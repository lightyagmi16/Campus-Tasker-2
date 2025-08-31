
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function ChatPage({ params }) {
  const { id } = params;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [task, setTask] = useState(null);

  const fetch = async ()=>{
    const { data: msgs } = await supabase.from('messages').select('*').eq('task_id', id).order('created_at', { ascending: true });
    const { data: t } = await supabase.from('tasks').select('*').eq('id', id).single();
    setMessages(msgs||[]);
    setTask(t);
  };

  useEffect(()=>{ fetch(); 
    const channel = supabase.channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if(payload.new.task_id === id) setMessages(prev=>[...prev, payload.new]);
      }).subscribe();
    return ()=> supabase.removeChannel(channel);
  }, [id]);

  const send = async ()=>{
    const user = (await supabase.auth.getUser()).data.user;
    if(!user) return alert('Login first');
    await supabase.from('messages').insert([{ task_id: id, author: user.id, text }]);
    setText('');
  };

  const accept = async ()=>{
    const user = (await supabase.auth.getUser()).data.user;
    if(!user) return alert('Login first');
    // atomic update via matching status open
    const { data, error } = await supabase.from('tasks').update({ assignee: user.id, status: 'accepted' }).match({ id, status: 'open' }).select();
    if(error) return alert(error.message);
    if(!data || data.length===0) alert('Task already taken');
    else alert('You accepted the task');
  };

  const complete = async ()=>{
    const { error } = await supabase.from('tasks').update({ status: 'completed' }).match({ id }).select();
    if(error) return alert(error.message);
    alert('Marked completed');
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-4 rounded shadow">
          <div className="font-medium">{task?.title}</div>
          <div className="text-sm text-slate-600">{task?.description}</div>
          <div className="mt-2 flex gap-2">
            <button className="px-2 py-1 border rounded" onClick={accept}>Accept</button>
            <button className="px-2 py-1 border rounded" onClick={complete}>Complete</button>
          </div>
        </div>

        <div className="mt-4 bg-white p-4 rounded shadow">
          <div className="space-y-3">
            {messages.map(m=>(
              <div key={m.id} className="bg-slate-100 p-2 rounded">{m.text}</div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input className="border p-2 flex-1" value={text} onChange={e=>setText(e.target.value)} />
            <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={send}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
