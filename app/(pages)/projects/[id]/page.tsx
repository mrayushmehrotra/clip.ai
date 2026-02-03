"use client";
import { useEffect, useRef, useState } from "react";
import { getFile, storeProject, useAppDispatch, useAppSelector } from "../../../store";
import { getProject } from "../../../store";
import { setCurrentProject, updateProject } from "../../../store/slices/projectsSlice";
import { rehydrate, setMediaFiles } from '../../../store/slices/projectSlice';
import { setActiveSection } from "../../../store/slices/projectSlice";
import AddText from '../../../components/editor/AssetsPanel/tools-section/AddText';
import AddMedia from '../../../components/editor/AssetsPanel/AddButtons/UploadMedia';
import MediaList from '../../../components/editor/AssetsPanel/tools-section/MediaList';
import { useRouter } from 'next/navigation';
import TextButton from "@/app/components/editor/AssetsPanel/SidebarButtons/TextButton";
import LibraryButton from "@/app/components/editor/AssetsPanel/SidebarButtons/LibraryButton";
import ExportButton from "@/app/components/editor/AssetsPanel/SidebarButtons/ExportButton";
import HomeButton from "@/app/components/editor/AssetsPanel/SidebarButtons/HomeButton";
import ShortcutsButton from "@/app/components/editor/AssetsPanel/SidebarButtons/ShortcutsButton";
import MediaProperties from "../../../components/editor/PropertiesSection/MediaProperties";
import TextProperties from "../../../components/editor/PropertiesSection/TextProperties";
import { Timeline } from "../../../components/editor/timeline/Timline";
import { PreviewPlayer } from "../../../components/editor/player/remotion/Player";
import { MediaFile } from "@/app/types";
import ExportList from "../../../components/editor/AssetsPanel/tools-section/ExportList";
import Image from "next/image";
import ProjectName from "../../../components/editor/player/ProjectName";

