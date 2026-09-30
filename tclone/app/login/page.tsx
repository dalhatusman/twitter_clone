"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(usernameOrEmail, password);
      router.push("/");
    } catch (err: any) {
      console.error("Login error:", err);
      const message =
        // err.response?.data?.detail ||
        "Incorrect username/email or password. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex h-dvh flex-1 flex-col overflow-auto bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-1 max-[500px]:hidden">
        <div className="flex flex-1 items-center justify-center px-4 py-4 min-[851px]:justify-start min-[851px]:ps-9">
          <div className="w-full max-w-[400px]">
            <div className="mb-3 flex justify-center min-[851px]:hidden">
              <Image
                src="/X.png"
                alt="logo"
                height={140}
                width={140}
                className="h-auto w-full max-w-[110px]"
              />
            </div>
            <h1
              className="mb-6 text-center text-[56px] leading-[1.1] font-black
          text-[#1A1A1A] min-[851px]:text-start min-[851px]:text-[76px]
          min-[851px]:tracking-[-1.5px] dark:text-white"
            >
              <span className="block">Happening</span>
              <span className="block mt-1">now.</span>
            </h1>
            <div className="w-full mt-7">
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                <Button className="w-full justify-center gap-3 rounded-full border border-border bg-white py-4 text-[15px] font-semibold text-foreground hover:bg-accent">
                  <Phone className="h-5 w-5" />
                  Continue with Phone
                </Button>
                <Button className="w-full justify-center gap-3 rounded-full border border-border bg-white py-4 text-[15px] font-semibold text-foreground hover:bg-accent">
                  <Image
                    src="/Glogo.png"
                    height={20}
                    width={20}
                    alt="Google Logo"
                  />
                  Continue with Google
                </Button>
                <Button className="w-full justify-center gap-3 rounded-full border border-border bg-white py-4 text-[15px] font-semibold text-foreground hover:bg-accent">
                  <Image
                    src="/Apple_logo.png"
                    height={18}
                    width={18}
                    alt="Apple Logo"
                  />
                  Continue with Apple
                </Button>
                <div className="flex items-center gap-2 my-1">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div>
                  <FieldGroup className="gap-2">
                    <Field>
                      <FieldLabel className="text-sm">
                        Username or Email
                      </FieldLabel>
                      <Input
                        name="username"
                        placeholder="Jordan Lee"
                        type="text"
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        className="rounded-full radius border-2 border-foreground/40 py-3 focus-visible:border-primary"
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel className="text-sm font-bold">
                        Password
                      </FieldLabel>
                      <Input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-3xl border-2 border-foreground/40 py-3 focus-visible:border-primary"
                        required
                      />
                    </Field>
                  </FieldGroup>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-full bg-foreground py-4 text-[15px] font-bold text-sm text-background hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <div>
                  <p className="text-xs text-center mb-2">
                    Don't have an account yet?
                    <Link href="/register"> Sign Up</Link>
                  </p>
                  <p className="text-xs text-center text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <a className="text-foreground underline">
                      Terms of Service,
                    </a>
                    <a className="text-foreground underline">
                      {" "}
                      Privacy Policy{" "}
                    </a>
                    and <a className="text-foreground underline">Cookie Use.</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
          <div className="hidden min-[851px]:flex min-[851px]:min-h-[45vh] min-[851px]:flex-1 min-[851px]:items-center min-[851px]:justify-end min-[851px]:pe-6 min-[851px]:overflow-hidden">
            <Image
              src="/X.png"
              alt="logo"
              height={140}
              width={140}
              className="h-auto w-90 max-w-[420px] opacity-90"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
