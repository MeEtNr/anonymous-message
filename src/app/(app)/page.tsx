"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-white flex flex-col">
        <section className="flex flex-col items-center justify-center flex-1 px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Send Anonymous Messages
          </h2>
          <p className="text-gray-600 max-w-md mb-6">
            Connect with friends, colleagues, and strangers without revealing
            your identity. Start a conversation, leave a message, or just share
            your thoughts anonymously.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg">
            Get Started
          </Button>
        </section>

        <section className="flex flex-col items-center justify-center flex-1 py-4 px-4 text-center">
          <Carousel className="w-128" plugins={[Autoplay({ delay: 2000 })]}>
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem
                  key={index}
                  className="flex justify-center items-center"
                >
                  <div className="p-1">
                    <Card className="w-96 h-auto shadow-md">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-orange-600">
                          {message.title}
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                          Received: {message.received}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex items-center justify-center p-6">
                        <span className="text-lg font-semibold text-center">
                          {message.content}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-orange-600">
                  Stay Anonymous
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your identity is safe. Share your thoughts freely without
                  revealing who you are.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-orange-600">
                  Instant Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Messages are delivered instantly. No delays, just pure, fast
                  communication.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="text-orange-600">
                  Secure & Simple
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built with privacy in mind, ensuring a smooth and safe
                  experience for everyone.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
