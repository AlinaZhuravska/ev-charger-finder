import React from "react";
import TypingText from "../components/TypingText";

const sections = [
  `1. What Information We Collect
We may collect personal data such as your name, email address, location, and usage data. This information is collected when you use our service to provide you with a more personalized and efficient experience.`,

  `2. How We Use Your Information
We use your data to enhance your experience with EV Finder. This includes personalizing your recommendations, improving the accuracy of our services, communicating with you, and offering customer support.`,

  `3. Sharing of Information
Your information is never sold to third parties. We may share your information with trusted partners or service providers who assist in operating our services, subject to strict confidentiality agreements. We may also share data when required by law or to protect the rights, property, or safety of our users.`,

  `4. Data Security
We take standard security measures to protect your personal information from unauthorized access, disclosure, or destruction. This includes encryption, access control, and regular security audits. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.`,

  `5. Your Rights
You have the right to request access to, correction of, or deletion of your personal information. You may also have the right to restrict or object to the processing of your data. To exercise these rights, please contact us at the details provided below.`,

  `6. Contact Us
If you have questions or concerns about this Privacy Policy or your data, contact us at:  
Email: alina.zhuravska@powercoders.org  
We will respond to your inquiry as soon as possible.`,

  `7. Changes to This Policy
We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the updated policy on our website and indicating the effective date. Please review this policy regularly for any updates.`,
];

const PrivacyPage = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 max-w-xl">Effective Date: May 6, 2025</p>
      </section>

      <main className="max-w-3xl mx-auto px-4 pb-12 text-gray-800 space-y-8">
        {sections.map((section, index) => (
          <div key={index}>
            <TypingText
              text={section}
              speed={30}
              className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap"
            />
          </div>
        ))}
      </main>
    </>
  );
};

export default PrivacyPage;
