import LoginAuth from "@/components/auth/login";
import RegisterAuth from "@/components/auth/register";
import { DefaultLayout } from "@/components/layout";
import { useState } from "react";

export default function Home() {
  const [page, usePage] = useState("login")
  
  const render= () => {
    if (page === "register") {
      return <RegisterAuth />
    } else {
      return <LoginAuth />
    }
  }
  
  return (
    <>
      <DefaultLayout title="Home" setParentState={(state) => usePage(state)}>
        <div className="h-[90vh] flex justify-center items-center">
            {render()}
        </div>
      </DefaultLayout>
    </>
  )
}
