import { ReactElement, FunctionComponent } from "react";
import Image, { StaticImageData } from "next/image";

interface PageHeroSectionProps {
    imageUrl?: string | StaticImageData;
    videoUrl?: string;
    title: string | JSX.Element;
    description: string | JSX.Element;
}

const PageHeroSection: FunctionComponent<PageHeroSectionProps> = ({
    imageUrl,
    videoUrl,
    title,
    description,
}): ReactElement => {
    return (
        <section className='relative flex flex-col gap-3 overflow-hidden'>
            {imageUrl && (
                <div className='size-full overflow-hidden [&_img]:size-full [&_img]:object-cover after:absolute after:size-full after:top-0 after:left-0 after:z-[2] after:bg-[linear-gradient(180deg,_rgba(129,51,241,0.7)_0%,_rgba(67,9,148,0.7)_100%)]'>
                    <Image
                        src={imageUrl}
                        alt='About'
                        sizes='auto'
                        fill
                        className="animate-subtleZoom" />
                </div>
            )}
            {videoUrl && (
                <div className='size-full absolute after:absolute after:size-full after:top-0 after:left-0 after:z-[2] after:bg-[linear-gradient(180deg,_rgba(129,51,241,0.7)_0%,_rgba(67,9,148,0.7)_100%)]'>
                    <video
                        autoPlay
                        className='size-full object-cover object-bottom overflow-hidden'
                        loop
                        muted
                        playsInline
                        src={videoUrl}
                    />
                </div>
            )}
            <div className='sectionPadding !py-6 w-full sm:w-[70%] z-[2] relative flex flex-col gap-3 text-white'>
                {typeof title === "string" ? (
                    <h1 className='font-medium text-2xl'>{title}</h1>
                ) : (
                    title
                )}
                {typeof description === "string" ? (
                    <p className='text-primary-color-sub font-light'>{description}</p>
                ) : (
                    description
                )}
            </div>
        </section>
    );
};

export default PageHeroSection;
