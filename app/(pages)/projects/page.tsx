'use client';

import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from '../../store';
import { addProject, deleteProject, rehydrateProjects, setCurrentProject } from '../../store/slices/projectsSlice';
import { listProjects, storeProject, deleteProject as deleteProjectFromDB } from '../../store';
import { ProjectState } from '../../types';
import { toast } from 'react-hot-toast';

export default function Projects() {
    const dispatch = useAppDispatch();
    const { projects, currentProjectId } = useAppSelector((state) => state.projects);
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            setIsLoading(true);
            try {
                const storedProjects = await listProjects();
                dispatch(rehydrateProjects(storedProjects));
            } catch (error) {
                toast.error('Failed to load projects');
                console.error('Error loading projects:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProjects();
    }, [dispatch]);

    useEffect(() => {
        if (isCreating && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isCreating]);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;

        const newProject: ProjectState = {
            id: crypto.randomUUID(),
            projectName: newProjectName,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            mediaFiles: [],
            textElements: [],
            currentTime: 0,
            isPlaying: false,
            isMuted: false,
            duration: 0,
            activeSection: 'media',
            activeElement: 'text',
            activeElementIndex: 0,
            filesID: [],
            zoomLevel: 1,
            timelineZoom: 100,
            enableMarkerTracking: true,
            resolution: { width: 1920, height: 1080 },
            fps: 30,
            aspectRatio: '16:9',
            history: [],
            future: [],
            exportSettings: {
                resolution: '1080p',
                quality: 'high',
                speed: 'fastest',
                fps: 30,
                format: 'mp4',
                includeSubtitles: false,
            },
        };

        await storeProject(newProject);
        dispatch(addProject(newProject));
        setNewProjectName('');
        setIsCreating(false);
        toast.success('Project created successfully');
    };

    const handleDeleteProject = async (projectId: string) => {
        await deleteProjectFromDB(projectId);
        dispatch(deleteProject(projectId));
        const storedProjects = await listProjects();
        dispatch(rehydrateProjects(storedProjects));
        toast.success('Project deleted successfully');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 relative overflow-hidden">
            {/* Film grain texture */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}></div>
            </div>

            {/* Gradient accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full translate-y-1/2 -translate-x-1/2"></div>

            {/* Loading Screen */}
            {isLoading ? (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/95 backdrop-blur-md">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-teal-500/30 p-8 rounded-2xl flex flex-col items-center">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-teal-500/40 rounded-full animate-spin-slow"></div>
                        </div>
                        <p className="mt-6 text-white text-lg font-medium" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>LOADING PROJECTS...</p>
                        <p className="mt-2 text-slate-400 text-sm" style={{ fontFamily: '"Work Sans", sans-serif' }}>Preparing your workspace</p>
                    </div>
                </div>
            ) : (
                <div className="relative py-16 px-6">
                    {/* Header */}
                    <div className="max-w-7xl mx-auto mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex gap-0.5">
                                <div className="w-1 h-8 bg-orange-500 animate-pulse"></div>
                                <div className="w-1 h-8 bg-orange-400 animate-pulse delay-75"></div>
                                <div className="w-1 h-8 bg-orange-500 animate-pulse delay-150"></div>
                            </div>
                            <Link href="/" className="text-teal-400 uppercase tracking-[0.3em] text-sm font-medium hover:text-teal-300 transition-colors">
                                ← Back to Home
                            </Link>
                        </div>

                        <h1 className="text-6xl lg:text-7xl font-black text-white mb-4" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                            YOUR PROJECTS
                        </h1>
                        <div className="h-1 w-32 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                        <p className="mt-6 text-xl text-slate-400 max-w-2xl" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                            Manage your video projects and continue editing where you left off.
                        </p>
                    </div>

                    {/* Projects Grid */}
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Create New Project Card */}
                            <button
                                onClick={() => setIsCreating(true)}
                                className="group relative bg-slate-800/30 backdrop-blur-sm border-2 border-dashed border-teal-500/30 rounded-xl p-8 hover:border-orange-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1 min-h-[280px] flex flex-col items-center justify-center"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-teal-500/0 group-hover:from-orange-500/5 group-hover:to-teal-500/5 rounded-xl transition-all duration-300"></div>

                                <div className="relative flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-teal-500/20 border-2 border-orange-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                                        NEW PROJECT
                                    </h3>
                                    <p className="text-slate-400 text-center" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                                        Start creating
                                    </p>
                                </div>
                            </button>

                            {/* Project Cards */}
                            {[...projects]
                                .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                                .map(({ id, projectName, createdAt, lastModified }) => (
                                    <div key={id} className="group relative">
                                        <Link
                                            href={`/projects/${id}`}
                                            onClick={() => dispatch(setCurrentProject(id))}
                                            className="block"
                                        >
                                            <div className="relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-teal-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 min-h-[280px] flex flex-col">
                                                {/* Gradient overlay on hover */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-teal-500/0 group-hover:from-orange-500/5 group-hover:to-teal-500/5 rounded-xl transition-all duration-300"></div>

                                                <div className="relative flex-1 flex flex-col">
                                                    {/* Film icon */}
                                                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-orange-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                        <svg className="w-7 h-7 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>

                                                    {/* Project name */}
                                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                                                        {projectName}
                                                    </h3>

                                                    {/* Metadata */}
                                                    <div className="mt-auto space-y-2 text-sm text-slate-400" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            <span>{new Date(createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-teal-400">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span>Modified {new Date(lastModified).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Corner accent */}
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        </Link>

                                        {/* Delete button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (confirm('Are you sure you want to delete this project?')) {
                                                    handleDeleteProject(id);
                                                }
                                            }}
                                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30 hover:scale-110"
                                        >
                                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                        </div>

                        {/* Empty state */}
                        {projects.length === 0 && (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                                    NO PROJECTS YET
                                </h3>
                                <p className="text-slate-400 mb-6" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                                    Create your first project to get started
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Project Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-slate-800/90 backdrop-blur-md border-2 border-teal-500/30 rounded-2xl w-full max-w-md p-8 relative overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full"></div>

                        <div className="relative">
                            <h3 className="text-3xl font-black text-white mb-2" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                                CREATE PROJECT
                            </h3>
                            <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-amber-400 mb-6"></div>

                            <input
                                type="text"
                                ref={inputRef}
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleCreateProject();
                                    } else if (e.key === "Escape") {
                                        setIsCreating(false);
                                    }
                                }}
                                placeholder="Enter project name..."
                                className="w-full p-4 mb-6 bg-slate-900/50 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                style={{ fontFamily: '"Work Sans", sans-serif' }}
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all font-medium"
                                    style={{ fontFamily: '"Work Sans", sans-serif' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateProject}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-900 rounded-lg transition-all font-bold shadow-lg hover:shadow-xl hover:shadow-orange-500/30"
                                    style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}
                                >
                                    CREATE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </div>
    );
}