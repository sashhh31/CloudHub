"use client"

import * as Clerk from "@clerk/elements/common"
import * as SignIn from "@clerk/elements/sign-in"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex flex-1 items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
          <SignIn.Root>
            <SignIn.Step name="start">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold tracking-tight">Sign in to your account</h1>
                  <p className="mt-2 text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/sign-up" className="font-medium text-[#ff5631] hover:text-[#e64a2a]">
                      Sign up
                    </Link>
                  </p>
                </div>

                <Clerk.Connection
                  name="google"
                  className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                >
                  Sign in with Google
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
                  <Clerk.Field name="identifier" className="space-y-2">
                    <Clerk.Label className="block text-sm font-medium text-gray-700">Email</Clerk.Label>
                    <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                    <Clerk.FieldError className="text-sm text-red-600" />
                  </Clerk.Field>

                  <SignIn.Action
                    submit
                    className="flex w-full justify-center rounded-md bg-[#ff5631] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e64a2a] focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                  >
                    Continue
                  </SignIn.Action>
                </div>
              </div>
            </SignIn.Step>

            <SignIn.Step name="verifications">
              <SignIn.Strategy name="email_code">
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                      We sent a code to <SignIn.SafeIdentifier />.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Clerk.Field name="code" className="space-y-2">
                      <Clerk.Label className="block text-sm font-medium text-gray-700">Email code</Clerk.Label>
                      <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                      <Clerk.FieldError className="text-sm text-red-600" />
                    </Clerk.Field>

                    <SignIn.Action
                      submit
                      className="flex w-full justify-center rounded-md bg-[#ff5631] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e64a2a] focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                    >
                      Continue
                    </SignIn.Action>
                  </div>
                </div>
              </SignIn.Strategy>

              <SignIn.Strategy name="password">
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Enter your password</h1>
                  </div>

                  <div className="space-y-4">
                    <Clerk.Field name="password" className="space-y-2">
                      <Clerk.Label className="block text-sm font-medium text-gray-700">Password</Clerk.Label>
                      <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                      <Clerk.FieldError className="text-sm text-red-600" />
                    </Clerk.Field>

                    <SignIn.Action
                      submit
                      className="flex w-full justify-center rounded-md bg-[#ff5631] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e64a2a] focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                    >
                      Continue
                    </SignIn.Action>

                    <SignIn.Action
                      navigate="forgot-password"
                      className="flex w-full justify-center text-sm font-medium text-[#ff5631] hover:text-[#e64a2a]"
                    >
                      Forgot password?
                    </SignIn.Action>
                  </div>
                </div>
              </SignIn.Strategy>

              <SignIn.Strategy name="reset_password_email_code">
                <div className="space-y-6">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                      We sent a code to <SignIn.SafeIdentifier  />.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Clerk.Field name="code" className="space-y-2">
                      <Clerk.Label className="block text-sm font-medium text-gray-700">Email code</Clerk.Label>
                      <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                      <Clerk.FieldError className="text-sm text-red-600" />
                    </Clerk.Field>

                    <SignIn.Action
                      submit
                      className="flex w-full justify-center rounded-md bg-[#ff5631] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e64a2a] focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                    >
                      Continue
                    </SignIn.Action>
                  </div>
                </div>
              </SignIn.Strategy>
            </SignIn.Step>

            <SignIn.Step name="forgot-password">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold tracking-tight">Forgot your password?</h1>
                  <p className="mt-2 text-sm text-gray-500">We'll send you a code to reset your password.</p>
                </div>

                <div className="space-y-4 flex w-full justify-center rounded-md bg-[#ff5631] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e64a2a] focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2">
                  <SignIn.SupportedStrategy
                    name="reset_password_email_code"
                  >
                    Reset password
                  </SignIn.SupportedStrategy>

                  <SignIn.Action
                    navigate="previous"
                    className="flex w-full justify-center text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Go back
                  </SignIn.Action>
                </div>
              </div>
            </SignIn.Step>

            <SignIn.Step name="reset-password">
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
                  <p className="mt-2 text-sm text-gray-500">Create a new password for your account.</p>
                </div>

                <div className="space-y-4">
                  <Clerk.Field name="password" className="space-y-2">
                    <Clerk.Label className="block text-sm font-medium text-gray-700">New password</Clerk.Label>
                    <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                    <Clerk.FieldError className="text-sm text-red-600" />
                  </Clerk.Field>

                  <Clerk.Field name="confirmPassword" className="space-y-2">
                    <Clerk.Label className="block text-sm font-medium text-gray-700">Confirm password</Clerk.Label>
                    <Clerk.Input className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#ff5631] focus:outline-none focus:ring-1 focus:ring-[#ff5631]" />
                    <Clerk.FieldError className="text-sm text-red-600" />
                  </Clerk.Field>

                  <SignIn.Action
                    submit
                    className="flex w-full justify-center rounded-md bg-[#ff5631] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#e64a2a] focus:outline-none focus:ring-2 focus:ring-[#ff5631] focus:ring-offset-2"
                  >
                    Reset password
                  </SignIn.Action>
                </div>
              </div>
            </SignIn.Step>
          </SignIn.Root>
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

