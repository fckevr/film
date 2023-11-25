"use client"
import Link from 'next/link'
import React, { useState } from 'react'
const ForgotPasswordPage = () => {
    const [otp, setOTP] = useState(null)
    const [otpInput, setOTPInput] = useState(null)
    const [email, setEmail] = useState(null)
    const [error, setError] = useState(null)
    const sendOTP = async () => {
        const response = await fetch("/api/user/email/" + email)
        if (response.ok) {
            const random = Math.floor(Math.random() * (999999 - 100001)) + 100001;
            setOTP(random)   
            const send = await fetch("/api/auth/email", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    otp: random
                })
            })
            setTimeout(() => {
                setOTP(null)
            }, 300000)
        }
        else {
            setError("Email not found!")
        }
    }  
    const verifyOTP = () => {
        if (otp == otpInput) {
            alert("yeah!")
        } else {
            setError("Wrong OTP!")
            setOTP(null)
        }
    }
    return (
        <section className="w-full h-screen dark-100 flex flex-center">
            <div className="flex flex-center">
                <div className="">
                    <h1 className="text-4xl font-bold text-white">Forgot Password</h1>
                    {otp ? (
                        <div className="flex flex-col gap-8 mt-20">
                            <div className='text-white'>
                                Enter the OTP has been sent to your email
                            </div>
                            <input onChange={(e) => {setOTPInput(e.target.value); setError(null)}} className="rounded-lg px-3 py-2" type="text" placeholder="Enter OTP"></input>
                            <button onClick={verifyOTP} className="rounded-lg px-3 py-2 primary-600 font-bold">Submit</button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 mt-20">
                            <input onChange={(e) => {setEmail(e.target.value); setError(null)}} className="rounded-lg px-3 py-2" type="email" placeholder="Enter your email"></input>
                            <button onClick={sendOTP} className="rounded-lg px-3 py-2 primary-600 font-bold">Submit</button>
                        </div>
                    )}
                    
                    <div className='text-red-500 mt-5 text-center'>
                        {error}
                    </div>
                    <div className='flex justify-between text-white mt-5'>
                        <Link href={"/signin"}>Sign In</Link>
                        <Link href={"/signup"}>Sign Up</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ForgotPasswordPage