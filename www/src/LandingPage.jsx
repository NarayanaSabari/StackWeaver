import React from "react";
import webpageImage from "./assets/webpage-image.jpg";

function copyToClipboard() {
    navigator.clipboard.writeText("npm install -g stackweaver")
}

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="container mx-auto py-16 text-center  pt-32">
        <h1 className="text-9xl font-bold mb-4">Stackweaver</h1>
        <p className="text-xl mb-8">
          The ultimate MERN stack project initializer for modern web development
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={copyToClipboard}>
            npm install -g stackweaver
          </button>
          {/* <button className="border border-blue-400 text-blue-400 hover:bg-blue-900 font-bold py-2 px-4 rounded">
            Documentation
          </button> */}
        </div>
      </header>

      <main className="container mx-auto py-16">
        <section className="mb-32">
          <h2 className="text-4xl font-bold mb-16 text-center">
            Why Choose Stackweaver?
          </h2>
          <FeatureSection
            title="Lightning-Fast Setup"
            description="Stackweaver revolutionizes your MERN stack development process. With a single command, you'll have a fully configured project ready to go. Say goodbye to hours of setup and hello to instant productivity."
            features={[
              "Pre-configured MERN stack environment",
              "TypeScript support out of the box",
              "Optimized for developer productivity",
            ]}
            isReversed={false}
          />
          <FeatureSection
            title="Cutting-Edge Technology Stack"
            description="Stay ahead of the curve with Stackweaver's carefully curated technology stack. We've handpicked the best tools and libraries to ensure your project is built on a solid foundation."
            features={[
              "React with Next.js for powerful frontend development",
              "Express.js backend with MongoDB integration",
              "GraphQL support for flexible data querying",
            ]}
            isReversed={true}
          />
          {/* Add more FeatureSection components as needed */}
        </section>

        <section className="mb-32">
          <h2 className="text-4xl font-bold mb-16 text-center">
            Get Started in Seconds
          </h2>
          <div className="grid grid-cols-2 gap-10 items-center">
            <div>
              <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
                <h3 className="text-2xl font-semibold mb-4">
                  Initialize Your Project
                </h3>
                <code className="text-green-400 text-lg block mb-4">
                  stackweaver
                </code>
                <p className="text-gray-300 mb-6">
                  This command sets up your entire MERN stack project with all
                  the bells and whistles.
                </p>
              </div>
              {/* Add more content as needed */}
            </div>
            <div>
              <img src={webpageImage} alt="webpage-image"/>
            </div>
          </div>
        </section>

        <section className="mb-32">
          <h2 className="text-4xl font-bold mb-16 text-center">
            What Developers Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Stackweaver cut my project setup time from hours to minutes. It's an absolute game-changer for my productivity."
              author="Mugilan, Full-stack Developer"

            />
            <TestimonialCard
              quote="StackWeaver saved me hours by quickly setting up my MERN stack projects with Tailwind CSS and ShadCN UI. It’s a game-changer!"
              author="Kavin, Full-stack Developer"

            />
            <TestimonialCard
              quote="StackWeaver takes the hassle out of project setup. It’s intuitive and lets me focus on coding rather than configuration."
              author="Melvin, Full-stack Developer"

            />
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto text-center">
          <p className="text-gray-400 mb-4">
            &copy; 2024 Stackweaver. Empowering developers to build
            extraordinary MERN stack applications.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="https://github.com/NarayanaSabari/StackWeaver" className="text-gray-400 hover:text-white">
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/stackweaver" className="text-gray-400 hover:text-white">
              npm
            </a>
          
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureSection = ({ title, description, features, isReversed }) => (
  <div
    className={`flex flex-col ${
      isReversed ? "md:flex-row-reverse" : "md:flex-row"
    } items-center mb-24`}
  >
    <div className="md:w-1/2 mb-8 md:mb-0">
      <h3 className="text-3xl font-bold mb-4">{title}</h3>
      <p className="text-gray-300 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <span className="mr-2 text-green-500">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
    <div className="md:w-1/2 flex justify-center">
      <div className="w-48 h-48 bg-gray-800 rounded-full flex items-center justify-center">
        {/* Placeholder for icon */}
        <span className="text-6xl">🚀</span>
      </div>
    </div>
  </div>
);

const TestimonialCard = ({ quote, author, company }) => (
  <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
    <p className="text-lg text-gray-300 italic mb-4">"{quote}"</p>
    <p className="text-blue-400 font-semibold">{author}</p>
    <p className="text-gray-400">{company}</p>
  </div>
);

export default LandingPage;
