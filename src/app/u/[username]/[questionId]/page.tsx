"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionData {
  _id: string;
  content: string;
  username: string;
  createdAt: string;
}

const QuestionPage = () => {
  const params = useParams<{ username: string; questionId: string }>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [question, setQuestion] = useState<QuestionData | null>(null);

  const username = params.username;
  const questionId = params.questionId;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`/api/get-question-info/${questionId}`);
        if (response.data.success) {
          setQuestion(response.data.question);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        toast.error("Failed to load question");
      } finally {
        setFetching(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleSubmit = async () => {
    if (!message.trim()) return toast.error("Message cannot be empty");

    try {
      setLoading(true);

      const { status } = await axios.post("/api/send-question-message", {
        questionId,
        content: message,
      });

      if (status === 201) {
        toast.success("Message sent successfully");
        setMessage(""); // clear input
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to send a message");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <Skeleton className="h-10 w-3/4 mx-auto mb-6" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-10 w-24 mx-auto" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-red-600">Question Not Found</h1>
        <p className="mt-4">The question you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-3xl text-center font-bold text-black uppercase">
        Question for <span className="text-orange-600">@{username}</span>
      </h1>

      <Card className="mt-6 border-2 border-orange-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">
            {question.content}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Send an anonymous message
        </label>
        <Textarea
          className="w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your anonymous message here..."
          rows={4}
        />
      </div>

      <div className="flex justify-center mt-6">
        <Button onClick={handleSubmit} className="px-8 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out" disabled={loading}>
          {loading ? "Sending..." : "Send Message Anonymously"}
        </Button>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-500 text-sm">
          Your message will be sent anonymously to @{username}. 
        </p>
      </div>
    </div>
  );
};

export default QuestionPage;
