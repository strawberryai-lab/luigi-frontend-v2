import Logo from "../../public/logo.svg";
import Luigi from "../../public/luigi.svg";

export function Header() {
  return (
    <div className="p-4 fixed top-0 w-full border-b bg-black/75 backdrop-blur-sm supports-[backdrop-filter]:bg-black/40 z-[99]">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center justify-between gap-2">
          <Luigi className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 168 120" />
          <h2 className="text-xl font-semibold"><code>0xLuigi</code></h2>
        </div>
        <div className="items-center justify-between gap-2 hidden md:flex">
          <div>
            <Logo className="w-8 h-8" viewBox="0 0 94 94" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Strawberry</h2>
          </div>
        </div>
      </div>
    </div>
  )
}