
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { AnimatedButtonProps } from '@/interfaces/buttonProp';

const AnimatedButton = ({
  variant = 'primary',
  size = 'default',
  children,
  className,
  ...props
}: AnimatedButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10'
  };
  
  return (
    <button 
      className={cn(
        "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        "overflow-hidden",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={props.disabled}
      {...props}
    >
      <span className={cn(
        "relative z-10 transition-transform duration-300",
        isHovering && "transform -translate-y-px"
      )}>
        {children}
      </span>
      
      <span className={cn(
        "absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300",
        isHovering && "opacity-100"
      )} />
    </button>
  );
};

export default AnimatedButton;
