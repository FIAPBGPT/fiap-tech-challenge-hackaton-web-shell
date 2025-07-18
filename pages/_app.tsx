"use client";
import StyledComponentsRegistry from "@/@core/lib/registry";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Suspense } from "react";
import { Container } from "react-bootstrap";
import Loading from "./loading";
import { StyledRoot } from "@/@theme/styledRoot";
import { useAuthListener } from "@/@core/hooks/useAuthListener";

// Ensure useAuthListener returns { user, loading }
import ProtectedLayout from "@/@core/components/auth/ProtectedLayout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const { user, loading } = useAuthListener();
  const router = useRouter();

  // Show loading while checking auth state
  if (loading) {
    return (
      <Container fluid style={{ overflow: "hidden" }}>
        <StyledComponentsRegistry>
          <StyledRoot>
            <Loading />
          </StyledRoot>
        </StyledComponentsRegistry>
      </Container>
    );
  }

  // If no user, redirect to login page
  if (!user && router.pathname !== "/") {
    if (typeof window !== "undefined") {
      router.replace("/");
    }
    return null;
  }

  // If user is authenticated, show protected layout
  if (user) {
    return (
      <Container fluid style={{ overflow: "hidden" }}>
          <StyledComponentsRegistry>
            <StyledRoot>
              <Suspense fallback={<Loading />}>
                <Component {...pageProps} />
              </Suspense>
            </StyledRoot>
          </StyledComponentsRegistry>
      </Container>
    );
  }

  // Otherwise, show login page
  return (
    <Container fluid style={{ overflow: "hidden" }}>
      <StyledComponentsRegistry>
        <StyledRoot>
          <Suspense fallback={<Loading />}>
            <Component {...pageProps} />
          </Suspense>
        </StyledRoot>
      </StyledComponentsRegistry>
    </Container>
  );
}
