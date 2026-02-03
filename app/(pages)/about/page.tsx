'use client'
import { Github, Twitter, Linkedin, Heart } from "lucide-react";
import { useState } from "react";

export default function AboutMe() {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="flex flex-col items-center mt-20 min-h-screen py-16 px-4">
            <div className="max-w-3xl w-full bg-black bg-opacity-30 backdrop-blur-lg border border-gray-800 border-opacity-30 rounded-xl shadow-xl p-8 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">{`Hey there, I'm Mohy Khalid`}</h1>

                <p className="text-gray-300 mt-4 text-lg">
                    {`I'm a software developer with a passion for building products that help people.`}
                </p>

                <div className="my-8 p-6 bg-gray-900 bg-opacity-30 backdrop-blur-lg border border-gray-800 border-opacity-30 rounded-lg">
                    <p className="text-gray-300 text-lg">
                        {`I'm currently working on`} <span className="font-semibold text-yellow-300">Clip.ai</span>, a browser-based video editor that enables you to edit videos directly from your web browser.
                    </p>
                    <p className="text-gray-300 mt-3 text-lg">
                        {`Everything including rendering happens right in your browser! It's `}<span className="font-bold text-green-400">100% free</span> with no watermarks and supports up to 1080p export.
                    </p>
                </div>

            </div>
        </div>
    );
}