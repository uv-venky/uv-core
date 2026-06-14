import { type ComponentType, type ReactNode } from 'react';
import type { PageItem, SidebarAction, Team } from './types';
import { type NotificationProvider } from '../../lib/core/client/notifications';
import type { DeployConfigMap } from '../../app/(secure)/admin/monitoring/deployments/deploy-constants';
import type { WorkflowClientPlugin } from '../../lib/workflow/client-plugin';
import type { SidebarIconRegistry } from './icons';
import type { TableVariant } from '../../components/core/common/types';
/**
 * Props for a custom mini logo component.
 * Should match the interface of the default MiniLogo component.
 */
export interface CustomMiniLogoProps {
    className?: string;
    fill?: string;
}
export interface AppContextValue {
    dynamicSidebarContent?: ComponentType<{
        activeTeam: Team;
    }>;
    executeSidebarAction?: (actionName: SidebarAction, path: string) => void;
    isSidebarItemActive?: (pathname: string, item: PageItem, team: Team) => boolean;
    APP_NAME: string;
    APP_DESCRIPTION: string;
    DISABLE_HEADER_FILTERS_DEFAULT: boolean;
    IGNORE_CASE_DEFAULT: boolean;
    TEST_PASSWORD: string;
    /** AWS ECS deployment configuration per environment */
    deployConfig?: DeployConfigMap;
    /** AWS region for deployments (defaults to 'us-east-1') */
    awsRegion?: string;
    /** GitHub repository name for GitHub Actions links (e.g., 'wayvo-ai/metro-one-cop') */
    gitHubRepoName?: string;
    /** Enable useWhyDidYouUpdate debug logging (default: false) */
    whyDidYouUpdateEnabled?: boolean;
    /** Component names to debug with useWhyDidYouUpdate (default: []) */
    whyDidYouUpdateNames?: string[];
    /** Custom mini logo component to replace the default MiniLogo in the sidebar */
    customMiniLogo?: ComponentType<CustomMiniLogoProps>;
    /** Custom workflow plugins for client-side integration registration */
    workflowPlugins?: WorkflowClientPlugin[];
    /** Custom sidebar icons; merged with core icons. Augment SidebarIconRegistry to add type-safe keys. */
    customSidebarIcons?: Record<keyof SidebarIconRegistry, ComponentType<{
        className?: string;
    }>>;
    /** Default row density for all DataTable and Pivot components. Per-component props override this. */
    tableVariant?: TableVariant;
}
export declare const AppContext: import("react").Context<AppContextValue | undefined>;
export declare function useAppContext(): AppContextValue;
/** @deprecated Use useAppContext instead */
export declare const useAppSidebarContext: typeof useAppContext;
/**
 * Hook to access deployment configuration from context.
 * Throws error if deployConfig is not provided by the consuming project.
 */
export declare function useDeployConfig(): {
    deployConfig: any;
    awsRegion: string;
    gitHubRepoName: string | undefined;
};
export interface BaseAppProviderProps extends Partial<AppContextValue> {
    children: ReactNode;
    /**
     * Optional notification provider for core client modules (store, useQuery, etc.).
     * If omitted, the default sonner-based provider is used.
     */
    notificationProvider?: NotificationProvider;
}
export declare function BaseAppProvider({ children, executeSidebarAction, isSidebarItemActive, dynamicSidebarContent, APP_NAME, APP_DESCRIPTION, DISABLE_HEADER_FILTERS_DEFAULT, IGNORE_CASE_DEFAULT, TEST_PASSWORD, deployConfig, awsRegion, gitHubRepoName, whyDidYouUpdateEnabled, whyDidYouUpdateNames, customMiniLogo, workflowPlugins, customSidebarIcons, tableVariant, notificationProvider, }: BaseAppProviderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=app-provider-base.d.ts.map