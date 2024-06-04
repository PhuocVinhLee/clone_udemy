
import NavbarRoutes from '@/components/navbar-routes'
import MobileSidebar from'./mobile-sidebar'
const NavBar = () => {
  return (
    <div className='p-4 flex items-center border-b h-full bg-white shadow-sm'>
       <MobileSidebar></MobileSidebar>
       <NavbarRoutes/>
    </div>
  )
}

export default NavBar