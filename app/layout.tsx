import type { Metadata, Viewport } from "next";
import "react-quill/dist/quill.snow.css";
import "./styles/globals.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import dynamic from "next/dynamic";
import GlobalProvider from "./components/Provider";
import Head from "next/head";
import { initializeIcons, loadTheme } from "@fluentui/react";

const Layout = dynamic(() => import("./components/Layout"), { ssr: false });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Ticketsdeck Events",
  description: "Unlocking best experiences, easily.",
};

export const viewport: Viewport = {
  themeColor: "#111",
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

  return (
    <GlobalProvider>
      <html lang='en' data-theme={"dark"}>
        <Head>
          <link rel='apple-touch-icon' href='/etd_logo_192.png' />
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
              height='1'
              width='1'
              style={{ display: "none" }}
              src='https://www.facebook.com/tr?id=891024619563071&ev=PageView&noscript=1'
              alt='Facebook Pixel'
            />
          </noscript>
        </Head>
        {/* <meta name="description" content="Elevating event experiences with next-level ticketing and management solutions." />

                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="image" content="https://res.cloudinary.com/doklhs4em/image/upload/v1711460397/External/bablo_meta_img.jpg" />

                <meta property="og:url" content="https://bablohomes.co.uk/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Ticketsdeck Events | Unlocking best experiences, Easily." />
                <meta property="og:description" content="Elevating event experiences with next-level ticketing and management solutions." />
                <meta property="og:image" content="https://res.cloudinary.com/doklhs4em/image/upload/v1711460397/External/bablo_meta_img.jpg" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="https://bablohomes.co.uk/" />
                <meta property="twitter:url" content="https://bablohomes.co.uk/" />
                <meta name="twitter:title" content="Ticketsdeck Events | Unlocking best experiences, Easily." />
                <meta name="twitter:description" content="Elevating event experiences with next-level ticketing and management solutions." />
                <meta name="twitter:image" content="https://res.cloudinary.com/doklhs4em/image/upload/v1711460397/External/bablo_meta_img.jpg" /> */}

        <body>
          <Layout children={children} session={session} />
        </body>
      </html>
    </GlobalProvider>
  );
}
