
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
              Introducing Luminous
            </span>
            
            <h1 className="h1 mb-6 animate-slide-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              Beautifully crafted products for a better experience
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
              Experience the perfect balance of form and function, designed with precision and care to elevate your everyday interactions.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center animate-slide-up opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
              <AnimatedButton variant="primary" size="lg">
                Get Started
              </AnimatedButton>
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
            <h2 className="h2 mb-4">Thoughtfully designed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every detail matters. We've created products that combine beautiful aesthetics with exceptional functionality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Precision',
                description: 'Meticulously crafted with attention to every detail for a perfect experience.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path>
                    <path d="m15 9-3 3-3-3"></path>
                    <path d="M12 12v5"></path>
                  </svg>
                )
              },
              {
                title: 'Simplicity',
                description: 'Intuitive design that eliminates complexity and focuses on what truly matters.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg>
                )
              },
              {
                title: 'Functionality',
                description: 'Every feature serves a purpose, creating a seamless and effortless experience.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12.9 7.1C14.2 7.4 15.3 8.5 15.6 9.8"></path>
                    <path d="M9.1 11.5a5 5 0 0 1 5.4-5.4"></path>
                    <path d="M9.1 11.5a5 5 0 0 0 5.4 5.4"></path>
                    <path d="M15.6 14.2a5 5 0 0 1-2.7 2.7"></path>
                    <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z"></path>
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
            <h2 className="h2 mb-4">What our customers say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from people who have experienced the difference our products make.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "The attention to detail and intuitive design make this product a joy to use every day.",
                author: "Alex Johnson",
                role: "Creative Director"
              },
              {
                quote: "Exceptional quality that exceeds expectations. This has completely transformed how I work.",
                author: "Samantha Lee",
                role: "Product Designer"
              },
              {
                quote: "Beautiful, functional, and thoughtfully designed. Exactly what I've been looking for.",
                author: "Michael Chen",
                role: "Entrepreneur"
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
              <h2 className="h2 mb-4">Ready to experience the difference?</h2>
              <p className="text-lg opacity-90 mb-8">
                Join thousands of satisfied customers who have transformed their daily experience with our products.
              </p>
              <div className="flex flex-wrap gap-4">
                <AnimatedButton
                  className="bg-white text-primary hover:bg-white/90"
                  size="lg"
                >
                  Get Started
                </AnimatedButton>
                <AnimatedButton
                  className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/20"
                  size="lg"
                >
                  Contact Sales
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
