'use client';
import { supabase } from '../../lib/supabaseClient'

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');

  // Correct way to create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      alert(error.message);
    } else {
      alert('Check your email for the login link!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Campus Tasker</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="border p-2 w-64 mb-4 rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Login / Signup
      </button>
    </div>
  );
}
