import { FunctionComponent, ReactElement } from "react";
import styles from "@/app/styles/About.module.scss";
import Image from "next/image";
import images from "@/public/images";
import Link from "next/link";
import { InstagramIcon, LinkedInIcon, TwitterIcon } from "../SVGs/SVGicons";

interface TeamSectionProps {

}

const TeamSection: FunctionComponent<TeamSectionProps> = (): ReactElement => {

    const teamMembers = [
        {
            name: "Similoluwa Afolabi",
            role: "Co-Founder & CEO",
            image: images.simlex,
            socials: [
                {
                    name: "Instagram",
                    icon: <InstagramIcon />,
                    link: "https://www.instagram.com/the.brand.simlex"
                },
                {
                    name: "Twitter",
                    icon: <TwitterIcon />,
                    link: "https://x.com/simlex_x"
                },
                {
                    name: "LinkedIn",
                    icon: <LinkedInIcon />,
                    link: "https://www.linkedin.com/in/simlex/"
                },
            ]
        },
        {
            name: "Awoyinfa Oluwatobiloba",
            role: "Co-Founder & COO",
            image: images.toby,
            socials: [
                {
                    name: "Instagram",
                    icon: <InstagramIcon />,
                    link: "https://www.instagram.com/_tobygold"
                },
                {
                    name: "Twitter",
                    icon: <TwitterIcon />,
                    link: "https://x.com/tobygold_a"
                },
                {
                    name: "LinkedIn",
                    icon: <LinkedInIcon />,
                    link: "https://www.linkedin.com/in/oluwatobilobaawo/"
                },
            ]
        },
        {
            name: "Oluwashola Afolabi",
            role: "Brand & Product Designer",
            image: images.sholly,
            socials: [
                {
                    name: "Instagram",
                    icon: <InstagramIcon />,
                    link: "https://www.instagram.com/shola_the.design.chef"
                },
                {
                    name: "Twitter",
                    icon: <TwitterIcon />,
                    link: "https://x.com/shollyfresh_"
                },
                // {
                //     name: "LinkedIn",
                //     icon: <LinkedInIcon />,
                //     link: "https://www.linkedin.com/in/oluwashola-afolabi-9b0a4b1b0/"
                // },
            ]
        },
    ]

    return (
        <section className={styles.teamSection}>
            <div className={styles.topArea}>
                <h2>Our Team</h2>
                <p>Meet the Great Team Members</p>
            </div>

            <div className={styles.teams}>
                {
                    teamMembers.map((member, index) => {
                        return (
                            <div key={index} className={styles.team}>
                                <div className={styles.image}>
                                    <Image src={member.image} alt="Team member" fill sizes="auto" />
                                </div>
                                <div className={styles.info}>
                                    <h4>{member.name}</h4>
                                    <p>{member.role}</p>
                                    <div className={styles.links}>
                                        {
                                            member.socials.map((social, index) => {
                                                return (
                                                    <Link key={index} href={social.link} children={social.icon} />
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    );
}

export default TeamSection;