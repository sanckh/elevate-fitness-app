
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedButton from '@/components/AnimatedButton';
import { cn } from '@/lib/utils';

// Dashboard sections
const sections = [
  {
    id: 'workout-tracker',
    title: 'Workout Tracker',
    description: 'Log and track your workouts over time',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 11V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.5"></path>
        <path d="M14 10V8a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
        <path d="M10 9.5V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v9"></path>
        <path d="M6 14v1a6 6 0 0 0 12 0v-1"></path>
      </svg>
    ),
    color: 'bg-blue-500/10 text-blue-500'
  },
  {
    id: 'nutrition',
    title: 'Nutrition Tracker',
    description: 'Monitor your daily calories and macronutrients',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
        <path d="M19.5 10a7.5 7.5 0 1 0-15 0"></path>
        <path d="M12 12v8"></path>
        <path d="M8 16h8"></path>
      </svg>
    ),
    color: 'bg-green-500/10 text-green-500'
  },
  {
    id: 'goals',
    title: 'Fitness Goals',
    description: 'Set and track your personal fitness objectives',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
      </svg>
    ),
    color: 'bg-purple-500/10 text-purple-500'
  },
  {
    id: 'progress',
    title: 'Progress Photos',
    description: 'Visualize your transformation journey',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 8h.01"></path>
        <rect width="16" height="16" x="4" y="4" rx="3"></rect>
        <path d="m4 15 4-4a3 5 0 0 1 3 0l5 5"></path>
        <path d="m14 14 1-1a3 5 0 0 1 3 0l2 2"></path>
      </svg>
    ),
    color: 'bg-amber-500/10 text-amber-500'
  }
];

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Elevate Fitness Dashboard</h1>
            <p className="text-primary-foreground/80">Track, analyze, and improve your fitness journey</p>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Workouts', value: '0', change: '+0%' },
              { label: 'Active Days', value: '0', change: '+0%' },
              { label: 'Calories Burned', value: '0', change: '+0%' },
              { label: 'Goals Met', value: '0', change: '+0%' }
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="bg-white border border-border/50 rounded-xl p-4 shadow-subtle"
              >
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <span className="text-xs font-medium text-green-500">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dashboard Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {sections.map((section) => (
              <div 
                key={section.id} 
                className={cn(
                  "bg-white border border-border/50 rounded-xl p-6 shadow-subtle cursor-pointer transition-all duration-300",
                  activeSection === section.id ? "ring-2 ring-primary/20" : "hover:shadow-elevated"
                )}
                onClick={() => setActiveSection(section.id === activeSection ? null : section.id)}
              >
                <div className="flex items-start">
                  <div className={cn("rounded-full p-3 mr-4", section.color)}>
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{section.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{section.description}</p>
                    <AnimatedButton 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                    >
                      Open {section.title}
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white border border-border/50 rounded-xl p-6 shadow-subtle mb-8">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <AnimatedButton 
                variant="primary" 
                size="sm"
              >
                Log Workout
              </AnimatedButton>
              <AnimatedButton 
                variant="outline" 
                size="sm"
              >
                Track Meal
              </AnimatedButton>
              <AnimatedButton 
                variant="outline" 
                size="sm"
              >
                Record Weight
              </AnimatedButton>
              <AnimatedButton 
                variant="outline" 
                size="sm"
              >
                Add Progress Photo
              </AnimatedButton>
            </div>
          </div>
          
          {/* Return to Home */}
          <div className="text-center">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
