import { Message, Question } from "@/models/User";

export interface ApiResponse {
  success: boolean;
  message: string; //this is api response message
  isAcceptingMessages?: boolean;
  messages?: Array<Message>; // this is a array of user messages
  questions?: Array<Question>;
  question?: Question;
  suggestions?: string;
}
