import type { AppProps } from "next/app";
import { SolanaProvider } from "@/context/SolanaContext";
import { NextUIProvider } from "@nextui-org/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontSans, fontMono } from "@/config/fonts";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextThemesProvider>
      <NextUIProvider navigate={router.push}>
        <SolanaProvider>
          <Component {...pageProps} />
        </SolanaProvider>
      </NextUIProvider>
    </NextThemesProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
