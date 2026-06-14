import type { UserAvatar as UserAvatarType } from '../../../lib/common/ds/types/core/UserAvatar';
export declare function useUserAvatarStore(): import("../../../lib/core/common/types/Store").Store<UserAvatarType>;
export default function UserAvatar({ userId, userName, showDisplayName, showEmail, showImage, }: {
    userId?: number | null;
    userName?: string | null;
    showDisplayName?: boolean;
    showImage?: boolean;
    showEmail?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=user-avatar.d.ts.map