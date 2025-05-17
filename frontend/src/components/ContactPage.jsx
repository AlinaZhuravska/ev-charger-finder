import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

function ContactPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-5 pt-24 pb-8"> {/* добавлен pt-24 */}
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Contact form box */}
      <div className="relative z-10 w-full max-w-md bg-white text-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">Contact Us</h2>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-600">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Your message"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Send
          </button>
        </form>

        {/* Icon Row */}
        <div className="pt-4 flex justify-center space-x-6 text-gray-600 text-2xl">
          <a
            href="mailto:alina.zhuravska@powercoders.org"
            className="hover:text-yellow-500"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
          <a
            href="https://github.com/alinazhuravska"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-500"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/alina-zhuravska/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow-500"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
