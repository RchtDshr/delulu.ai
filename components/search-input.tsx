'use client'

import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEventHandler, useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import qs from "query-string"

export default function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId");
  const name = searchParams.get("name")

  const [value, setValue] = useState(name || "")

  // when user stops typing then we trigger this hook, we consider after 0.5s user stops typing he has finished typing and wants to see the result 
  const debouncedValue = useDebounce<string>(value, 500)

  // const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   setValue(e.target.value)
  // }

  useEffect(()=>{
    const query = {
      name: debouncedValue, categoryId: categoryId
    }

    const url = qs.stringifyUrl({
      url: window.location.href, query: query
    }, {skipEmptyString: true, skipNull: true })

    router.push(url)

  }, [debouncedValue, router, categoryId])

  return (
    <div className="relative">
        <Search className="absolute top-2 left-4 text-muted-foreground "/>
        <Input value={value} 
        // onChange={onChange} 
        onChange={(e) => setValue(e.target.value)}
        className="h-10 bg-primary/20 pl-16" placeholder="Search..."/>
    </div>
  )
}
