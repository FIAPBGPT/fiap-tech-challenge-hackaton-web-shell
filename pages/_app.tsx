"use client";
import StyledComponentsRegistry from "@/@core/lib/registry";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Suspense } from "react";
import { Container } from "react-bootstrap";
import Loading from "./loading";
import { StyledRoot } from "@/@theme/styledRoot";
import { useAuthListener } from "@/@core/hooks/useAuthListener";
import ProtectedLayout from "@/@core/components/auth/ProtectedLayout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  useAuthListener();
  const router = useRouter();
  const isLoginPage = router.pathname === "/";
  return (
    <Container fluid style={{ overflow: "hidden" }}>
      {/* <AppRouterCacheProvider> */}
      {!isLoginPage ? (
        <ProtectedLayout>
          <StyledComponentsRegistry>
            <StyledRoot>
              <Suspense fallback={<Loading />}>
                {/* <SessionProvider session={pageProps.session}> */}
                {/* <QueryClientProvider client={queryClient}> */}
                {/* <HydrationBoundary state={pageProps.dehydratedState}> */}
                <Component {...pageProps} />
                {/* </HydrationBoundary> */}
                {/* </QueryClientProvider> */}
                {/* </SessionProvider> */}
              </Suspense>
            </StyledRoot>
          </StyledComponentsRegistry>
        </ProtectedLayout>
      ) : (
        <StyledComponentsRegistry>
          <StyledRoot>
            <Suspense fallback={<Loading />}>
              {/* <SessionProvider session={pageProps.session}> */}
              {/* <QueryClientProvider client={queryClient}> */}
              {/* <HydrationBoundary state={pageProps.dehydratedState}> */}
              <Component {...pageProps} />
              {/* </HydrationBoundary> */}
              {/* </QueryClientProvider> */}
              {/* </SessionProvider> */}
            </Suspense>
          </StyledRoot>
        </StyledComponentsRegistry>
      )}
      {/* </AppRouterCacheProvider> */}
    </Container>
  );
}
