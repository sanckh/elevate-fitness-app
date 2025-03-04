
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import AnimatedButton from './AnimatedButton';

const ProductShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const products = [
    {
      title: 'Precision Design',
      description: 'Crafted with attention to every detail, our product delivers unparalleled quality and performance.',
      image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Seamless Experience',
      description: 'Intuitive interactions and thoughtful design create a product that feels natural to use.',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Beautiful Simplicity',
      description: 'Eliminating the unnecessary to focus on what truly matters in your experience.',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % products.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isInView, products.length]);
  
  return (
    <div ref={containerRef} className="w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 max-w-lg mx-auto lg:mx-0">
            <h2 className="h2 animate-slide-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
              Experience perfection in form and function
            </h2>
            <p className="text-lg text-muted-foreground animate-slide-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              Every detail matters. We've crafted a product that combines beautiful design with intuitive functionality.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4 animate-slide-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
              <AnimatedButton variant="primary" size="lg">
                Explore Products
              </AnimatedButton>
              <AnimatedButton variant="outline" size="lg">
                Learn More
              </AnimatedButton>
            </div>
          </div>
          
          <div className="relative h-[400px] md:h-[500px] w-full animate-fade-in opacity-0" style={{ animationDelay: '700ms', animationFillMode: 'forwards' }}>
            {products.map((product, idx) => (
              <div
                key={idx}
                className={cn(
                  "absolute inset-0 rounded-3xl shadow-glossy overflow-hidden transition-all duration-1000",
                  activeIndex === idx ? "opacity-100 translate-x-0 rotate-0 scale-100" : "opacity-0 translate-x-8 rotate-2 scale-95"
                )}
                aria-hidden={activeIndex !== idx}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6 text-white">
                  <h3 className="text-xl font-display font-medium mb-2">{product.title}</h3>
                  <p className="text-sm text-white/90">{product.description}</p>
                </div>
              </div>
            ))}
            
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    activeIndex === idx ? "bg-white" : "bg-white/40"
                  )}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductShowcase;
