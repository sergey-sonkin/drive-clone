import { SignInButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <>
      <SignInButton forceRedirectUrl="/drive">Sign In</SignInButton>
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()} Sonkin Drive. All rights reserved.
      </footer>
    </>
  );
}
