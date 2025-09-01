'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProfile(id);
  }, [id]);

  const fetchProfile = async (userId) => {
    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, bio, upi_qr')
      .eq('id', userId)
      .single();

    setLoading(false);

    if (error) {
      console.error(error);
    } else {
      setProfile(data);
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!profile) return <p className="p-6">Profile not found</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {profile.name || profile.email}
      </h1>

      <p className="text-gray-600 mb-4">{profile.bio || 'No bio yet'}</p>

      <p className="text-sm text-gray-500">Email: {profile.email}</p>

      {profile.upi_qr && (
        <div className="mt-4">
          <p className="text-sm font-medium">UPI QR Code:</p>
          <img
            src={profile.upi_qr}
            alt="UPI QR"
            className="w-40 h-40 border rounded"
          />
        </div>
      )}
    </div>
  );
}
