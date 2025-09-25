import Link from "next/link";
import { FunctionComponent, ReactElement } from "react";
import { ApplicationRoutes } from "../../constants/applicationRoutes";

interface PrivacyPolicyPageProps {

}

const PrivacyPolicyPage: FunctionComponent<PrivacyPolicyPageProps> = (): ReactElement => {
    return (
        <main className="px-5 md:px-40 py-8 min-h-screen bg-container-grey">
            <div className="mb-3 text-white">
                <h2 className="text-2xl font-medium mb-3">Privacy Policy</h2>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        Introduction
                    </span>
                    <p className="text-sm leading-6 mb-1">
                        Ticketsdeck Solutions LTD (“Ticketsdeck”, “Company”, “we”,”us”,”our”)
                        is a ticketing service company that offers online and offline ticketing
                        solutions to enable easy and great experiences business growth and productivity.
                    </p>
                    <p className="text-sm leading-6 mb-1">
                        The privacy of our users is important to us, and we are assure you of our
                        unflinching commitment to protecting and safeguarding it. Hence, this Privacy
                        Policy explains your personal information/ data which we collect, how we collect it,
                        why we collect it, and what we do with it, and how we protect it
                        (as regulated by the NDPA), when you use our Service. This policy applies to our website,
                        mobile application, payment platforms(“Platforms”), API, Software Applications (“Apps”),
                        Point of Sale (PoS) Terminals, tools, and services (collectively known as “Our Services”).
                    </p>
                    <p className="text-sm leading-6 mb-1">
                        This Policy does not apply to services not provided, owned or controlled directly by
                        Ticketsdeck i.e. services provided by Ticketsdeck’s merchants or services owned or controlled
                        by third-party websites. Note that, on some occasion, Ticketsdeck would generally process
                        personal data on behalf of Merchants. When we do, we do so as a service provider or a
                        “Data Processor” to those Merchants, but we do not control and are not responsible for
                        the privacy practices of those Merchants.
                    </p>
                    <p className="text-sm leading-6 mb-1">
                        By using the Service, or submitting information through our Platforms, you agree and expressly
                        consent to the collection, use, processing, storage, transfer and disclosure of your personal
                        data/ information in accordance with this Privacy Policy, Acceptable Use Policy and Terms of Use.
                        If you do not consent or agree with our privacy policy, please do not use our site, platform, or
                        services.
                    </p>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        1. Interpretation and Definitions
                    </span>
                    <p className="text-sm leading-6 mb-2">
                        1.1 Interpretation:
                        The words of which the initial letter is capitalized have meanings defined under
                        the following conditions. The following definitions shall have the same meaning
                        regardless of whether they appear in singular or in plural.
                    </p>
                    <div className="mb-2">
                        <span className="font-Mona-Sans-Wide text-primary-color-sub">
                            Definitions
                        </span>
                        <p className="text-sm leading-6">
                            For the purpose of this Privacy Policy:
                            “Account” means a unique account created for you to access our Service or parts of our Service “Ticketsdeck Account”; <br />
                            “Affiliate” means an entity that controls, is controlled by or is under common control with a party; where “control” means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority;<br />
                            “Cookies” are small files that are placed on your computer, mobile device or any other device by a website, which saves details of your browsing history on that website for ease of use and full functionality of the website;<br />
                            “Country” refers to Nigeria;<br />
                            “Device” means any device that can access the Service such as a computer, a mobile phone, a digital tablet, etc;<br />
                            “NDPA” means Nigerian Data Protection Act 2023;<br />
                            “Personal Data” is any information that is associated or relates to a specific individual and can be used to identify that person. It means any information relating to an identified or identifiable natural person (‘Data Subject’); an identifiable natural person is one who can be identified, directly or indirectly, in particular by reference to an identifier such as a name, an identification number, location data, an online identifier or to one or more factors specific to the physical, physiological, genetic, mental, economic, cultural or social identity of that natural person; It can be anything from a name, address, a photo, an email address, bank details, posts on social networking websites, medical information, and other unique identifier such as but not limited to MAC address, IP address, IMEI number, IMSI number, SIM, Personal Identifiable Information (PII) and others;<br />
                            “Personal Data Breach” means a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, Personal Data transmitted, stored or otherwise processed;<br />
                            “Processing” means any operation or set of operations which is performed on Personal Data or on sets of Personal Data, whether or not by automated means, such as collection, recording, organisation, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or combination, restriction, erasure or destruction;<br />
                            “Service” refers to the Website, mobile applications, software applications (“Apps”) and/ or
                            payment platforms offered by Ticketsdeck, and all activities as it relates thereto;<br />
                            “Sites” means any Ticketsdeck’s platform including but not limited to mobile applications, websites, and social media platforms<br />
                            “Service Provider” means any natural or legal person who processes the data on behalf of Ticketsdeck. It refers to third-party companies or individuals employed by Ticketsdeck to facilitate or provide the Service on its behalf, to perform services related to the Service or to assist Ticketsdeck in analysing how the Service is used;<br />
                            “Sensitive Personal Data” means data relating to religious or other beliefs, sexual orientation, health, race, ethnicity, political views, trades union membership, criminal records or any other sensitive personal information;<br />
                            “Third-party Social Media Service” refers to any website or any social network website through which a User can log in or create an Account to use the Service;<br />
                            “Ticketsdeck Platforms” refer to Ticketsdeck’s website, mobile application, and other digital/ electronic device(s);<br />
                            “Usage Data” refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself;<br />
                            “We”, “Us” or “Our” in this Policy refers to Ticketsdeck;<br />
                            “Website” refers to Ticketsdeck’s website accessible from <Link className="text-primary-color-sub" href={ApplicationRoutes.Home}>https://events@ticketsdeck.com</Link>; and<br />
                            “You” means the individual accessing or using our Service, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.<br />
                        </p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        2. Scope and Consent
                    </span>
                    <p className="text-sm leading-6 mb-2">
                        2.1. By signing up for the use of any of our services or accessing any of our platform, its content, features, technologies, functions, you hereby consent to this Privacy Policy. You reserve the right to exercise your data protection rights as listed under the NDPA.
                        2.2. This Privacy Policy governs the use of Ticketsdeck’s Services by registered and non- registered users, unless otherwise agreed through written contract.
                    </p>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        3. Types of Data Collected and how we collect same
                    </span>
                    <div>
                        <p className="text-sm leading-6 mb-2">
                            3.1. Personal Data: Your data is collected electronically and manually when you visit any of our Platforms and register to use any of our services. The types of personal data collected include but not limited to:
                        </p>
                        <ul className="text-sm leading-6 list-item pl-1 mb-2">
                            <li>a. Information Provided during sign-up or on-boarding: To access and use the service, you must create a Ticketsdeck account by entering your first name, last name, date of birth, business email, business name, type of business, business/ company information, Directors’ KYC information, your phone number and other information that assists in providing you with access to and use of the service. This data is necessary for us to verify your identity, determine your eligibility to use and give you access to the service.</li>
                            <li>b. Payment Information: To facilitate processing payments and/or refunds, you need to provide a payment method and information such as your name, entity name, billing address, residential address, credit card or banking information, account information, Bank Verification Number (BVN) date, time and amount of transaction, and such other applicable information as requested by our third-party payment service or regulatory body.</li>
                            <li>c. Information collected with cookies: We use cookies on certain pages of our Service to allow us analyse Service usage, in order to improve our content and product offerings, to improve our marketing and promotional efforts, and to customize our Service’s content, layout and services. See Clause 11 below.</li>
                            <li>d. Correspondence: If you correspond with us via email, phone, text, or another method, we may gather the information that you submit in a file specific to you. This can also be used for quality assurance purposes.</li>
                        </ul>
                        <p className="text-sm leading-6 mb-2">
                            3.2. Usage Data
                        </p>
                        <ul className="text-sm leading-6 list-item pl-1 mb-2">
                            <li>a. When you access Ticketsdeck services, our servers automatically record some technical information that your browser sends whenever you visit a website, links you have clicked on, length of visit on certain pages, unique device identifier, log- in information, location and other device details.</li>
                            <li>b. When you access the Service by or through a mobile device, we may automatically collect information that your browser sends.</li>
                            <li>c. We also automatically record all information about your interactions with our website/ services. This helps us in improving our services. This information includes records of your transactions and information about your other activities related to our services, such as date and time of your sessions, the pages you view, links to/from any page, time spent in a session, etc.</li>
                            <li>d. We may also use information provided by third parties like social media sites, financial institutions, open government databases, and verification agencies. We may also infer additional personal data. Information about you which are provided by you or any person to other websites or platforms are not controlled by Ticketsdeck, and we are therefore not liable for how they use it.</li>
                        </ul>
                        <p className="text-sm leading-6 mb-2">
                            3.3. As a principle, we do not collect any sensitive personal data. In the event we collect same, we will ensure strict compliance with data protection and privacy laws.
                        </p>
                        <p className="text-sm leading-6 mb-2">
                            3.4. This Privacy Policy applies to Ticketsdeck services only. We do not exercise control over the sites displayed or linked from within our various services. These other sites may place their own cookies, plug-ins or other files on your computer, collect data or solicit personal data from you. Ticketsdeck does not control these third-party websites and we are not responsible for their privacy statements. Please consult such third parties’ privacy statements.
                        </p>
                        <p className="text-sm leading-6 mb-2">
                            3.5. You reserve the right to decline provision of any personal data or restrict access to such data. However, if you choose not to provide necessary personal data or restrict access to such data, our services or features may not be fully available or functional.
                        </p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        4. Use of Your Personal Data
                    </span>
                    <div>
                        <p className="text-sm leading-6 mb-2">
                            4.1. We may use your Personal Data for the following purposes:
                        </p>
                        <ul className="text-sm leading-6 list-item pl-1 mb-2">
                            <li>a. Providing you holistic and agreed services; create and manage any accounts you may have with us, verify your identity, provide our services, troubleshoot problems, and respond to your enquiries;</li>
                            <li>b. Process your payment transactions (including authorization, clearing, chargebacks and other related dispute resolution activities);</li>
                            <li>c. To monitor your usage of our services; and maintain our Service with a secure, smooth, efficient, and customized experience customer support;</li>
                            <li>d. To manage your Account, manage risk, detect, prevent, and/or remediate fraud, unauthorized transactions, violations of policies or other potentially prohibited or illegal activities;</li>
                            <li>e. To manage and protect our information technology infrastructure from cyber-attacks and other forms of hacker activities;</li>
                            <li>f. To perform creditworthiness and solvency checks;</li>
                            <li>g. To carry our Know Your Customer (KYC), compliance and risk assessments on your Account as required by applicable laws and regulations including but not limited to Anti-Money Laundering, Anti-Corruption, Anti-Terrorism Financing or as requested by any judicial process, law enforcement or governmental authorities having or claiming jurisdiction over Ticketsdeck or Ticketsdeck’s affiliates;</li>
                            <li>h. Carry out due diligence and verify information provided with third parties;</li>
                            <li>i. To contact you via email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application’s push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
                            <li>j. Evaluate your interest in employment and contact you regarding possible employment with Ticketsdeck;</li>
                            <li>k. Use data analytics to improve our website, products or services, and user experiences; and</li>
                            <li>l. Notify you of new products, new functionalities, services and/or offerings; or any enhancements/amendments to existing products services and/or offerings. You have the right to contact us via <Link className="text-primary-color-sub" href="mailto:ticketsdeckevents@gmail.com">ticketsdeckevents@gmail.com</Link>; to be unsubscribed from our mailing lists at any time.</li>
                        </ul>
                        <p className="text-sm leading-6 mb-2">
                            4.2. If we intend to process your personal information for any purpose other than those listed in this policy, we will seek your consent before the further processing commences.
                        </p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        5. Retention of Your Personal Data
                    </span>
                    <div>
                        <p className="text-sm leading-6 mb-2">
                            5.1. We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy and in accordance with the provision of applicable data protection laws. We will retain and use your Personal Data to the extent necessary to perform our Services, comply with legal obligations, resolve disputes, and enforce our legal agreements and policies. This also applies to deactivated accounts.
                        </p>
                        <p className="text-sm leading-6 mb-2">
                            5.2. We will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer periods.
                        </p>
                        <p className="text-sm leading-6 mb-2">
                            5.3. We aim to maintain our services in a manner that protects information from accidental or malicious destruction. Thus, we reserve the right not to immediately delete residual copies from our servers and may retain such information in our backup systems, after you delete information from our services.
                        </p>
                        <p className="text-sm leading-6 mb-2">
                            5.4. After it is no longer necessary for us to retain your Personal data, we may dispose of it in a secure manner in compliance with limitation periods under applicable law.
                        </p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        6. Security, Protection and Storage of Personal Data
                    </span>
                    <div>
                        <p className="text-sm leading-6 mb-2">6.1. We store and process your personal information on our computers in Nigeria, Africa and elsewhere in the world where our facilities are located. Regardless of where your information is processed, we apply the same protections described in this policy.</p>
                        <p className="text-sm leading-6 mb-2">6.2. We have implemented additional access control measures, physical, administrative, technical, security protocols, and standards in accordance with the Payment Card Industry Data Security Standard (PCI DSS Requirements”) to secure and protect your all information in our server. The measures include but not limited to the use of encryption and firewall technologies. We also carry out periodical security updates to ensure that our security infrastructures are in compliance with industry standards.</p>
                        <p className="text-sm leading-6 mb-2">6.3. To ensure that our website is secure, we have also implemented Secure Sockets Layer/Transport Layer Security (SSL/TLS) to ensure secure transmission of your personal data. This can be confirmed by the padlock symbol in your URL address bar when accessing the site, https://events.ticketsdeck.com; The URL address will also start with “https:// depicting a secure webpage. This ensures that any data transmitted during the session will be encrypted before transmission and decrypted at the receiving end. This is to ensure that data cannot be read during transmission.</p>
                        <p className="text-sm leading-6 mb-2">6.4. The security of your Personal Data is important to us, and we will always use reasonable measures and industry standards to protect your information. However, note that transmission of data over the internet or other electronic form is not 100% secure.</p>
                        <p className="text-sm leading-6 mb-2">6.5. Furthermore, in the event of an actual or suspected breach of your personal information, we will inform you as soon as possible and use best effort to remedy the breach within one (1) month from the date we report the breach to you.</p>
                        <p className="text-sm leading-6 mb-2">6.6. We will not be held responsible for unauthorized access to your Personal data. You have the responsibility of reporting any unusual events that may indicate a breach in your data security. We will then investigate whether the security breach was related to the data transmissions from our Services and let you know what steps can be taken to rectify the problem. Further action, such as reporting incidents to the police or other relevant authorities, may also be required.</p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        7. Transfer of Your Personal Data
                    </span>
                    <div>
                        <p className="text-sm leading-6 mb-2">7.1. Your information, including Personal Data, is processed at our operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of your state, province, Country or other governmental jurisdiction. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
                        <p className="text-sm leading-6 mb-2">7.2. International Data Transfers: Your Personal Data may be transferred to countries which may not have the same data protection laws as the country you initially provided your Personal data, but whenever we transfer or transmit your Personal data internationally, we will ensure or take reasonable steps to ensure your Personal Information is handled securely in line with the applicable data protection laws and standard contractual clauses. You have a right (upon your request) to be informed of the appropriate safeguards for data protection in the foreign country.</p>
                        <p className="text-sm leading-6 mb-2">7.3. We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy; and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other Personal Data.</p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        8. Access to Your Data
                    </span>
                    <div>
                        <p className="text-sm leading-6 mb-2">8.1. If you are a registered user on Ticketsdeck, you may access your personal information using your secure login credentials to access the relevant system features for such purpose. If you are a non-registered user, you may request for your personal information by sending an email to ticketsdeck.com</p>
                        <p className="text-sm leading-6 mb-2">8.2. This information should only be used for your own purposes and not to circumvent the platform, or to be distributed to other parties who may use such information to jeopardize the interest of Ticketsdeck or the usage of Ticketsdeck’s Platform.</p>
                        <p className="text-sm leading-6 mb-2">8.3. You have the right to request that we stop using your data or return your data to you or transmit the data directly to another data controller. The withdrawal of your consent at any time shall not affect the lawful processing based on your consent before its withdrawal. In the event you intend to exercise your right in this regard, kindly notify us through <Link className="text-primary-color-sub" href="mailto:ticketsdeckevents@gmail.com">ticketsdeck@gmail.com</Link> and your request shall be treated promptly.</p>
                        <p className="text-sm leading-6 mb-2">8.4. You can also let us know if you feel that your personal information is being processed in any way other than how you have consented to it being used. We will take reasonable steps to ensure that your personal information is processed in the manner in which you have consented to it, or we may delete it based on your instruction. However, we may not accede to your request if it is unrealistic, impractical or detrimental to our compliance with applicable regulation or laws.</p>
                        <p className="text-sm leading-6 mb-2">8.5. If the information you have supplied to us is wrong, you can put in a request to update it quickly or to delete it – unless we have to keep that information for legitimate business or legal purposes, and when responding to a request to update your personal information, we may ask you to verify your identity before we can act on the request. We may reject requests that are unreasonably repetitive, require disproportionate technical effort (for example, developing a new system or fundamentally changing an existing practice), risk the privacy of others, or would be extremely impractical (for instance, requests concerning information residing on backup systems). Where we can provide information access and correction, we will do so for free, except where it would require a disproportionate effort.</p>
                        <p className="text-sm leading-6 mb-2">8.6. You may also deactivate your Account at any time, which deactivation shall be construed as withdrawal of consent. You may contact us should you wish to de-activate your Account at any time by contacting us at <Link className="text-primary-color-sub" href="mailto:ticketsdeckevents@gmail.com">ticketsdeckevents@gmail.com</Link> or <Link className="text-primary-color-sub" href="mailto:ticketsdeck@gmail.com">ticketsdeck@gmail.com</Link></p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        9. Disclosure of your Personal Data
                    </span>
                    <div>
                        <p className="text-sm leading-6 mb-2">9.1. We will not share. sell, trade, rent or disclose your personal data with a third party without your consent except as necessary to provide the Services or as described in this Privacy Policy.</p>
                        <p className="text-sm leading-6 mb-2">9.2. When transacting with others, we may provide those parties with information to complete the transaction, such as your name, User ID, contact details, or other information needed to promote the reliability and security of the transaction. If a transaction is held, fails, or is later invalidated, we may also provide details of the unsuccessful transaction.</p>
                        <p className="text-sm leading-6 mb-2">9.3. We work with third parties, including but not limited to merchants, to enable them to accept or send payments from or to you, using Ticketsdeck. In doing so, a third party may share information about you with us, such as your email address or mobile phone number, to inform you that a payment has been sent to you or when you attempt to pay a merchant or third party. We use this information to confirm that you are a Ticketsdeck customer and that Ticketsdeck a as a payment and collection platform can be enabled. We also validate your status as a Ticketsdeck customer to third parties on your instruction.</p>
                        <p className="text-sm leading-6 mb-2">9.4. Law enforcement: Under certain circumstances, Ticketsdeck may be required to disclose your Personal Data if required to do so by law or in response to valid requests by government authorities.</p>
                        <p className="text-sm leading-6 mb-2">9.5. Your card information may be available for your subsequent re-use if you chose to be remembered at previous attempts.</p>
                        <p className="text-sm leading-6 mb-2">9.6. Ticketsdeck will not disclose your personal data, inclusive or credit/debit card number or bank account number to anyone excluding its merchants and relevant regulatory bodies, except with your express permission.</p>
                        <p className="text-sm leading-6 mb-2">9.7. In addition to the above, Ticketsdeck may share your Personal Data with third parties which include our merchants, affiliates, parent company, employees, officers, service providers, suppliers, agents, sub-contractors as may be reasonably necessary only in the following circumstances:</p>
                        <ul className="text-sm leading-6 list-item pl-1 mb-2">
                            <li>a. Fraud prevention and risk management;</li>
                            <li>b. For customer service purposes;</li>
                            <li>c. Protecting and defending the rights of Ticketsdeck;</li>
                            <li>d. For compliance with applicable laws, anti-money laundering and counter- terrorist financing verification requirements;</li>
                            <li>e. With Service Providers, to enable them monitor and analyze the use of our Service and support our business operations;</li>
                            <li>f. Prevent or investigate possible wrongdoing in connection with the Service;</li>
                            <li>g. Protect the personal safety of Users of the Service or the public;</li>
                            <li>h. Protect against legal liability.</li>
                            <li>i. Where disclosure is necessary for the performance of a contract to which you are party (such as our marketing services) or in order to take steps at your request prior to entering into a contract with us. Specifically, we may disclose your personal data to third parties during our verification exercise to determine your identity or eligibility to use our service</li>
                            <li>j. With Our Affiliates, parent company, and partners where necessary; and</li>
                            <li>k. With other users – when you share Personal Data or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside. If you interact with other users or register through a Third-Party Social Media Service, your contacts on the Third-Party Social Media Service may see your Personal Data.</li>
                        </ul>
                        <p className="text-sm leading-6 mb-2">9.8. You accept that your pictures and testimonials on all social media platforms about Ticketsdeck can be used for limited promotional purposes by us or our agents. This does not include your trademark or copyright protected materials.</p>
                        <p className="text-sm leading-6 mb-2">9.9. Where your employee, as part of the process of application for a service from Ticketsdeck or a third party, requires his/her data to be provided in support of such an application to Ticketsdeck or a third party, we are obligated to avail such request, upon the employee giving the requisite authorisation as the Data Owner/Data Subject, in the form prescribed by us or the third party.</p>
                        <p className="text-sm leading-6 mb-2">9.10. We may disclose personal data as part of a corporate transaction or proceeding such as a merger, financing, acquisition, bankruptcy, dissolution, or a transfer, divestiture, or sale of all or a portion of our business or assets. In this case, your Personal Data may be transferred and becomes subject to a different privacy policy</p>
                        <p className="text-sm leading-6 mb-2">9.11. We work with third parties, including merchants, to facilitate the receipt of your payments. Kindly note that third parties, such as merchants, involved in transactions may have their own privacy policies, and Ticketsdeck does not allow the other transacting party to use this information for anything other than providing agreed Services. Ticketsdeck is not responsible for their actions, including their information protection practices.</p>
                        <p className="text-sm leading-6 mb-2">9.12. We may also disclose/ share your personal data, transaction history/ data, business information and any other data generated by us pursuant to your use of our services with our affiliates, parent-company, sister-companies, subsidiaries, business partners and any other Company within Access Corporation, for business synergy purposes and for the provision of other services to you. In this case your personal data becomes subject to a different privacy policy. However, we will always comply with the provisions of all applicable data protection law.</p>
                    </div>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        10. Your rights under the NDPA
                    </span>
                    <p className="text-sm leading-6 mb-2">You have data protection rights and are entitled to the following:</p>
                    <ul className="text-sm leading-6 list-item pl-1 mb-2">
                        <li>a. The right to access – You have the right to request copies of your Personal Data from us. We may charge a reasonable fee for this service, in consideration of the administrative cost that will be incurred in accomplishing the request.</li>
                        <li>b. The right to rectification – You have the right to request for the correction of any information you believe and have proven to have been captured inaccurately. You also have the right to request for the completion of any information you believe is incomplete.</li>
                        <li>c. The right to erasure – You have the right to request to erase your Personal Data, under certain conditions some of which are listed in the NDPA, however not limited to regulatory requirements or law enforcement agencies.</li>
                        <li>d. The right to restrict processing – You have the right to request the restriction of the processing of your Personal Data, under certain conditions some of which are listed in the NDPA.</li>
                        <li>e. The right to object to processing – You have the right to object to the processing of your Personal Data, under certain conditions.</li>
                        <li>f. The right to data portability – You have the right to request the transfer of data collected to another organization, or directly to you, where technically feasible, without unnecessary hindrance.</li>
                    </ul>
                    <span className="text-sm">Any requests emanating from any of the rights above shall be handled between two (2) to four (4) working weeks.</span>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        11. Tracking Technologies and Cookies
                    </span>
                    <p className="text-sm leading-6 mb-2">11.1. We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information.</p>
                    <p className="text-sm leading-6 mb-2">11.2. When you browse our website, we use cookies to ensure a seamless user experience across all the functions you access. The contents of this page are meant to explain to you in clear terms what cookies mean and how we use them on our site. Cookies are necessary for our website to perform its functions normally. We use them in different contexts, as some are meant to manage your session and ensure that you transition smoothly between pages when logged in with your browser kept active while others are more persistent and linger on your device for a longer period.</p>
                    <p className="text-sm leading-6 mb-2">11.3. Cookies allow a website to recognize a particular device or browser. There are several types of cookies</p>
                    <div className="rounded-xl overflow-hidden my-2 mb-4 border-[1px] border-gray-400/60">
                        <table className="">
                            <tr className="">
                                <th className="p-3 w-1/3 text-sm font-medium text-primary-color-sub-50 font-Mona-Sans-Wide text-left">Type of Cookies</th>
                                <th className="p-3 text-sm font-medium text-primary-color-sub-50 font-Mona-Sans-Wide text-left">Usage Description</th>
                            </tr>
                            <tr className="bg-white/5">
                                <td className="p-3 text-sm">Third-Party Cookies:</td>
                                <td className="p-3 text-sm">Third-party cookies may be place on your computer when you visit the Site by companies that run certain services we offer. These cookies allow the third parties to gather and track certain information about you. These cookies can be manually disabled.</td>
                            </tr>
                            <tr>
                                <td className="p-3 text-sm">Our Cookies</td>
                                <td className="p-3 text-sm">Our cookies are “first-party cookies”, and can be either permanent or temporary. These are necessary cookies, without which the Site won’t work properly or be able to provide certain features and functionalities. Some of these may be manually disabled in your browser, but may affect the functionality of the Site.</td>
                            </tr>
                            <tr className="bg-white/5">
                                <td className="p-3 text-sm">Personalization Cookies</td>
                                <td className="p-3 text-sm">Personalization Cookies are used to recognize repeat visitors to the Site. We use these cookies to record your browsing history, the pages you have visited, and your settings and preferences each time you visit the Site.</td>
                            </tr>
                            <tr>
                                <td className="p-3 text-sm">Site Management Cookies</td>
                                <td className="p-3 text-sm">Site management cookies are used to maintain your identity or session on the Site so that you are not logged off unexpectedly, and any information you enter is retained from page to page. These cookies cannot be turned off individually, but you can disable all cookies in your browser.</td>
                            </tr>
                        </table>
                    </div>
                    <p className="text-sm leading-6 mb-2">11.4. Tracking:</p>
                    <p className="text-sm leading-6 mb-2">In addition to cookies, we may use web beacons, pixel tags, and other tracking technologies on the Site to help customize the Site and improve your experience. A “web beacon” or “pixel tag” is tiny object or image embedded in a web page or email. They are used to track the number of users who have visited particular pages and viewed emails, and acquire other statistical data. They collect only a limited set of data, such as a cookie number, time and date of page or email view, and a description of the page or email on which they reside. Web beacons and pixel tags cannot be declined. However, you can limit their use by controlling the cookies that interact with them.”</p>
                    <p className="text-sm leading-6 mb-2">11.5. Usage of Cookies</p>
                    <p className="text-sm leading-6 mb-2">11.5.1. How we use Cookies:</p>
                    <p className="text-sm leading-6 mb-2">We use cookies for a variety of reasons (which are detailed below). Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to our site. It is recommended that you leave on all cookies if you are not sure whether you need them or not, just in case they are being used to provide a service that you need.</p>
                    <p className="text-sm leading-6 mb-2">11.5.2. We use cookies on the Site to, among other things, keep track of services you have used, record registration information, record your user preferences, keep you logged into the Site, facilitate purchase procedures, and track the pages you visit. Cookies help us understand how the Site is being used and improve your user experience.</p>
                    <p className="text-sm leading-6 mb-2">11.6. What we use Cookies for:</p>
                    <p className="text-sm leading-6 mb-2">We use cookies to optimize your user experience when you browse our website. If you register a profile with us, we will use cookies for the management of the sign-up process, general administration and to manage your browser session while you are logged in. These cookies will usually be deleted when you log out. They may however in some cases remain afterwards to remember your site preferences when you are logged out. See usage table below:</p>
                    <p className="text-sm leading-6 mb-2">11.7. Turning off/ Opting out of Cookies</p>
                    <p className="text-sm leading-6 mb-2">11.7.1. You can manually disable cookies on your computer and devices or delete existing cookies. Disabling cookies (See How to Disable Cookies in Your Browser) may restrict your browsing experience on our Website related to important features such as logging in to your profile, navigating webpages etc. We do recommend that for a good user experience on our website, you allow Ticketsdeck to store cookies.</p>
                    <p className="text-sm leading-6 mb-2">11.7.2. Ticketsdeck does not share cookie information with any other website nor do we sell this data to any third party without your consent.</p>
                    <p className="text-sm leading-6 mb-2">11.7.3. You can instruct your browser to refuse all Cookies or to indicate when a Cookie is being sent. We give you the option to opt-out of cookies in order to let you control your privacy. However, we do recommend that for a good user experience on our website, you allow Ticketsdeck to store cookies.</p>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        12. Links to Other Websites
                    </span>
                    <p className="text-sm leading-6 mb-2">12.1. Certain services processing channels on Ticketsdeck may require links to other websites. Please note that Ticketsdeck is not responsible for and has no control over third party websites. We do not monitor or review the content of other parties’ websites which are linked from this website.</p>
                    <p className="text-sm leading-6 mb-2">12.2. Opinions expressed or materials appearing on such websites are not necessarily shared or endorsed by us, and Ticketsdeck should not be regarded as the publisher of such opinions or materials, and you agree that we shall not be liable for any liability arising from your interpretation of any information on any third-party website linked to Ticketsdeck.</p>
                    <p className="text-sm leading-6 mb-2">12.3. Please be aware that we are not responsible for the privacy practices, or content of any third-party sites and we encourage our users to read the privacy statements of these third-party sites. You should evaluate the security and trustworthiness of any other site connected to this site or accessed through this site yourself, before disclosing any personal information to it.</p>
                    <p className="text-sm leading-6 mb-2">12.4. Ticketsdeck will not accept any responsibility for any loss or damage in whatever manner, howsoever caused, resulting from your disclosure to third parties of your personal information.</p>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        13. Marketing
                    </span>
                    <p className="text-sm leading-6 mb-2">13.1. You acknowledge and understand that as part of us providing our services to you we may provide you information about third party products and services and we may share limited personal data about you in connection with our services. Our lawful basis for doing this is performance of our contract with you or our legitimate business interest (or those of a third party).</p>
                    <p className="text-sm leading-6 mb-2">13.2. Please note however that you may opt out of the marketing and promotional offers. if you opt-out of marketing content, we may still send you messages relating to transactions and our Services related to our ongoing business relationship. We may ask you for permission to send notifications to you.</p>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        14. Limitation of Liability
                    </span>
                    <p className="text-sm leading-6 mb-2">14.1. Ticketsdeck will not be liable for loss of income, profits, business, opportunity, goodwill, contracts or any indirect, special, incidental or consequential damages arising out of or in connection with the Service, any computation or failed service on Ticketsdeck, arising out of any breach of this Policy.</p>
                    <p className="text-sm leading-6 mb-2">14.2. We will not be liable for any loss or damage arising as a result of unauthorized access to the Service if (a) you intentionally or negligently fail to take reasonable precautions to protect your security, access codes, login details or any device used to access the Service, (b) you failed to promptly notify us that the Service was being accessed in an unauthorised way after becoming aware of it, or (c) you acted fraudulently.</p>
                    <p className="text-sm leading-6 mb-2">14.3. Our liability to you or any third party in any circumstance of proven liability by us, shall not exceed the fees paid to us in respect of the specific transaction that gave rise to the claim or liability, unless otherwise specified by a court of competent jurisdiction.</p>
                    <p className="text-sm leading-6 mb-2">14.4. Notwithstanding any provision in clauses 15, limitation of liability shall not apply if we breach any provision of the Nigerian Data Protection Act 2023 (“NDPA”).</p>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        15. Children’s Privacy
                    </span>
                    <p className="text-sm leading-6 mb-2">15.1. Our services do not address anyone under the age of 18 (“Children”). We do not knowingly collect personally identifiable information from Children. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us at <Link className="text-primary-color-sub" href="mailto:ticketsdeckevents@gmail.com">ticketsdeckevents@gmail.com</Link></p>
                    <p className="text-sm leading-6 mb-2">15.2. If we become aware that we have collected Personal Data from any Children without verification of parental consent, we take steps to remove that information from our database.</p>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        16. Providing Us with Personal Data of another Person
                    </span>
                    <p className="text-sm leading-6 mb-2">If you need to provide us with personal data about another person, you must obtain that individual’s express consent to share their information. You covenant to also share this Privacy policy with those individuals as it shall also apply to them.</p>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        17. Remedies for Personal Data Breach
                    </span>
                    <p className="text-sm leading-6 mb-2">Where we notice personal data breach or where you report any personal data breach to us, we will as soon as possible investigate same and notify you of the security or correctional measures to be taken including without limitation to reporting same to relevant government authorities.</p>
                </div>
                <div className="mb-2">
                    <span className="font-Mona-Sans-Wide text-primary-color-sub">
                        18. Changes to this Privacy Policy
                    </span>
                    <p className="text-sm leading-6 mb-2">From time to time, we may change, amend or review this Privacy Policy to reflect new services or changes in our Privacy Policy and place any updates on this page. If we make any material changes to the Privacy Policy, we will notify you by sending an e-mail to the e-mail address you most recently provided us or by posting notice of the changes on this site.</p>
                    <p className="text-sm leading-6 mb-2">We request you to periodically review the Privacy Policy from time to time for the recent changes on our privacy practices. If you keep using our Services, you consent to all amendments of this Privacy Policy.</p>
                    <p className="text-sm leading-6 mb-2">For Complaints</p>
                    <p className="text-sm leading-6 mb-2">All access requests, questions, comments, complaints, and other requests regarding the privacy policy should be sent to <Link className="text-primary-color-sub" href="mailto:ticketsdeckevents@gmail.com">ticketsdeckevents@gmail.com</Link></p>
                </div>
            </div>
        </main>
    );
}

export default PrivacyPolicyPage;