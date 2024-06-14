import Nav from "./_components/nav";
import Sidebar from "./_components/sidebar";
import { auth } from '@clerk/nextjs/server'

const DashbroardLayout = ({ children }: { children: React.ReactNode }) => {
  //auth().protect()
  return (
    <div className=" h-full ">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Nav></Nav>
      </div>

      <div className=" hidden md:flex h-full w-56   flex-col fixed inset-y-0 z-50">
        <Sidebar></Sidebar>
      </div>

      <main className=" h-full md:pl-56 pt-[80px] border border-red-800 ">{children}</main>
    </div>
  );
};

export default DashbroardLayout;
