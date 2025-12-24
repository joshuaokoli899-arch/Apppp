
import React, { useRef, useEffect } from 'react';

interface ConsoleProps {
    log: string[];
}

const Console: React.FC<ConsoleProps> = ({ log }) => {
    const consoleEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);

    return (
        <div className="bg-black rounded-md p-4 flex-grow overflow-y-auto h-96 font-mono text-sm text-gray-300 custom-scrollbar">
            {log.length === 0 ? (
                <p className="text-gray-500 animate-pulse">Waiting for build to start...</p>
            ) : (
                <pre>
                    <code>
                        {log.map((line, index) => (
                            <div key={index} className="flex">
                                <span className="text-gray-600 mr-4 select-none">{String(index + 1).padStart(3, ' ')}</span>
                                <span className="flex-1 whitespace-pre-wrap break-words">{line}</span>
                            </div>
                        ))}
                        <div ref={consoleEndRef} />
                    </code>
                </pre>
            )}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1f2937; /* bg-gray-800 */
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4b5563; /* bg-gray-600 */
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #6b7280; /* bg-gray-500 */
                }
            `}</style>
        </div>
    );
};

export default Console;
