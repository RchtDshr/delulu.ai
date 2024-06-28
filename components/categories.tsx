'use client'
import { Category } from "@prisma/client"
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { cn } from "@/lib/utils";

interface CategoriesProps{
    data: Category[];
}

export default function Categories({data}: CategoriesProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryId = searchParams.get("categoryId");

    // user clicks on a button taht category is appended in the url 
    const onClick = (id: string | undefined) => {
        const query = { categoryId: id};

        const url = qs.stringifyUrl ({url: window.location.href, query}, {skipNull: true})

        router.push(url)
    }

  return (
    <div className="w-full overflow-x-auto py-2 p-1 pt-1 flex items-center gap-2 scrollbar-hide">
        <Button
        onClick={() => onClick(undefined)}
        className={cn("text-sm h-10 px-5 bg-primary/90 flex items-center", 
        !categoryId ? 'bg-primary' : 'bg-primary/70' )} >
            Newest
        </Button>

        {data.map((item) => (
            <Button
            onClick={() => onClick(item.id)}
            key={item.id}
            className={cn("text-sm h-10 px-5 bg-primary/90 flex items-center", item.id===categoryId ? 'bg-primary' : 'bg-primary/70' )} >
            {item.name}
        </Button>
        ))}
    </div>
  )
}
