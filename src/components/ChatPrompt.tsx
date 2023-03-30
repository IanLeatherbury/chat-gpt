import { useRef, useState } from 'react'

interface UserMessage {
    role: string;
    content: any;
    totalTokens?: number;
}


async function sendMessage(messages: UserMessage[]): Promise<{ content: string; totalTokens: number, promptTokens: number, completionTokens: number }> {
    try {
        const response = await fetch('/api/openai-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });

        const data = await response.json();

        if (data) {
            return {
                content: data.message.content,
                totalTokens: data.total_tokens ? data.total_tokens : 0,
                promptTokens: data.prompt_tokens ? data.prompt_tokens : 0,
                completionTokens: data.completion_tokens ? data.completion_tokens : 0
            };
        }
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }

    return { content: '', totalTokens: 0, promptTokens: 0, completionTokens: 0 };
}


interface ChatPromptProps {
    onMessageSubmit: (messageText: UserMessage, totalTokens: number) => void;
}

function Toast({ show, message }: { show: boolean; message: string }) {
    return (
        <div
            className={`${show ? 'flex' : 'hidden'
                } fixed bottom-0 left-0 right-0 items-center justify-center mb-4 z-50`}
        >
            <div className="px-6 py-2 text-white bg-red-500 rounded-lg shadow-lg">
                {message}
            </div>
        </div>
    );
}

export default function ChatPrompt({ onMessageSubmit }: ChatPromptProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<UserMessage[]>([]);
    const [totalTokens, setTotalTokens] = useState<number>(0);
    const [promptTokens, setPromptTokens] = useState<number>(0);
    const [completionTokens, setCompletionTokens] = useState<number>(0);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (message: string) => {
        setToastMessage(message);
        setToastVisible(true);
        setTimeout(() => {
            setToastVisible(false);
        }, 3000);
    };



    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        if (textareaRef.current) {
            var messageText = textareaRef.current.value;

            if (textareaRef.current) {
                textareaRef.current.value = '';
            }

            try {
                // Send the message as a user
                const userMessage = { role: 'user', content: messageText };
                const updatedMessages = [...messages, userMessage];
                onMessageSubmit(userMessage, 0);


                const result = await sendMessage(updatedMessages);

                if (result.content === null) {
                    console.log('No message received');
                } else {
                    // Format the response as an assistant message
                    const assistantMessage = { role: 'assistant', content: result.content };
                    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
                    setTotalTokens(result.totalTokens || 0)
                    setPromptTokens(result.promptTokens || 0)
                    setCompletionTokens(result.completionTokens || 0)
                    onMessageSubmit(assistantMessage, result.totalTokens || 0);

                }
                messageText = '';
                setIsProcessing(false);

            }
            catch (error) {
                console.error('Error in client code:', error);
                setIsProcessing(false);
                setToastMessage('Error sending message. Please try again.');
                setToastVisible(true);
                setTimeout(() => {
                    setToastVisible(false);
                }, 3000);
            }
        }
    };

    return (
        <div className='flex-col items-center justify-center mt-10 dark:bg-gray-700'>
            <Toast show={toastVisible} message={toastMessage} />
            <div className="pb-2 text-sm text-center text-gray-500 dark:text-gray-400">
                Nerd stats: {totalTokens} tokens.
            </div>
            <div className="flex items-center justify-center dark:bg-gray-700">
                <div className="flex items-start flex-grow w-full">
                    <form className="relative w-full" onSubmit={handleSubmit}>
                        <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 dark:ring-0 dark:focus-within:ring-indigo-300">
                            <textarea
                                rows={3}
                                name="comment"
                                ref={textareaRef}
                                id="comment"
                                className="block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
                                placeholder="Ask me a question or give me a prompt..."
                                defaultValue={''}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            {/* Spacer element to match the height of the toolbar */}
                            <div className="py-2 dark:ring-0 dark:bg-gray-800" aria-hidden="true">
                                {/* Matches height of button in toolbar (1px border + 36px content height) */}
                                <div className="py-px dark:ring-0 dark:bg-gray-800">
                                    <div className="h-9 dark:bg-gray-800" />
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2 rounded-lg dark:bg-gray-800">
                            <div className="flex items-center space-x-5"></div>
                            <div className="flex-shrink-0">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-400 dark:hover:bg-indigo-300 dark:focus:ring-indigo-200"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l1-1.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        'Send'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}