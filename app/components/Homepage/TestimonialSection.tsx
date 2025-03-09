import React from 'react'
import Badge from '../ui/badge'
import Testimonials from './Testimonials'

type Props = {}

export default function TestimonialSection({ }: Props) {

    const testimonials = [
        {
            id: 1,
            name: "Esiso Oghenenyerhovwo",
            role: "Event Manager",
            avatar: "/placeholder.svg?height=40&width=40",
            content:
                "Ticketsdeck Events is a user friendly website that is easy to navigate. The interface is aesthetically pleasing too, not too much to do. I'm glad I worked with you, and look forward to more future collaborations.",
            rating: 5,
        },
        {
            id: 2,
            name: "VICTORFIT",
            role: "Co Convener the fifo experience",
            avatar: "/placeholder.svg?height=40&width=40",
            content:
                "Ticketsdeck Events was a game changer for us this year, they made registration and collation of data seamless.Thank you! We will definitely refer you to other event conveners like us.",
            rating: 5,
        },
        {
            id: 3,
            name: "Party Enigma",
            role: "Rave Island Organizer",
            avatar: "/placeholder.svg?height=40&width=40",
            content:
                "Partnering with Ticketsdeck Events for the Rave Island Pool Party was an incredible experience. Their professionalism and support made everything run smoothly. Thank you for helping us create unforgettable memories!",
            rating: 5,
        },
        // {
        //     id: 2,
        //     name: "Michael Chen",
        //     role: "Regular Attendee",
        //     avatar: "/placeholder.svg?height=40&width=40",
        //     content:
        //         "I've discovered so many amazing events through Ticketsdock. The booking process is seamless and I love the reminder features!",
        //     rating: 3,
        // },
    ]

    return (
        <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 flex flex-col items-center">
                    <Badge title='Testimonials' />
                    <h2 className="text-3xl font-semibold mb-4">What Our Users Say</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Join thousands of satisfied users who have transformed their event experience with Ticketsdeck Events.
                    </p>
                </div>

                <Testimonials
                    testimonials={testimonials}
                    // autoScrollInterval={5000}
                />

                {/* <Carousel className="w-full">
                    <CarouselContent>
                        {testimonials.map((testimonial) => (
                            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                                <Card className="bg-gray-900/50 border-gray-800 h-full">
                                    <CardHeader>
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold">{testimonial.name}</h4>
                                                <p className="text-sm text-gray-400">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-gray-300">"{testimonial.content}"</p>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-center mt-6">
                        <CarouselPrevious className="relative static translate-y-0 mr-2" />
                        <CarouselNext className="relative static translate-y-0" />
                    </div>
                </Carousel> */}
            </div>
        </section>
    )
}