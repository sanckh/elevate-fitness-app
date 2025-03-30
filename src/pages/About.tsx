import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Elevate Fitness</h1>
          
          <div className="prose prose-lg">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">The Creator's Journey</h2>
              <p className="text-muted-foreground mb-6">
                Before becoming a software engineer, I spent many years working in the fitness industry. This unique background gave me firsthand experience with the challenges and needs of both fitness professionals and enthusiasts. Now, as the founder of The Tech Talent Blueprint - a brand encompassing multiple innovative apps - I'm leveraging my combined expertise in fitness and technology to create solutions that make a difference.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">The Birth of Elevate Fitness</h2>
              <p className="text-muted-foreground mb-6">
                Elevate Fitness is one of the flagship applications under The Tech Talent Blueprint brand. It represents the perfect fusion of my two passions: fitness and technology. Having worked on both sides of this divide, I recognized the need for a comprehensive, user-friendly fitness tracking solution that could adapt to individual needs and goals.
              </p>
              <p className="text-muted-foreground mb-6">
                Drawing from my experience in the fitness industry and software engineering skills, I've designed Elevate Fitness to combine practical fitness knowledge with modern technology. Whether you're a beginner or an experienced athlete, this app provides the tools you need to succeed in your fitness journey.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Vision for the Future</h2>
              <p className="text-muted-foreground">
                Through The Tech Talent Blueprint, I'm committed to creating technology that makes a real impact in people's lives. Elevate Fitness is a testament to this commitment - making fitness tracking accessible, intuitive, and effective for everyone. I continuously improve and evolve the platform based on user feedback and emerging fitness trends, always focusing on helping you achieve your fitness goals with seamless and motivating tools.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
