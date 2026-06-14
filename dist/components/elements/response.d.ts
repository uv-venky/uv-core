import type { StreamdownProps } from 'streamdown';
type ResponseProps = StreamdownProps & {
    className?: string;
    kbChunksByFile?: Record<string, {
        chunkIds: string[];
        docId: string;
    }>;
};
export declare const Response: import("react").MemoExoticComponent<({ className, children, kbChunksByFile, ...props }: ResponseProps) => import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=response.d.ts.map