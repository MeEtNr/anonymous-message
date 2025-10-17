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
      <main className="min-h-screen bg-background flex flex-col">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center flex-1 px-6 text-center py-12 sm:py-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Send Anonymous Messages
          </h2>
          <p className="text-muted-foreground max-w-lg mb-6 text-sm sm:text-base md:text-lg">
            Connect with friends, colleagues, and strangers without revealing
            your identity. Start a conversation, leave a message, or just share
            your thoughts anonymously.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg transition-all duration-300">
            Get Started
          </Button>
        </section>

        {/* Carousel Section */}
        <section className="flex flex-col items-center justify-center flex-1 py-10 px-4 bg-background">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
            <Carousel plugins={[Autoplay({ delay: 2000 })]}>
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem
                    key={index}
                    className="flex justify-center items-center"
                  >
                    <div className="p-2 sm:p-4 w-full">
                      <Card className="w-full shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl bg-card border border-border">
                        <CardHeader>
                          <CardTitle className="text-xl sm:text-2xl font-bold text-primary">
                            {message.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground text-sm">
                            Received: {message.received}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="flex items-center justify-center p-4 sm:p-6">
                          <span className="text-base sm:text-lg font-semibold text-center text-foreground">
                            {message.content}
                          </span>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 rounded-2xl border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-primary text-lg sm:text-xl font-semibold">
                  Stay Anonymous
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Your identity is safe. Share your thoughts freely without
                  revealing who you are.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 rounded-2xl border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-primary text-lg sm:text-xl font-semibold">
                  Instant Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Messages are delivered instantly. No delays, just pure, fast
                  communication.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 rounded-2xl border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-primary text-lg sm:text-xl font-semibold">
                  Secure & Simple
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
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
