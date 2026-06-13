import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { Team } from '../lib/auth/sidebar.js';
import type { AuthUser } from '../lib/auth/types.js';

export interface SidebarRenderOptions {
  activeTeam: Team | null;
  teams: Team[];
  activePath: string;
  user: AuthUser;
  brandName?: string;
  logo?: string | React.ReactNode;
  contentHtml?: string;
  theme?: 'dark' | 'light';
  tokenStorageKey?: string;
  logoutApiPath?: string;
}

const DEFAULT_LOGO = `<svg viewBox="0 0 1000 201" style="height: 24px; width: auto;" class="sidebar-logo-svg" xmlns="http://www.w3.org/2000/svg">
  <g fill="currentColor">
    <path d="M373.684,148.475h-10.867l47.677-90.412h11.57l46.509,90.412h-10.867l-37.629-73.597-3.857-8.407-3.973,8.407-38.563,73.597Z"/>
    <path d="M505.047,116.572v-58.509h9.816v59.315c0,14.396,11.686,23.381,35.291,23.381,19.281,0,33.888-8.178,33.888-23.266v-59.43h9.816v59.315c0,21.076-17.295,32.364-44.055,32.364-26.527,0-44.757-10.136-44.757-33.17Z"/>
    <path d="M658.763,148.475h-9.816V58.063h56.443c13.205,0,20.802,4.377,24.656,11.173,1.987,3.57,3.156,7.831,3.156,13.705,0,5.644-.935,10.481-2.804,13.706-3.04,5.413-8.998,9.213-15.776,9.79l27.812,42.039h-11.92l-26.293-40.426h-21.652l-5.011-8.868h29.234c7.595,0,12.504-2.303,14.608-6.565,1.167-2.303,1.751-5.759,1.751-8.868,0-3.571-.584-7.256-1.751-9.328-2.572-4.723-8.063-7.256-17.414-7.256h-45.224v81.313Z"/>
    <path d="M789.89,58.063h10.051v90.412h-10.051V58.063Z"/>
    <path d="M884.202,102.405l-40.901-44.342h12.62l34.357,37.087,35.407-37.087h12.038l-41.719,43.767,42.77,46.645h-12.62l-36.226-39.389-37.745,39.389h-12.038l44.057-46.07Z"/>
  </g>
</svg>`;

