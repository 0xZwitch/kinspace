import Link from "next/link"
import { Home, Users } from "lucide-react"

export default function Navigation() {
  return (
    <nav>
      <ul className="space-y-2">
        <li>
          <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/public" className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md">
            <Users className="h-5 w-5" />
            <span>Spaces</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}
