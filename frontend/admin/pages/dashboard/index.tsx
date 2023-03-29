import BooksDashboard from "@/components/dashboard/books";
import HelpDashboard from "@/components/dashboard/help";
import { DashboardLayout } from "@/components/layout";
import { capitalize } from "@/utils/string_helper";
import { Card } from "flowbite-react";
import { useState } from "react";

export default function Home() {
    const [page, usePage] = useState("")

    const render = () => {
        if (page == "books") {
            return <BooksDashboard />
        } else if (page == "help") {
            return <HelpDashboard />
        } 
        
        else {
            return <Card>
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Welcome, Raden Mohamad Rishwan
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    This is admin dashboard. Please be carefull when you do something.
                </p>
            </Card>
        }
    }

    return (
        <>
            <DashboardLayout title={page === "" ? "Dashboard" : capitalize(page)} setParentState={(state: string) => usePage(state)}>
                {render()}
            </DashboardLayout>
        </>
    )
}
