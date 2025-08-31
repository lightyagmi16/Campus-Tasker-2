'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function FeedPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);

    // 👇 Fetch tasks and join with profiles (name + email + upi_qr)
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, description, created_at, profiles (name, email, upi_qr)')
      .order('created_at', { ascending: false });

    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }

    setTasks(data || []);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Task Feed</h1>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet. Be the first to post!</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 bg-white shadow rounded-lg border"
            >
              <h2 className="text-lg font-semibold">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>

              <p className="text-sm text-gray-400 mt-2">
                Posted by:{' '}
                {task.profiles?.name
                  ? task.profiles.name
                  : task.profiles?.email || 'Unknown'}{' '}
                • {new Date(task.created_at).toLocaleString()}
              </p>

              {task.profiles?.upi_qr && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500">UPI QR:</p>
                  <img
                    src={task.profiles.upi_qr}
                    alt="UPI QR"
                    className="w-20 h-20 border rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
