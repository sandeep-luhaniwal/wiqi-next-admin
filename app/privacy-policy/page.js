"use client";

const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-purple-900 text-xl font-semibold">{title}</h2>
    <div className="text-purple-700 leading-relaxed">{children}</div>
  </section>
);


export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen !mx-auto">
      <div className="max-w-[1200px] !mx-auto px-4">
        {/* Header */}
        <header className="mt-12">
          <h1 className="text-4xl font-bold text-purple-900 mb-3">
            Privacy Policy
          </h1>
        </header>

        {/* Content */}
        <div className="bg-white rounded-3xl md:shadow-xl p-2 md:p-12 space-y-10 leading-relaxed text-purple-700">
          <Section title="1. Introduction">
            This Privacy Policy explains how <strong>Wiqi</strong> (“we”, “our”, or
            “us”) collects, uses, and protects your personal information when you
            use our mobile or web application (“App”). By using Wiqi, you agree to
            the terms outlined in this Privacy Policy.
          </Section>

          <Section title="2. Information We Collect">
            We collect the following types of data to improve your experience:
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
              <li>
                <strong>Account Information:</strong> Name, email address, and
                login credentials.
              </li>
              <li>
                <strong>Usage Data:</strong> How you use the App, pages visited, and
                features accessed.
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating system,
                and IP address.
              </li>
              <li>
                <strong>Optional Data:</strong> Any data you upload (tasks,
                projects, or notes) for using Wiqi’s features.
              </li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            We use your data to:
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
              <li>Provide and improve Wiqi’s services</li>
              <li>Personalize your experience</li>
              <li>Send updates, reminders, or support notifications</li>
              <li>Ensure account security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="4. Data Sharing and Disclosure">
            We do not sell your personal data. We may share information only in the
            following cases:
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
              <li>
                With <strong>service providers</strong> who help us operate the App
                (e.g., hosting, analytics, customer support)
              </li>
              <li>
                To comply with <strong>legal obligations</strong> or protect our
                rights
              </li>
              <li>
                With your <strong>explicit consent</strong> for specific features or
                integrations
              </li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            We retain your data only as long as necessary to provide our services
            and meet legal requirements. You can request deletion of your account
            and data anytime by contacting us.
          </Section>

          <Section title="6. Security">
            We use encryption, secure servers, and regular audits to protect your
            personal information. However, no online service can guarantee
            100% security, so please use Wiqi responsibly.
          </Section>

          <Section title="7. Your Rights">
            You have the right to:
            <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
              <li>Access or update your personal information</li>
              <li>Request deletion of your account and data</li>
              <li>Withdraw consent to data processing</li>
              <li>Opt out of marketing communications</li>
            </ul>
            To exercise your rights, contact us at{" "}
            <strong>support@wiqi.app</strong>.
          </Section>

          <Section title="8. Third-Party Services">
            Wiqi may include links or integrations with third-party tools such as
            cloud storage or analytics platforms. We are not responsible for their
            privacy practices. Please review their privacy policies before use.
          </Section>

          <Section title="9. Cookies and Tracking">
            Wiqi may use cookies or similar technologies to enhance user experience
            and analyze app performance. You can manage or disable cookies through
            your browser settings.
          </Section>

          <Section title="10. Children's Privacy">
            Wiqi is not intended for children under 13. We do not knowingly collect
            data from minors. If you believe a child has provided us data, contact
            us to remove it.
          </Section>

          <Section title="11. Changes to This Policy">
            We may update this Privacy Policy occasionally. Updates will be posted
            on this page with a new “Last Updated” date. Continued use of Wiqi after
            changes means you accept the revised policy.
          </Section>

          <Section title="12. Contact Us">
            For questions or privacy concerns, reach us at:
            <div className="bg-purple-50 p-4 rounded-lg mt-4">
              <p className="text-purple-900">Email: support@wiqi.app</p>
              <p className="text-purple-900">
                Address: Wiqi HQ, 123 Innovation Street, San Francisco, CA
              </p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
