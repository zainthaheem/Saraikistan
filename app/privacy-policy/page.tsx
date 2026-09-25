
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Saraikistan',
  description:
    'Read the Saraikistan Privacy Policy to learn how information, cookies, and personal data are handled when you visit our website.',
  alternates: {
    canonical: 'https://saraikistan.org/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Saraikistan',
    description:
      'Learn how Saraikistan handles personal information, cookies, and privacy.',
    url: 'https://saraikistan.org/privacy-policy',
    siteName: 'Saraikistan',
    type: 'website',
  },
}

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-cream text-navy">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">

        <p className="font-body text-sm text-shawl">
          Saraikistan
        </p>

        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
          Privacy Policy
        </h1>

        <p className="mt-5 font-body text-sm text-navy/55">
          Last updated: September 25, 2026
        </p>

        <div className="mt-10 space-y-10 font-body text-base leading-8 text-navy/75">

          <section>
            <h2 className="font-display text-2xl text-navy">
              1. Introduction
            </h2>

            <p className="mt-4">
              Welcome to Saraikistan (saraikistan.org). We are dedicated to
              promoting Saraiki culture, history, language, people, places,
              music, and heritage.
            </p>

            <p className="mt-4">
              This Privacy Policy explains how information may be collected,
              used, and protected when you visit our website. By using
              Saraikistan, you acknowledge this policy.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">
              2. Information We Collect
            </h2>

            <p className="mt-4">
              We do not ask visitors to provide personal information simply
              to browse our publicly available content.
            </p>

            <p className="mt-4">
              If you contact us by email or through a contact feature, we may
              receive information you voluntarily provide, such as your name,
              email address, and the contents of your message.
            </p>

            <p className="mt-4">
              Our website hosting, content management, and other technical
              service providers may process technical information such as
              browser details, IP addresses, and server logs as part of
              providing and securing their services. The information
              collected depends on the services and their configurations.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">
              3. How We Use Information
            </h2>

            <p className="mt-4">
              Information may be used to:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Operate, maintain, and improve the website.</li>
              <li>Respond to messages and inquiries.</li>
              <li>Protect the website against spam, abuse, and security threats.</li>
              <li>Understand and resolve technical problems.</li>
            </ul>

            <p className="mt-4">
              We do not sell personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">
              4. Cookies and Similar Technologies
            </h2>

            <p className="mt-4">
              Cookies are small files stored on your device. They may be used
              by websites and service providers to support functionality,
              security, preferences, analytics, and advertising.
            </p>

            <p className="mt-4">
              Saraikistan's use of cookies and similar technologies may depend
              on the features and third-party services enabled on the website.
              We will update this policy as those services are introduced
              or changed.
            </p>

            <p className="mt-4">
              You can manage or delete cookies through your browser settings.
              Disabling certain cookies may affect some website features.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">
              5. Third-Party Services
            </h2>

            <p className="mt-4">
              Saraikistan may rely on third-party providers for website
              hosting, content delivery, content management, security, and
              other technical services. These providers may process
              information as necessary to deliver their services and under
              their applicable privacy policies.
            </p>

            <p className="mt-4">
              We encourage visitors to review the privacy policies of
              third-party services when using features or links provided
              through our website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">
              6. Google AdSense and Advertising
            </h2>

            <p className="mt-4">
              Saraikistan may display advertisements provided by Google
              AdSense or other advertising partners in the future.
            </p>

            <p className="mt-4">
              If advertising is enabled, third-party vendors, including
              Google, may use cookies or similar technologies to serve ads,
              measure advertising performance, and personalize advertisements
              where permitted by applicable law and user preferences.
            </p>

            <p className="mt-4">
              Google and its partners may use information about visits to
              this and other websites to provide advertising services.
              Visitors can learn about Google's advertising practices and
              manage available advertising settings through Google's
              advertising privacy resources.
            </p>

            <p className="mt-4">
              Learn more at{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-shawl underline underline-offset-4"
              >
                Google's Advertising Policies and Technologies
              </a>.
            </p>

            <p className="mt-4">
              Where required, we will provide appropriate consent and
              advertising preference options before enabling relevant
              advertising technologies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">
              7. Data Security and Retention
            </h2>

            <p className="mt-4">
              We take reasonable steps to protect information handled through
              our website. However, no method of transmitting or storing
              information online can be guaranteed to be completely secure.
            </p>

            <p className="mt-4">
              Information is retained only for as long as reasonably
              necessary for the purposes described in this policy, subject
              to applicable legal and operational requirements.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">
              8. Your Privacy Rights
            </h2>

            <p className="mt-4">
              Depending on your location and applicable law, you may have
              rights to request access to, correction of, or deletion of
              personal information we hold about you.
            </p>

            <p className="mt-4">
              You may contact us to make a privacy-related request. We may
              need to verify your identity before responding.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">
              9. Children's Privacy
            </h2>

            <p className="mt-4">
              Saraikistan is a general audience cultural website and is not
              specifically directed at children under 13. We do not knowingly
              collect personal information directly from children under 13.
              If you believe a child has provided us with personal
              information, please contact us so that we can review the matter.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">
              10. Changes to This Policy
            </h2>

            <p className="mt-4">
              We may update this Privacy Policy when our website, services,
              or legal obligations change. The latest version will be
              published on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-navy">
              11. Contact Us
            </h2>

            <p className="mt-4">
              If you have questions about this Privacy Policy or how
              information is handled, contact us:
            </p>

            <p className="mt-4">
              Email:{' '}
              <a
                href="mailto:hello.saraikistan@gmail.com"
                className="text-shawl underline underline-offset-4"
              >
                hello.saraikistan@gmail.com
              </a>
            </p>

            <p className="mt-2">
              Website:{' '}
              <a
                href="https://saraikistan.org"
                className="text-shawl underline underline-offset-4"
              >
                saraikistan.org
              </a>
            </p>
          </section>

        </div>
      </div>
    </main>
  )
}
