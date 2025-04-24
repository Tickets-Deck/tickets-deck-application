import axios from "axios";
import { ApiRoutes } from "../apiRoutes";

const SITE_URL = "https://events.ticketsdeck.com";
const API_BASE = ApiRoutes.BASE_URL;

export async function GET() {
  const staticPages = ["/", "/about", "/contact", "/events"];

  try {
    // STEP 1: Request Token
    const tokenRes = await axios.get(`${API_BASE}auth/request-token`, {
      headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
    });
    console.log("🚀 ~ GET ~ tokenRes:", tokenRes);

    const token = tokenRes.data?.token;
    if (!token) throw new Error("No token returned.");

    // STEP 2: Fetch Events with Token
    const eventsRes = await axios.get(`${API_BASE}events`, {
      headers: { "x-api-key": process.env.NEXT_API_KEY },
    });
    console.log("🚀 ~ GET ~ eventsRes:", eventsRes);

    const eventPages = eventsRes.data || [];

    // STEP 3: Build XML
    // const eventUrls = eventPages.map(
    //   (event: { id: string; createdAt: string }) => `
    //     <url>
    //       <loc>${SITE_URL}/events/${event.id}</loc>
    //       <lastmod>${new Date(event.createdAt).toISOString()}</lastmod>
    //       <changefreq>weekly</changefreq>
    //       <priority>0.8</priority>
    //     </url>
    //   `
    // );
    const eventUrls = eventPages.map(
      (event: { id: string; createdAt: string }) => `
        <url>
          <loc>${SITE_URL}/events/${event.id}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `
    );

    const staticUrls = staticPages.map(
      (page) => `
        <url>
          <loc>${SITE_URL}${page}</loc>
          <changefreq>monthly</changefreq>
          <priority>1.0</priority>
        </url>
      `
    );

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${staticUrls.join("\n")}
        ${eventUrls.join("\n")}
      </urlset>
    `;

    return new Response(sitemap, {
      headers: {
        "Content-Type": "text/xml",
      },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error generating sitemap:", error);
    return new Response(`"Failed to generate sitemap." ${error}`, {
      status: 500,
    });
  }
}
