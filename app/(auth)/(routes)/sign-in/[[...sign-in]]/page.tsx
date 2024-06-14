import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
 
export default function Page() {
  const { userId } = auth();
  // if (!userId) return redirect("/");
if(!userId) {
  return <SignIn />
}
  //return <SignIn />;
}
// "use client"
// import { SignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
// import { useEffect, useState } from "react";

// const AuthenticationPage = () => {
//   const { isLoaded, userId } = useAuth();
//   const [isSignedIn, setIsSignedIn] = useState(false);

//   useEffect(() => {
//     if (isLoaded) {
//       setIsSignedIn(!!userId);
//     }
//   }, [isLoaded, userId]);

//   if (!isLoaded) {
//     return <div>Loading...</div>; // Render a loading state while auth status is being determined
//   }

//   return (
//     <div>
  
//         <SignIn />
      
//     </div>
//   );
// };

// export default AuthenticationPage;
