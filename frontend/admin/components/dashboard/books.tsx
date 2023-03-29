import { BookOpenIcon, MagnifyingGlassIcon, TagIcon } from "@heroicons/react/24/solid"
import { Pagination, Table, Tabs } from "flowbite-react"
import React, { useState } from "react"

const BooksDashboard = () => {
    let books = []

    for (let i = 0; i < 10; i++) {
        books.push(<Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={i}>
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
        </Table.Row>)
    }
    return <>
        <div className="mt-5 mb-5">
            <Tabs.Group
                aria-label="Tabs with icons"
                style="underline"
            >
                <Tabs.Item
                    title="Books"
                    icon={BookOpenIcon}
                >
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
                            {books}
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
                </Tabs.Item>
                <Tabs.Item
                    active={true}
                    title="Category"
                    icon={TagIcon}
                >
                    Dashboard content
                </Tabs.Item>
                <Tabs.Item
                    title="Search"
                    icon={MagnifyingGlassIcon}
                >
                    Settings content
                </Tabs.Item>
            </Tabs.Group>
        </div>
    </>
}

export default BooksDashboard