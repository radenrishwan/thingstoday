import { DashboardLayout } from "@/components/layout";
import { Card, Pagination, Table } from "flowbite-react";
import { NavbarBrand } from "flowbite-react/lib/esm/components/Navbar/NavbarBrand";

export default function Home() {
    return (
        <>
            <DashboardLayout title="Books">
                <p className="text-xl font-semibold mb-5">Books</p    >
                <Table className="">
                    <Table.Head>
                        <Table.HeadCell>
                            Books Title
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Color
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Category
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Price
                        </Table.HeadCell>
                        <Table.HeadCell>
                            <span className="sr-only">
                                Edit
                            </span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                Apple MacBook Pro 17"
                            </Table.Cell>
                            <Table.Cell>
                                Sliver
                            </Table.Cell>
                            <Table.Cell>
                                Laptop
                            </Table.Cell>
                            <Table.Cell>
                                $2999
                            </Table.Cell>
                            <Table.Cell>
                                <a
                                    href="/tables"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    Edit
                                </a>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                Microsoft Surface Pro
                            </Table.Cell>
                            <Table.Cell>
                                White
                            </Table.Cell>
                            <Table.Cell>
                                Laptop PC
                            </Table.Cell>
                            <Table.Cell>
                                $1999
                            </Table.Cell>
                            <Table.Cell>
                                <a
                                    href="/tables"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    Edit
                                </a>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                Magic Mouse 2
                            </Table.Cell>
                            <Table.Cell>
                                Black
                            </Table.Cell>
                            <Table.Cell>
                                Accessories
                            </Table.Cell>
                            <Table.Cell>
                                $99
                            </Table.Cell>
                            <Table.Cell>
                                <a
                                    href="/tables"
                                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    Edit
                                </a>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <div className="flex items-center justify-center mt-5">
                    <Pagination
                        currentPage={1}
                        onPageChange={() => { }}
                        showIcons={true}
                        totalPages={100}
                    />
                </div>
            </DashboardLayout>
        </>
    )

}
