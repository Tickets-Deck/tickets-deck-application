export async function getServerSideProps({ res }: any) {
  const response = await fetch("https://events.ticketsdeck.com/api/sitemap");
  const sitemap = await response.text();

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
