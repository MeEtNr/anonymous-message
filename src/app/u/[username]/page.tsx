"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

const page = () => {
  const params = useParams<{ username: string }>();
  const [message, setMessages] = useState("");
  const username = params.username;
  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";
  const [suggestedMessages, setSuggestedMessages] =
    useState(initialMessageString);
  const debounced = useDebounceCallback(setMessages, 500);

  const handleMessageClick = (message: string) => {
    setMessages(message);
  };

  const handleSubmit = async () => {
    try {
      await axios
        .post("/api/send-message", {
          username,
          content: message,
        })
        .then((data) => {
          if (data.status === 201) {
            toast.success("Message sent successfuly");
          }
        });
    } catch (error) {
      toast.error("unable to send a message");
    }
  };

  const handleSuggestButton = async () => {
    try {
      await axios
        .post<ApiResponse>("/api/suggest-messages")
        .then((response) => {
          console.log(response.data.suggestions);

          setSuggestedMessages(response.data.suggestions as string);
        });
    } catch (error) {
      toast.error("error suggesting messages");
    }
  };
  return (
    <>
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-3xl text-center font-bold text-black">
          SEND MESSAGE TO <span className="text-orange-600">@{username}</span>
        </h1>

        <Textarea
          className="max-w-200 mt-4 "
          defaultValue={message}
          onChange={(e) => {
            debounced(e.target.value);
          }}
        />
        <div className="flex justify-center">
          <Button onClick={handleSubmit} className="mt-3 ">
            Send
          </Button>
        </div>

        <div className="mt-4">
          <Button className="" onClick={handleSuggestButton}>
            Suggest Messages
          </Button>
          <p className="mt-4">Click on any message to select</p>
        </div>

        <Card className="mt-3">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardContent className="flex flex-col space-y-4">
              {suggestedMessages.split("||").map((message, index) => (
                <Button
                  key={index}
                  type="submit"
                  className="bg-white whitespace-normal break-words h-14 shadow-gray-300 text-black mt-2 w-full"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))}
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};

export default page;
