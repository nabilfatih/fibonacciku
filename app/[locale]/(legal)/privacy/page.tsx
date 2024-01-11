import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="relative">
      <section className="z-40 m-auto my-12 flex w-full max-w-4xl flex-col justify-between px-4">
        <header className="flex flex-col items-center justify-center gap-2 pb-3">
          <Link href="/">
            <Image src="/logo.webp" width={36} height={36} alt="FibonacciKu" />
          </Link>
          <h1 className="text-lg font-bold">
            Welcome to FibonacciKu Privacy Policy
          </h1>
        </header>
        <main className="flex flex-col space-y-6 text-sm">
          <section className="flex flex-col gap-3">
            <p className="font-medium italic">Last update: 20 June 2023</p>
            <p>
              At FibonacciKu, your privacy is of the utmost importance to us.
              This Privacy Policy explains in detail the types of personal
              information we collect, the purposes for collecting it, how we use
              and protect it, and your rights regarding this information. By
              using our website, fibonacciku.com, you agree to the collection
              and use of information in accordance with this policy.
            </p>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">
              Information Collection and Use
            </h2>
            <section className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <p>
                While using our site, we may ask you to provide us with certain
                personally identifiable information that can be used to contact
                or identify you. Personally identifiable information may
                include, but is not limited to:
              </p>
              <ul className="list-inside list-disc">
                <li>Name</li>
                <li>Email address</li>
                <li>Address, city, and postal code</li>
              </ul>

              <p>We use this information for the following purposes:</p>
              <ul className="list-inside list-disc">
                <li>To provide, maintain, and improve our services.</li>
                <li>
                  To respond to your inquiries and provide customer support.
                </li>
                <li>
                  To communicate with you about updates, promotions, or events.
                </li>
                <li>To personalize your experience on our website.</li>
                <li>
                  To conduct research and analysis to better understand our
                  users and improve our services.
                </li>
                <li>To detect, prevent, and address technical issues.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Log Data</h3>
              <p>
                Like many site operators, we collect information that your
                browser sends whenever you visit our site (&#34;Log Data&#34;).
                This Log Data may include information such as:
              </p>
              <ul className="list-inside list-disc">
                <li>Your computer&#39;s Internet Protocol address</li>
                <li>Browser type and version</li>
                <li>The pages of our site that you visit</li>
                <li>The time and date of your visit</li>
                <li>The time spent on those pages</li>
                <li>Referring and exit pages</li>
                <li>Other statistics</li>
              </ul>
              <p>
                We use this information to analyze trends, administer the site,
                track user movement, and gather broad demographic information
                for aggregate use.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Cookies</h3>
              <p>
                Cookies are small files containing a string of characters that
                are sent to your computer when you visit a website. When you
                visit the website again, the cookie allows that site to
                recognize your browser.
              </p>
              <p>We use &#34;cookies&#34; to:</p>
              <ul className="list-inside list-disc">
                <li>Remember your preferences and settings.</li>
                <li>Understand and save your preferences for future visits.</li>
                <li>
                  Compile aggregate data about site traffic and site interaction
                  to offer better site experiences and tools in the future.
                </li>
              </ul>
              <p>
                You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent. However, if you do not
                accept cookies, you may not be able to use some portions of our
                site.
              </p>
            </section>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">
              Payment Information and Security
            </h2>
            <section className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">
                Collection of Payment Information
              </h3>
              <p>
                In order to process payments for our subscription-based
                services, we may collect certain payment information from you.
                This may include, but is not limited to:
              </p>
              <ul className="list-inside list-disc">
                <li>Name</li>
                <li>Billing address</li>
                <li>Credit card number</li>
                <li>Credit card expiration date</li>
                <li>Credit card security code (CVV)</li>
                <li>Other relevant payment details</li>
              </ul>
              <p>
                We do not store your full credit card information on our
                servers. Instead, we rely on our payment gateway, Stripe, to
                securely handle and process your payment information.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Stripe Payment Gateway</h3>
              <p>
                We use Stripe, a secure and widely recognized payment gateway,
                to process your payments. Stripe has been audited by a
                PCI-certified auditor and is certified to PCI Service Provider
                Level 1, the highest level of certification available in the
                payments industry. To learn more about Stripe&#39;s security
                practices, please visit{" "}
                <Link
                  href={"https://stripe.com/docs/security"}
                  target="_blank"
                  className="link link-secondary"
                >
                  Stripe&#39;s security page
                </Link>
                .
              </p>
              <p>
                By using our services and providing your payment information,
                you agree to the processing of your payment information by
                Stripe in accordance with their{" "}
                <Link
                  href={"https://stripe.com/privacy"}
                  target="_blank"
                  className="link link-secondary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">
                Protection of Payment Information
              </h3>
              <p>
                We take the security of your payment information very seriously.
                We employ various security measures, such as encryption and
                secure socket layer (SSL) technology, to protect your payment
                information during transmission. Additionally, we limit access
                to your payment information to authorized personnel only.
              </p>
              <p>
                While we strive to protect your payment information, no method
                of transmission over the Internet or method of electronic
                storage is 100% secure. Therefore, we cannot guarantee the
                absolute security of your payment information.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">
                Changes to Payment Information
              </h3>
              <p>
                You can update your payment information at any time by accessing
                your account settings or contacting our customer support. It is
                your responsibility to keep your payment information up-to-date
                and accurate to avoid disruptions to your subscription.
              </p>
            </section>
          </section>
          <section className="flex flex-col gap-3">
            <section className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">Third-Party Services</h2>
              <p>
                We may employ third-party companies and individuals to
                facilitate our service, provide the service on our behalf,
                perform service-related activities, or assist us in analyzing
                how our service is used.
              </p>
              <p>
                These third parties have access to your personal information
                only to perform these tasks on our behalf and are obligated not
                to disclose or use it for any other purpose.
              </p>
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Security</h3>
              <p>
                The security of your personal information is important to us,
                but remember that no method of transmission over the Internet,
                or method of electronic storage, is 100% secure. While we strive
                to use commercially acceptable means to protect your personal
                information, we cannot guarantee its absolute security.
              </p>
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">Your Rights</h3>
              <p>
                You have the right to access, update, or delete your personal
                information. You can do this by contacting us at the email
                address provided below. You may also have the right to restrict
                or object to the processing of your personal information, as
                well as the right to data portability.
              </p>
            </section>
            <section className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold">
                Changes to This Privacy Policy
              </h3>
              <p>
                This Privacy Policy is effective as of 20 June 2023 and will
                remain in effect except with respect to any changes in its
                provisions in the future, which will be in effect immediately
                after being posted on this page.
              </p>
              <p>
                We reserve the right to update or change our Privacy Policy at
                any time, and you should check this Privacy Policy periodically.
                Your continued use of the Service after we post any
                modifications to the Privacy Policy on this page will constitute
                your acknowledgment of the modifications and your consent to
                abide and be bound by the modified Privacy Policy.
              </p>
              <p>
                If we make any material changes to this Privacy Policy, we will
                notify you either through the email address you have provided us
                or by placing a prominent notice on our website.
              </p>
            </section>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              or if you wish to exercise any of your rights, please don&#39;t
              hesitate to contact us to this email: support@fibonacciku.com
            </p>
          </section>
          <section className="flex flex-col gap-2">
            <p className="text-lg font-semibold italic">FibonacciKu Team</p>
          </section>
        </main>
      </section>
    </main>
  );
}
