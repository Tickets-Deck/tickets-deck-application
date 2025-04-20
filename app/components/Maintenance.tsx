import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

const MaintenancePage = () => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number }>({
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endTime = new Date("2024-04-21T04:00:00Z").getTime();
      const now = new Date().getTime();
      const _11pm = new Date("2024-04-20T23:00:00Z").getTime();
      const distance = endTime - now;
    //   console.log("🚀 ~ calculateTimeLeft ~ _11pm:", _11pm)
    //   console.log("🚀 ~ calculateTimeLeft ~ now:", now)
    //   console.log("🚀 ~ calculateTimeLeft ~ endTime:", endTime)
    //   console.log("🚀 ~ calculateTimeLeft ~ distance:", distance)

      if (distance > 0) {
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        return { hours, minutes };
      }
      return { hours: 0, minutes: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#B78AF7] flex flex-col items-center justify-center p-5 text-white font-['Josefin_Sans']">
      <Head>
        <title>Maintenance Mode - Ticketsdeck Events</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap"
          rel="stylesheet"
        />
      </Head>

      <img
        src="https://res.cloudinary.com/dvxqk1487/image/upload/v1723533838/logo/etd-logo_gq8p9t.png"
        alt="Logo"
        className="w-20 mb-8"
      />

      <div className="bg-[#1D0D35] max-w-2xl w-full p-10 rounded-2xl text-center">
        <h1 className="text-4xl md:text-5xl mb-5">
          We&apos;re Upgrading Your Experience!
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Our systems are currently undergoing scheduled maintenance to bring
          you improved performance and new features.
        </p>

        <div className="text-2xl mb-8 text-[#FFD700] min-h-8">
          {timeLeft.hours >= 0 && timeLeft.minutes >= 0
            ? `Service Restoration In: ${timeLeft.hours}h ${timeLeft.minutes}m`
            : "Maintenance Complete!"}
        </div>

        <div className="flex justify-center mb-10">
          {[...Array(3)].map((_, index) => (
            <span
              key={index}
              className="w-4 h-4 bg-[#8133F1] rounded-full mx-2 animate-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>

        <div className="space-y-2">
          <p>Need immediate assistance?</p>
          <p>
            Contact us at:
            <Link
              className="flex items-center mx-auto gap-[0.35rem] text-[0.75rem] text-white opacity-70 hover:opacity-100 hover:text-primary-color-sub no-underline w-fit"
              href="mailto:ticketsdeckevents@gmail.com"
            >
              ticketsdeckevents@gmail.com
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
