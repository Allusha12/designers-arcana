"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SceneBackground from "@/components/background/SceneBackground";
import Logo from "@/components/ui/Logo";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { useAuth } from "@/hooks/useAuth";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if already signed in
  useEffect(() => {
    if (!loading && user) router.replace("/history");
  }, [loading, user, router]);

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
      router.replace("/deck");
    } catch {
      // sign-in cancelled or failed — stay on page
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      <SceneBackground variant="landing" />

      <div className="relative z-10 flex flex-col items-center gap-10 px-[var(--page-padding-x)]">
        <Logo />

        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-subtitle" style={{ color: "#f4eccb", maxWidth: 340 }}>
            Увійди, щоб зберігати<br />свою історію карт
          </p>

          <button
            onClick={handleGoogleSignIn}
            className="flex items-center gap-3 px-8 py-4 border transition-opacity hover:opacity-80"
            style={{
              borderColor: "rgba(200,168,97,0.45)",
              background: "rgba(10,5,7,0.6)",
              borderRadius: 999,
              fontFamily: "var(--font-display)",
              fontSize: 15,
              letterSpacing: "0.20em",
              color: "#c8a861",
              textTransform: "uppercase",
            }}
          >
            <GoogleIcon />
            Увійти через Google
          </button>

          <button
            onClick={() => router.push("/deck")}
            className="text-nav hover:opacity-60 transition-opacity mt-2"
            style={{ color: "rgba(200,168,97,0.50)" }}
          >
            Продовжити без входу
          </button>
        </div>
      </div>
    </main>
  );
}
