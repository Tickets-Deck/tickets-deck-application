"use client"
import { FunctionComponent, ReactElement } from "react";
import styles from "@/app/styles/About.module.scss";
import Image from "next/image";
import images from "@/public/images";
import CreateEvent from "../components/Homepage/CreateEvent";
import PageHeroSection from "../components/shared/PageHeroSection";
import IntroSection from "../components/AboutPage/IntroSection";
import WhyChooseUs from "../components/AboutPage/WhyChooseUs";
import TeamSection from "../components/AboutPage/TeamSection";

interface AboutPageProps {

}

const AboutPage: FunctionComponent<AboutPageProps> = (): ReactElement => {

    return (
        <main className={styles.main}>
            <PageHeroSection
                imageUrl={images.about_hero}
                title="About Us"
                description="Ticketsdeck Events ~ where the magic of unforgettable experiences comes to life!"
            />
            <IntroSection />
            <WhyChooseUs />
            <TeamSection />
            {/* <CreateEvent /> */}
        </main>
    );
}

export default AboutPage;