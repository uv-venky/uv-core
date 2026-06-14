import type { IntegrationType } from '@/lib/types/integration';
type IntegrationSelectorProps = {
    integrationType: IntegrationType;
    value?: string;
    onChange: (integrationId: string | undefined) => void;
    onOpenSettings?: () => void;
    label?: string;
    disabled?: boolean;
};
export declare function IntegrationSelector({ integrationType, value, onChange, onOpenSettings, label, disabled, }: IntegrationSelectorProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=integration-selector.d.ts.map