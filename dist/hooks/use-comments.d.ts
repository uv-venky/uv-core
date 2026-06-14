import type { NewComment } from '@/types/comments';
export declare function useComments(context: string, contextId: string): {
    comments: any[];
    lastViewedAt: string | undefined;
    createComment: (comment: NewComment) => Promise<any>;
    fetchComments: () => Promise<void>;
    hasMore: boolean;
    loading: boolean;
    reactToComment: (commentId: string, emoji: string | null) => Promise<void>;
    toggleReaction: (commentId: string, emoji: string) => Promise<void>;
    setCommentView: () => Promise<void>;
};
//# sourceMappingURL=use-comments.d.ts.map