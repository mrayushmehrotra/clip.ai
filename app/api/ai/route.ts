import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
    apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

// Define available functions for the AI
const tools = [
    {
        type: "function",
        function: {
            name: "add_text",
            description: "Add a text element to the video timeline at the current playhead position",
            parameters: {
                type: "object",
                properties: {
                    text: {
                        type: "string",
                        description: "The text content to display",
                    },
                    duration: {
                        type: "number",
                        description: "Duration in seconds for how long the text should be visible",
                    },
                },
                required: ["text", "duration"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "split_element",
            description: "Split the currently selected element at the current playhead position",
            parameters: {
                type: "object",
                properties: {},
            },
        },
    },
    {
        type: "function",
        function: {
            name: "delete_element",
            description: "Delete the currently selected element from the timeline",
            parameters: {
                type: "object",
                properties: {},
            },
        },
    },
    {
        type: "function",
        function: {
            name: "duplicate_element",
            description: "Duplicate the currently selected element",
            parameters: {
                type: "object",
                properties: {},
            },
        },
    },
    {
        type: "function",
        function: {
            name: "move_playhead",
            description: "Move the playhead to a specific time position in seconds",
            parameters: {
                type: "object",
                properties: {
                    time: {
                        type: "number",
                        description: "Time in seconds to move the playhead to",
                    },
                },
                required: ["time"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "set_zoom",
            description: "Set the timeline zoom level",
            parameters: {
                type: "object",
                properties: {
                    level: {
                        type: "number",
                        description: "Zoom level between 30 and 120",
                    },
                },
                required: ["level"],
            },
        },
    },
];

export async function POST(request: NextRequest) {
    try {
        const { messages, projectContext } = await request.json();

        // Add system message with project context
        const systemMessage = {
            role: "system",
            content: `You are an AI assistant for Clip.AI, a browser-based video editor. You help users edit their videos through natural language commands.

Current project context:
- Current time: ${projectContext.currentTime}s
- Duration: ${projectContext.duration}s
- Selected element: ${projectContext.activeElement || "none"}
- Available media files: ${projectContext.mediaCount}
- Text elements: ${projectContext.textCount}

You can execute the following actions:
- Add text elements to the timeline
- Split elements at the current playhead position
- Delete selected elements
- Duplicate elements
- Move the playhead to specific times
- Adjust timeline zoom

Be concise and helpful. When you perform an action, confirm what you did.`,
        };

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [systemMessage, ...messages],
            tools: tools,
            tool_choice: "auto",
            temperature: 0.7,
            max_tokens: 1000,
        });

        const response = completion.choices[0].message;

        // Check if AI wants to call a function
        if (response.tool_calls && response.tool_calls.length > 0) {
            return NextResponse.json({
                message: response.content || "",
                toolCalls: response.tool_calls.map((call: any) => ({
                    name: call.function.name,
                    arguments: JSON.parse(call.function.arguments),
                })),
            });
        }

        return NextResponse.json({
            message: response.content,
            toolCalls: [],
        });
    } catch (error: any) {
        console.error("Groq API error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process AI request" },
            { status: 500 }
        );
    }
}
