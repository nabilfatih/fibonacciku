import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FibonacciKu",
    short_name: "FibonacciKu",
    description:
      "Your genius study buddy. Start using AI for your personal tutor instead of cheating tool. Specifically designed for teachers and students",
    start_url: "/",
    display: "standalone",
    background_color: "#060c17",
    theme_color: "#060c17",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon"
      }
    ]
  }
}
