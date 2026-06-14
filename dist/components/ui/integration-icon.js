'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { Database, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getIntegration } from '../../plugins';
// Inline SVG for Vercel icon (special case - no plugin)
function VercelIcon({ className }) {
    return (_jsx("svg", { className: className, fill: "currentColor", height: "12", viewBox: "0 0 1155 1000", width: "12", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "m577.3 0 577.4 1000H0z" }) }));
}
// Special icons for integrations without plugins (database, vercel)
const SPECIAL_ICONS = {
    database: Database,
    vercel: VercelIcon,
};
export function IntegrationIcon({ integration, className = 'h-3 w-3' }) {
    // Check for special icons first (integrations without plugins)
    const SpecialIcon = SPECIAL_ICONS[integration];
    if (SpecialIcon) {
        return _jsx(SpecialIcon, { className: cn('text-foreground', className) });
    }
    // Look up plugin from registry
    const plugin = getIntegration(integration);
    if (plugin?.icon) {
        const PluginIcon = plugin.icon;
        return _jsx(PluginIcon, { className: cn('text-foreground', className) });
    }
    // Fallback for unknown integrations
    return _jsx(HelpCircle, { className: cn('text-foreground', className) });
}
//# sourceMappingURL=integration-icon.js.map