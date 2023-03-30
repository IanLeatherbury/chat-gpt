// components/CodeBlock.tsx
import React, { useState, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import clipboardCopy from 'clipboard-copy';

type CodeBlockProps = {
    value: string;
    language: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ value, language }) => {
    const [isCopied, setIsCopied] = useState(false);
    const copyButtonRef = useRef<HTMLButtonElement>(null);

    const handleCopyClick = () => {
        clipboardCopy(value);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    return (
        <div className="relative">
            <div>
                <SyntaxHighlighter language={language} style={tomorrow} className="rounded-md">
                    {value}
                </SyntaxHighlighter>
            </div>
            <button
                ref={copyButtonRef}
                onClick={handleCopyClick}
                className="absolute top-0 right-0 px-2 py-1 mt-2 mr-2 text-xs text-white bg-indigo-600 rounded shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {isCopied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
};

export default CodeBlock;
