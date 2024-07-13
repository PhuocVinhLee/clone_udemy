"use client"
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import SearchInput from './search-input';


 const NavbarRoutes = () => {
  const pathname = usePathname();
 

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search"
  const isQuestionPage = pathname === "/teacher/questions"
   return (
    <>
    {(isSearchPage || isQuestionPage) && (
      <div className=' hidden md:block'>
        <SearchInput>
          
        </SearchInput>
      </div>
    )}
   
     <div className=' flex gap-2 ml-auto'>

      {isCoursePage || isTeacherPage ? (
        <Link href='/'>
        <Button size="sm" variant="ghost">
          <LogOut className="h-4 w-4 mr-2">

          </LogOut>
          Exit

        </Button>
        </Link>
      ): (
        <Link href='/teacher/courses'>
          <Button size="sm" variant="ghost">
            Teacher mode
          </Button>
        </Link>
      ) }
        <UserButton afterSignOutUrl='/'></UserButton>
      
     </div>

     </>
   )
 }
 
 export default NavbarRoutes
 