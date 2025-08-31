
import Link from 'next/link';
export default function Home(){ return (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-3xl font-bold">Campus Tasker</h1>
      <p className="mt-4"><Link href="/login" className="text-indigo-600">Login</Link> • <Link href="/feed" className="text-indigo-600">Feed</Link></p>
    </div>
  </div>
)};
