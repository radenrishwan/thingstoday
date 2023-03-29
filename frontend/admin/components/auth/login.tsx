import { Button, Checkbox, Label, TextInput } from "flowbite-react"

const LoginAuth = () => {
    return <>
        <div className="w-[30vw] p-5 drop-shadow-md bg-blue-100 rounded-md">
            <form className="flex flex-col gap-4">
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="email"
                            value="Email"
                        />
                    </div>
                    <TextInput
                        id="email"
                        type="emai"
                        placeholder="email@gmail.com"
                        minLength={8}
                        maxLength={25}
                        required={true}
                    />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label
                            htmlFor="password"
                            value="Password"
                        />
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        placeholder="********"
                        minLength={8}
                        maxLength={25}
                        required={true}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember">
                        Remember me
                    </Label>
                </div>
                <Button href="/dashboard">
                    Login
                </Button>
            </form>
        </div>
    </>
}

export default LoginAuth