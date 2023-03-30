import ChatPrompt from "@/components/ChatPrompt";
import ChatResponse from "@/components/ChatResponse";
import { useEffect, useRef, useState } from "react";

interface UserMessage {
    role: string;
    content: any;
}

// Chat component
export default function Chat() {
    // State to hold the list of messages
    const [messages, setMessages] = useState<UserMessage[]>([]);
    // Reference for scrolling to the bottom of the chat
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    // Function to handle user messages
    function handleUserMessage(newMessage: UserMessage) {
        // Add the new message to the list of messages
        setMessages((prevMessages) => [
            newMessage,
            ...prevMessages,
        ]);
    }

    // Scroll to the bottom of the chat whenever a new message is added
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Function to scroll the chat to the bottom
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    // Render the chat component
    return (
        <div className="flex flex-col items-center h-screen">
            <div className="flex flex-col-reverse flex-grow w-full overflow-y-auto">
                {/* Display each message in the chat */}
                {messages.map((message, index) => (
                    <ChatResponse key={index} message={message} />
                ))}
            </div>
            {/* Empty div to help with scrolling */}
            <div ref={messagesEndRef}></div>
            {/* Chat input component */}
            <div className="w-full">
                <ChatPrompt onMessageSubmit={handleUserMessage} />
            </div>
        </div>
    )
}