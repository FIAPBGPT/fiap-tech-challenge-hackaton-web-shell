"use client";

import Head from "next/head";
import LoginPage from "./login";

export default function HomePage() {
  return (
    <>
      <div style={{ overflowX: "hidden" }}>
        <LoginPage />
      </div>
    </>
  );
}
