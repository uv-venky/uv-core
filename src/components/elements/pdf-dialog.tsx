'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';
import { Popup } from '../core/page/popup';

interface PdfCitationProps {
  fileName: string;
  pageNumber?: number;
  openInNewTab?: boolean;
  highlightChunks?: string[];
  docId?: string;
}

interface ChunkData {
  chunkId: string;
  content: string;
  chunkIndex: number;
  sectionTitle: string | null;
  highlighted: boolean;
}

function MarkdownContent({
  fileName,
  highlightChunks,
  docId,
}: {
  fileName: string;
  highlightChunks?: string[];
  docId?: string;
}) {
  const [chunks, setChunks] = useState<ChunkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const chunksParam = highlightChunks?.length ? `&chunks=${highlightChunks.join(',')}` : '';
        // Get user query from the last user message on the page for similarity highlighting
        const userMsgEl = document.querySelector('[data-testid="message-content"]');
        const userQuery = userMsgEl?.textContent?.trim() || '';
        const queryParam = !highlightChunks?.length && userQuery ? `&query=${encodeURIComponent(userQuery)}` : '';
        const docParam = docId ? `&docId=${docId}` : '';
        const res = await fetch(
          `/api/command-center/kb/document?file=${encodeURIComponent(fileName)}${docParam}${chunksParam}${queryParam}`,
        );
        const data = await res.json();
        if (data.status === 'OK') {
          setChunks(data.chunks || []);
        } else {
          setError(data.message || 'Failed to load document');
        }
      } catch {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [fileName, highlightChunks, docId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive text-sm">{error}</div>
      </div>
    );
  }

  const hasHighlights = chunks.some((c) => c.highlighted);

  return (
    <div className="h-full overflow-auto p-4">
      {hasHighlights && (
        <div className="mb-4 flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700 text-xs dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
          <span className="inline-block size-2 rounded-full bg-blue-500" />
          Highlighted sections were used to generate the response
        </div>
      )}
      <div className="space-y-1">
        {chunks.map((chunk) => (
          <div
            key={chunk.chunkId}
            className={
              chunk.highlighted
                ? 'rounded-md border-blue-500 border-l-4 bg-blue-50/50 py-2 pr-3 pl-4 dark:bg-blue-950/30'
                : 'py-2 pr-3 pl-4'
            }
          >
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{chunk.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PdfCitation({ fileName, pageNumber, openInNewTab = false, highlightChunks, docId }: PdfCitationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeBlocked, setIframeBlocked] = useState(false);

  const isPdf = fileName.toLowerCase().endsWith('.pdf');
  const label = pageNumber ? `${fileName} p${pageNumber}` : fileName;

  const isKbDoc = !!(docId || highlightChunks?.length);
  const baseUrl = docId
    ? `/api/command-center/kb/file?docId=${docId}`
    : isKbDoc
      ? `/api/command-center/kb/file?file=${encodeURIComponent(fileName)}`
      : `/api/files?file=${encodeURIComponent(fileName)}`;
  const pdfUrlWithPage = pageNumber ? `${baseUrl}&page=${pageNumber}#page=${pageNumber}` : baseUrl;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setError(null);
      setIframeBlocked(false);
    }
  };

  const handleOpenPdf = async () => {
    if (openInNewTab) {
      setIsLoading(true);
      setError(null);
      try {
        const newWindow = window.open(pdfUrlWithPage, '_blank');
        if (!newWindow) {
          throw new Error('Unable to open PDF. Please check your popup blocker settings.');
        }
        setIsOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to open PDF');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <span
        role="button"
        onClick={() => (isPdf && openInNewTab ? handleOpenPdf() : handleOpenChange(true))}
        className="inline-flex cursor-pointer items-center gap-1 rounded bg-muted/50 px-1.5 py-0.5 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground"
        data-tip={fileName}
      >
        <FileText className="size-3" />
        {label}
      </span>
      {isOpen && (
        <Popup
          onClose={() => handleOpenChange(false)}
          title={fileName}
          width={1200}
          height={880}
          headerToolbar={
            isPdf ? (
              <Button
                variant="link"
                size="sm"
                onClick={() => window.open(pdfUrlWithPage, '_blank')}
                className="mr-4 inline-flex items-center gap-2"
              >
                <ExternalLink className="size-4" />
                Open in New Tab
              </Button>
            ) : undefined
          }
        >
          <div className="relative h-full w-full flex-1">
            {error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive text-sm">{error}</div>
              </div>
            )}

            {isPdf ? (
              !iframeBlocked ? (
                <iframe
                  src={pdfUrlWithPage}
                  className="h-full w-full border-0"
                  title={`PDF: ${fileName}${pageNumber ? ` (Page ${pageNumber})` : ''}`}
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setIframeBlocked(true);
                    setIsLoading(false);
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="space-y-4 text-center">
                    <p className="text-muted-foreground text-sm">
                      PDF cannot be displayed in this dialog due to security restrictions.
                    </p>
                    <Button onClick={() => window.open(pdfUrlWithPage, '_blank')} className="w-full">
                      <ExternalLink className="size-4" />
                      Open PDF in New Tab
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <MarkdownContent fileName={fileName} highlightChunks={highlightChunks} docId={docId} />
            )}

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </Popup>
      )}
    </>
  );
}
