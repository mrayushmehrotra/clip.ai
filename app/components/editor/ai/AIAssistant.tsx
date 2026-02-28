'use client';

import { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
    setCurrentTime,
    setTimelineZoom,
    setTextElements,
    setMediaFiles
} from '@/app/store/slices/projectSlice';
import toast from 'react-hot-toast';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const dispatch = useAppDispatch();
    const projectState = useAppSelector((state) => state.projectState);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Execute function calls from AI
    const executeFunctionCall = (name: string, args: any) => {
        switch (name) {
            case 'add_text':
                const newText = {
                    id: crypto.randomUUID(),
                    text: args.text,
                    positionStart: projectState.currentTime,
                    positionEnd: projectState.currentTime + args.duration,
                    x: 50,
                    y: 50,
                    fontSize: 48,
                    fontFamily: 'Arial',
                    color: '#ffffff',
                    backgroundColor: 'transparent',
                    textAlign: 'center' as const,
                };
                dispatch(setTextElements([...projectState.textElements, newText]));
                toast.success(`Added text: "${args.text}"`);
                return `Added text element "${args.text}" for ${args.duration} seconds`;

            case 'split_element':
                // Trigger split by clicking the split button
                const splitBtn = document.querySelector('[data-action="split"]') as HTMLButtonElement;
                if (splitBtn) {
                    splitBtn.click();
                    return 'Split the selected element';
                }
                return 'No element selected to split';

            case 'delete_element':
                const deleteBtn = document.querySelector('[data-action="delete"]') as HTMLButtonElement;
                if (deleteBtn) {
                    deleteBtn.click();
                    return 'Deleted the selected element';
                }
                return 'No element selected to delete';

            case 'duplicate_element':
                const duplicateBtn = document.querySelector('[data-action="duplicate"]') as HTMLButtonElement;
                if (duplicateBtn) {
                    duplicateBtn.click();
                    return 'Duplicated the selected element';
                }
                return 'No element selected to duplicate';

            case 'move_playhead':
                dispatch(setCurrentTime(args.time));
                toast.success(`Moved playhead to ${args.time}s`);
                return `Moved playhead to ${args.time} seconds`;

            case 'set_zoom':
                const clampedZoom = Math.max(30, Math.min(120, args.level));
                dispatch(setTimelineZoom(clampedZoom));
                toast.success(`Set zoom to ${clampedZoom}`);
                return `Set timeline zoom to ${clampedZoom}`;

            default:
                return `Unknown function: ${name}`;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Send message to API with project context
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    projectContext: {
                        currentTime: projectState.currentTime,
                        duration: projectState.duration,
                        activeElement: projectState.activeElement,
                        mediaCount: projectState.mediaFiles.length,
                        textCount: projectState.textElements.length,
                    },
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Execute any function calls
            let functionResults = '';
            if (data.toolCalls && data.toolCalls.length > 0) {
                for (const call of data.toolCalls) {
                    const result = executeFunctionCall(call.name, call.arguments);
                    functionResults += result + '. ';
                }
            }

            // Add assistant response
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.message || functionResults || 'Done!',
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('AI error:', error);
            toast.error(error.message || 'Failed to get AI response');
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-full shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all flex items-center justify-center z-40 group"
                    aria-label="Open AI Assistant"
                >
                    <svg className="w-7 h-7 text-slate-900 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl flex flex-col z-40 animate-slide-up">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                                    AI ASSISTANT
                                </h3>
                                <p className="text-xs text-slate-400" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                                    Powered by Groq
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-400 hover:text-white"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-custom">
                        {messages.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-slate-400 text-sm mb-4" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                                    Hi! I can help you edit your video.
                                </p>
                                <div className="space-y-2 text-xs text-left">
                                    <p className="text-slate-500" style={{ fontFamily: '"Work Sans", sans-serif' }}>Try asking:</p>
                                    <div className="bg-slate-800/50 p-2 rounded text-slate-300" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                                        "Add text saying 'Hello World' for 5 seconds"
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded text-slate-300" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                                        "Split this clip at the current position"
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded text-slate-300" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                                        "Move playhead to 10 seconds"
                                    </div>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-lg ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-slate-900'
                                        : 'bg-slate-800/50 text-slate-200'
                                        }`}
                                    style={{ fontFamily: '"Work Sans", sans-serif' }}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700/50">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me to edit your video..."
                                className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                                style={{ fontFamily: '"Work Sans", sans-serif' }}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-900 font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-orange-500/30"
                                style={{ fontFamily: '"Work Sans", sans-serif' }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
