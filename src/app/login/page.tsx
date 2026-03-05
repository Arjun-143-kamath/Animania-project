"use client";

import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div>

      <button onClick={() => signIn("google")}>
        Login with Google
      </button>

      <button onClick={() => signIn("github")}>
        Login with Github
      </button>

      <button onClick={() => signIn()}>
        Login with Email
      </button>

    </div>
  );
}