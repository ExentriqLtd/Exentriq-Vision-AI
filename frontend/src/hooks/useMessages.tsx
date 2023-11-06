// hooks/useMessages.js
import { useState } from "react";
import { ROLE, MESSAGE_STATUS } from "~/types/conversation";
import type { Message } from "~/types/conversation";
import { getDateWithUTCOffset } from "~/utils/timezone";

const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const userSendMessage = (content: string, uuidv4: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,

      {
        id: uuidv4,
        conversationId,
        content,
        role: ROLE.USER,
        status: MESSAGE_STATUS.PENDING,
        created_at: getDateWithUTCOffset(),
      },
    ]);
  };

  const setErrorMessage = (id: string) => {
    setMessages((prevMessages) => {
      const existingMessageIndex = prevMessages.findIndex(
        (msg) => msg.id === id
      );
      // Update the existing message
      if (existingMessageIndex > -1) {
        const updatedMessages = [...prevMessages];
        //@ts-ignore
        updatedMessages[existingMessageIndex] = { ...updatedMessages[existingMessageIndex], errorUi: true };
        return updatedMessages;
      }

      // Add a new message if it doesn't exist
      return messages;
    });
  }

  const systemSendMessage = (message: Message) => {
    setMessages((prevMessages) => {
      const existingMessageIndex = prevMessages.findIndex(
        (msg) => msg.id === message.id
      );

      // Update the existing message
      if (existingMessageIndex > -1) {
        const updatedMessages = [...prevMessages];
        updatedMessages[existingMessageIndex] = message;
        return updatedMessages;
      }

      // Add a new message if it doesn't exist
      return [...prevMessages, message];
    });
  };

  return {
    messages,
    setErrorMessage,
    userSendMessage,
    setMessages,
    systemSendMessage,
  };
};

export default useMessages;
