import { HomeIcon } from '@heroicons/react/24/solid';
import { Avatar, Breadcrumb, Button, Dropdown, Navbar } from 'flowbite-react'
import React from "react";

const DefaultNavbar = ({ setParentState }: { setParentState: (state: string) => void }) => {
    const [isLogin, setIsLogin] = React.useState(true)

    const setStateAndIsLogin = (state: string) => {
        setParentState(state)
        setIsLogin(!isLogin)
    }

    return <>
        <Navbar fluid={true} rounded={true} >
            <Navbar.Brand href="/">
                <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="mr-3 h-6 sm:h-9"
                    alt="Flowbite Logo"
                />
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                    ThingsToday
                </span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <Button size="md" pill={true} onClick={() => setStateAndIsLogin("login")} className={isLogin ? "" : "bg-white text-black"}>
                    Login
                </Button>
                <Button size="md" pill={true} onClick={() => setStateAndIsLogin("register")} className={isLogin ? "bg-white text-black" : ""}>
                    Register
                </Button>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link
                    href="/navbars"
                    active={true}
                >
                    Home
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    About
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    Services
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    Contact
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    </>
}


const DashboardNavbar = () => {
    return <>
        <Navbar fluid={true} rounded={true} >
            <Breadcrumb
                aria-label="Solid background breadcrumb example"
                className="py-3 dark:bg-gray-900"
            >
                <Breadcrumb.Item
                    href="#"
                    icon={HomeIcon}
                >
                    Home
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">
                    Projects
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Flowbite React
                </Breadcrumb.Item>
            </Breadcrumb>
            <div className="flex md:order-2">
                <Dropdown
                    arrowIcon={false}
                    inline={true}
                    label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded={true} />}
                >
                    <Dropdown.Header>
                        <span className="block text-sm">
                            Bonnie Green
                        </span>
                        <span className="block truncate text-sm font-medium">
                            name@flowbite.com
                        </span>
                    </Dropdown.Header>
                    <Dropdown.Item>
                        Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item>
                        Settings
                    </Dropdown.Item>
                    <Dropdown.Item>
                        Earnings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>
                        Sign out
                    </Dropdown.Item>
                </Dropdown>
                <Navbar.Toggle />
            </div>
        </Navbar>
    </>
}



export { DefaultNavbar, DashboardNavbar }