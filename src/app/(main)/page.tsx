
"use client";

import type React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFormStatus } from 'react-dom'; // Keep useFormStatus from react-dom
import { toast } from "@/hooks/use-toast";
import { WebsiteIcon, SmartphoneIcon } from "@/components/icons";
import { submitContactForm, type ContactFormState } from '@/actions/contactActions'; // Import server action
import { useEffect, useRef, useActionState } from 'react'; // Import useActionState from react

const products = [
  {
    id: "website-building",
    name: "Website Building",
    description: "Create stunning websites with ease.",
    icon: WebsiteIcon,
    link: "#",
  },
  {
    id: "mobile-apps",
    name: "Mobile Apps",
    description: "Develop powerful mobile apps for iOS and Android.",
    icon: SmartphoneIcon,
    link: "#",
  },
];

// Submit Button component
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="bg-accent-teal hover:bg-accent-teal/90 text-white">
            {pending ? 'Sending...' : 'Send Message'}
        </Button>
    );
}

// Explicitly type the component
const Home: React.FC = () => {
  const initialState: ContactFormState = { message: '', success: false };
  // Use useActionState instead of useFormState
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null); // Ref to reset the form

  useEffect(() => {
    if (state.success) {
      toast({
        title: "Success",
        description: state.message,
      });
      formRef.current?.reset(); // Reset form fields on success
    } else if (state.message && !state.success) {
      toast({
        title: "Error",
        description: state.message || "Failed to send message.", // Use state message or fallback
        variant: "destructive",
      });
    }
  }, [state]);


  return (
      <main className="container mx-auto py-12 px-4 flex-grow">
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <product.icon className="mr-2 h-6 w-6 text-primary" />
                    {product.name}
                  </CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button asChild variant="outline">
                    <a href={product.link}>Learn More</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6">Contact Us</h2>
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                We'd love to hear from you! Send us a message, and we'll get
                back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Use formAction with the server action */}
              <form ref={formRef} action={formAction} className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name" // Add name attribute
                    // value={name} // Remove controlled component state
                    // onChange={(e) => setName(e.target.value)} // Remove controlled component state
                    placeholder="Your Name"
                    required // Add basic HTML validation
                  />
                   {state.errors?.name && (
                        <p className="text-sm font-medium text-destructive mt-1">
                            {state.errors.name.join(', ')}
                        </p>
                   )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email" // Add name attribute
                    // value={email} // Remove controlled component state
                    // onChange={(e) => setEmail(e.target.value)} // Remove controlled component state
                     placeholder="Your Email"
                     required // Add basic HTML validation
                  />
                    {state.errors?.email && (
                        <p className="text-sm font-medium text-destructive mt-1">
                            {state.errors.email.join(', ')}
                        </p>
                   )}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message" // Add name attribute
                    // value={message} // Remove controlled component state
                    // onChange={(e) => setMessage(e.target.value)} // Remove controlled component state
                    placeholder="Your Message"
                    required // Add basic HTML validation
                  />
                    {state.errors?.message && (
                        <p className="text-sm font-medium text-destructive mt-1">
                            {state.errors.message.join(', ')}
                        </p>
                   )}
                </div>
                 {/* Display general form errors */}
                 {state.errors?._form && (
                        <p className="text-sm font-medium text-destructive">
                            {state.errors._form.join(', ')}
                        </p>
                 )}
                <SubmitButton /> {/* Use the SubmitButton component */}
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
  );
}

export default Home; // Ensure default export
