declare module 'dom-to-image' {
  const domToImage: any;
  export default domToImage;
}

declare module 'streamdown' {
  export type StreamdownProps = any;
  const content: any;
  export default content;
}

declare module 'emoji-picker-react' {
  import * as React from 'react';
  export enum Theme {
    DARK = 'dark',
    LIGHT = 'light',
    AUTO = 'auto'
  }
  const EmojiPicker: React.ComponentType<any>;
  export default EmojiPicker;
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
}

declare module 'react-scan' {
  export const scan: any;
}

declare module '@dnd-kit/core' {
  export const DndContext: any;
  export const useDraggable: any;
  export const useDroppable: any;
  export const DragOverlay: any;
  export const closestCenter: any;
  export const KeyboardSensor: any;
  export const PointerSensor: any;
  export const useSensor: any;
  export const useSensors: any;
  export type DragEndEvent = any;
}

declare module '@dnd-kit/sortable' {
  export const arrayMove: any;
  export const SortableContext: any;
  export const useSortable: any;
  export const verticalListSortingStrategy: any;
  export const sortableKeyboardCoordinates: any;
}

declare module '@dnd-kit/utilities' {
  export const CSS: any;
}

declare module 'motion' {
  export const animate: any;
}

declare module 'flubber' {
  export const interpolate: any;
}

declare module 'tinycolor2' {
  const content: any;
  export default content;
}

declare module 'papaparse' {
  export const parse: any;
  export const unparse: any;
}

declare module 'xlsx' {
  export const read: any;
  export const utils: any;
  export const write: any;
  export type WorkBook = any;
  export type WorkSheet = any;
}

declare module 'react-fusioncharts' {
  const content: any;
  export default content;
}

declare module 'immutable' {
  export const Map: any;
  export const List: any;
  export type List<T = any> = any;
  export type Map<K = any, V = any> = any;
  export const fromJS: any;
}

declare module 'react-syntax-highlighter' {
  export const Prism: any;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const oneDark: any;
  export const oneLight: any;
}

declare module 'use-stick-to-bottom' {
  export const useStickToBottom: any;
  export const StickToBottom: any;
  export const useStickToBottomContext: any;
}

declare module 'next/link' {
  const content: any;
  export default content;
}

// Local path stubs for app-specific components
declare module '@/components/chat/visibility-selector' {
  export type VisibilityType = any;
  export const VisibilitySelector: any;
}
declare module '@/lib/chat/usage' {
  export type AppUsage = any;
  export const getChatUsage: any;
}
declare module '@/components/chat/artifact' {
  export type ArtifactKind = any;
  export const ChatArtifact: any;
}
declare module '@/lib/chat/types' {
  export type CustomUIDataTypes = any;
  export type ChatMessage = any;
}
declare module '@/lib/chat/utils' {
  export const cn: any;
  export const getChatUtils: any;
  const content: any;
  export default content;
}
declare module '@/lib/types/integration' {
  export type IntegrationType = any;
}
declare module '@/plugins' {
  export const getIntegration: any;
  export const findActionById: any;
  export const plugins: any;
}
declare module '@/components/settings/integration-form-dialog' {
  export const IntegrationFormDialog: any;
}
declare module '@/components/settings/hooks/use-integrations-store' {
  export const useIntegrationsStore: any;
}
declare module '@/hooks/use-mobile' {
  export function useIsMobile(): boolean;
}
declare module '@/lib/workflow-store' {
  export const edgesAtom: any;
  export const nodesAtom: any;
  export type WorkflowNode = any;
  export type WorkflowEdge = any;
  export const selectedNodeAtom: any;
  export const workflowStore: any;
}
declare module '@/lib/integrations-store' {
  export const integrationsVersionAtom: any;
  export const integrationsStore: any;
}
declare module '@/lib/feedback/client/FeedbackWidget' {
  export const FeedbackWidgetMenuItem: any;
  export const FeedbackWidgetMenuItemPanel: any;
  export const pushLog: any;
}
declare module '@/lib/monaco-setup' {
  const content: any;
  export default content;
}
declare module '@/lib/monaco-theme' {
  export const vercelDarkTheme: any;
  const content: any;
  export default content;
}
declare module '@/app/login/mini-logo' {
  export const MiniLogo: any;
  const content: any;
  export default content;
}
declare module '@/lib/common/cc-constants' {
  export const CC_ADMIN_ROLES: any;
  export const CC_BASE_ROLES: any;
  const content: any;
  export default content;
}
declare module '@/app/login/actions' {
  export const authenticate: any;
  const content: any;
  export default content;
}
declare module '@/app/login/reset-password/actions' {
  export const changePassword: any;
  export const requestPasswordReset: any;
  const content: any;
  export default content;
}
declare module '@/lib/common/password-utils' {
  export const getPasswordRequirements: any;
  const content: any;
  export default content;
}
declare module '@/app/(secure)/(chat)/chat/[[...id]]/state' {
  export const createNewChat: any;
  const content: any;
  export default content;
}
declare module 'next/navigation' {
  export const useRouter: any;
  export const usePathname: any;
  export const useSearchParams: any;
  export const useParams: any;
}
declare module '@/app/(secure)/EnvProvider' {
  export const EnvProvider: any;
  const content: any;
  export default content;
}
declare module '@/lib/common/ui-constants' {
  export const APP_DESCRIPTION: any;
  export const APP_NAME: any;
  export const DISABLE_HEADER_FILTERS_DEFAULT: any;
  export const IGNORE_CASE_DEFAULT: any;
  export const TEST_PASSWORD: any;
  const content: any;
  export default content;
}
declare module '@/app/(secure)/admin/monitoring/deployments/deploy-constants' {
  export const DeployConfigMap: any;
  export type DeployConfigMap = any;
  const content: any;
  export default content;
}
declare module '@/lib/workflow/client-plugin' {
  export const WorkflowClientPlugin: any;
  export type WorkflowClientPlugin = any;
  const content: any;
  export default content;
}
declare module '@/plugins/registry' {
  export const registerIntegration: any;
  const content: any;
  export default content;
}
declare module '@/app/(secure)/client-root-layout' {
  export const clientRootLayout: any;
  const content: any;
  export default content;
}
declare module '@/lib/markdown' {
  export const hasMarkdownSyntax: any;
  export const loadStreamdown: any;
  export type StreamdownComponent = any;
  export const Markdown: any;
  export const loadMarkdownDeps: any;
  export type MarkdownDeps = any;
  export const MarkdownDeps: any;
  const content: any;
  export default content;
}

declare module '@/types/comments' {
  export type Comment = any;
  export type Attachment = any;
  export type AttachmentWithFile = any;
  export type CommentWithParent = any;
  export type NewComment = any;
  export type CommentsProps = any;
  const content: any;
  export default content;
}

declare module 'ai' {
  export type UIMessagePart<T = any, U = any> = any;
  export type UITools = any;
  export type ToolUIPart = any;
  export type UIMessage = any;
  export type ChatStatus = any;
  export type Experimental_GeneratedImage = any;
  export const useChat: any;
}

declare module 'nodemailer/lib/mailer' {
  const Mailer: any;
  export default Mailer;
}

interface Window {
  __WAYVO_LOADING_COUNT__?: number;
  __WAYVO_DATA_READY__?: boolean;
}

declare namespace Mail {
  type Address = any;
  type Attachment = any;
  type Options = any;
}

declare module '*.css' {
  const content: any;
  export default content;
}

declare module '@aws-sdk/s3-presigned-post' {
  export type PresignedPost = any;
}
