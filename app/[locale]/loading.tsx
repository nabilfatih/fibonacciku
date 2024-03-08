import Particles from "@/components/ui/particles"

export default function Loading() {
  return (
    <main className="flex h-screen flex-1 flex-col overflow-hidden">
      <div className="relative">
        <Particles
          className="pointer-events-none absolute inset-0 -z-10 animate-fade-in"
          quantity={100}
        />
      </div>
    </main>
  )
}
