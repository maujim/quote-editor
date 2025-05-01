import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Quote Editor</h1>
      <Link href="/editor" className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
        Start Editing
      </Link>
    </main>
  )
}
