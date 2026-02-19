import React, { useState, useEffect } from 'react';



export function CopyToClipboardButton({ text, children, copiedMessage }: { text: string, children: React.ReactNode, copiedMessage: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <button onClick={() => copyToClipboard(text)}>
            {copied ? copiedMessage : children}
        </button>
    );
}