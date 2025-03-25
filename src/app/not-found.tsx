import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex max-w-md flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">404</h1>
        <h2 className="text-2xl font-semibold tracking-tight">Not Found</h2>
        <p className="text-muted-foreground">Sorry, we couldn&apos;t find the menu you&apos;re looking for.</p>
        <Link
          href="/menu"
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go to Menu
        </Link>
      </div>
    </div>
  )
}

