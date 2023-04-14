import { Red_Rose } from "next/font/google";
import Link from "next/link";

export default function Tools() {
  return (
    <div>
      <Link href="/tools/resistance">Resistance calculator</Link>
      <Link href="/tools/savings">Savings calculator</Link>
    </div>
  )
}