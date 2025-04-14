"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Icons } from "../components/ui/icons";
import Badge from "../components/ui/badge";
import Button from "../components/ui/button";
import { DreamyBackground, WavyBackground } from "./3d-background";
import { ApplicationRoutes } from "../constants/applicationRoutes";
import { ContactSalesModal } from "../components/Modal/PricingPage/ContactSales";
import { ScheduleDemoModal } from "../components/Modal/PricingPage/ScheduleDemo";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const featureItem = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

// Decorative shapes component
const DecorativeShapes = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="shape-circle bg-primary-color/5 w-64 h-64 absolute -top-20 -left-20"></div>
      <div className="shape-blob bg-primary-color/5 w-96 h-96 absolute -bottom-40 -right-20"></div>
      <div className="shape-diamond bg-primary-color/5 w-48 h-48 absolute top-1/3 -right-10"></div>
      <div className="shape-dots absolute top-1/4 left-1/4 w-full h-full opacity-30"></div>
    </div>
  );
};

// FAQ Component
const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-4 border-b border-primary-color-sub/20">
      <button
        className="flex w-full justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{question}</h3>
        {isOpen ? (
          <Icons.ChevronUp className="h-5 w-5 text-primary-color" />
        ) : (
          <Icons.ChevronDown className="h-5 w-5 text-primary-color" />
        )}
      </button>
      <motion.div
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        variants={{
          visible: { height: "auto", opacity: 1, marginTop: "1rem" },
          hidden: { height: 0, opacity: 0, marginTop: 0 },
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="text-text-grey">{answer}</p>
      </motion.div>
    </div>
  );
};

