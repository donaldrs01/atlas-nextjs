"use client";

import Image from "next/image";
import homepage from "../assets/homepage.jpg";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    console.log("Attempting sign-in with:", { email, password });

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/ui",
      redirect: false,
    });

    console.log("Sign in response:", result);

    if (result?.error) {
      console.error("Sign-in error:", result.error);
      alert("Login failed. Check console.");
      return;
    }

    console.log("Login successful - redirecting to /ui");
    router.push("/ui");
  }

  return (
    <main className="w-screen py-12 md:py-24 lg:py-32 flex flex-col items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex lg:flex-row flex-col gap-4 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl">
              Unlock the Power of the Web
            </h1>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Discover our suite of tools and services to build, deploy, and
              scale your web applications with ease.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border p-2 rounded"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border p-2 rounded"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Sign In with Credentials
                </button>
              </form>
              {/* GitHub Login Button */}
              <button
                onClick={() => signIn("github")}
                className="cursor-pointer inline-flex h-10 items-center justify-center rounded-md bg-gray-900 text-white px-8 text-sm font-medium"
              >
                <div>Sign in with GitHub</div>
              </button>
              <Link
                href="/about"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Learn More
              </Link>
            </div>
          </div>
          <Image
            src={homepage}
            alt="Hero"
            className="mx-auto aspect-square overflow-hidden rounded-xl object-cover w-full max-w-[550px]"
          />
        </div>
      </div>
    </main>
  );
}
