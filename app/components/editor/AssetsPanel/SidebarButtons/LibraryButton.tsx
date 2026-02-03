import Image from 'next/image';

export default function LibraryButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="w-14 h-14 rounded-xl bg-surfaceSecondary border border-borderPrimary hover:border-purple hover:bg-surfaceTertiary transition-all duration-200 flex flex-col items-center justify-center gap-1 group relative overflow-hidden"
            title="Library"
        >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-mixed opacity-0 group-hover:opacity-10 transition-opacity"></div>

            <Image
                alt="Library"
                className="h-auto w-auto max-w-[20px] max-h-[20px] opacity-70 group-hover:opacity-100 transition-opacity relative z-10"
                height={20}
                width={20}
                src="https://www.svgrepo.com/show/535454/image.svg"
                style={{ filter: 'invert(1)' }}
            />
            <span className="text-[10px] text-textSecondary group-hover:text-textPrimary transition-colors relative z-10">Media</span>
        </button>
    );
}