// Feature Category Component
const FeatureCategory = ({
  title,
  features,
}: {
  title: string;
  features: string[];
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-background shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="absolute top-0 left-0 w-full h-1 purple-gradient"></div>
      <div className="p-6 relative z-10">
        <div className="absolute top-0 right-0 w-24 h-24 shape-circle bg-primary-color-sub-50 -mr-8 -mt-8 opacity-50"></div>
        <h3 className="text-xl font-semibold mb-4 text-primary-color">
          {title}
        </h3>
        <motion.ul
          className="space-y-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-start"
              variants={featureItem}
            >
              <Icons.Check className="h-5 w-5 text-primary-color mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
};

export default function PricingPage() {
  const [isContactSalesModalOpen, setIsContactSalesModalOpen] = useState(false);
  const [isScheduleDemoModalOpen, setIsScheduleDemoModalOpen] = useState(false);

  const fee = 5;

  return (
    <div className="min-h-screen bg-dark-grey">
      <ContactSalesModal
        modalVisibility={isContactSalesModalOpen}
        setModalVisibility={setIsContactSalesModalOpen}
      />
      <ScheduleDemoModal
        modalVisibility={isScheduleDemoModalOpen}
        setModalVisibility={setIsScheduleDemoModalOpen}
      />

      {/* Hero Section */}
      <section className="sectionPadding !py-16 md:!py-24 relative overflow-hidden">
        <WavyBackground />
        <div className="absolute inset-0 shape-grid opacity-30"></div>
        <div className="container relative z-10 mx-auto">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Badge
              title="Simple Pricing"
              className="mb-4 !bg-primary-color-sub-50 !text-primary-color !border-primary-color-sub !hover:bg-primary-color-sub/20"
            />
            <h1 className="text-4xl md:text-5xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-color to-primary-color-sub">
              Transparent pricing for event organizers
            </h1>
            <p className="text-base md:text-xl text-white/80 mb-8">
              No hidden fees, no surprises. Just a simple pricing model to help
              you focus on creating amazing events.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                href={ApplicationRoutes.CreateEvent}
                className="tertiaryButton !w-full md:!w-fit justify-center"
              >
                Get Started for Free
              </Link>
              <Button
                onClick={() => setIsContactSalesModalOpen(true)}
                className="tertiaryButton !w-full md:!w-fit justify-center"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="sectionPadding !py-12 relative overflow-hidden">
        <div className="container relative z-10 mx-auto">
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="rounded-2xl purple-gradient-light purple-glow p-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 shape-blob bg-primary-color/10 -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 shape-circle bg-primary-color/10 -ml-20 -mb-20"></div>

              <div className="bg-background rounded-xl p-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-semibold mb-2 text-primary-color">
                      Simple, transparent pricing
                    </h2>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Icons.Check className="h-5 w-5 text-primary-color mr-2" />
                        <span>Sign up for free</span>
                      </li>
                      <li className="flex items-center">
                        <Icons.Check className="h-5 w-5 text-primary-color mr-2" />
                        <span>No charge for hosting free events</span>
                      </li>
                      <li className="flex items-center">
                        <Icons.Check className="h-5 w-5 text-primary-color mr-2" />
                        <span>Only {fee}% fee per paid ticket</span>
                      </li>
                      <li className="flex items-center">
                        <Icons.Check className="h-5 w-5 text-primary-color mr-2" />
                        <span>Option to pass fees to attendees</span>
                      </li>
                    </ul>
                  </div>
                  <div className="purple-gradient text-white p-6 rounded-lg text-center w-full md:w-auto shadow-lg">
                    <div className="text-sm uppercase font-semibold mb-1">
                      Current Fee
                    </div>
                    <div className="text-5xl font-bold">{fee}%</div>
                    <div className="text-sm mt-1 opacity-90">
                      per paid ticket
                    </div>
                    <Link
                      href={ApplicationRoutes.CreateEvent}
                      className="mt-4 tertiaryButton !mx-auto"
                    >
                      Create an Event
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="sectionPadding !py-16 relative">
        <div className="container relative z-10 mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-semibold mb-4 text-primary-color-sub">
              Everything you need to run successful events
            </h2>
            <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto">
              Ticketsdeck Events provides all the tools you need to create,
              manage, and grow your events.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCategory
              title="Event Types"
              features={[
                "Unlimited free events",
                "Unlimited paid events",
                "Unlimited private (invite only) events",
                "Virtual / Online Events",
                "Recurring events",
                "1:1 events",
                "Multi-day conferences",
                "Workshops and classes",
              ]}
            />

            <FeatureCategory
              title="Selling Tickets"
              features={[
                "No fee on free tickets",
                `${fee}% fee per paid ticket`,
                "Organizer can pay fee or pass to attendees",
                "Ability to manage ticket sales & inventory",
                "Multiple ticket types",
                "Early bird pricing",
                "Group discounts",
                "Reserved seating options",
              ]}
            />

            <FeatureCategory
              title="Tracking And Management"
              features={[
                "Unlimited Discount Codes",
                "Detailed Export Of All Data",
                "Sales Summary Dashboard",
                "Attendee Check In",
                "Check in analytics",
                "Real-time sales reporting",
                "Custom attendee fields",
                "Waitlist management",
              ]}
            />

            <FeatureCategory
              title="Promotion And Growth"
              features={[
                "Social Sharing Tools",
                "Emails To Attendees",
                "Automated Event Reminders",
                "Search Engine Optimisation",
                "Public Listing On Ticketsdeck Events",
                "Custom event landing pages",
                "Affiliate marketing tools",
                "Email marketing integration",
              ]}
            />

            <FeatureCategory
              title="Support And Security"
              features={[
                "Email And Chat Support",
                "Card Payments",
                "Bank Transfer Payments",
                "Mobile money payments",
                "USSD Payments",
                "Secure Payment Processing",
                "PCI-DSS 3.2 Level 1 Compliance",
                "24/7 security monitoring",
              ]}
            />

            <FeatureCategory
              title="Advanced Features"
              features={[
                "Custom branding options",
                // "API access for developers",
                "Integration with marketing tools",
                "Custom reports and analytics",
                // "Multi-user access controls",
                "Bulk ticket management",
                // "Customizable email templates",
                // "Event app integration",
              ]}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="sectionPadding !py-16 relative overflow-hidden">
        <div className="absolute inset-0 shape-grid opacity-30"></div>
        <div className="container relative z-10 mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4 text-primary-color-sub">
              Frequently Asked Questions
            </h2>
            <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto">
              Got questions? We've got answers.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto bg-background rounded-xl p-8 shadow-md">
            <FAQItem
              question={`How does the ${fee}% fee work?`}
              answer={`Our fee is ${fee}% of the ticket price for each paid ticket sold. There are no fees for free tickets or events.`}
            />
            <FAQItem
              question="Can I pass the fees to attendees?"
              answer="Yes, you have the option to either absorb the fees yourself or pass them on to your attendees. This can be configured in your event settings."
            />
            <FAQItem
              question="Are there any hidden fees?"
              answer={`No, we believe in complete transparency. The only fee is the ${fee}% per paid ticket. There are no setup fees, monthly fees, or other hidden charges.`}
            />
            <FAQItem
              question="How do payouts work?"
              answer="Payouts are processed within 24 hours after your request, ensuring you receive your funds quickly and securely."
            />
            <FAQItem
              question="What payment methods do you support?"
              answer="We integrate with Paystack, which supports credit/debit cards, bank transfers, mobile money payments, and USSD payments, making it easy for your attendees to purchase tickets."
            />
            <FAQItem
              question="Is there a limit to how many events I can create?"
              answer="No, you can create unlimited events on our platform, whether they're free, paid, or private."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="sectionPadding !py-16 relative overflow-hidden">
        <DreamyBackground />
        <div className="absolute inset-0">
          <div className="absolute inset-0 purple-gradient opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 shape-blob bg-primary-color/10 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 shape-circle bg-primary-color/10 -ml-20 -mb-20"></div>
        </div>
        <div className="container relative z-10 mx-auto">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-color-sub">
              Ready to create your first event?
            </h2>
            <p className="text-base md:text-xl text-white/70 mb-8">
              Join thousands of event organizers who trust Ticketsdeck Events to
              power their events.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                href={ApplicationRoutes.SignUp}
                className="tertiaryButton !w-full md:!w-fit justify-center !purple-gradient hover:opacity-90 transition-opacity"
              >
                Sign Up for Free
              </Link>
              <button
                onClick={() => setIsScheduleDemoModalOpen(true)}
                className="tertiaryButton !w-full md:!w-fit justify-center"
              >
                Schedule a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
