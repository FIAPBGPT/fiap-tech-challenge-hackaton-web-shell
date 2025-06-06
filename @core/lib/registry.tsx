"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

/**
 * Props for the `StyledComponentsRegistry` component.
 *
 * @property children - The React node(s) to be rendered within the registry.
 */
interface StyledComponentsRegistryProps {
  children: React.ReactNode;
}

/**
 * A React functional component that manages the integration of Styled Components
 * with server-side rendering (SSR) and client-side rendering (CSR).
 *
 * This component ensures that styles generated by Styled Components are properly
 * handled during SSR by using `ServerStyleSheet` and `StyleSheetManager`. On the
 * client side, it directly renders the children without additional processing.
 *
 * @param {StyledComponentsRegistryProps} props - The props for the component.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 *
 * @returns {JSX.Element} The rendered component, wrapped with `StyleSheetManager`
 * on the server or directly rendered on the client.
 *
 * @remarks
 * - On the server, it lazily initializes a `ServerStyleSheet` instance to collect
 *   styles and wraps the children with `StyleSheetManager`.
 * - On the client, it bypasses the `StyleSheetManager` and directly renders the children.
 * - The `useServerInsertedHTML` hook is used to inject the collected styles into the
 *   server-rendered HTML.
 *
 * @example
 * ```tsx
 * import StyledComponentsRegistry from './registry';
 *
 * const App = () => (
 *   <StyledComponentsRegistry>
 *     <YourComponent />
 *   </StyledComponentsRegistry>
 * );
 * ```
 */
const StyledComponentsRegistry: React.FC<StyledComponentsRegistryProps> = ({ children }) => {
  // Lazily initialize the ServerStyleSheet
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // If running on the client, return children directly
  if (typeof window !== "undefined") {
    return <>{children}</>;
  }

  // Wrap children with StyleSheetManager on the server
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
};

export default StyledComponentsRegistry;
