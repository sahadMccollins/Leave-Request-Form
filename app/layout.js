"use client";

import Provider from "./provider";

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head />
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
