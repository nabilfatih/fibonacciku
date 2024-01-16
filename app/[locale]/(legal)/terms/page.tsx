import Image from "next/image"
import Link from "next/link"

export default function TermsOfUsePage() {
  return (
    <main className="relative mx-auto prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-p:mb-2 prose-p:last:mb-0">
      <section className="z-40 m-auto my-12 flex w-full max-w-4xl flex-col justify-between px-4">
        <header className="flex flex-col items-center justify-center pb-3">
          <Link href="/" passHref>
            <Image
              src="/logo.webp"
              width={36}
              height={36}
              alt="FibonacciKu"
              className="my-2"
            />
          </Link>
          <h1 className="text-lg font-bold">
            Welcome to FibonacciKu Terms of Use
          </h1>
        </header>
        <main className="flex flex-col space-y-6 text-sm">
          <section className="flex flex-col">
            <p className="font-medium italic">Last update: 20 June 2023</p>
            <p>
              Please read these Terms of Use (&#34;Terms&#34;) carefully before
              using the FibonacciKu.com website (&#34;Service&#34;) operated by
              FibonacciKu (&#34;us&#34;, &#34;we&#34;, or &#34;our&#34;).
            </p>
            <p>
              Your access to and use of the Service is conditioned upon your
              acceptance of and compliance with these Terms. These Terms apply
              to all visitors, users, and others who wish to access or use the
              Service.
            </p>
            <p>
              By accessing or using the Service, you agree to be bound by these
              Terms. If you disagree with any part of the Terms, then you do not
              have permission to access the Service.
            </p>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of FibonacciKu and its
              licensors. The Service is protected by copyright, trademark, and
              other laws of both the country and foreign countries. Our
              trademarks and trade dress may not be used in connection with any
              product or service without the prior written consent of
              FibonacciKu.
            </p>
            <section className="flex flex-col">
              <h3 className="text-lg font-semibold">Copyrights</h3>
              <p>
                All content on the Service, including but not limited to text,
                graphics, logos, button icons, images, and software, is the
                property of FibonacciKu or its content suppliers and is
                protected by international copyright laws. The compilation of
                all content on the Service is the exclusive property of
                FibonacciKu and is protected by international copyright laws.
              </p>
            </section>
            <section className="flex flex-col">
              <h3 className="text-lg font-semibold">Trademarks</h3>
              <p>
                FibonacciKu, the FibonacciKu logo, and other FibonacciKu
                graphics, logos, and service names are trademarks or registered
                trademarks of FibonacciKu. FibonacciKu&#39;s trademarks and
                trade dress may not be used in connection with any product or
                service that is not FibonacciKu&#39;s, in any manner that is
                likely to cause confusion among customers, or in any manner that
                disparages or discredits FibonacciKu.
              </p>
            </section>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">User Conduct</h2>
            <p>By using our Service, you agree to:</p>
            <ul className="list-inside list-disc">
              <li>
                Comply with all applicable laws, including, without limitation,
                privacy laws, intellectual property laws, anti-spam laws, and
                regulatory requirements.
              </li>
              <li>
                Use the Service only for lawful purposes and not to engage in
                any conduct that is unlawful, harassing, threatening, abusive,
                defamatory, or invasive of another&#39;s privacy.
              </li>
              <li>
                Not to impersonate any person or entity or falsely state or
                otherwise misrepresent your affiliation with a person or entity.
              </li>
              <li>
                Not to interfere with or disrupt the Service or servers or
                networks connected to the Service, or disobey any requirements,
                procedures, policies, or regulations of networks connected to
                the Service.
              </li>
              <li>
                Not to reproduce, duplicate, copy, sell, resell, or exploit any
                portion of the Service without the express written permission of
                FibonacciKu.
              </li>
              <li>
                Not to use the Service to send unsolicited or unauthorized
                advertising, promotional materials, junk mail, spam, chain
                letters, or any other form of solicitation.
              </li>
              <li>
                Not to upload, post, email, transmit, or otherwise make
                available any material that contains software viruses or any
                other computer code, files, or programs designed to interrupt,
                destroy, or limit the functionality of any computer software or
                hardware or telecommunications equipment.
              </li>
            </ul>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">User Content</h2>
            <p>
              You are solely responsible for any content, including but not
              limited to text, images, audio, video, and links, that you submit,
              post, or transmit on or through the Service (&#34;User
              Content&#34;). You agree that you will not post any User Content
              that:
            </p>
            <ul className="list-inside list-disc">
              <li>
                Is unlawful, harmful, threatening, abusive, harassing,
                defamatory, vulgar, obscene, libelous, invasive of another&#39;s
                privacy, hateful, or racially, ethnically, or otherwise
                objectionable.
              </li>
              <li>
                Infringes any patent, trademark, trade secret, copyright, or
                other proprietary rights of any party.
              </li>
              <li>
                Is unsolicited or unauthorized advertising, promotional
                materials, &#34;junk mail,&#34; &#34;spam,&#34; &#34;chain
                letters,&#34; &#34;pyramid schemes,&#34; or any other form of
                solicitation.
              </li>
              <li>
                Contains software viruses or any other computer code, files, or
                programs designed to interrupt, destroy, or limit the
                functionality of any computer software or hardware or
                telecommunications equipment.
              </li>
            </ul>
            <p>
              FibonacciKu reserves the right (but not the obligation) to
              monitor, remove, or edit any User Content at its sole discretion.
            </p>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">Payments and Billing</h2>
            <section className="flex flex-col">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <p>
                We use Stripe as our payment gateway to process payments for our
                subscription-based services. Stripe accepts various payment
                methods, including major credit cards such as Visa, MasterCard,
                American Express, Discover, and others, as well as some local
                payment methods depending on your location. For more information
                on Stripe&#39;s supported payment methods, please visit{" "}
                <Link
                  href={
                    "https://stripe.com/docs/payments/payment-methods/overview"
                  }
                  target="_blank"
                  className="link link-secondary"
                >
                  Stripe&#39;s website
                </Link>
                .
              </p>
              <p>
                By providing your payment information and confirming your
                subscription, you authorize us to charge the applicable fees to
                your selected payment method. You also agree to keep your
                payment information up-to-date and accurate.
              </p>
            </section>
            <section className="flex flex-col">
              <h3 className="text-lg font-semibold">Subscription Plans</h3>
              <p>
                FibonacciKu offers subscription-based products, which grant you
                access to our services for a specified period. We provide
                different subscription plans to cater to the diverse needs of
                our users.
              </p>
              <p>
                By subscribing to a plan, you agree to pay the subscription fees
                associated with that plan. Subscription fees are billed in
                advance and are non-refundable, except as stated in our Refund
                Policy below.
              </p>
              <p>
                We reserve the right to change our subscription plans, fees, or
                billing methods at any time. We will notify you of any changes
                in advance, and you will have the option to continue using our
                services under the new terms or cancel your subscription.
              </p>
            </section>
            <section className="flex flex-col">
              <h3 className="text-lg font-semibold">Automatic Renewal</h3>
              <p>
                Your subscription will automatically renew at the end of each
                billing period unless you cancel your subscription before the
                renewal date. You can cancel your subscription at any time
                through your account settings or by contacting our customer
                support.
              </p>
            </section>
            <section className="flex flex-col">
              <h3 className="text-lg font-semibold">Refund Policy</h3>
              <p>
                We strive to provide a high-quality service to our users.
                However, if for any reason you are not satisfied with our
                services, you can request a refund within 1 day of the initial
                purchase or subscription renewal. Refund requests made after
                this period will not be eligible for a refund.
              </p>
              <p>
                To request a refund, please contact our customer support with
                your account details and the reason for your refund request. We
                will review your request and process the refund if it meets our
                refund policy criteria.
              </p>
              <p>
                Please note that refunds may take several business days to
                appear on your statement, depending on your payment provider.
              </p>
            </section>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">Links to Other Web Sites</h2>
            <p>
              Our Service may contain links to third-party websites or services
              that are not owned or controlled by FibonacciKu.
            </p>
            <p>
              FibonacciKu has no control over and assumes no responsibility for
              the content, privacy policies, or practices of any third-party
              websites or services. We do not warrant the offerings of any of
              these entities/individuals or their websites.
            </p>
            <p>
              You acknowledge and agree that FibonacciKu shall not be
              responsible or liable, directly or indirectly, for any damage or
              loss caused or alleged to be caused by or in connection with the
              use of or reliance on any such content, goods, or services
              available on or through any such third-party websites or services.
            </p>
            <p>
              We strongly advise you to read the terms and conditions and
              privacy policies of any third-party websites or services that you
              visit.
            </p>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">Termination</h2>
            <p>
              We may terminate or suspend your access to the Service
              immediately, without prior notice or liability, under our sole
              discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>
            <p>
              All provisions of the Terms, which by their nature should survive
              termination, shall survive termination, including, without
              limitation, ownership provisions, warranty disclaimers, indemnity,
              and limitations of liability.
            </p>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless FibonacciKu and
              its licensee and licensors, and their employees, contractors,
              agents, officers, and directors, from and against any and all
              claims, damages, obligations, losses, liabilities, costs or debt,
              and expenses (including but not limited to attorney&#39;s fees),
              resulting from or arising out of a) your use and access of the
              Service, b) your violation of any term of these Terms, c) your
              violation of any third-party right, including without limitation
              any copyright, property, or privacy right, or d) any claim that
              your User Content caused damage to a third party.
            </p>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">Limitation of Liability</h2>
            <p>
              In no event shall FibonacciKu, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from (i) your
              access to or use of or inability to access or use the Service;
              (ii) any conduct or content of any third party on the Service;
              (iii) any content obtained from the Service; and (iv) unauthorized
              access, use or alteration of your transmissions or content,
              whether based on warranty, contract, tort (including negligence)
              or any other legal theory, whether or not we have been informed of
              the possibility of such damage, and even if a remedy set forth
              herein is found to have failed of its essential purpose.
            </p>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">Changes</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide at least 30 days&#39; notice prior to any new terms taking
              effect. What constitutes a material change will be determined at
              our sole discretion.
            </p>
            <p>
              By continuing to access or use our Service after any revisions
              become effective, you agree to be bound by the revised terms. If
              you do not agree to the new terms, you are no longer authorized to
              use the Service.
            </p>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the
              laws of the applicable jurisdiction, without regard to its
              conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights. If any provision of
              these Terms is held to be invalid or unenforceable by a court, the
              remaining provisions of these Terms will remain in effect. These
              Terms constitute the entire agreement between us regarding our
              Service and supersede and replace any prior agreements we might
              have had between us regarding the Service.
            </p>
          </section>
          <section className="flex flex-col">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please don&#39;t
              hesitate to contact us to support@fibonacciku.com
            </p>
          </section>
          <section className="flex flex-col">
            <p className="text-lg font-semibold italic">FibonacciKu Team</p>
          </section>
        </main>
      </section>
    </main>
  )
}
