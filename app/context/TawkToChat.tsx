import { useEffect } from "react";
import { usePathname } from "next/navigation";

const TawkToChat = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Don't load Tawk.to widget if user is in the /app route (user console)
    if (pathname?.startsWith("/app")) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/67e00b0598d9ad1905a9ce1b/1in1im3vh";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      // Only try to remove script if it was actually added
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [pathname]);

  return null; // No UI needed
};

export default TawkToChat;
