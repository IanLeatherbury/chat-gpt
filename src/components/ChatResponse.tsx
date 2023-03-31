/* eslint-disable @next/next/no-img-element */
import Prism from 'prismjs';
import CodeBlock from './CodeBlock';

function getCurrentDateFormatted(): string {
    const currentDate = new Date();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const month = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    const formattedHours = ((hours + 11) % 12 + 1); // Convert 24-hour format to 12-hour format
    const formattedTime = `${formattedHours}:${minutes} ${ampm}`;

    return `${month} ${day} at ${formattedTime}`;
}

function parseContent(content: string) {
    const codeBlockRegex = /```([\w-]+)?\n([\s\S]*?)```/g;
    const elements: JSX.Element[] = [];
  
    // Create an array to store the extracted code blocks
    const codeBlocks: {
      match: string;
      lang: string;
      code: string;
      index: number;
    }[] = [];
  
    // Extract code blocks and store them with their original index
    content.replace(codeBlockRegex, (match, lang, code, index) => {
      codeBlocks.push({ match, lang, code, index });
      return match;
    });
  
    // Replace code blocks with placeholders
    const placeholder = '%%CODE_BLOCK_PLACEHOLDER%%';
    const contentWithPlaceholders = content.replace(codeBlockRegex, placeholder);
  
    // Split content into paragraphs, keeping placeholders intact
    const paragraphs = contentWithPlaceholders.split('\n\n');
  
    let codeBlockIndex = 0;
  
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const isCodeBlock = paragraph === placeholder;
  
      if (isCodeBlock) {
        const { lang, code } = codeBlocks[codeBlockIndex];
        const language =
          lang || (Prism.languages.typescript && 'typescript') || 'javascript';
  
        elements.push(
          <CodeBlock key={`codeblock-${paragraphIndex}`} value={code.trim()} language={language} />,
        );
  
        codeBlockIndex++;
      } else {
        // If the paragraph isn't a code block placeholder, parse it for inline code
        parseInlineCode(paragraph, elements, paragraphIndex);
      }
  
      // Add line breaks between paragraphs, except for the last one
      if (paragraphIndex < paragraphs.length - 1) {
        elements.push(<br key={`br1-${paragraphIndex}`} />);
        
        // Add an extra line break only if the current paragraph is not a code block
        if (!isCodeBlock) {
          elements.push(<br key={`br2-${paragraphIndex}`} />);
        }
      }
    });
  
    return elements;
  }
  


function parseInlineCode(slicedContent: string, elements: JSX.Element[], offset: number) {
    const inlineCodeRegex = /(`)(.*?)\1/g;
    let lastIndex = 0;

    slicedContent.replace(inlineCodeRegex, (match, backtick, code, index) => {
        if (index > lastIndex) {
            elements.push(<span key={offset + index}>{slicedContent.slice(lastIndex, index)}</span>);
        }

        elements.push(
            <code
                key={`inlinecode-${offset + index}`}
                className="inline-code text-sm bg-gray-200 text-gray-900 dark:bg-gray-500 dark:text-gray-100 font-mono px-1 py-0.5 rounded"
            >
                {code}
            </code>


        );

        lastIndex = index + match.length;
        return match;
    });

    if (lastIndex < slicedContent.length) {
        elements.push(<span key={offset + slicedContent.length}>{slicedContent.slice(lastIndex)}</span>);
    }
}

export default function ChatResponse({ message }: { message: any }) {
    const parsedContent = parseContent(message.content);

    return (
        <div className="w-full">
            <div className={`flex justify-start`}>
                <div className={`w-full py-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100`}>
                    <div className="flex pt-5 space-x-3">
                        <div className="flex-shrink-0">
                            <img
                                className="w-10 h-10 rounded-full"
                                src={message.role === 'user' ? "https://i.imgur.com/5ofvvh9.png" : "https://i.imgur.com/uMVZEsN.png"}
                                alt=""
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold text-gray-900 dark:text-gray-200`}>
                                <a href="#" className="hover:underline">
                                    {message.role === 'user' ? "User" : "Scott"}
                                </a>
                            </p>
                            <p className={`text-sm text-gray-500 dark:text-gray-400`}>
                                <a href="#" className="hover:underline">
                                    {getCurrentDateFormatted()}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`text-gray-900 dark:text-gray-200 dark:bg-gray-700'}`}>{parsedContent}</div>
        </div>
    )
}
