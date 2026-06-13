import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
const DEFAULT_LOGO = `<svg viewBox="0 0 1000 201" style="height: 24px; width: auto;" class="sidebar-logo-svg" xmlns="http://www.w3.org/2000/svg">
  <g fill="#fff">
    <path d="M373.684,148.475h-10.867l47.677-90.412h11.57l46.509,90.412h-10.867l-37.629-73.597-3.857-8.407-3.973,8.407-38.563,73.597Z"/>
    <path d="M505.047,116.572v-58.509h9.816v59.315c0,14.396,11.686,23.381,35.291,23.381,19.281,0,33.888-8.178,33.888-23.266v-59.43h9.816v59.315c0,21.076-17.295,32.364-44.055,32.364-26.527,0-44.757-10.136-44.757-33.17Z"/>
    <path d="M658.763,148.475h-9.816V58.063h56.443c13.205,0,20.802,4.377,24.656,11.173,1.987,3.57,3.156,7.831,3.156,13.705,0,5.644-.935,10.481-2.804,13.706-3.04,5.413-8.998,9.213-15.776,9.79l27.812,42.039h-11.92l-26.293-40.426h-21.652l-5.011-8.868h29.234c7.595,0,12.504-2.303,14.608-6.565,1.167-2.303,1.751-5.759,1.751-8.868,0-3.571-.584-7.256-1.751-9.328-2.572-4.723-8.063-7.256-17.414-7.256h-45.224v81.313Z"/>
    <path d="M789.89,58.063h10.051v90.412h-10.051V58.063Z"/>
    <path d="M884.202,102.405l-40.901-44.342h12.62l34.357,37.087,35.407-37.087h12.038l-41.719,43.767,42.77,46.645h-12.62l-36.226-39.389-37.745,39.389h-12.038l44.057-46.07Z"/>
  </g>
</svg>`;
const ICONS = {
    admin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,
    chat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    workflow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M21 12H3"/><path d="M12 3v18"/></svg>`,
    settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron-icon"><polyline points="6 9 12 15 18 9"/></svg>`,
    toggleLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toggle-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 8 8 12 12 16"/><line x1="16" y1="12" x2="8" y2="12"/></svg>`,
    toggleRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toggle-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 8 16 12 12 16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`,
    logout: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
};
function getIcon(name) {
    const normalized = name.toLowerCase();
    let rawSvg = ICONS.default;
    if (normalized.includes('admin') || normalized.includes('console'))
        rawSvg = ICONS.admin;
    else if (normalized.includes('chat') || normalized.includes('agent'))
        rawSvg = ICONS.chat;
    else if (normalized.includes('workflow') || normalized.includes('run'))
        rawSvg = ICONS.workflow;
    else if (normalized.includes('setting'))
        rawSvg = ICONS.settings;
    else if (normalized.includes('user') || normalized.includes('profile'))
        rawSvg = ICONS.user;
    return _jsx("div", { dangerouslySetInnerHTML: { __html: rawSvg }, style: { display: 'contents' } });
}
export const SidebarLayout = ({ activeTeam, teams, activePath, user, brandName = 'Stitchmate', logo = DEFAULT_LOGO, contentHtml = '', tokenStorageKey = 'uv_access_token', logoutApiPath = '/api/auth/logout', }) => {
    const isSingleTeam = teams.length === 1;
    return (_jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "utf-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), _jsx("title", { children: `${brandName} Dashboard` }), _jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }), _jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }), _jsx("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap", rel: "stylesheet" }), _jsx("style", { dangerouslySetInnerHTML: { __html: `
          :root {
            --primary: #512fff;
            --primary-hover: #4120D9;
            --bg-slate-900: #0f172a;
            --bg-slate-950: #020617;
            --sidebar-bg: rgba(15, 23, 42, 0.6);
            --sidebar-border: rgba(255, 255, 255, 0.08);
            --text-white: #f8fafc;
            --text-muted: #94a3b8;
            --border-slate: #334155;
            --sidebar-width-expanded: 260px;
            --sidebar-width-collapsed: 70px;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Inter', system-ui, sans-serif;
            min-height: 100vh;
            color: var(--text-white);
            background-color: var(--bg-slate-950);
            display: flex;
            overflow-x: hidden;
            position: relative;
          }

          .bg-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }

          .bg-container::before {
            content: '';
            position: absolute;
            width: 150%;
            height: 150%;
            background: radial-gradient(circle at 80% 20%, rgba(81, 47, 255, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 10% 80%, rgba(15, 23, 42, 0.9) 0%, transparent 60%);
            animation: rotateBg 40s infinite linear;
          }

          @keyframes rotateBg {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: var(--sidebar-width-expanded);
            background: var(--sidebar-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-right: 1px solid var(--sidebar-border);
            display: flex;
            flex-direction: column;
            z-index: 100;
            transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .sidebar.collapsed {
            width: var(--sidebar-width-collapsed);
          }

          .sidebar-header {
            padding: 1rem;
            border-bottom: 1px solid var(--sidebar-border);
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            position: relative;
          }

          .sidebar-brand-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 32px;
          }

          .sidebar-logo-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            overflow: hidden;
            white-space: nowrap;
            transition: opacity 0.2s ease;
          }

          .sidebar.collapsed .sidebar-logo-container {
            opacity: 0;
            width: 0;
            pointer-events: none;
          }

          .sidebar-toggle-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 4px;
            transition: all 0.2s ease;
          }

          .sidebar-toggle-btn:hover {
            color: var(--text-white);
            background: rgba(255, 255, 255, 0.05);
          }

          .toggle-icon {
            width: 20px;
            height: 20px;
          }

          .team-switcher-container {
            position: relative;
            width: 100%;
          }

          .team-switcher-btn {
            width: 100%;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--sidebar-border);
            border-radius: 8px;
            padding: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-white);
            cursor: pointer;
            text-align: left;
            font-family: inherit;
            transition: all 0.2s ease;
          }

          .team-switcher-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
          }

          .team-logo-avatar {
            width: 32px;
            height: 32px;
            background: var(--primary);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 1rem;
            flex-shrink: 0;
            box-shadow: 0 4px 10px rgba(81, 47, 255, 0.25);
          }

          .team-info {
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            min-width: 0;
            transition: opacity 0.2s ease;
          }

          .sidebar.collapsed .team-info {
            opacity: 0;
            width: 0;
            pointer-events: none;
          }

          .team-name {
            font-size: 0.875rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .team-role {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .chevron-icon {
            width: 16px;
            height: 16px;
            color: var(--text-muted);
            flex-shrink: 0;
            transition: transform 0.2s ease;
          }

          .sidebar.collapsed .chevron-icon {
            display: none;
          }

          .team-dropdown-list {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #0b0f19;
            border: 1px solid var(--sidebar-border);
            border-radius: 8px;
            margin-top: 4px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
            z-index: 110;
            overflow: hidden;
          }

          .team-dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.625rem;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.875rem;
            transition: all 0.2s ease;
          }

          .team-dropdown-item:hover {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-white);
          }

          .team-dropdown-item.active {
            background: rgba(81, 47, 255, 0.1);
            color: var(--text-white);
          }

          .team-dropdown-item.active .team-logo-avatar {
            background: var(--primary);
          }

          .sidebar-content {
            flex: 1;
            overflow-y: auto;
            padding: 1rem 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .sidebar-group {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
          }

          .sidebar-group-label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            padding: 0 0.75rem;
            margin-bottom: 0.25rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            transition: opacity 0.2s ease;
          }

          .sidebar.collapsed .sidebar-group-label {
            opacity: 0;
          }

          .sidebar-menu {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .sidebar-menu-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.625rem 0.75rem;
            color: var(--text-muted);
            text-decoration: none;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            transition: all 0.2s ease;
            white-space: nowrap;
          }

          .sidebar-menu-link:hover {
            color: var(--text-white);
            background: rgba(255, 255, 255, 0.04);
          }

          .sidebar-menu-link.active {
            color: var(--text-white);
            background: var(--primary);
            box-shadow: 0 4px 12px rgba(81, 47, 255, 0.3);
          }

          .nav-icon {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
          }

          .sidebar-link-text {
            transition: opacity 0.2s ease;
          }

          .sidebar.collapsed .sidebar-link-text {
            opacity: 0;
            width: 0;
            pointer-events: none;
            display: inline-block;
          }

          .sidebar-footer {
            padding: 1rem;
            border-top: 1px solid var(--sidebar-border);
            position: relative;
          }

          .user-profile-menu {
            width: 100%;
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-white);
            text-align: left;
            font-family: inherit;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--border-slate);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 0.875rem;
            flex-shrink: 0;
          }

          .user-details {
            display: flex;
            flex-direction: column;
            min-width: 0;
            flex-grow: 1;
            transition: opacity 0.2s ease;
          }

          .sidebar.collapsed .user-details {
            opacity: 0;
            width: 0;
            pointer-events: none;
          }

          .user-name {
            font-size: 0.875rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-email {
            font-size: 0.75rem;
            color: var(--text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-popup-menu {
            position: absolute;
            bottom: calc(100% + 8px);
            left: 10px;
            right: 10px;
            background: #0d1321;
            border: 1px solid var(--sidebar-border);
            border-radius: 8px;
            padding: 0.5rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6);
            z-index: 120;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .sidebar.collapsed .user-popup-menu {
            left: 100%;
            bottom: 10px;
            width: 220px;
            margin-left: 8px;
          }

          .user-popup-header {
            padding: 0.5rem;
            border-bottom: 1px solid var(--sidebar-border);
            margin-bottom: 0.25rem;
          }

          .user-popup-title {
            font-size: 0.875rem;
            font-weight: 600;
          }

          .user-popup-subtitle {
            font-size: 0.75rem;
            color: var(--text-muted);
          }

          .user-popup-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem;
            color: var(--text-muted);
            background: transparent;
            border: none;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            text-align: left;
            width: 100%;
            font-family: inherit;
            transition: all 0.2s ease;
          }

          .user-popup-item:hover {
            background: rgba(255, 255, 255, 0.05);
            color: var(--text-white);
          }

          .hidden {
            display: none !important;
          }

          .layout-wrapper {
            margin-left: var(--sidebar-width-expanded);
            flex: 1;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            transition: margin-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .sidebar.collapsed ~ .layout-wrapper {
            margin-left: var(--sidebar-width-collapsed);
          }

          main.page-content {
            padding: 2rem;
            flex: 1;
            max-width: 1200px;
            width: 100%;
            margin: 0 auto;
          }

          @media (max-width: 768px) {
            .sidebar {
              transform: translateX(-100%);
            }

            .sidebar.mobile-open {
              transform: translateX(0);
              width: var(--sidebar-width-expanded) !important;
            }

            .sidebar.mobile-open .sidebar-link-text,
            .sidebar.mobile-open .team-info,
            .sidebar.mobile-open .user-details,
            .sidebar.mobile-open .sidebar-group-label {
              opacity: 1;
              width: auto;
              pointer-events: auto;
            }

            .layout-wrapper {
              margin-left: 0 !important;
            }

            .mobile-header {
              height: 60px;
              background: var(--sidebar-bg);
              backdrop-filter: blur(12px);
              border-bottom: 1px solid var(--sidebar-border);
              display: flex;
              align-items: center;
              padding: 0 1rem;
              position: sticky;
              top: 0;
              z-index: 90;
            }

            .mobile-menu-toggle {
              background: transparent;
              border: none;
              color: var(--text-white);
              cursor: pointer;
              padding: 0.5rem;
              margin-right: 1rem;
            }

            .mobile-menu-toggle svg {
              width: 24px;
              height: 24px;
            }

            .sidebar-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              backdrop-filter: blur(4px);
              z-index: 95;
              display: none;
            }

            .sidebar-overlay.active {
              display: block;
            }
          }

          @media (min-width: 769px) {
            .mobile-header {
              display: none;
            }
            .sidebar-overlay {
              display: none !important;
            }
          }
        ` } })] }), _jsxs("body", { children: [_jsx("div", { className: "bg-container" }), _jsx("div", { className: "sidebar-overlay", id: "sidebar-overlay" }), _jsxs("aside", { className: "sidebar", id: "sidebar", children: [_jsxs("div", { className: "sidebar-header", children: [_jsxs("div", { className: "sidebar-brand-row", children: [logo && typeof logo === 'string' ? (_jsx("div", { className: "sidebar-logo-container", dangerouslySetInnerHTML: { __html: logo } })) : (_jsx("div", { className: "sidebar-logo-container", children: logo })), _jsx("button", { type: "button", className: "sidebar-toggle-btn", id: "sidebar-toggle-btn", title: "Toggle Sidebar", children: _jsx("div", { dangerouslySetInnerHTML: { __html: ICONS.toggleLeft }, style: { display: 'contents' } }) })] }), activeTeam && teams && teams.length > 0 && (_jsxs("div", { className: "team-switcher-container", children: [_jsxs("button", { type: "button", className: "team-switcher-btn", disabled: isSingleTeam, id: "team-switcher-btn", children: [_jsx("div", { className: "team-logo-avatar", children: activeTeam.name.charAt(0).toUpperCase() }), _jsxs("div", { className: "team-info", children: [_jsx("span", { className: "team-name", children: activeTeam.name }), _jsx("span", { className: "team-role", children: user.roles.join(', ') })] }), !isSingleTeam && (_jsx("div", { dangerouslySetInnerHTML: { __html: ICONS.chevronDown }, style: { display: 'contents' } }))] }), !isSingleTeam && (_jsx("div", { className: "team-dropdown-list hidden", id: "team-dropdown-list", children: teams.map((team) => (_jsxs("a", { href: team.teamPath, className: `team-dropdown-item ${activeTeam.teamPath === team.teamPath ? 'active' : ''}`, children: [_jsx("div", { className: "team-logo-avatar", children: team.name.charAt(0).toUpperCase() }), _jsx("span", { children: team.name })] }, team.teamPath))) }))] }))] }), _jsxs("div", { className: "sidebar-content", children: [activeTeam && activeTeam.oneLevelNav && activeTeam.oneLevelNav.length > 0 && (_jsxs("div", { className: "sidebar-group", children: [_jsx("div", { className: "sidebar-group-label", children: activeTeam.menuTitle ?? activeTeam.name }), _jsx("ul", { className: "sidebar-menu", children: activeTeam.oneLevelNav.map((item) => {
                                                    const fullUrl = `${activeTeam.teamPath}${item.pagePath}`;
                                                    const isActive = activePath === fullUrl || activePath.startsWith(`${fullUrl}/`);
                                                    return (_jsx("li", { className: "sidebar-menu-item", children: _jsxs("a", { href: fullUrl, className: `sidebar-menu-link ${isActive ? 'active' : ''}`, children: [getIcon(item.icon), _jsx("span", { className: "sidebar-link-text", children: item.title })] }) }, fullUrl));
                                                }) })] })), activeTeam && activeTeam.modules && activeTeam.modules.length > 0 && (_jsx(_Fragment, { children: activeTeam.modules.map((module) => (_jsx(React.Fragment, { children: module.pageGroups.map((group) => {
                                                const hasPages = group.pages && group.pages.length > 0;
                                                return (_jsxs("div", { className: "sidebar-group", children: [_jsx("div", { className: "sidebar-group-label", children: group.title }), _jsx("ul", { className: "sidebar-menu", children: hasPages && group.pages.map((page) => {
                                                                const fullUrl = `${module.modulePath}${group.groupPath}${page.pagePath}`;
                                                                const isActive = activePath === fullUrl || activePath.startsWith(`${fullUrl}/`);
                                                                return (_jsx("li", { className: "sidebar-menu-item", children: _jsxs("a", { href: fullUrl, className: `sidebar-menu-link ${isActive ? 'active' : ''}`, children: [getIcon(page.icon), _jsx("span", { className: "sidebar-link-text", children: page.title })] }) }, fullUrl));
                                                            }) })] }, group.groupPath));
                                            }) }, module.modulePath))) }))] }), _jsxs("div", { className: "sidebar-footer", children: [_jsxs("button", { type: "button", className: "user-profile-menu", id: "user-profile-menu", children: [_jsx("div", { className: "user-avatar", children: user.displayName.charAt(0).toUpperCase() }), _jsxs("div", { className: "user-details", children: [_jsx("span", { className: "user-name", children: user.displayName }), _jsx("span", { className: "user-email", children: user.email })] }), _jsx("div", { dangerouslySetInnerHTML: { __html: ICONS.chevronDown }, style: { display: 'contents' } })] }), _jsxs("div", { className: "user-popup-menu hidden", id: "user-popup-menu", children: [_jsxs("div", { className: "user-popup-header", children: [_jsx("div", { className: "user-popup-title", children: user.displayName }), _jsx("div", { className: "user-popup-subtitle", children: user.email })] }), _jsxs("button", { type: "button", className: "user-popup-item", id: "logout-btn", children: [_jsx("div", { dangerouslySetInnerHTML: { __html: ICONS.logout }, style: { display: 'contents' } }), _jsx("span", { children: "Log out" })] })] })] })] }), _jsxs("div", { className: "layout-wrapper", children: [_jsxs("header", { className: "mobile-header", children: [_jsx("button", { type: "button", className: "mobile-menu-toggle", id: "mobile-menu-toggle", children: _jsx("svg", { fill: "none", stroke: "currentColor", strokeWidth: "2", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6h16M4 12h16M4 18h16" }) }) }), _jsx("span", { children: brandName })] }), _jsx("main", { className: "page-content", dangerouslySetInnerHTML: { __html: contentHtml } })] }), _jsx("script", { dangerouslySetInnerHTML: { __html: `
          (function () {
            var sidebar = document.getElementById('sidebar');
            var toggleBtn = document.getElementById('sidebar-toggle-btn');
            var teamSwitcherBtn = document.getElementById('team-switcher-btn');
            var teamDropdownList = document.getElementById('team-dropdown-list');
            var userProfileMenu = document.getElementById('user-profile-menu');
            var userPopupMenu = document.getElementById('user-popup-menu');
            var logoutBtn = document.getElementById('logout-btn');
            
            var mobileToggle = document.getElementById('mobile-menu-toggle');
            var overlay = document.getElementById('sidebar-overlay');

            var tokenStorageKey = ${JSON.stringify(tokenStorageKey)};
            var logoutApiPath = ${JSON.stringify(logoutApiPath)};

            if (toggleBtn) {
              toggleBtn.addEventListener('click', function () {
                var isCollapsed = sidebar.classList.toggle('collapsed');
                toggleBtn.innerHTML = isCollapsed ? ${JSON.stringify(ICONS.toggleRight)} : ${JSON.stringify(ICONS.toggleLeft)};
                if (isCollapsed) {
                  if (teamDropdownList) teamDropdownList.classList.add('hidden');
                  if (userPopupMenu) userPopupMenu.classList.add('hidden');
                }
              });
            }

            if (mobileToggle) {
              mobileToggle.addEventListener('click', function () {
                sidebar.classList.add('mobile-open');
                overlay.classList.add('active');
              });
            }

            if (overlay) {
              overlay.addEventListener('click', function () {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
              });
            }

            if (teamSwitcherBtn && teamDropdownList) {
              teamSwitcherBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (sidebar.classList.contains('collapsed')) {
                  sidebar.classList.remove('collapsed');
                  if (toggleBtn) toggleBtn.innerHTML = ${JSON.stringify(ICONS.toggleLeft)};
                }
                teamDropdownList.classList.toggle('hidden');
                if (userPopupMenu) userPopupMenu.classList.add('hidden');
              });
            }

            if (userProfileMenu && userPopupMenu) {
              userProfileMenu.addEventListener('click', function (e) {
                e.stopPropagation();
                userPopupMenu.classList.toggle('hidden');
                if (teamDropdownList) teamDropdownList.classList.add('hidden');
              });
            }

            document.addEventListener('click', function () {
              if (teamDropdownList) teamDropdownList.classList.add('hidden');
              if (userPopupMenu) userPopupMenu.classList.add('hidden');
            });

            if (userPopupMenu) {
              userPopupMenu.addEventListener('click', function (e) {
                e.stopPropagation();
              });
            }

            if (logoutBtn) {
              logoutBtn.addEventListener('click', async function () {
                var token = localStorage.getItem(tokenStorageKey);
                try {
                  await fetch(logoutApiPath, {
                    method: 'POST',
                    headers: token ? { Authorization: 'Bearer ' + token } : {}
                  });
                } catch (e) {
                  console.error('Logout request failed', e);
                } finally {
                  localStorage.removeItem(tokenStorageKey);
                  document.cookie = "uv_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
                  window.location.href = '/login';
                }
              });
            }
          })();
        ` } })] })] }));
};
export function renderSidebar(options) {
    const markup = renderToStaticMarkup(_jsx(SidebarLayout, { ...options }));
    return `<!DOCTYPE html>\n${markup}`;
}
//# sourceMappingURL=sidebar-component.js.map