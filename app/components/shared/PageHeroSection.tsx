import { ReactElement, FunctionComponent } from "react";
import Image, { StaticImageData } from "next/image";
import styles from "@/app/styles/components/PageHeroSection.module.scss";
import images from "@/public/images";

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
    <section className='relative flex flex-col gap-3'>
      {imageUrl && (
        <div className='size-full [&_img]:size-full [&_img]:object-cover after:bg-white after:absolute after:size-full after:top-0 after:left-0 after:z-[2] after:bg-[linear-gradient(180deg,_#8133f1_0%,_#430994_100%)]'>
          <Image src={imageUrl} alt='About' sizes='auto' fill />
        </div>
      )}
      {videoUrl && (
        <div className='absolute size-full after:bg-white after:absolute after:size-full after:z-[2] after:bg-[linear-gradient(180deg,_#8133f1_0%,_#6315d3_100%)]'>
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
          <h1 className='font-medium'>{title}</h1>
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
