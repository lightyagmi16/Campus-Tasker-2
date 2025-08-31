
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(()=>{
    supabase.auth.getUser().then(({ data })=> setUser(data.user));
  },[]);

  const upload = async (e)=>{
    const file = e.target.files[0];
    if(!file || !user) return;
    const fileName = `${user.id}.png`;
    const { error } = await supabase.storage.from('upi_qr').upload(fileName, file, { upsert: true });
    if(error) return alert(error.message);
    const { data } = supabase.storage.from('upi_qr').getPublicUrl(fileName);
    await supabase.from('users').upsert([{ id: user.id, email: user.email, upi_qr_url: data.publicUrl }], { returning: 'minimal' });
    setQrUrl(data.publicUrl);
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Profile</h2>
        {!user && <div>Please login first</div>}
        {user && (
          <div className="space-y-3">
            <div className="font-medium">{user.email}</div>
            <input type="file" accept="image/*" onChange={upload} />
            {qrUrl && <img src={qrUrl} alt="UPI QR" className="w-48 h-48 mt-2" />}
          </div>
        )}
      </div>
    </div>
  );
}
