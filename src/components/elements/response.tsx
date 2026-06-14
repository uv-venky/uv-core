'use client';

import { memo, useEffect, useState, type ReactNode } from 'react';
import type { StreamdownProps } from 'streamdown';
import { cn } from '@/lib/chat/utils';
import { PdfCitation } from '@/components/elements/pdf-dialog';
import { hasMarkdownSyntax, loadStreamdown, type StreamdownComponent } from '@/lib/markdown';

type ResponseProps = StreamdownProps & {
  className?: string;
  kbChunksByFile?: Record<string, { chunkIds: string[]; docId: string }>;
};

const CITE_RE = /\[source:\s*([^\],]+?)(?:\s*,\s*p{1,2}\.\s*([^\]]+?))?\s*\]/gi;
const CITE_DETECT_RE = /\[source:\s*[^\]]+?\s*\]/i;

function renderWithCitations(
  text: string,
  kbChunksByFile?: Record<string, { chunkIds: string[]; docId: string }>,
): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  const regex = new RegExp(CITE_RE.source, 'gi');
  let match: RegExpExecArray | null = regex.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const file = match[1].trim();
    const pageStr = match[2]?.trim();
    const pageNum = pageStr ? Number.parseInt(pageStr, 10) : undefined;
    const kbEntry = kbChunksByFile?.[file];
    parts.push(
      <PdfCitation
        key={`cite-${match.index}`}
        fileName={file}
        pageNumber={Number.isNaN(pageNum) ? undefined : pageNum}
        highlightChunks={kbEntry?.chunkIds}
        docId={kbEntry?.docId}
      />,
    );
    lastIndex = regex.lastIndex;
    match = regex.exec(text);
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export const Response = memo(
  ({ className, children, kbChunksByFile, ...props }: ResponseProps) => {
    const [Streamdown, setStreamdown] = useState<StreamdownComponent | null>(null);
    const rawContent = children?.toString() ?? '';
    const hasCitations = CITE_DETECT_RE.test(rawContent);
    const needsMarkdown = hasMarkdownSyntax(rawContent) || hasCitations;

    useEffect(() => {
      if (!needsMarkdown) return;
      let cancelled = false;
      void loadStreamdown().then((component: any) => {
        if (!cancelled) {
          setStreamdown(() => component);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [needsMarkdown]);

    if (!needsMarkdown) {
      return (
        <div className={cn('size-full whitespace-pre-wrap break-words', className)}>
          {hasCitations ? renderWithCitations(rawContent, kbChunksByFile) : rawContent}
        </div>
      );
    }
    if (!Streamdown) {
      return <div className={cn('invisible size-full whitespace-pre-wrap break-words', className)}>{rawContent}</div>;
    }

    // Streamdown applies its own classes (e.g. `py-1 [&>p]:inline` on <li>)
    // to its built-in components. When we override them, those classes are lost.
    // We must replicate the critical styles so loose-list <p> tags inside <li>
    // render inline with the bullet marker (list-inside positioning).
    const citationComponents = hasCitations
      ? {
          p(pProps: any) {
            const { children: pChildren, ...rest } = pProps;
            if (!pChildren) return <p {...rest} />;
            const text = typeof pChildren === 'string' ? pChildren : null;
            if (text && CITE_DETECT_RE.test(text)) {
              return <p {...rest}>{renderWithCitations(text, kbChunksByFile)}</p>;
            }
            return <p {...rest}>{pChildren}</p>;
          },
          li(liProps: any) {
            const { children: liChildren, className: liCls, ...rest } = liProps;
            const mergedCls = cn('py-1 [&>p]:inline', liCls);
            if (!liChildren) return <li className={mergedCls} {...rest} />;
            const text = typeof liChildren === 'string' ? liChildren : null;
            if (text && CITE_DETECT_RE.test(text)) {
              return (
                <li className={mergedCls} {...rest}>
                  {renderWithCitations(text, kbChunksByFile)}
                </li>
              );
            }
            return (
              <li className={mergedCls} {...rest}>
                {liChildren}
              </li>
            );
          },
        }
      : undefined;

    return (
      <Streamdown
        className={cn(
          'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_code]:whitespace-pre-wrap [&_code]:break-words [&_pre]:max-w-full [&_pre]:overflow-x-auto',
          className,
        )}
        {...props}
        components={citationComponents}
      >
        {rawContent}
      </Streamdown>
    );
  },
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children && prevProps.kbChunksByFile === nextProps.kbChunksByFile,
);

Response.displayName = 'Response';
