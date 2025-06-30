"use client";

import Head from "next/head";
import dynamic from "next/dynamic";
import { Spinner } from "react-bootstrap";
import LoginPage from "./login";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Fiap Farms</title>
        <meta name="description" content="Site Fiap Farms" />
        <link rel="icon" href="/icon.svg" type="image/svg" />
      </Head>
      <div style={{ overflowX: "hidden" }}>
        <LoginPage />
      </div>
    </>
  );
}
