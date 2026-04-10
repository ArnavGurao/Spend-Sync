function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function homeLoader() {
  const data = await fetch("/home").then((res) => res.json())

  return data
}

export async function aboutLoader() {
  await wait(120)
  return {
    title: "About",
    description: "Simple About page using a route loader for boilerplate data.",
    stack: ["React", "react-router-dom", "Nitro + Vite"],
  }
}
