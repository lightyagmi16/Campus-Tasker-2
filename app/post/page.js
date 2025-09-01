'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function PostTaskPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const addTask = async () => {
    setLoading(true);

    // 1. Get the logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert('You must be logged in to post a task.');
      setLoading(false);
      return;
    }

    // 2. Insert task with user.id as the author
    console.log("Posting task with author:", user.id);

    const { error } = await supabase.from('tasks').insert({
      title,
      description,
      author: user.id, // 👈 critical fix
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert('Error adding task: ' + error.message);
    } else {
      alert('Task posted successfully!');
      setTitle('');
      setDescription('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Post a New Task</h1>

      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-64 mb-4 rounded"
      />

      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-64 mb-4 rounded"
      />

      <button
        onClick={addTask}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'Post Task'}
      </button>
    </div>
  );
}
