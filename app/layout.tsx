import type { Metadata, Viewport } from "next";
import "react-quill/dist/quill.snow.css";
import "./styles/globals.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dynamic from "next/dynamic";
import GlobalProvider from "./components/Provider";
import Head from "next/head";
import { initializeIcons, loadTheme } from "@fluentui/react";
import { UserCredentialsResponse } from "./models/IUser";
import { useFetchUserInformation } from "./api/apiClient";
import Script from "next/script";

const Layout = dynamic(() => import("./components/Layout"), { ssr: false });

export const metadata: Metadata = {
  title: "Ticketsdeck Events | Unlocking best experiences, Easily.",
  description:
    "Elevating event experiences with next-level ticketing and management solutions.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://events.ticketsdeck.com"),
  openGraph: {
    title: "Ticketsdeck Events | Unlocking best experiences, Easily.",
    description:
      "Elevating event experiences with next-level ticketing and management solutions.",
    url: "https://events.ticketsdeck.com",
    siteName: "Ticketsdeck Events",
    images: [
      {
        url: "https://res.cloudinary.com/dvxqk1487/image/upload/v1745473667/misc/ticketsdeck-metadata-img_iaijvt.jpg",
        width: 1200,
        height: 630,
        alt: "Ticketsdeck Events",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ticketsdeck Events | Unlocking best experiences, Easily.",
    description:
      "Elevating event experiences with next-level ticketing and management solutions.",
    images: [
      "https://res.cloudinary.com/dvxqk1487/image/upload/v1745473667/misc/ticketsdeck-metadata-img_iaijvt.jpg",
    ],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/etd_logo_192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#111",
  width: "device-width",
  initialScale: 1,
};

// Load fluent UI icons
loadTheme({
  palette: {
    themePrimary: "#8133f1",
    themeLighterAlt: "#fef9f6",
    themeLighter: "#fde5db",
    themeLight: "#fbcfbd",
    themeTertiary: "#f7a17c",
    themeSecondary: "#f47742",
    themeDarkAlt: "#da5b25",
    themeDark: "#b84d1f",
    themeDarker: "#883917",
    neutralLighterAlt: "#faf9f8",
    neutralLighter: "#f3f2f1",
    neutralLight: "#edebe9",
    neutralQuaternaryAlt: "#e1dfdd",
    neutralQuaternary: "#d0d0d0",
    neutralTertiaryAlt: "#c8c6c4",
    neutralTertiary: "#a19f9d",
    neutralSecondary: "#605e5c",
    neutralSecondaryAlt: "#8a8886",
    neutralPrimaryAlt: "#3b3a39",
    neutralPrimary: "#323130",
    neutralDark: "#201f1e",
    black: "#000000",
    white: "#ffffff",
  },
  defaultFontStyle: { fontFamily: "MonaSans" },
});

// Initialize icons
initializeIcons();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const fetchUserInformation = useFetchUserInformation();

  let userData: UserCredentialsResponse | null = null;

  if (session?.user?.id) {
    try {
      const response = await fetchUserInformation(session.user.id);
      userData = response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }

  return (
    <GlobalProvider>
      <html lang="en">
        <head>
          <link rel="apple-touch-icon" href="/etd_logo_192.png" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];
                                s.parentNode.insertBefore(t,s)}(window, document,'script',
                                'https://connect.facebook.net/en_US/fbevents.js');
                                fbq('init', '891024619563071');
                                fbq('track', 'PageView');
                                `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=891024619563071&ev=PageView&noscript=1"
              alt="Facebook Pixel"
            />
          </noscript>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                            !function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];
                                s.parentNode.insertBefore(t,s)}(window, document,'script',
                                'https://connect.facebook.net/en_US/fbevents.js');
                                fbq('init', '1297977994706009');
                                fbq('track', 'PageView');
                                `,
            }}
          />

          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=1297977994706009&ev=PageView&noscript=1"
              alt="Facebook Pixel"
            />
          </noscript>

          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
          </Script>
        </head>
        <body>
          <Layout children={children} session={session} userData={userData} />
        </body>
      </html>
    </GlobalProvider>
  );
}
