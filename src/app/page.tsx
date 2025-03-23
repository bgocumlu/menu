import { redirect } from "next/navigation"

// Main page redirects to the Anatolia menu
export default function Home() {
  redirect("/anatolia")
}

