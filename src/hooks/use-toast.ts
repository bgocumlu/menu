"use client"

// This is a mock implementation since we don't have the actual toast component
export function useToast() {
  return {
    toast: ({ title, description }: { title: string; description?: string }) => {
      console.log(`Toast: ${title}`, description)
      alert(`${title}\n${description || ""}`)
    },
  }
}

