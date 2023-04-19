import { Inter } from "next/font/google";
import Link from "next/link";

export default function Tools() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-5xl font-extrabold mb-16">Tools created with Next.js 13</h1>
      <div className="flex max-w-md gap-24">
        <Link className="text-red-500 font-bold" href="/tools/resistance">Resistance calculator</Link>
        <Link className="text-green-500 font-bold" href="/tools/savings">Savings calculator</Link>
      </div>
    </main>
  )
}