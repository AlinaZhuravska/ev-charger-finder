import React from "react";
import TypingText from "../components/TypingText";

const sections = [
  `1. About EV Finder
EV Finder is a platform designed to help electric vehicle users easily locate charging stations based on their preferences and location. Our mission is to make the transition to electric mobility seamless and accessible.`,

  `2. Our Mission
We aim to support the growth of sustainable transportation by providing accurate, real-time information about EV charging infrastructure. We believe in a cleaner, greener future.`,

  `3. Who We Are
We are a passionate team of developers, designers, and sustainability advocates committed to building tools that empower EV users around the world.`,

  `4. Technology Behind EV Finder
Our platform integrates modern web technologies and real-time data from trusted sources to provide users with an intuitive, fast, and responsive experience.`,

  `5. Get Involved
We are always looking for feedback, collaborations, or contributions. If you'd like to get involved, feel free to reach out to us!`,

  `6. Contact Us
For any inquiries or suggestions, you can contact us at:  
Email: alina.zhuravska@powercoders.org`,

  `7. Future Vision
We’re continuously improving our service with new features like route planning, station availability predictions, and user reviews. Stay tuned!`,
];

const AboutPage = () => {
  return (
    <>
      {/* Заголовок как в PrivacyPage */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">About EV Finder</h1>
        <p className="text-gray-600 max-w-xl">Learn more about our mission, team, and technology.</p>
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

export default AboutPage;
