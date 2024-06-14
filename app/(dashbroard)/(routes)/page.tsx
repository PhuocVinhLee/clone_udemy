import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";


export default function Home() {
  const { userId } = auth();
  return (
    <p className=" text-3xl border  border-red-600  text-blue-600"> 
    <div>UseId:{userId}</div>
    <UserButton afterSignOutUrl="/">
      
    </UserButton>
    
     </p>
    
  );
}
