

import React from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs';
export default function DashboardNavbar() {
    return (

        <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                <Image src="/frisbee-svgrepo-com.svg" width={30} height={30} alt="logo" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Ultimate Tracker</span>
            </a>
            <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                <SignedIn>
                    <UserButton />
                </SignedIn>
                </li>
            </ul>
            </div>
        </div>
        </nav>

    )
}