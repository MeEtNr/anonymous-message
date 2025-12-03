"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

const Page = () => {
  const params = useParams<{ username: string }>();
  const [message, setMessages] = useState("");
  const [loading, setLoading] = useState(false);
  const username = params.username;

  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const [suggestedMessages, setSuggestedMessages] =
    useState(initialMessageString);

  const debounced = useDebounceCallback(setMessages, 500);

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

  const handleSuggestButton = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages");
      setSuggestedMessages(response.data.suggestions as string);
    } catch (error) {
      console.log(error);
      toast.error("Error suggesting messages");
    }
  };

  return (
    <>
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-3xl text-center font-bold text-black">
          SEND MESSAGE TO <span className="text-orange-600">@{username}</span>
        </h1>

        <Textarea
          className="max-w-200 mt-4"
          value={message}
          onChange={(e) => setMessages(e.target.value)}
        />

        <div className="flex justify-center">
          <Button onClick={handleSubmit} className="mt-3" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>

        <div className="mt-4">
          <Button onClick={handleSuggestButton}>Suggest Messages</Button>
          <p className="mt-4">Click on any message to select</p>
        </div>

        <Card className="mt-3">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardContent className="flex flex-col space-y-4">
              {suggestedMessages.split("||").map((msg, index) => (
                <Button
                  key={index}
                  type="button"
                  className="bg-white whitespace-normal break-words h-14 shadow-gray-300 text-black mt-2 w-full"
                  onClick={() => handleMessageClick(msg)}
                >
                  {msg}
                </Button>
              ))}
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};

export default Page;
