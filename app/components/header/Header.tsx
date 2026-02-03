'use client'
import Link from "next/link";
import ThemeSwitch from "../buttons/ThemeSwitch";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    if (pathname.startsWith("/projects/")) {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-xl">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo with film strip accent */}
                <div className="flex items-center gap-3">
                    {/* Film strip accent */}
                    <div className="flex gap-0.5">
                        <div className="w-1 h-6 bg-orange-500"></div>
                        <div className="w-1 h-6 bg-orange-400"></div>
                        <div className="w-1 h-6 bg-orange-500"></div>
                    </div>

                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                            <span className="text-slate-900 font-bold text-lg">C</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span
                                className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors"
                                style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}
                            >
                                CLIP.AI
                            </span>
                            <span
                                className="px-2 py-0.5 text-xs font-bold bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded"
                                style={{ fontFamily: '"Work Sans", sans-serif' }}
                            >
                                BETA
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex items-center">
                    <ul className="flex space-x-1">
                        <li>
                            <Link
                                href="/"
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${pathname === '/'
                                    ? 'bg-teal-500/20 border border-teal-500/50 text-teal-400'
                                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                    }`}
                                style={{ fontFamily: '"Work Sans", sans-serif' }}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/projects"
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${pathname === '/projects'
                                    ? 'bg-teal-500/20 border border-teal-500/50 text-teal-400'
                                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                    }`}
                                style={{ fontFamily: '"Work Sans", sans-serif' }}
                            >
                                Projects
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${pathname === '/about'
                                    ? 'bg-teal-500/20 border border-teal-500/50 text-teal-400'
                                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                    }`}
                                style={{ fontFamily: '"Work Sans", sans-serif' }}
                            >
                                About Me
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Add fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </header>
    );
}
