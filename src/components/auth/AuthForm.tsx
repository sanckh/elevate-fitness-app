import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { resendVerificationEmail } from "@/api/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";


const baseSchema = {
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
};

const signUpSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object(baseSchema);

type SignUpFormData = z.infer<typeof signUpSchema>;
type SignInFormData = z.infer<typeof signInSchema>;
type FormData = SignUpFormData | SignInFormData;

interface AuthFormProps {
    isSignUp: boolean;
    onToggleMode: () => void;
  }
const defaultValues = {
  email: "",
  password: "",
  confirmPassword: "",
};

export const AuthForm = ({ isSignUp, onToggleMode }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reset form when switching modes
  useEffect(() => {
    form.reset(defaultValues);
  }, [isSignUp, form]);

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to resend verification email. Please try again.");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (isSignUp) {
        const { error, confirmEmail } = await signUp(data.email, data.password);
        if (error) {
          // Handle Firebase auth errors
          const errorCode = (error as { code?: string }).code;
          let errorMessage = error.message;
          
          switch(errorCode) {
            case 'auth/email-already-in-use':
              errorMessage = 'This email is already registered. Please sign in instead.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Please enter a valid email address.';
              break;
            case 'auth/weak-password':
              errorMessage = 'Password is too weak. Please choose a stronger password.';
              break;
          }
          toast.error(errorMessage);
        } else if (confirmEmail) {
          toast.message(
            "Account created successfully! ",
            {
              description: "Please check your email to verify your account before signing in.",
              duration: 10000,
              className: "bg-primary/10 border-primary text-lg",
              action: {
                label: "Resend Email",
                onClick: handleResendVerification
              }
            }
          );
          onToggleMode(); // Switch to sign in mode
          form.reset(defaultValues);
        } else {
          toast.success("Account created successfully!");
          navigate("/");
        }
      } else {
        try {
          await signIn(data.email, data.password);
          toast.success("Signed in successfully!");
          navigate("/");
        } catch (error) {
          // Handle Firebase auth errors for sign in
          const errorCode = (error as { code?: string }).code;
          let errorMessage = (error as Error).message;
          
          switch(errorCode) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              errorMessage = 'Invalid email or password.';
              break;
            case 'auth/user-disabled':
              errorMessage = 'This account has been disabled.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Too many failed attempts. Please try again later.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Please enter a valid email address.';
              break;
          }
          if (error.message.includes('verify your email')) {
            toast.error(
              <div>
                {errorMessage}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal underline ml-2"
                  onClick={handleResendVerification}
                >
                  Resend verification email
                </Button>
              </div>
            );
          } else {
            toast.error(errorMessage);
          }
        }
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication error");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Elevate Fitness</h1>
          <p className="text-muted-foreground mt-2">Track your fitness journey</p>
        </div>
        
        <div className="bg-card shadow-md rounded-lg p-6 border border-border">
          <Tabs defaultValue={isSignUp ? "signup" : "signin"} value={isSignUp ? "signup" : "signin"} onValueChange={(value) => {
            if ((value === "signup") !== isSignUp) {
              onToggleMode();
            }
          }}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isSignUp && (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {isSignUp && (
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, and one number
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? isSignUp
                      ? "Creating account..."
                      : "Signing in..."
                    : isSignUp
                    ? "Sign Up"
                    : "Sign In"}
                </Button>
              </form>
            </Form>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
