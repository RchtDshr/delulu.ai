import Categories from '@/components/categories';
import Companions from '@/components/companions';
import SearchInput from '@/components/search-input'
import prismadb from '@/lib/prismadb'

interface RootPageParams{
  // every server component has searchParams which is used to extract data from url
  searchParams: {
    categoryId: string,
    name: string
  }
}

export default async function RootPage({searchParams} : RootPageParams) {

  // extract data from db with categoryId from url and show them in the screen
  //  order the result by when it was created and also count the number of msgs from each user showcasing the popularity by msgs
  const data = await prismadb.companion.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      _count: {
        select: {
          msgs: true
        }
      }
    }
  
  })

  // find all categories from the categories table
  const categories = await prismadb.category.findMany();
  return (
    <div className='h-full space-y-2 p-1 pr-2'>
       <SearchInput />
       <Categories data={categories} />
       <Companions data={data} />
    </div>
  )
}
