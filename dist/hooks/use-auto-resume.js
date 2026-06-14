'use client';
import { useEffect } from 'react';
import { useDataStream } from '@/components/chat/data-stream-provider';
export function useAutoResume({ autoResume, initialMessages, resumeStream, setMessages }) {
    const { dataStream } = useDataStream();
    // biome-ignore lint/correctness/useExhaustiveDependencies: we intentionally run this once
    useEffect(() => {
        if (!autoResume) {
            return;
        }
        const mostRecentMessage = initialMessages.at(-1);
        if (mostRecentMessage?.role === 'user') {
            resumeStream();
        }
        // we intentionally run this once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoResume, resumeStream]);
    useEffect(() => {
        if (!dataStream) {
            return;
        }
        if (dataStream.length === 0) {
            return;
        }
        const dataPart = dataStream[0];
        if (dataPart.type === 'data-appendMessage') {
            const message = JSON.parse(dataPart.data);
            setMessages([...initialMessages, message]);
        }
    }, [dataStream, initialMessages, setMessages]);
}
//# sourceMappingURL=use-auto-resume.js.map