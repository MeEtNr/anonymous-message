import { Message } from "@/models/User";

export interface ApiResponse {
  success: boolean;
  message: string; //this is api response message
  isAcceptingMessages?: boolean;
  messages?: Array<Message>; // this is a array of user messages
  suggestions?: string;
}
