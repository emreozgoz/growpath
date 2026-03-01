import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-primary-500 mb-4">
          🌱 GrowPath
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-Powered Personalized Learning Platform
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Get Started
          </Link>
          <Link href="/login" className="bg-white hover:bg-gray-50 text-primary-500 border-2 border-primary-500 px-6 py-3 rounded-lg font-medium transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
