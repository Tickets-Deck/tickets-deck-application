import { Metadata } from 'next'
import Homepage from './Homepage'
import { getPlaceholderImage } from './services/DynamicBlurDataUrl'
import images from '@/public/images';

export const metadata: Metadata = {
    title: 'Homepage | Ticketsdeck Events',
    description: 'Unlocking best experiences, easily.'
}

export default async function Home() {
    
    const imageList = [
        {
            img: images.ImageBg1,
        },
        {
            img: images.ImageBg2,
        },
        // {
        //     img: images.ImageBg3,
        // },
        {
            img: images.ImageBg4,
        },
        {
            img: images.ImageBg5,
        },
        {
            img: images.ImageBg6,
        },
        // {
        //     img: images.ImageBg7,
        // },
        // {
        //     img: images.ImageBg8,
        // },
    ];

    const imageWithPlaceholder = await Promise.all(
        imageList.map(async (eachImage) => {
            const imageWithPlaceholder = await getPlaceholderImage(eachImage.img)
            return imageWithPlaceholder;
        }),
    )

    return (
        <Homepage imageWithPlaceholder={imageWithPlaceholder} />
    )
}