export default function Project({ params }: { params: { id: string } }) {
    const { id } = params;
    const dispatch = useAppDispatch();
    const projectState = useAppSelector((state) => state.projectState);
    const { currentProjectId } = useAppSelector((state) => state.projects);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const { activeSection, activeElement } = projectState;

    // when page is loaded set the project id if it exists
    useEffect(() => {
        const loadProject = async () => {
            if (id) {
                setIsLoading(true);
                const project = await getProject(id);
                if (project) {
                    dispatch(setCurrentProject(id));
                    setIsLoading(false);
                } else {
                    router.push('/404');
                }
            }
        };
        loadProject();
    }, [id, dispatch]);

    // set project state from with the current project id
    useEffect(() => {
        const loadProject = async () => {
            if (currentProjectId) {
                const project = await getProject(currentProjectId);
                if (project) {
                    dispatch(rehydrate(project));

                    dispatch(setMediaFiles(await Promise.all(
                        project.mediaFiles.map(async (media: MediaFile) => {
                            const file = await getFile(media.fileId);
                            return { ...media, src: URL.createObjectURL(file) };
                        })
                    )));
                }
            }
        };
        loadProject();
    }, [dispatch, currentProjectId]);

    // save
    useEffect(() => {
        const saveProject = async () => {
            if (!projectState || projectState.id != currentProjectId) return;
            await storeProject(projectState);
            dispatch(updateProject(projectState));
        };
        saveProject();
    }, [projectState, dispatch]);

    const handleFocus = (section: "media" | "text" | "export") => {
        dispatch(setActiveSection(section));
    };

    return (
        <div className="flex flex-col h-screen select-none bg-gradient-to-br from-slate-900 via-teal-950/30 to-slate-900 overflow-hidden">
            {/* Film grain texture */}
            <div className="fixed inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-0">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}></div>
            </div>

            {/* Cinematic Loading Screen */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-900/95 backdrop-blur-md animate-fade-in">
                    <div className="bg-slate-800/50 backdrop-blur-sm border-2 border-teal-500/30 p-8 rounded-2xl flex flex-col items-center shadow-xl">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-teal-500/40 rounded-full animate-spin-slow"></div>
                        </div>
                        <p className="mt-6 text-white text-lg font-medium" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>LOADING PROJECT...</p>
                        <p className="mt-2 text-slate-400 text-sm" style={{ fontFamily: '"Work Sans", sans-serif' }}>Preparing your workspace</p>
                    </div>
                </div>
            )}

            {/* Top Navigation Bar - Cinematic Style */}
            <div className="relative bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 h-14 flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-4">
                    {/* Film strip accent */}
                    <div className="flex gap-0.5">
                        <div className="w-1 h-6 bg-orange-500"></div>
                        <div className="w-1 h-6 bg-orange-400"></div>
                        <div className="w-1 h-6 bg-orange-500"></div>
                    </div>

                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                            <span className="text-slate-900 font-bold text-lg">C</span>
                        </div>
                        <span className="text-white font-semibold text-lg" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>CLIP.AI</span>
                    </div>

                    {/* Project Name */}
                    <div className="ml-4">
                        <ProjectName />
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button className="px-3 py-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors" style={{ fontFamily: '"Work Sans", sans-serif' }}>
                        <span>Auto-save: On</span>
                    </button>
                    <button
                        onClick={() => handleFocus("export")}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg text-sm font-bold text-slate-900 shadow-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all"
                        style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}
                    >
                        EXPORT VIDEO
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative flex flex-1 overflow-hidden">
                {/* Left Sidebar - Tool Buttons */}
                <div className="w-20 bg-slate-900/80 backdrop-blur-sm border-r border-slate-700/50 flex flex-col items-center py-6 gap-3 scrollbar-custom overflow-y-auto">
                    <HomeButton />
                    <TextButton onClick={() => handleFocus("text")} />
                    <LibraryButton onClick={() => handleFocus("media")} />
                    <ExportButton onClick={() => handleFocus("export")} />
                </div>

                {/* Assets Panel */}
                <div className="w-80 bg-slate-900/60 backdrop-blur-sm border-r border-slate-700/50 flex flex-col scrollbar-custom overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50">
                        <h2 className="text-white font-bold text-lg" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                            {activeSection === "media" && "MEDIA LIBRARY"}
                            {activeSection === "text" && "TEXT TOOLS"}
                            {activeSection === "export" && "EXPORT SETTINGS"}
                        </h2>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto scrollbar-custom">
                        {activeSection === "media" && (
                            <div className="space-y-4 animate-slide-up">
                                <AddMedia />
                                <MediaList />
                            </div>
                        )}
                        {activeSection === "text" && (
                            <div className="animate-slide-up">
                                <AddText />
                            </div>
                        )}
                        {activeSection === "export" && (
                            <div className="space-y-4 animate-slide-up">
                                <ExportList />
                            </div>
                        )}
                    </div>
                </div>

                {/* Center - Video Preview */}
                <div className="flex-1 flex items-center justify-center bg-slate-950/50 p-6 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                        <PreviewPlayer />
                    </div>
                </div>

                {/* Right Sidebar - Properties Panel */}
                <div className="w-80 bg-slate-900/60 backdrop-blur-sm border-l border-slate-700/50 flex flex-col scrollbar-custom overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50">
                        <h2 className="text-white font-bold text-lg" style={{ fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
                            {activeElement === "media" && "MEDIA PROPERTIES"}
                            {activeElement === "text" && "TEXT PROPERTIES"}
                            {!activeElement && "PROPERTIES"}
                        </h2>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto scrollbar-custom">
                        {activeElement === "media" && (
                            <div className="animate-slide-up">
                                <MediaProperties />
                            </div>
                        )}
                        {activeElement === "text" && (
                            <div className="animate-slide-up">
                                <TextProperties />
                            </div>
                        )}
                        {!activeElement && (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4">
                                <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                </div>
                                <p className="text-slate-300 text-sm font-medium" style={{ fontFamily: '"Work Sans", sans-serif' }}>Select an element</p>
                                <p className="text-slate-500 text-xs mt-1" style={{ fontFamily: '"Work Sans", sans-serif' }}>Click on a timeline element to edit its properties</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Timeline at bottom */}
            <div className="relative h-64 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 flex flex-row overflow-hidden">
                {/* Timeline Track Labels */}
                <div className="w-20 bg-slate-900 border-r border-slate-700/50 flex flex-col">
                    <div className="h-12 border-b border-slate-700/50"></div>

                    <div className="flex-1 flex flex-col">
                        <div className="relative h-16 border-b border-slate-800 flex items-center justify-center group hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-2 p-3">
                                <Image
                                    alt="Video"
                                    className="opacity-70 group-hover:opacity-100 transition-opacity h-auto w-auto max-w-[24px] max-h-[24px]"
                                    height={24}
                                    width={24}
                                    src="https://www.svgrepo.com/show/532727/video.svg"
                                    style={{ filter: 'invert(0.6) sepia(1) hue-rotate(160deg) saturate(2) brightness(1.1)' }}
                                />
                            </div>
                        </div>

                        <div className="relative h-16 border-b border-slate-800 flex items-center justify-center group hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-2 p-3">
                                <Image
                                    alt="Audio"
                                    className="opacity-70 group-hover:opacity-100 transition-opacity h-auto w-auto max-w-[24px] max-h-[24px]"
                                    height={24}
                                    width={24}
                                    src="https://www.svgrepo.com/show/532708/music.svg"
                                    style={{ filter: 'invert(0.6) sepia(1) hue-rotate(160deg) saturate(2) brightness(1.1)' }}
                                />
                            </div>
                        </div>

                        <div className="relative h-16 border-b border-slate-800 flex items-center justify-center group hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-2 p-3">
                                <Image
                                    alt="Image"
                                    className="opacity-70 group-hover:opacity-100 transition-opacity h-auto w-auto max-w-[24px] max-h-[24px]"
                                    height={24}
                                    width={24}
                                    src="https://www.svgrepo.com/show/535454/image.svg"
                                    style={{ filter: 'invert(0.6) sepia(1) hue-rotate(10deg) saturate(3) brightness(1.2)' }}
                                />
                            </div>
                        </div>

                        <div className="relative h-16 flex items-center justify-center group hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-2 p-3">
                                <Image
                                    alt="Text"
                                    className="opacity-70 group-hover:opacity-100 transition-opacity h-auto w-auto max-w-[24px] max-h-[24px]"
                                    height={24}
                                    width={24}
                                    src="https://www.svgrepo.com/show/535686/text.svg"
                                    style={{ filter: 'invert(0.6) sepia(1) hue-rotate(10deg) saturate(3) brightness(1.2)' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Content */}
                <div className="flex-1 overflow-hidden">
                    <Timeline />
                </div>
            </div>

            {/* Add fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </div >
    );
}
