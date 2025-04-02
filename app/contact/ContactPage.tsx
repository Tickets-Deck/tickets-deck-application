"use client";
import { ReactElement, FunctionComponent, useState } from "react";
import images from "@/public/images";
import Link from "next/link";
import PageHeroSection from "../components/shared/PageHeroSection";
import { Icons } from "../components/ui/icons";
import { CustomerEnquiry } from "../models/ICustomerEnquiries";
import ComponentLoader from "../components/Loader/ComponentLoader";
import { useCreateCustomerEnquiry } from "../api/apiClient";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useToast } from "../context/ToastCardContext";

interface ContactPageProps { }

const ContactPage: FunctionComponent<ContactPageProps> = (): ReactElement => {
    const toastHandler = useToast();
    const appTheme = useSelector((state: RootState) => state.theme.appTheme);

    const createCustomerEnquiry = useCreateCustomerEnquiry();

    const [formValues, setFormValues] = useState<CustomerEnquiry>();
    const [isCreatingEnquiry, setIsCreatingEnquiry] = useState(false);

    function onFormValueChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        // Desctructure the name and value from the event target
        const { name, value } = e.target;

        setFormValues({ ...(formValues as CustomerEnquiry), [name]: value });
    }

    async function handeCreateEnquiry(
        e:
            | React.FormEvent<HTMLFormElement>
            | React.KeyboardEvent<HTMLTextAreaElement>
    ) {
        // Prevent the default form submission
        e.preventDefault();

        // If all fields are not filled, show error
        if (
            !formValues?.name ||
            !formValues?.email ||
            !formValues?.subject ||
            !formValues?.message
        ) {
            toastHandler.logError(
                "Fill all fields",
                "Please fill all fields, and try again."
            );
            return;
        }

        // Start loader
        setIsCreatingEnquiry(true);

        // Call the function to create customer enquiry
        await createCustomerEnquiry(formValues as CustomerEnquiry)
            .then((response) => {
                console.log("🚀 ~ .then ~ response:", response);

                // Clear form values
                setFormValues(undefined);

                // Show success message
                toastHandler.logSuccess(
                    "Success",
                    "Your message has been sent successfully. We will get back to you soon."
                );
            })
            .catch((error) => {
                console.log("🚀 ~ handeCreateEnquiry ~ error:", error);

                // Show error message
                toastHandler.logError(
                    "Error",
                    "An error occurred while sending your message. Please try again later."
                );
            })
            .finally(() => {
                // Stop loader
                setIsCreatingEnquiry(false);
            });
    }

    return (
        <main>
            <PageHeroSection
                imageUrl={images.about_hero}
                title='Contact Us'
                description="Have a question or need assistance? We're here to help!"
            />
            <section
                className={
                    "sectionPadding py-8 md:!py-16 flex flex-col md:flex-row items-center justify-between bg-dark-grey-2 text-white"
                }
            >
                <div className='flex flex-col mb-20 w-full md:w-[45%]'>
                    <p className='mb-6 leading-[1.875rem] font-light text-[0.875rem]'>
                        Do you have any inquiries, requests, or complaints? Feel free to
                        contact us immediately, and we will respond to you as soon as
                        possible. Your satisfaction is our priority, and we are here to
                        assist you with any concerns you may have.
                    </p>
                    <div className='flex flex-col gap-[0.85rem]'>
                        <Link
                            className='flex items-center gap-[0.35rem] text-[0.75rem] text-white opacity-70 hover:opacity-100 hover:text-primary-color-sub no-underline w-fit'
                            href='mailto:ticketsdeckevents@gmail.com'
                        >
                            <Icons.Mail />
                            ticketsdeckevents@gmail.com
                        </Link>
                        <Link
                            className='flex items-center gap-[0.35rem] text-[0.75rem] text-white opacity-70 hover:opacity-100 hover:text-primary-color-sub no-underline w-fit'
                            href='tel:8065926316'
                        >
                            <Icons.Phone />
                            (234) 806 592 6316
                        </Link>
                        <Link
                            className='flex items-center gap-[0.35rem] text-[0.75rem] text-white opacity-70 hover:opacity-100 hover:text-primary-color-sub no-underline w-fit'
                            href='tel:9057977870'
                        >
                            <Icons.Phone />
                            (234) 905 797 7870
                        </Link>
                        <Link
                            className='flex items-center gap-[0.35rem] text-[0.75rem] text-white opacity-70 hover:opacity-100 hover:text-primary-color-sub no-underline w-fit'
                            href={
                                "https://www.google.com/maps/search/?api=1&query=Lagos,+Nigeria"
                            }
                        >
                            <Icons.Location />
                            Lagos, Nigeria
                        </Link>
                    </div>
                </div>
                <form
                    onSubmit={handeCreateEnquiry}
                    className='p-6 mb-8 bg-container-grey w-full md:w-[45%] rounded-3xl tablet:w-full'
                >
                    <h3 className='text-white text-[1.25rem] font-normal mb-4'>
                        Send a message
                    </h3>
                    <input
                        type='text'
                        name='name'
                        placeholder='Full name'
                        className='w-full outline-none border-none bg-white/10 text-white text-[1rem] mb-2 p-3 rounded-lg'
                        value={formValues?.name ?? ""}
                        onChange={(e) => onFormValueChange(e)}
                    />
                    <input
                        type='text'
                        name='email'
                        placeholder='Email'
                        className='w-full outline-none border-none bg-white/10 text-white text-[1rem] mb-2 p-3 rounded-lg'
                        value={formValues?.email ?? ""}
                        onChange={(e) => onFormValueChange(e)}
                    />
                    <input
                        type='text'
                        name='subject'
                        placeholder='Title of message'
                        className='w-full outline-none border-none bg-white/10 text-white text-[1rem] mb-2 p-3 rounded-lg'
                        value={formValues?.subject ?? ""}
                        onChange={(e) => onFormValueChange(e)}
                    />
                    <textarea
                        name='message'
                        placeholder='Message'
                        className='w-full outline-none border-none bg-white/10 text-white text-[1rem] mb-2 p-3 rounded-lg resize-none h-[120px] leading-5'
                        value={formValues?.message ?? ""}
                        onChange={(e) => onFormValueChange(e)}
                        onKeyDown={(e) => {
                            // If shift+enter key is pressed, trigger submission
                            if (e.key === "Enter" && e.shiftKey) {
                                handeCreateEnquiry(e);
                            }
                        }}
                    />
                    <button
                        className='tertiaryButton mt-4 !w-full flex justify-center text-base'
                        type='submit'
                    >
                        Send
                        {isCreatingEnquiry && (
                            <ComponentLoader
                                isSmallLoader
                                customBackground='#ffffff'
                                customLoaderColor='#111111'
                            />
                        )}
                    </button>
                </form>
            </section>
        </main>
    );
};

export default ContactPage;
