"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import {signIn, getProviders, getSession} from 'next-auth/react'
import { useRouter, useSearchParams } from "next/navigation" 

const LoginLayout = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [signup, setSignup] = useState(null)
    useEffect(() => {
        if (searchParams.get("signup")) {
            setSignup(searchParams.get("signup"))
        }
    }, [searchParams])
    {/* Login by Facebook and Google */}
    const [providers, setProviders] = useState(null)
    useEffect(() => {
        // const getUserSession = async () => {
        //     const session = await getSession();
        //     if (session) {
        //         router.push("/")
        //     }
        // }
        // getUserSession();

        const setupProviders = async () => {
            const response = await getProviders();

            setProviders(response)
        }
        setupProviders();
    }, [])

    {/* Login by email and password */}
    const [submitting, setSubmitting] = useState(false)
    const [user, setUser] = useState({
        email: '',
        password: '',
        remember: false
    })
    const [errorAlert, setErrorAlert] = useState(null)
    const handlerLogin = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await signIn("credentials", {
                email: user.email,
                password: user.password,
                redirect: false
            })
            if (response?.error === "CredentialsSignin") {
                setErrorAlert("Thông tin đăng nhập không chính xác, vui lòng kiểm tra lại!")
            }
            else {
                if (signup == "success") {
                    router.push("/")
                }
                else  
                    router.back()
            }
        }
        catch (error) {
            setErrorAlert(error)
        }
        finally {
            setSubmitting(false)
        }
    }
    return (
        <section className="h-screen">
            <div className="h-full">
                <div
                className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
                    <div
                        className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                        <Image
                        src="/assets/images/login_bg.jpg"
                        width={600} height={400}
                        alt="Background image" />
                    </div>

                    <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
                        <form onSubmit={handlerLogin} >
                            <div
                                className="flex flex-row items-center justify-center lg:justify-start">
                                <p className="mb-0 mr-4 text-lg text-white">Sign In with</p>
                                {providers && Object.values(providers).map((provider) => (
                                    <button
                                    hidden={provider.name == "credentials"}
                                    type="button"
                                    key={provider.name}
                                    onClick={() => signIn(provider.id, {callbackUrl: "/"})}
                                    className="mx-1 h-9 w-9 rounded-full bg-primary uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
                                        {provider.name == "Google" ? <Image src="/assets/images/google.svg" width={200} height={200}></Image> : <></>}
                                    </button> )
                                )}
                            </div>

                            <div
                                className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                                <p
                                className="mx-4 mb-0 text-center font-semibold dark:text-white">
                                Or
                                </p>
                            </div>

                            <div className="relative mb-6" data-te-input-wrapper-init>
                                <input
                                type="text"
                                className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                id="exampleformControlInput2"
                                onChange={(e) => setUser({ ...user, email: e.target.value})}
                                placeholder=" " 
                                required/>
                                <label
                                htmlFor="exampleformControlInput2"
                                className="absolute left-3 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >Email
                                </label>
                            </div>

                            <div className="relative mb-6" data-te-input-wrapper-init>
                                <input
                                type="password"
                                className="block py-2.5 px-3 w-full text-sm text-gray-900 bg-transparent border-0 border-b border-gray-300 appearance-none dark:text-white dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                id="exampleformControlInput22"
                                placeholder=" " 
                                required
                                onChange={(e) => setUser({ ...user, password: e.target.value})}/>
                                <label
                                htmlFor="exampleformControlInput22"
                                className="absolute left-3 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-3 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >Mật khẩu
                                </label>
                            </div>

                            <div className="-mt-4 flex-end">
                                <Link href="/forgot-password" className="text-red-400 italic">Forgot Password?</Link>
                            </div>

                            <div className="text-center lg:text-left">
                                {!submitting ? (
                                    <input
                                        type="submit"
                                        className="cursor-pointer inline-block rounded bg-white px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                        data-te-ripple-init
                                        data-te-ripple-color="light"
                                        disabled={submitting} value={"Sign In"}/>
                                ) : (
                                    <button className="rounded bg-white px-13 py-2dot4 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
                                        <div role="status">
                                            <svg aria-hidden="true" class="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                            </svg>
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </button>
                                )}
                                
                                <p className="mb-0 mt-2 pt-1 text-sm font-semibold text-red-500">
                                    <Link
                                        href="/signup"
                                        className="text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700"
                                        >Sign Up</Link>
                                </p>
                            </div>
                        </form>
                        {errorAlert ? (
                            <div className="text-white mt-3 bg-red-500 rounded-lg px-3 py-2">
                                {errorAlert}
                            </div>
                        ) : (
                            <></>
                        )}
                        {signup == "success" ? (
                            <div className="text-white mt-3 bg-green-500 rounded-lg px-3 py-2">
                                Sign up successfully!
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LoginLayout