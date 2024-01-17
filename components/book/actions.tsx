import { Button } from "@/components/ui/button"

export default function BookActions() {
  return (
    <div className="fixed inset-x-0 bottom-0 h-16 w-full border-t duration-300 ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <div className="mx-auto w-full max-w-2xl px-4 flex items-center justify-between">
        <div></div>
        <div className="flex-1">
          <div className="flex items-center"></div>
        </div>
      </div>
    </div>
  )
}
