"use client"
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Menu, X } from 'lucide-react';
import * as RadixNavigationMenu from '@radix-ui/react-navigation-menu';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Data for industries
const industries = [
  {
    title: 'Events',
    icon: '/icons/events.svg',
    description: 'Seamless event ticketing solutions',
    benefits: ['Fast booking', 'Real-time updates', 'Secure payments'],
    color: 'from-purple-600 to-pink-500',
    link: 'https://events.ticketsdeck.com',
  },
  {
    title: 'Flights',
    icon: '/icons/flights.svg',
    description: 'Global flight booking platform',
    benefits: ['Best prices', 'Flexible dates', 'Instant confirmation'],
    color: 'from-blue-600 to-cyan-500',
    link: 'https://flights.ticketsdeck.com',
  },
  {
    title: 'Homes',
    icon: '/icons/homes.svg',
    description: 'Vacation rental ticketing',
    benefits: ['Verified listings', 'Easy booking', '24/7 support'],
    color: 'from-green-600 to-emerald-500',
    link: 'https://homes.ticketsdeck.com',
  },
  {
    title: 'Sports',
    icon: '/icons/sports.svg',
    description: 'Sports event ticketing',
    benefits: ['Prime seats', 'Group discounts', 'Live updates'],
    color: 'from-orange-600 to-red-500',
    link: 'https://sports.ticketsdeck.com',
  },
];

// Data for testimonials
const testimonials = [
  {
    quote: 'Ticketsdeck made event planning a breeze!',
    author: 'Jane Doe',
    role: 'Event Organizer',
    company: 'EventPro',
    rating: 5,
  },
  {
    quote: 'Best flight booking experience ever!',
    author: 'John Smith',
    role: 'Frequent Traveler',
    company: 'TravelCo',
    rating: 4,
  },
];

// Data for client logos
const clientLogos = [
  '/logos/client1.png',
  '/logos/client2.png',
  '/logos/client3.png',
  '/logos/client4.png',
];

// Main component
export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-cream-100 font-mona">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center">
          <div className="text-2xl font-bold">Ticketsdeck</div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#industries" className="text-gray-600 hover:text-purple-600">Industries</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-purple-600">How It Works</Link>
            <Link href="#features" className="text-gray-600 hover:text-purple-600">Features</Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-purple-600">Testimonials</Link>
          </nav>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="md:hidden bg-white"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link href="#industries" className="text-gray-600 hover:text-purple-600">Industries</Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-purple-600">How It Works</Link>
              <Link href="#features" className="text-gray-600 hover:text-purple-600">Features</Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-purple-600">Testimonials</Link>
            </div>
          </motion.nav>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-cream-200">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Your All-in-One Ticketing Solution
          </motion.h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            Discover seamless ticketing for Events, Flights, Homes, and Sports
          </p>
          <RadixNavigationMenu.Root>
            <RadixNavigationMenu.List className="flex justify-center">
              <RadixNavigationMenu.Item>
                <RadixNavigationMenu.Trigger className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-100">
                  Explore Your Industry
                </RadixNavigationMenu.Trigger>
                <RadixNavigationMenu.Content className="bg-white rounded-md shadow-lg p-4 mt-2">
                  {industries.map((industry) => (
                    <Link key={industry.title} href={industry.link} className="block p-2 hover:bg-gray-100">
                      {industry.title}
                    </Link>
                  ))}
                </RadixNavigationMenu.Content>
              </RadixNavigationMenu.Item>
            </RadixNavigationMenu.List>
          </RadixNavigationMenu.Root>
        </div>
      </section>

      {/* Industry Tiles */}
      <section id="industries" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Our Industries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry) => (
              <motion.div
                key={industry.title}
                className="relative group bg-white rounded-lg shadow-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <div className={`p-6 bg-gradient-to-r ${industry.color}`}>
                  <Image src={industry.icon} alt={industry.title} width={48} height={48} />
                  <h3 className="text-2xl font-semibold text-white mt-4">{industry.title}</h3>
                  <p className="text-white/80">{industry.description}</p>
                </div>
                <motion.div
                  className="absolute inset-0 bg-white p-6 flex flex-col justify-center"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <h4 className="text-xl font-semibold mb-4">Benefits</h4>
                  <ul className="list-disc pl-5">
                    {industry.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                  <Link
                    href={industry.link}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-full inline-flex items-center"
                  >
                    Go to {industry.title} <ArrowRight className="ml-2" size={16} />
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {['Choose Industry', 'Book Tickets', 'Enjoy Experience'].map((step, index) => (
              <motion.div
                key={step}
                className="flex-1 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold">{step}</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Trusted By</h2>
          <div className="overflow-hidden">
            <motion.div
              className="flex space-x-8"
              animate={{ x: ['0%', '-100%'] }}
              transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            >
              {[...clientLogos, ...clientLogos].map((logo, index) => (
                <Image key={index} src={logo} alt="Client Logo" width={100} height={50} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Snapshot */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {['Secure Payments', '24/7 Support', 'Fast Booking', 'Global Access'].map((feature) => (
              <motion.div
                key={feature}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star size={24} />
                </div>
                <h3 className="text-xl font-semibold">{feature}</h3>
                <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">What Our Customers Say</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-center"
            >
              <div className="flex justify-center mb-4">
                {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                  <Star key={i} className="text-yellow-400" size={20} />
                ))}
              </div>
              <p className="text-lg italic mb-4">"{testimonials[currentTestimonial].quote}"</p>
              <p className="font-semibold">{testimonials[currentTestimonial].author}</p>
              <p className="text-gray-600">{testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}</p>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full mx-1 ${index === currentTestimonial ? 'bg-purple-600' : 'bg-gray-300'}`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Ticketsdeck</h3>
              <p>Your all-in-one ticketing solution for Events, Flights, Homes, and Sports.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Industries</h3>
              {industries.map((industry) => (
                <Link key={industry.title} href={industry.link} className="block py-1 hover:text-purple-300">
                  {industry.title}
                </Link>
              ))}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Resources</h3>
              <Link href="/about" className="block py-1 hover:text-purple-300">About</Link>
              <Link href="/support" className="block py-1 hover:text-purple-300">Support</Link>
              <Link href="/blog" className="block py-1 hover:text-purple-300">Blog</Link>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 p-2 rounded-l-md text-gray-800"
                />
                <button className="bg-purple-600 p-2 rounded-r-md">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p>&copy; 2025 Ticketsdeck Solutions Limited. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}