import { FunctionComponent, ReactElement, useRef } from "react";
import Image from "next/image";
import images from "@/public/images";
import Link from "next/link";
import { Icons } from "../ui/icons";
import { useScroll, useTransform, motion } from "framer-motion";

interface TeamSectionProps { }

const TeamSection: FunctionComponent<TeamSectionProps> = (): ReactElement => {

    const teamMembers = [
        {
            name: "Similoluwa Afolabi",
            role: "Co-Founder & CEO",
            image: images.simlex,
            socials: [
                {
                    name: "Instagram",
                    icon: <Icons.Instagram />,
                    link: "https://www.instagram.com/the.brand.simlex",
                },
                {
                    name: "Twitter",
                    icon: <Icons.Twitter />,
                    link: "https://x.com/simlex_x",
                },
                {
                    name: "LinkedIn",
                    icon: <Icons.LinkedIn />,
                    link: "https://www.linkedin.com/in/simlex/",
                },
            ],
        },
        {
            name: "Awoyinfa Oluwatobiloba",
            role: "Co-Founder & COO",
            image: images.toby,
            socials: [
                {
                    name: "Instagram",
                    icon: <Icons.Instagram />,
                    link: "https://www.instagram.com/_tobygold",
                },
                {
                    name: "Twitter",
                    icon: <Icons.Twitter />,
                    link: "https://x.com/tobygold_a",
                },
                {
                    name: "LinkedIn",
                    icon: <Icons.LinkedIn />,
                    link: "https://www.linkedin.com/in/oluwatobilobaawo/",
                },
            ],
        },
        {
            name: "Oluwashola Afolabi",
            role: "Brand & Product Designer",
            image: images.sholly,
            socials: [
                {
                    name: "Instagram",
                    icon: <Icons.Instagram />,
                    link: "https://www.instagram.com/shola_the.design.chef",
                },
                {
                    name: "Twitter",
                    icon: <Icons.Twitter />,
                    link: "https://x.com/shollyfresh_",
                },
                // {
                //     name: "LinkedIn",
                //     icon: <Icons.LinkedIn />,
                //     link: "https://www.linkedin.com/in/oluwashola-afolabi-9b0a4b1b0/"
                // },
            ],
        },
    ];

    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'], // When section starts entering & leaves view
    });

    // Transform values based on scroll progress
    const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]); // Zoom out to normal
    const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 1, 1]); // Optional fade-in feel


    return (
        <motion.section
            // ref={sectionRef}
            // style={{ scale, opacity }}
            className='sectionPadding !py-10 md:!py-12 bg-dark-grey text-white'>
            <div className='flex flex-col items-center mx-auto mb-8'>
                <h2 className='w-fit mx-auto font-medium text-2xl'>Our Team</h2>
                <p className='w-fit'>Meet the Great Team Members</p>
            </div>

            <div className='grid [grid-template-columns:_repeat(auto-fit,_minmax(250px,_1fr))]'>
                {teamMembers.map((member, index) => {
                    return (
                        <div
                            key={index}
                            className='flex flex-col items-center justify-center py-8 px-6 rounded-[20px] bg-transparent text-white text-center transition-all duration-300'
                        >
                            <div className='size-[10rem] relative rounded-full overflow-hidden mb-4'>
                                <Image
                                    src={member.image}
                                    className='size-full object-cover'
                                    alt='Team member'
                                    fill
                                    sizes='auto'
                                />
                            </div>
                            <div className='flex flex-col'>
                                <h4 className='text-base font-medium'>{member.name}</h4>
                                <p className='text-sm font-light leading-6 opacity-65 mb-2'>
                                    {member.role}
                                </p>
                                <div className='flex w-fit mx-auto gap-2'>
                                    {member.socials.map((social, index) => {
                                        return (
                                            <Link
                                                key={index}
                                                className='transition-all duration-300 hover:translate-y-[-2px] [&_svg]:size-5 [&_svg_path]:fill-white [&_svg_path]:hover:fill-primary-color-sub'
                                                href={social.link}
                                                children={social.icon}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </motion.section>
    );
};

export default TeamSection;
