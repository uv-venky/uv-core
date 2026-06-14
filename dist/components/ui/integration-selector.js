'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSetAtom } from 'jotai';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { integrationsVersionAtom } from '@/lib/integrations-store';
import { IntegrationFormDialog } from '@/components/settings/integration-form-dialog';
import { useIntegrationsStore } from '@/components/settings/hooks/use-integrations-store';
import { useRows, useIsStoreLoading } from '../../components/core/hooks/useStoreHooks';
import { getIntegration } from '../../plugins';
export function IntegrationSelector({ integrationType, value, onChange, onOpenSettings, label, disabled, }) {
    const store = useIntegrationsStore();
    const allIntegrations = useRows(store);
    const loading = useIsStoreLoading(store);
    const [showNewDialog, setShowNewDialog] = useState(false);
    const setIntegrationsVersion = useSetAtom(integrationsVersionAtom);
    const onChangeRef = useRef(onChange);
    const hasAutoSelectedRef = useRef(false);
    // Keep onChange ref up to date
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);
    // Filter integrations by type
    const integrations = useMemo(() => {
        return allIntegrations.filter((i) => i.type === integrationType);
    }, [allIntegrations, integrationType]);
    // Check if this integration type requires config fields
    const requiresConfig = useMemo(() => {
        const plugin = getIntegration(integrationType);
        const hasFormFields = plugin?.formFields && plugin.formFields.length > 0;
        const isDatabase = integrationType === 'database';
        return hasFormFields || isDatabase;
    }, [integrationType]);
    // For non-configurable integrations, ensure integrationId is cleared if not needed
    useEffect(() => {
        if (!requiresConfig && !loading && integrations.length === 0 && value) {
            // Clear the integrationId since we don't need it for non-configurable integrations
            onChangeRef.current(undefined);
        }
    }, [requiresConfig, loading, integrations.length, value]);
    // Auto-select if only one option and nothing selected yet
    // Use refs to prevent infinite loops from onChange function reference changes
    const singleIntegrationId = integrations.length === 1 ? integrations[0]?.id : null;
    useEffect(() => {
        // Don't auto-select if dialog is open (creating new integration)
        if (showNewDialog) {
            return;
        }
        // Only auto-select if we have exactly one integration, no value selected, and haven't already auto-selected
        if (singleIntegrationId && !value && !hasAutoSelectedRef.current) {
            hasAutoSelectedRef.current = true;
            onChangeRef.current(singleIntegrationId);
        }
        // Reset auto-select flag when value changes or integrations count changes
        if (value || !singleIntegrationId) {
            hasAutoSelectedRef.current = false;
        }
    }, [singleIntegrationId, value, showNewDialog]);
    // // Refresh store when version changes
    // useEffect(() => {
    //   store.executeQuery();
    // }, [integrationsVersion, store]);
    const handleValueChange = async (newValue) => {
        if (newValue === '__new__') {
            // Reset auto-select flag when creating new integration
            hasAutoSelectedRef.current = false;
            await store.createNew({ partialRecord: { type: integrationType } });
            setShowNewDialog(true);
        }
        else if (newValue === '__manage__') {
            onOpenSettings?.();
        }
        else {
            onChange(newValue || undefined);
        }
    };
    const handleNewIntegrationCreated = async (integrationId) => {
        onChange(integrationId);
        setShowNewDialog(false);
        // Increment version to trigger auto-fix for other nodes that need this integration type
        setIntegrationsVersion((v) => v + 1);
    };
    if (loading) {
        return (_jsx(Select, { disabled: true, value: "", children: _jsx(SelectTrigger, { className: "flex-1", children: _jsx(SelectValue, { placeholder: "Loading..." }) }) }));
    }
    if (integrations.length === 0) {
        // If integration doesn't require configs, don't show selector (no integration needed)
        if (!requiresConfig) {
            return null;
        }
        return (_jsxs("div", { className: "space-y-2", children: [_jsxs(Select, { disabled: disabled, onValueChange: handleValueChange, value: value, children: [_jsx(SelectTrigger, { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "rounded-full bg-orange-500/50 p-0.5", children: _jsx(AlertTriangle, { className: "size-3 text-white" }) }), _jsx(SelectValue, { placeholder: "No integrations" })] }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "__new__", children: "New Integration" }), _jsx(SelectItem, { value: "__manage__", children: "Manage Integrations" })] })] }), _jsx(IntegrationFormDialog, { onClose: () => setShowNewDialog(false), onSuccess: handleNewIntegrationCreated, open: showNewDialog, preselectedType: integrationType })] }));
    }
    // For integrations without configs, hide the selector (no integrationId needed)
    if (!requiresConfig) {
        return null;
    }
    return (_jsxs("div", { className: "flex items-center gap-2", children: [label && _jsx("span", { className: "text-muted-foreground text-sm", children: label }), _jsxs(Select, { disabled: disabled, onValueChange: handleValueChange, value: value, children: [_jsx(SelectTrigger, { className: "flex-1", children: _jsx(SelectValue, { placeholder: "Select integration..." }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "__new__", children: "New Integration" }), _jsx(SelectItem, { value: "__manage__", children: "Manage Integrations" }), integrations.length > 0 && _jsx(Separator, { className: "my-1" }), integrations.map((integration) => (_jsx(SelectItem, { value: integration.id, children: integration.name }, integration.id)))] })] }), _jsx(IntegrationFormDialog, { onClose: () => setShowNewDialog(false), onSuccess: handleNewIntegrationCreated, open: showNewDialog, preselectedType: integrationType })] }));
}
//# sourceMappingURL=integration-selector.js.map