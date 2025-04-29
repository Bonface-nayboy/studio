
"use client";

import type React from 'react'; // Explicit import
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
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { WebsiteIcon, SmartphoneIcon } from "@/components/icons"; // Use SmartphoneIcon

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
    icon: SmartphoneIcon, // Use SmartphoneIcon
    link: "#",
  },
];

// Explicitly type the component
const Home: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    try {
      //   const response = await fetch('/api/contact', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ name, email, message }),
      //   });

      //   if (response.ok) {
      toast({
        title: "Success",
        description: "Your message has been sent!",
      });
      setName("");
      setEmail("");
      setMessage("");
      //   } else {
      //     throw new Error('Failed to send message');
      //   }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

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
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                     placeholder="Your Email"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your Message"
                  />
                </div>
                <Button type="submit" className="bg-accent-teal hover:bg-accent-teal/90 text-white">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
  );
}

export default Home; // Ensure default export
