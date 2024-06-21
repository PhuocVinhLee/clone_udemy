import { getAllCategory } from "@/lib/actions/categorys.action";
import Categories from "./_components/Categories";
import SearchInput from "@/components/search-input";

const SearchPage = async () => {
  const ArrCategories = await getAllCategory();

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput></SearchInput>
      </div>

      <div className="p-6">
        <Categories items={ArrCategories}></Categories>
      </div>
    </>
  );
};

export default SearchPage;