const ICONS: Record<string, string> = {
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

function getIcon(name: string) {
  const normalized = name.toLowerCase();
  let rawSvg = ICONS.default;
  if (normalized.includes('admin') || normalized.includes('console')) rawSvg = ICONS.admin;
  else if (normalized.includes('chat') || normalized.includes('agent')) rawSvg = ICONS.chat;
  else if (normalized.includes('workflow') || normalized.includes('run')) rawSvg = ICONS.workflow;
  else if (normalized.includes('setting')) rawSvg = ICONS.settings;
  else if (normalized.includes('user') || normalized.includes('profile')) rawSvg = ICONS.user;
  
  return <div dangerouslySetInnerHTML={{ __html: rawSvg }} style={{ display: 'contents' }} />;
}

export const SidebarLayout: React.FC<SidebarRenderOptions> = ({
  activeTeam,
  teams,
  activePath,
  user,
  brandName = 'Stitchmate',
  logo = DEFAULT_LOGO,
  contentHtml = '',
  tokenStorageKey = 'uv_access_token',
  logoutApiPath = '/api/auth/logout',
}) => {
  const isSingleTeam = teams.length === 1;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`${brandName} Dashboard`}</title>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('theme') || 'dark';
            if (theme === 'system') {
              var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (systemDark) {
                document.documentElement.classList.remove('light');
              } else {
                document.documentElement.classList.add('light');
              }
            } else if (theme === 'light') {
              document.documentElement.classList.add('light');
            } else {
              document.documentElement.classList.remove('light');
            }
          })();
        ` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
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

          html.light {
            --bg-slate-900: #f1f5f9;
            --bg-slate-950: #f8fafc;
            --sidebar-bg: rgba(241, 245, 249, 0.85);
            --sidebar-border: rgba(15, 23, 42, 0.08);
            --text-white: #0f172a;
            --text-muted: #64748b;
            --border-slate: #cbd5e1;
          }

          .sidebar-logo-svg path, .sidebar-logo-svg g {
            fill: var(--text-white);
          }

          .theme-switcher-section {
            padding: 0.5rem;
            border-bottom: 1px solid var(--sidebar-border);
            margin-bottom: 0.5rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .theme-switcher-label {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .theme-switcher-buttons {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 6px;
            padding: 2px;
            border: 1px solid var(--sidebar-border);
          }
          .theme-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            padding: 0.375rem 0;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }
          .theme-btn:hover {
            color: var(--text-white);
            background: rgba(255, 255, 255, 0.03);
          }
          .theme-btn.active {
            background-color: var(--primary);
            color: white;
            box-shadow: 0 2px 6px rgba(81, 47, 255, 0.2);
          }
          .theme-icon {
            width: 1rem;
            height: 1rem;
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
            color: var(--text-white);
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
        ` }} />
      </head>
      <body>
        <div className="bg-container"></div>
        <div className="sidebar-overlay" id="sidebar-overlay"></div>

        <aside className="sidebar" id="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-brand-row">
              {logo && typeof logo === 'string' ? (
                <div className="sidebar-logo-container" dangerouslySetInnerHTML={{ __html: logo }} />
              ) : (
                <div className="sidebar-logo-container">{logo}</div>
              )}
              <button type="button" className="sidebar-toggle-btn" id="sidebar-toggle-btn" title="Toggle Sidebar">
                <div dangerouslySetInnerHTML={{ __html: ICONS.toggleLeft }} style={{ display: 'contents' }} />
              </button>
            </div>

            {activeTeam && teams && teams.length > 0 && (
              <div className="team-switcher-container">
                <button type="button" className="team-switcher-btn" disabled={isSingleTeam} id="team-switcher-btn">
                  <div className="team-logo-avatar">
                    {activeTeam.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="team-info">
                    <span className="team-name">{activeTeam.name}</span>
                    <span className="team-role">{user.roles.join(', ')}</span>
                  </div>
                  {!isSingleTeam && (
                    <div dangerouslySetInnerHTML={{ __html: ICONS.chevronDown }} style={{ display: 'contents' }} />
                  )}
                </button>
                {!isSingleTeam && (
                  <div className="team-dropdown-list hidden" id="team-dropdown-list">
                    {teams.map((team) => (
                      <a key={team.teamPath} href={team.teamPath} className={`team-dropdown-item ${activeTeam.teamPath === team.teamPath ? 'active' : ''}`}>
                        <div className="team-logo-avatar">{team.name.charAt(0).toUpperCase()}</div>
                        <span>{team.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="sidebar-content">
            {activeTeam && activeTeam.oneLevelNav && activeTeam.oneLevelNav.length > 0 && (
              <div className="sidebar-group">
                <div className="sidebar-group-label">{activeTeam.menuTitle ?? activeTeam.name}</div>
                <ul className="sidebar-menu">
                  {activeTeam.oneLevelNav.map((item) => {
                    const fullUrl = `${activeTeam.teamPath}${item.pagePath}`;
                    const isActive = activePath === fullUrl || activePath.startsWith(`${fullUrl}/`);
                    return (
                      <li key={fullUrl} className="sidebar-menu-item">
                        <a href={fullUrl} className={`sidebar-menu-link ${isActive ? 'active' : ''}`}>
                          {getIcon(item.icon)}
                          <span className="sidebar-link-text">{item.title}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {activeTeam && activeTeam.modules && activeTeam.modules.length > 0 && (
              <>
                {activeTeam.modules.map((module) => (
                  <React.Fragment key={module.modulePath}>
                    {module.pageGroups.map((group) => {
                      const hasPages = group.pages && group.pages.length > 0;
                      return (
                        <div key={group.groupPath} className="sidebar-group">
                          <div className="sidebar-group-label">{group.title}</div>
                          <ul className="sidebar-menu">
                            {hasPages && group.pages.map((page) => {
                              const fullUrl = `${module.modulePath}${group.groupPath}${page.pagePath}`;
                              const isActive = activePath === fullUrl || activePath.startsWith(`${fullUrl}/`);
                              return (
                                <li key={fullUrl} className="sidebar-menu-item">
                                  <a href={fullUrl} className={`sidebar-menu-link ${isActive ? 'active' : ''}`}>
                                    {getIcon(page.icon)}
                                    <span className="sidebar-link-text">{page.title}</span>
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </>
            )}

            <div className="sidebar-group" style={{ marginTop: 'auto' }}>
              <ul className="sidebar-menu">
                <li className="sidebar-menu-item">
                  <button type="button" className="sidebar-menu-link" id="sidebar-menu-theme-toggle" style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                    <div className="theme-toggle-icon-container" style={{ display: 'contents' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon sun-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon moon-icon hidden"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                    </div>
                    <span className="sidebar-link-text" id="sidebar-theme-text">Theme: Dark</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="sidebar-footer">
            <button type="button" className="user-profile-menu" id="user-profile-menu">
              <div className="user-avatar">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">{user.displayName}</span>
                <span className="user-email">{user.email}</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: ICONS.chevronDown }} style={{ display: 'contents' }} />
            </button>

            <div className="user-popup-menu hidden" id="user-popup-menu">
              <div className="user-popup-header">
                <div className="user-popup-title">{user.displayName}</div>
                <div className="user-popup-subtitle">{user.email}</div>
              </div>
              
              <div className="theme-switcher-section">
                <div className="theme-switcher-label">Theme</div>
                <div className="theme-switcher-buttons">
                  <button type="button" className="theme-btn" data-theme="light" id="theme-btn-light" title="Light Theme">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                  </button>
                  <button type="button" className="theme-btn" data-theme="dark" id="theme-btn-dark" title="Dark Theme">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                  </button>
                  <button type="button" className="theme-btn" data-theme="system" id="theme-btn-system" title="System Theme">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-icon"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  </button>
                </div>
              </div>

              <button type="button" className="user-popup-item" id="logout-btn">
                <div dangerouslySetInnerHTML={{ __html: ICONS.logout }} style={{ display: 'contents' }} />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="layout-wrapper">
          <header className="mobile-header">
            <button type="button" className="mobile-menu-toggle" id="mobile-menu-toggle">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <span>{brandName}</span>
          </header>

          <main className="page-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
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

            // Theme selection click handlers
            var themeBtnLight = document.getElementById('theme-btn-light');
            var themeBtnDark = document.getElementById('theme-btn-dark');
            var themeBtnSystem = document.getElementById('theme-btn-system');
            
            function applyTheme(theme) {
              if (theme === 'system') {
                var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (systemDark) {
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                }
              } else if (theme === 'light') {
                document.documentElement.classList.add('light');
              } else {
                document.documentElement.classList.remove('light');
              }
            }

            var sidebarThemeToggle = document.getElementById('sidebar-menu-theme-toggle');
            var sidebarThemeText = document.getElementById('sidebar-theme-text');

            function updateActiveThemeButton(theme) {
              [themeBtnLight, themeBtnDark, themeBtnSystem].forEach(function(btn) {
                if (btn) btn.classList.remove('active');
              });
              if (theme === 'light' && themeBtnLight) themeBtnLight.classList.add('active');
              else if (theme === 'dark' && themeBtnDark) themeBtnDark.classList.add('active');
              else if (theme === 'system' && themeBtnSystem) themeBtnSystem.classList.add('active');
              
              if (sidebarThemeToggle) {
                var sunIcon = sidebarThemeToggle.querySelector('.sun-icon');
                var moonIcon = sidebarThemeToggle.querySelector('.moon-icon');
                if (theme === 'light') {
                  sunIcon.classList.add('hidden');
                  moonIcon.classList.remove('hidden');
                  if (sidebarThemeText) sidebarThemeText.textContent = 'Theme: Light';
                } else if (theme === 'dark') {
                  sunIcon.classList.remove('hidden');
                  moonIcon.classList.add('hidden');
                  if (sidebarThemeText) sidebarThemeText.textContent = 'Theme: Dark';
                } else {
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (systemDark) {
                    sunIcon.classList.remove('hidden');
                    moonIcon.classList.add('hidden');
                  } else {
                    sunIcon.classList.add('hidden');
                    moonIcon.classList.remove('hidden');
                  }
                  if (sidebarThemeText) sidebarThemeText.textContent = 'Theme: System';
                }
              }
            }

            var currentTheme = localStorage.getItem('theme') || 'dark';
            updateActiveThemeButton(currentTheme);

            function handleThemeClick(theme) {
              localStorage.setItem('theme', theme);
              applyTheme(theme);
              updateActiveThemeButton(theme);
            }

            if (themeBtnLight) themeBtnLight.addEventListener('click', function() { handleThemeClick('light'); });
            if (themeBtnDark) themeBtnDark.addEventListener('click', function() { handleThemeClick('dark'); });
            if (themeBtnSystem) themeBtnSystem.addEventListener('click', function() { handleThemeClick('system'); });

            if (sidebarThemeToggle) {
              sidebarThemeToggle.addEventListener('click', function() {
                var theme = localStorage.getItem('theme') || 'dark';
                var nextTheme = theme === 'dark' ? 'light' : 'dark';
                handleThemeClick(nextTheme);
              });
            }

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
              var theme = localStorage.getItem('theme') || 'dark';
              if (theme === 'system') {
                applyTheme('system');
              }
            });

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
        ` }} />
      </body>
    </html>
  );
};

export function renderSidebar(options: SidebarRenderOptions): string {
  const markup = renderToStaticMarkup(<SidebarLayout {...options} />);
  return `<!DOCTYPE html>\n${markup}`;
}
