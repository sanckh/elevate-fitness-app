import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsOfService() {
  return (
    <div className="flex-1">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: December 2024</p>
            </div>

            <Separator />

            <section className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Elevate Fitness, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Service Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Elevate Fitness provides:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Personalized workout plans tailored to your goals</li>
                  <li>Progress tracking for weight, body fat, and measurements</li>
                  <li>Access to a library of workouts and fitness resources</li>
                  <li>Tools to log and analyze your fitness journey</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">User Obligations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide accurate information</li>
                  <li>Maintain the security of your account</li>
                  <li>Not share your account credentials</li>
                  <li>Use the service for lawful purposes only</li>
                  <li>Not attempt to reverse engineer the service</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content and functionality on Elevate Fitness, including but not limited to text, graphics, logos, and software, is the property of Elevate Fitness or its licensors and is protected by copyright and other intellectual property laws.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Elevate Fitness is provided "as is" without any warranties. We are not liable for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Service interruptions or errors</li>
                  <li>Data loss or security breaches</li>
                  <li>Content accuracy or employment outcomes</li>
                  <li>Third-party services or links</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Suspend or terminate accounts for violations</li>
                  <li>Modify or discontinue services</li>
                  <li>Update these terms at any time</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these terms, please contact us at corey.sutton7@gmail.com.
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
