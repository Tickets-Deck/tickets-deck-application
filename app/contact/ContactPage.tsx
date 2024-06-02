"use client"
import { ReactElement, FunctionComponent, useState } from "react";
import styles from "@/app/styles/Contact.module.scss";
import images from "@/public/images";
import Link from "next/link";
import PageHeroSection from "../components/shared/PageHeroSection";
import { LocationIcon, MailIcon, PhoneIcon } from "../components/SVGs/SVGicons";
import { CustomerEnquiry } from "../models/ICustomerEnquiries";
import ComponentLoader from "../components/Loader/ComponentLoader";
import { useCreateCustomerEnquiry } from "../api/apiClient";
import { toast } from "sonner"

interface ContactPageProps {

}

const ContactPage: FunctionComponent<ContactPageProps> = (): ReactElement => {

    const createCustomerEnquiry = useCreateCustomerEnquiry();

    const [formValues, setFormValues] = useState<CustomerEnquiry>();
    const [isCreatingEnquiry, setIsCreatingEnquiry] = useState(false);

    function onFormValueChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        // Desctructure the name and value from the event target
        const { name, value } = e.target;

        setFormValues({ ...formValues as CustomerEnquiry, [name]: value });
    };

    async function handeCreateEnquiry(e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLTextAreaElement>) {
        // Prevent the default form submission
        e.preventDefault();

        // If all fields are not filled, show error
        if (!formValues?.name || !formValues?.email || !formValues?.subject || !formValues?.message) {
            toast.error("Please fill all fields, and try again.")
        }

        // Start loader
        setIsCreatingEnquiry(true);

        // Call the function to create customer enquiry
        await createCustomerEnquiry(formValues as CustomerEnquiry)
            .then((response) => {
                console.log(response);

                // Clear form values
                setFormValues(undefined);

                // Show success message
                toast.success("Your message has been sent successfully. We will get back to you soon.");
            })
            .catch((error) => {
                console.log(error);

                // Show error message
                toast.error("An error occurred while sending your message. Please try again later.");
            })
            .finally(() => {
                // Stop loader
                setIsCreatingEnquiry(false);
            });
    }

    return (
        <main className={styles.main}>
            <PageHeroSection
                imageUrl={images.about_hero}
                title="Contact Us"
                description="Have a question or need assistance? We're here to help!"
            />
            <section className={styles.contactSection}>
                <div className={styles.lhs}>
                    <p>
                        Do you have any inquiries, requests, or complaints? Feel free to
                        contact us immediately, and we will respond to you as soon as
                        possible. Your satisfaction is our priority, and we are here to
                        assist you with any concerns you may have.
                    </p>
                    <div className={styles.links}>
                        <Link href="mailto:contact@company.com"><MailIcon />contact@company.com</Link>
                        <Link href="tel:8065926316"><PhoneIcon />(234) 806 592 6316</Link>
                        <Link href={"https://www.google.com/maps/search/?api=1&query=Lagos,+Nigeria"}><LocationIcon />Lagos, Nigeria</Link>
                    </div>
                </div>
                <form onSubmit={handeCreateEnquiry}>
                    <h3>Send a message</h3>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        value={formValues?.name ?? ""}
                        onChange={(e) => onFormValueChange(e)}
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formValues?.email ?? ""}
                        onChange={(e) => onFormValueChange(e)}
                    />
                    <input
                        type="text"
                        name="subject"
                        placeholder="Title of message"
                        value={formValues?.subject ?? ""}
                        onChange={(e) => onFormValueChange(e)}
                    />
                    <textarea
                        name="message"
                        placeholder="Message"
                        value={formValues?.message ?? ""}
                        onChange={(e) => onFormValueChange(e)}
                        onKeyDown={(e) => {
                            // If shift+enter key is pressed, trigger submission
                            if (e.key === "Enter" && e.shiftKey) {
                                handeCreateEnquiry(e);
                            }
                        }}
                    />
                    <button type="submit">
                        Send
                        {isCreatingEnquiry && <ComponentLoader isSmallLoader customBackground="#ffffff" customLoaderColor="#111111" />}
                    </button>
                </form>
            </section>
        </main>
    );
}

export default ContactPage;