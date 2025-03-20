import Image from "next/image";
import { FunctionComponent, ReactElement } from "react";
import images from "@/public/images";

interface ImagesDisplayProps {}

const ImagesDisplay: FunctionComponent<
  ImagesDisplayProps
> = (): ReactElement => {
  return (
    <div className='w-[35%] overflow-hidden relative hidden min-[1200px]:block'>
      <span className='bg-white size-[5rem] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2] grid place-items-center shadow-[0px_0px_48px_8px_rgba(0,0,0,0.35)]'>
        <Image className='size-[55%]' src={images.logoPurple} alt='Logo' />
      </span>
      <div className='flex size-[100%] gap-[0.8rem] rotate-[25deg] translate-x-[-65%]'>
        <div className='flex flex-col gap-4 h-[120%]'>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg6}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg2}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg3}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg1}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
        </div>
        <div className='flex flex-col gap-4 h-[120%] translate-y-[-40px]'>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg5}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg4}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg6}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg3}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
        </div>
        <div className='flex flex-col gap-4 h-[120%] translate-y-[40px]'>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg1}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg3}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidde'>
            <Image
              src={images.ImageBg5}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg4}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
        </div>
        <div className='flex flex-col gap-4 h-[120%]'>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg4}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg4}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg4}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
          <span className='relative w-[7rem] h-[12rem] rounded-[0.625rem] overflow-hidden'>
            <Image
              src={images.ImageBg4}
              className='object-cover'
              alt='Event'
              fill
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ImagesDisplay;
