"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useShare } from "@/hooks/useShare";
import ShareModal from "@/components/ShareModal";

const Page = () => {
  const params = useParams<{ username: string }>();
  const [message, setMessages] = useState("");
  const [loading, setLoading] = useState(false);
  const { share, isModalOpen, setIsModalOpen, shareData } = useShare();
  const username = params.username;

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const [suggestedMessages] = useState(initialMessageString);

  const handleMessageClick = (msg: string) => {
    setMessages(msg);
  };

  const handleSubmit = async () => {
    if (!message.trim()) return toast.error("Message cannot be empty");

    try {
      setLoading(true);

      const { status } = await axios.post("/api/send-message", {
        username,
        content: message,
      });

      if (status === 201) {
        toast.success("Message sent successfully");
        setMessages(""); // clear input
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to send a message");
    } finally {
      setLoading(false);
    }
  };

  // const handleSuggestButton = async () => {
  //   try {
  //     const response = await axios.post<ApiResponse>("/api/suggest-messages");
  //     setSuggestedMessages(response.data.suggestions as string);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Error suggesting messages");
  //   }
  // };

  return (
    <>
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl shadow-sm border border-slate-100 relative">
        <div className="flex justify-end mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2 rounded-full text-blue-600 hover:bg-blue-50"
            onClick={() => share({
              title: "Send me anonymous messages 👀",
              text: "Send me anonymous messages 👀\nI’ll reply honestly",
              url: window.location.href,
            })}
          >
            <Share2 className="h-4 w-4" />
            Share Profile
          </Button>
        </div>
        <h1 className="text-3xl text-center font-bold text-black uppercase">
          SEND MESSAGE TO <span className="text-blue-600">@{username}</span>
        </h1>

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Send an anonymous message
          </label>
          <Textarea
            className="w-full"
            value={message}
            onChange={(e) => setMessages(e.target.value)}
            placeholder="Type your message..."
            rows={4}
          />
        </div>

        <div className="flex justify-center mt-6">
          <Button 
            onClick={handleSubmit} 
            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out" 
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message Anonymously"}
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Your message will be sent anonymously to @{username}. 
          </p>
        </div>

        {/* <div className="mt-4">
          <Button onClick={handleSuggestButton}>Suggest Messages</Button>
          <p className="mt-4">Click on any message to select</p>
        </div> */}

        <Card className="mt-8 border-blue-50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Need Inspiration?</CardTitle>
            <CardContent className="flex flex-col space-y-4 p-0 pt-4">
              {suggestedMessages.split("||").map((msg, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  className="bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300 whitespace-normal break-words h-auto py-3 px-4 shadow-sm text-gray-600 w-full text-left justify-start font-normal"
                  onClick={() => handleMessageClick(msg)}
                >
                  {msg}
                </Button>
              ))}
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      {shareData && (
        <ShareModal
          isOpen={isModalOpen}
          onClose={setIsModalOpen}
          title={shareData.title}
          text={shareData.text}
          url={shareData.url}
        />
      )}
    </>
  );
};

export default Page;
