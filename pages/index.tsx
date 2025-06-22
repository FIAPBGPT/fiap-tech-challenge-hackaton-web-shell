"use client";

import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import DashboardPage from "./home/index";

// @ts-ignore
const Mfe = dynamic(() => import("mfe/app"), {
  ssr: false,
  loading: () => <Spinner animation="border" variant="secondary" size="sm" />,
});

export default function HomePage() {
    return (
    <>
      <Head>
        <title>FarmFiap</title>
        <meta name="description" content="Site Bytebank" />
        <link rel="icon" href="/icon.svg" type="image/svg" />
      </Head>
      <div style={{ overflowX: "hidden" }}>
        <DashboardPage />
      </div>
    </>
  );
}
