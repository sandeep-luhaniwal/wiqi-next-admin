"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Section = ({ title, children }) => (
    <section className="space-y-3">
        <h2 className="text-purple-900 text-xl font-semibold">{title}</h2>
        <div className="text-purple-700 leading-relaxed">{children}</div>
    </section>
);

const Subsection = ({ subtitle, children }) => (
    <div className="space-y-2">
        <h3 className="text-purple-800 font-medium">{subtitle}</h3>
        <p>{children}</p>
    </div>
);

export default function Terms() {
    return (
        <div className="min-h-screen !mx-auto">
            <div className="max-w-[1200px] !mx-auto px-4">

                {/* Header */}
                <header className="mt-12">
                    <h1 className="text-4xl font-bold text-purple-900 mb-3">
                        Terms & Conditions
                    </h1>
                </header>

                {/* Content */}
                <div className="bg-white rounded-3xl md:shadow-xl p-2 md:p-12 space-y-10 leading-relaxed text-purple-700">
                    <Section title="1. Acceptance of Terms">
                        By downloading, installing, or using the <strong>Wiqi</strong> mobile
                        or web application ("the App"), you agree to be bound by these Terms
                        and Conditions ("Terms"). If you do not agree, please do not use the
                        App.
                    </Section>

                    <Section title="2. Description of Service">
                        Wiqi helps users manage workflows efficiently with features such as:
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                            <li>Project and task management</li>
                            <li>Team collaboration tools</li>
                            <li>Progress tracking and analytics</li>
                            <li>Smart notifications and reminders</li>
                            <li>Cloud-based data synchronization</li>
                        </ul>
                    </Section>

                    <Section title="3. User Accounts">
                        <Subsection subtitle="3.1 Account Creation">
                            You may need an account to access certain features. Please provide
                            accurate and complete information when creating your account.
                        </Subsection>
                        <Subsection subtitle="3.2 Account Security">
                            You are responsible for maintaining the confidentiality of your
                            credentials and for all activity under your account.
                        </Subsection>
                    </Section>

                    <Section title="4. Usage Guidelines">
                        You agree to use Wiqi lawfully and NOT to:
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Attempt unauthorized access to Wiqi systems</li>
                            <li>Disrupt or interfere with the App’s functionality</li>
                            <li>Upload malicious code, viruses, or harmful content</li>
                            <li>Impersonate others or provide false information</li>
                        </ul>
                    </Section>

                    <Section title="5. Intellectual Property">
                        <Subsection subtitle="5.1 Our Content">
                            All intellectual property related to Wiqi (text, images, design,
                            code, etc.) belongs to Wiqi and is protected by law.
                        </Subsection>
                        <Subsection subtitle="5.2 Your Content">
                            You retain rights to the content you upload. By uploading, you
                            grant Wiqi a limited license to use it solely for providing
                            services.
                        </Subsection>
                    </Section>

                    <Section title="6. Disclaimer">
                        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                            <strong className="text-purple-900 block mb-2">
                                Important: Wiqi is a productivity tool, not a guarantee of
                                performance.
                            </strong>
                            Wiqi helps with task organization and reminders but does not
                            assume responsibility for outcomes, losses, or delays caused by
                            user decisions.
                        </div>
                    </Section>

                    <Section title="7. Limitation of Liability">
                        Wiqi is not liable for:
                        <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                            <li>Indirect, incidental, or consequential damages</li>
                            <li>Loss of profits, data, or productivity</li>
                            <li>Unauthorized access or errors in content</li>
                        </ul>
                    </Section>

                    <Section title="8. Third-Party Services">
                        Wiqi may include links or integrations with third-party platforms.
                        Wiqi is not responsible for their content or data handling
                        practices.
                    </Section>

                    <Section title="9. Subscription and Payments">
                        Some features may require paid subscriptions. Subscriptions renew
                        automatically unless cancelled 24 hours before renewal. Refunds
                        follow the store’s (App Store/Play Store) policy.
                    </Section>

                    <Section title="10. Termination">
                        Wiqi may suspend or terminate accounts for policy violations or
                        misuse. Upon termination, your access will be immediately revoked.
                    </Section>

                    <Section title="11. Changes to Terms">
                        We may update these Terms periodically. Updated versions will be
                        posted on this page with a revised “Last Updated” date.
                    </Section>

                    <Section title="12. Contact">
                        For questions, reach us at:
                        <div className="bg-purple-50 p-4 rounded-lg mt-4">
                            <p className="text-purple-900">Email: support@wiqi.app</p>
                            <p className="text-purple-900">
                                Address: Wiqi HQ, 123 Innovation Street, San Francisco, CA
                            </p>
                        </div>
                    </Section>

                    <Section title="13. Entire Agreement">
                        These Terms, along with our Privacy Policy, represent the complete
                        agreement between you and Wiqi regarding use of the App.
                    </Section>
                </div>
            </div>
        </div>
    );
}
