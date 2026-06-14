'use client';

import { useSetAtom } from 'jotai';
import { AlertTriangle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { integrationsVersionAtom } from '@/lib/integrations-store';
import type { IntegrationType } from '@/lib/types/integration';
import { IntegrationFormDialog } from '@/components/settings/integration-form-dialog';
import { useIntegrationsStore } from '@/components/settings/hooks/use-integrations-store';
import { useRows, useIsStoreLoading } from '@/components/core/hooks/useStoreHooks';
import type { WorkflowIntegrations } from '@/lib/common/ds/types/core/WorkflowIntegrations';
import { getIntegration } from '@/plugins';

type IntegrationSelectorProps = {
  integrationType: IntegrationType;
  value?: string;
  onChange: (integrationId: string | undefined) => void;
  onOpenSettings?: () => void;
  label?: string;
  disabled?: boolean;
};

export function IntegrationSelector({
  integrationType,
  value,
  onChange,
  onOpenSettings,
  label,
  disabled,
}: IntegrationSelectorProps) {
  const store = useIntegrationsStore();
  const allIntegrations = useRows(store) as WorkflowIntegrations[];
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

  const handleValueChange = async (newValue: string) => {
    if (newValue === '__new__') {
      // Reset auto-select flag when creating new integration
      hasAutoSelectedRef.current = false;
      await store.createNew({ partialRecord: { type: integrationType } });
      setShowNewDialog(true);
    } else if (newValue === '__manage__') {
      onOpenSettings?.();
    } else {
      onChange(newValue || undefined);
    }
  };

  const handleNewIntegrationCreated = async (integrationId: string) => {
    onChange(integrationId);
    setShowNewDialog(false);
    // Increment version to trigger auto-fix for other nodes that need this integration type
    setIntegrationsVersion((v: any) => v + 1);
  };

  if (loading) {
    return (
      <Select disabled value="">
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (integrations.length === 0) {
    // If integration doesn't require configs, don't show selector (no integration needed)
    if (!requiresConfig) {
      return null;
    }

    return (
      <div className="space-y-2">
        <Select disabled={disabled} onValueChange={handleValueChange} value={value}>
          <SelectTrigger className="flex-1">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-orange-500/50 p-0.5">
                <AlertTriangle className="size-3 text-white" />
              </div>
              <SelectValue placeholder="No integrations" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__new__">New Integration</SelectItem>
            <SelectItem value="__manage__">Manage Integrations</SelectItem>
          </SelectContent>
        </Select>

        <IntegrationFormDialog
          onClose={() => setShowNewDialog(false)}
          onSuccess={handleNewIntegrationCreated}
          open={showNewDialog}
          preselectedType={integrationType}
        />
      </div>
    );
  }

  // For integrations without configs, hide the selector (no integrationId needed)
  if (!requiresConfig) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-muted-foreground text-sm">{label}</span>}
      <Select disabled={disabled} onValueChange={handleValueChange} value={value}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Select integration..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__new__">New Integration</SelectItem>
          <SelectItem value="__manage__">Manage Integrations</SelectItem>
          {integrations.length > 0 && <Separator className="my-1" />}
          {integrations.map((integration) => (
            <SelectItem key={integration.id} value={integration.id}>
              {integration.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <IntegrationFormDialog
        onClose={() => setShowNewDialog(false)}
        onSuccess={handleNewIntegrationCreated}
        open={showNewDialog}
        preselectedType={integrationType}
      />
    </div>
  );
}
