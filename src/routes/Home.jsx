import { useLoaderData } from "react-router-dom"

export function Home() {
  const data = useLoaderData()

  return (
    <article>
      <h2 className="text-2xl font-semibold">Home</h2>
      <p className="mt-2">{data.message}</p>
      <p className="mt-3 text-sm text-gray-600">Loaded at: {new Date().toLocaleTimeString()}</p>
    </article>
  )
}
