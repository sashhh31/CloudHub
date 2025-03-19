"use client"

import * as Clerk from "@clerk/elements/common"
import * as SignUp from "@clerk/elements/sign-up"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
          <SignUp.Root>
            <SignUp.Step name="start">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
                  <p className="mt-2 text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="font-medium text-[#ff5631] hover:text-[#e64a2a]">
                      Sign in
                    </Link>
                  </p>
                </div>

                <Clerk.Connection
                  name="google"
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                >
                  Sign up with Google
                </Clerk.Connection>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Clerk.Field name="firstName" className="space-y-2">
                    <Clerk.Label className="block text-sm font-medium text-gray-700">First name</Clerk.Label>
                    <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                    <Clerk.FieldError className="text-sm text-red-600" />
                  </Clerk.Field>

                  <Clerk.Field name="lastName" className="space-y-2">
                    <Clerk.Label className="block text-sm font-medium text-gray-700">Last name</Clerk.Label>
                    <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                    <Clerk.FieldError className="text-sm text-red-600" />
                  </Clerk.Field>

                  <Clerk.Field name="emailAddress" className="space-y-2">
                    <Clerk.Label className="block text-sm font-medium text-gray-700">Email</Clerk.Label>
                    <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                    <Clerk.FieldError className="text-sm text-red-600" />
                  </Clerk.Field>

                  <Clerk.Field name="password" className="space-y-2">
                    <Clerk.Label className="block text-sm font-medium text-gray-700">Password</Clerk.Label>
                    <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                    <Clerk.FieldError className="text-sm text-red-600" />
                  </Clerk.Field>

                  <SignUp.Action
                    submit
                    className="flex w-full justify-center rounded-md bg-[#ff5631] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e64a2a] focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                  >
                    Create account
                  </SignUp.Action>

                  <p className="text-xs text-gray-500">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="font-medium text-[#ff5631] hover:text-[#e64a2a]">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-medium text-[#ff5631] hover:text-[#e64a2a]">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </SignUp.Step>

            <SignUp.Step name="verifications">
              <SignUp.Strategy name="email_code">
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                      We sent a code to your email address.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Clerk.Field name="code" className="space-y-2">
                      <Clerk.Label className="block text-sm font-medium text-gray-700">Email code</Clerk.Label>
                      <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                      <Clerk.FieldError className="text-sm text-red-600" />
                    </Clerk.Field>

                    <SignUp.Action
                      submit
                      className="flex w-full justify-center rounded-md bg-[#ff5631] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e64a2a] focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                    >
                      Continue
                    </SignUp.Action>
                  </div>
                </div>
              </SignUp.Strategy>

              <SignUp.Strategy name="phone_code">
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Check your phone</h1>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                      We sent a code to your phone number.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Clerk.Field name="code" className="space-y-2">
                      <Clerk.Label className="block text-sm font-medium text-gray-700">Phone code</Clerk.Label>
                      <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                      <Clerk.FieldError className="text-sm text-red-600" />
                    </Clerk.Field>

                    <SignUp.Action
                      submit
                      className="flex w-full justify-center rounded-md bg-[#ff5631] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e64a2a] focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                    >
                      Continue
                    </SignUp.Action>
                  </div>
                </div>
              </SignUp.Strategy>
            </SignUp.Step>

            <SignUp.Step name="restricted">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold tracking-tight">Complete your profile</h1>
                  <p className="mt-2 text-sm text-gray-500">Tell us a bit more about yourself.</p>
                </div>

                <div className="space-y-4">
                  <Clerk.Field name="username" className="space-y-2">
                    <Clerk.Label className="block text-sm font-medium text-gray-700">Username</Clerk.Label>
                    <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                    <Clerk.FieldError className="text-sm text-red-600" />
                  </Clerk.Field>

                  <SignUp.Action
                    submit
                    className="flex w-full justify-center rounded-md bg-[#ff5631] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e64a2a] focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                  >
                    Complete sign up
                  </SignUp.Action>
                </div>
              </div>
            </SignUp.Step>
          </SignUp.Root>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DejectStudio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

