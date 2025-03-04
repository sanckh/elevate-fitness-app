
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedButton from '@/components/AnimatedButton';
import ProductShowcase from '@/components/ProductShowcase';
import { cn } from '@/lib/utils';

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const translateY = scrollY * 0.2;
      
      heroRef.current.style.transform = `translateY(${translateY}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      
      {/* Hero section */}
      <section className="relative pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-24 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6 animate-fade-in opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              Elevate Fitness
            </span>
            
            <h1 className="h1 mb-6 animate-slide-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              Your complete fitness journey in one app
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
              Track workouts, monitor nutrition, set goals, and visualize your progress all in one place.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center animate-slide-up opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
              <Link to="/dashboard">
                <AnimatedButton variant="primary" size="lg">
                  Get Started
                </AnimatedButton>
              </Link>
              <AnimatedButton variant="outline" size="lg">
                Learn More
              </AnimatedButton>
            </div>
          </div>
        </div>
        
        {/* Abstract background shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl pointer-events-none z-0" ref={heroRef}>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl animate-float opacity-70"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-200/20 rounded-full filter blur-3xl animate-float opacity-70" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-purple-100/10 rounded-full filter blur-3xl animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="h2 mb-4">All your fitness needs in one place</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive solution designed to help you achieve your fitness goals with ease.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Workout Tracking',
                description: 'Log your workouts, track your sets, reps, and weights with detailed analytics.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 11V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.5"></path>
                    <path d="M14 10V8a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
                    <path d="M10 9.5V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v9"></path>
                    <path d="M6 14v1a6 6 0 0 0 12 0v-1"></path>
                  </svg>
                )
              },
              {
                title: 'Nutrition Management',
                description: 'Monitor your daily calories, macronutrients, and build healthier eating habits.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                    <path d="M19.5 10a7.5 7.5 0 1 0-15 0"></path>
                    <path d="M12 12v8"></path>
                    <path d="M8 16h8"></path>
                  </svg>
                )
              },
              {
                title: 'Progress Tracking',
                description: 'Visualize your journey with progress photos, measurements, and achievement badges.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
                  </svg>
                )
              }
            ].map((feature, idx) => (
              <div 
                key={feature.title} 
                className={cn(
                  "flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-border/50 shadow-subtle hover:shadow-elevated transition-all duration-300 animate-fade-in opacity-0",
                  idx === 0 ? "animate-slide-up" : idx === 1 ? "animate-slide-up animate-delay-200" : "animate-slide-up animate-delay-300"
                )}
                style={{ animationFillMode: 'forwards' }}
              >
                <div className="rounded-full p-3 bg-primary/10 text-primary mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-medium mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Product showcase section */}
      <ProductShowcase />
      
      {/* Testimonial section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="h2 mb-4">Transformations that inspire</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands who have changed their lives with Elevate Fitness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "This app helped me stay consistent with my workouts and track my progress in ways I never could before.",
                author: "Alex Johnson",
                role: "Lost 30 lbs in 6 months"
              },
              {
                quote: "The nutrition tracking features completely changed my relationship with food and helped me reach my goals.",
                author: "Samantha Lee",
                role: "Gained 12 lbs of muscle"
              },
              {
                quote: "Setting goals and tracking progress has never been easier. This is the app I've been waiting for.",
                author: "Michael Chen",
                role: "Improved 5K time by 7 minutes"
              }
            ].map((testimonial, idx) => (
              <div 
                key={testimonial.author}
                className={cn(
                  "flex flex-col p-8 rounded-2xl bg-white border border-border/50 shadow-subtle animate-fade-in opacity-0",
                  idx === 0 ? "animate-slide-up" : idx === 1 ? "animate-slide-up animate-delay-200" : "animate-slide-up animate-delay-300"
                )}
                style={{ animationFillMode: 'forwards' }}
              >
                <div className="mb-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <blockquote className="flex-1 mb-4 italic text-lg">"{testimonial.quote}"</blockquote>
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-8 md:p-12 lg:p-16">
            <div className="relative z-10 max-w-2xl">
              <h2 className="h2 mb-4">Start your fitness journey today</h2>
              <p className="text-lg opacity-90 mb-8">
                Join Elevate Fitness and transform your approach to health and wellness with our all-in-one solution.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <AnimatedButton
                    className="bg-white text-primary hover:bg-white/90"
                    size="lg"
                  >
                    Get Started
                  </AnimatedButton>
                </Link>
                <AnimatedButton
                  className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/20"
                  size="lg"
                >
                  Learn More
                </AnimatedButton>
              </div>
            </div>
            
            {/* Abstract background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 translate-x-1/3 rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 -translate-x-1/3 translate-y-1/3 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
