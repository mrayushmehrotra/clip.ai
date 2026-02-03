"use client";

import { listFiles, useAppDispatch, useAppSelector } from "../../../../store";
import { setMediaFiles, setFilesID } from "../../../../store/slices/projectSlice";
import { storeFile } from "../../../../store";
import { categorizeFile } from "../../../../utils/utils";

export default function AddMedia() {
    const { mediaFiles, filesID } = useAppSelector((state) => state.projectState);
    const dispatch = useAppDispatch();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        const updatedFiles = [...filesID || []];
        for (const file of newFiles) {
            const fileId = crypto.randomUUID();
            await storeFile(file, fileId);
            updatedFiles.push(fileId)
        }
        dispatch(setFilesID(updatedFiles));
        e.target.value = "";
    };

    return (
        <div className="w-full">
            <label
                htmlFor="file-upload"
                className="cursor-pointer w-full btn-primary flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all hover:shadow-glow group"
            >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Media</span>
            </label>
            <input
                type="file"
                accept="video/*,audio/*,image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
            />
        </div>
    );
}
