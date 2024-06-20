import { getAllCategory } from "@/lib/actions/categorys.action";
import Categories from "./_components/Categories";


const SearchPage = async () => {
  const ArrCategories = await getAllCategory();
  
  return (
    <div className="p-6">

     <Categories items={ArrCategories}>
      
     </Categories>
    </div>
  )
}

export default SearchPage
