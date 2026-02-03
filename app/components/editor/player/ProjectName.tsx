import { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/store';
import { setProjectName } from "../../../store/slices/projectSlice";

export default function ProjectName() {
    const [isEditing, setIsEditing] = useState(false);
    const { projectName } = useAppSelector((state) => state.projectState);
    const dispatch = useAppDispatch();

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsEditing(false);
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setProjectName(e.target.value));
    };

    return (
        <div className="relative">
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={projectName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="text-base font-medium bg-surfaceSecondary border border-purple text-textPrimary px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple/50"
                    autoFocus
                />
            ) : (
                <button
                    onClick={handleClick}
                    className="text-base font-medium text-textPrimary hover:text-textPrimary bg-transparent hover:bg-surfaceSecondary px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 group"
                >
                    <span className="truncate max-w-[200px]">{projectName || 'Untitled Project'}</span>
                    <svg className="w-3 h-3 text-textTertiary group-hover:text-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                    </svg>
                </button>
            )}
        </div>
    );
}