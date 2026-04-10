import { useLoaderData } from "react-router-dom"

export function About() {
  const data = useLoaderData()

  return (
    <article>
      <h2 className="text-2xl font-semibold">{data.title}</h2>
      <p className="mt-2">{data.description}</p>
      <ul className="mt-4 list-inside list-disc space-y-1 text-sm">
        {data.stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}
