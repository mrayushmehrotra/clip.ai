import { useAppSelector } from "@/app/store";
import { setMarkerTrack, setTextElements, setMediaFiles, setTimelineZoom, setCurrentTime, setIsPlaying, setActiveElement } from "@/app/store/slices/projectSlice";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Header from "./Header";
import VideoTimeline from "./elements-timeline/VideoTimeline";
import ImageTimeline from "./elements-timeline/ImageTimeline";
import AudioTimeline from "./elements-timeline/AudioTimline";
import TextTimeline from "./elements-timeline/TextTimeline";
import { throttle } from 'lodash';
import GlobalKeyHandlerProps from "../../../components/editor/keys/GlobalKeyHandlerProps";
import toast from "react-hot-toast";
export const Timeline = () => {
    const { currentTime, timelineZoom, enableMarkerTracking, activeElement, activeElementIndex, mediaFiles, textElements, duration, isPlaying } = useAppSelector((state) => state.projectState);
    const dispatch = useDispatch();
    const timelineRef = useRef<HTMLDivElement>(null)

    const throttledZoom = useMemo(() =>
        throttle((value: number) => {
            dispatch(setTimelineZoom(value));
        }, 100),
        [dispatch]
    );

    const handleSplit = () => {
        let element = null;
        let elements = null;
        let setElements = null;

        if (!activeElement) {
            toast.error('No element selected.');
            return;
        }

        if (activeElement === 'media') {
            elements = [...mediaFiles];
            element = elements[activeElementIndex];
            setElements = setMediaFiles;

            if (!element) {
                toast.error('No element selected.');
                return;
            }

            const { positionStart, positionEnd } = element;

            if (currentTime <= positionStart || currentTime >= positionEnd) {
                toast.error('Marker is outside the selected element bounds.');
                return;
            }

            const positionDuration = positionEnd - positionStart;

            // Media logic (uses startTime/endTime for trimming)
            const { startTime, endTime } = element;
            const sourceDuration = endTime - startTime;
            const ratio = (currentTime - positionStart) / positionDuration;
            const splitSourceOffset = startTime + ratio * sourceDuration;

            const firstPart = {
                ...element,
                id: crypto.randomUUID(),
                positionStart,
                positionEnd: currentTime,
                startTime,
                endTime: splitSourceOffset
            };

            const secondPart = {
                ...element,
                id: crypto.randomUUID(),
                positionStart: currentTime,
                positionEnd,
                startTime: splitSourceOffset,
                endTime
            };

            elements.splice(activeElementIndex, 1, firstPart, secondPart);
        } else if (activeElement === 'text') {
            elements = [...textElements];
            element = elements[activeElementIndex];
            setElements = setTextElements;

            if (!element) {
                toast.error('No element selected.');
                return;
            }

            const { positionStart, positionEnd } = element;

            if (currentTime <= positionStart || currentTime >= positionEnd) {
                toast.error('Marker is outside the selected element.');
                return;
            }

            const firstPart = {
                ...element,
                id: crypto.randomUUID(),
                positionStart,
                positionEnd: currentTime,
            };

            const secondPart = {
                ...element,
                id: crypto.randomUUID(),
                positionStart: currentTime,
                positionEnd,
            };

            elements.splice(activeElementIndex, 1, firstPart, secondPart);
        }

        if (elements && setElements) {
            dispatch(setElements(elements as any));
            dispatch(setActiveElement(null));
            toast.success('Element split successfully.');
        }
    };

    const handleDuplicate = () => {
        let element = null;
        let elements = null;
        let setElements = null;

        if (activeElement === 'media') {
            elements = [...mediaFiles];
            element = elements[activeElementIndex];
            setElements = setMediaFiles;
        } else if (activeElement === 'text') {
            elements = [...textElements];
            element = elements[activeElementIndex];
            setElements = setTextElements;
        }

        if (!element) {
            toast.error('No element selected.');
            return;
        }

        const duplicatedElement = {
            ...element,
            id: crypto.randomUUID(),
        };

        if (elements) {
            elements.splice(activeElementIndex + 1, 0, duplicatedElement as any);
        }

        if (elements && setElements) {
            dispatch(setElements(elements as any));
            dispatch(setActiveElement(null));
            toast.success('Element duplicated successfully.');
        }
    };

    const handleDelete = () => {
        // @ts-ignore
        let element = null;
        let elements = null;
        let setElements = null;

        if (activeElement === 'media') {
            elements = [...mediaFiles];
            element = elements[activeElementIndex];
            setElements = setMediaFiles;
        } else if (activeElement === 'text') {
            elements = [...textElements];
            element = elements[activeElementIndex];
            setElements = setTextElements;
        }

        if (!element) {
            toast.error('No element selected.');
            return;
        }

        if (elements) {
            // @ts-ignore
            elements = elements.filter(ele => ele.id !== element.id)
        }

        if (elements && setElements) {
            dispatch(setElements(elements as any));
            dispatch(setActiveElement(null));
            toast.success('Element deleted successfully.');
        }
    };


    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineRef.current) return;

        dispatch(setIsPlaying(false));
        const rect = timelineRef.current.getBoundingClientRect();

        const scrollOffset = timelineRef.current.scrollLeft;
        const offsetX = e.clientX - rect.left + scrollOffset;

        const seconds = offsetX / timelineZoom;
        const clampedTime = Math.max(0, Math.min(duration, seconds));

        dispatch(setCurrentTime(clampedTime));
    };

    return (
        <div className="flex w-full flex-col gap-3">
            <div className="flex flex-row items-center justify-between gap-12 w-full px-2">
                <div className="flex flex-row items-center gap-2 flex-wrap">
                    {/* Track Marker */}
                    <button
                        onClick={() => dispatch(setMarkerTrack(!enableMarkerTracking))}
                        className={`px-3 py-2 rounded-lg border transition-all flex flex-row items-center justify-center gap-2 font-medium text-sm ${enableMarkerTracking
                                ? 'bg-teal-500/20 border-teal-500/50 text-teal-400 hover:bg-teal-500/30'
                                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                            }`}
                        style={{ fontFamily: '"Work Sans", sans-serif' }}
                    >
                        {enableMarkerTracking ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <span>Track <span className="text-xs opacity-70">(T)</span></span>
                    </button>

                    {/* Split */}
                    <button
                        onClick={handleSplit}
                        className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-teal-500/50 hover:text-teal-400 transition-all flex flex-row items-center justify-center gap-2 font-medium text-sm"
                        style={{ fontFamily: '"Work Sans", sans-serif' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                        </svg>
                        <span>Split <span className="text-xs opacity-70">(S)</span></span>
                    </button>

                    {/* Duplicate */}
                    <button
                        onClick={handleDuplicate}
                        className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:border-teal-500/50 hover:text-teal-400 transition-all flex flex-row items-center justify-center gap-2 font-medium text-sm"
                        style={{ fontFamily: '"Work Sans", sans-serif' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Duplicate <span className="text-xs opacity-70">(D)</span></span>
                    </button>

                    {/* Delete */}
                    <button
                        onClick={handleDelete}
                        className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all flex flex-row items-center justify-center gap-2 font-medium text-sm"
                        style={{ fontFamily: '"Work Sans", sans-serif' }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete <span className="text-xs opacity-70">(Del)</span></span>
                    </button>
                </div>

                {/* Timeline Zoom */}
                <div className="flex flex-row justify-between items-center gap-3 mr-4">
                    <label className="block text-sm font-medium text-slate-400" style={{ fontFamily: '"Work Sans", sans-serif' }}>Zoom</label>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-sm">−</span>
                        <input
                            type="range"
                            min={30}
                            max={120}
                            step="1"
                            value={timelineZoom}
                            onChange={(e) => throttledZoom(Number(e.target.value))}
                            className="w-[100px] h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                                accentColor: '#14b8a6'
                            }}
                        />
                        <span className="text-slate-500 text-sm">+</span>
                    </div>
                </div>
            </div>

            <div
                className="relative overflow-x-auto w-full border-t border-slate-700/50 bg-slate-900/80 z-10 rounded-lg"
                ref={timelineRef}
                onClick={handleClick}
            >
                {/* Timeline Header */}
                <Header />

                <div className="bg-slate-900/80"
                    style={{
                        width: "100%",
                    }}
                >
                    {/* Timeline cursor - Orange accent */}
                    <div
                        className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500 to-amber-500 z-50 shadow-lg shadow-orange-500/50"
                        style={{
                            left: `${currentTime * timelineZoom}px`,
                        }}
                    >
                        {/* Playhead */}
                        <div className="absolute -top-1 -left-2 w-5 h-5 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full border-2 border-slate-900 shadow-lg"></div>
                    </div>
                    {/* Timeline elements */}
                    <div className="w-full">

                        <div className="relative h-16 z-10">
                            <VideoTimeline />
                        </div>

                        <div className="relative h-16 z-10">
                            <AudioTimeline />
                        </div>

                        <div className="relative h-16 z-10">
                            <ImageTimeline />
                        </div>

                        <div className="relative h-16 z-10">
                            <TextTimeline />
                        </div>

                    </div>
                </div>
            </div >
            <GlobalKeyHandlerProps handleDuplicate={handleDuplicate} handleSplit={handleSplit} handleDelete={handleDelete} />
        </div>

    );
};

export default memo(Timeline)
