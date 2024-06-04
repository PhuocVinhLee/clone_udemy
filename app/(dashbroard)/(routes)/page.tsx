import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";


export default function Home() {
  return (
    <p className=" text-3xl  text-blue-600"> <UserButton afterSignOutUrl="/">
      
    </UserButton>
     </p>
    
  );
}
