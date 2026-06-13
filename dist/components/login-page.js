import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { renderToStaticMarkup } from 'react-dom/server';
const DEFAULT_LOGO_SVG = `<svg viewBox="0 0 1000 201" style="max-height: 48px; width: auto;" class="logo-svg" xmlns="http://www.w3.org/2000/svg">
  <g>
    <path d="M373.684,148.475h-10.867l47.677-90.412h11.57l46.509,90.412h-10.867l-37.629-73.597-3.857-8.407-3.973,8.407-38.563,73.597Z" fill="currentColor"/>
    <path d="M505.047,116.572v-58.509h9.816v59.315c0,14.396,11.686,23.381,35.291,23.381,19.281,0,33.888-8.178,33.888-23.266v-59.43h9.816v59.315c0,21.076-17.295,32.364-44.055,32.364-26.527,0-44.757-10.136-44.757-33.17Z" fill="currentColor"/>
    <path d="M658.763,148.475h-9.816V58.063h56.443c13.205,0,20.802,4.377,24.656,11.173,1.987,3.57,3.156,7.831,3.156,13.705,0,5.644-.935,10.481-2.804,13.706-3.04,5.413-8.998,9.213-15.776,9.79l27.812,42.039h-11.92l-26.293-40.426h-21.652l-5.011-8.868h29.234c7.595,0,12.504-2.303,14.608-6.565,1.167-2.303,1.751-5.759,1.751-8.868,0-3.571-.584-7.256-1.751-9.328-2.572-4.723-8.063-7.256-17.414-7.256h-45.224v81.313Z" fill="currentColor"/>
    <path d="M789.89,58.063h10.051v90.412h-10.051V58.063Z" fill="currentColor"/>
    <path d="M884.202,102.405l-40.901-44.342h12.62l34.357,37.087,35.407-37.087h12.038l-41.719,43.767,42.77,46.645h-12.62l-36.226-39.389-37.745,39.389h-12.038l44.057-46.07Z" fill="currentColor"/>
  </g>
  <path d="M312.112,152.829l-125.516-114.769-125.37,114.965,3.529,4.915c17.295-10.472,36.182-18.512,56.192-23.899,20.397-5.492,42.098-8.277,64.499-8.277,45.159,0,88.738,11.358,123.106,32.025l3.561-4.959ZM186.601,45.573l80.599,73.698c-12.717-9.665-26.21-19.774-38.636-28.631-30.51-21.746-38.659-24.535-42.351-24.535s-11.739,2.763-41.699,24.305c-11.803,8.487-24.626,18.169-36.798,27.5l78.883-72.337ZM147.751,94.909c28.149-20.241,36.181-23.263,38.464-23.263,2.299,0,10.44,3.054,39.134,23.506,13.704,9.768,28.737,21.084,42.58,31.637-29.526-16.845-63.311-33.625-82.099-33.625-18.505,0-51.113,16.427-79.806,33.036,13.598-10.464,28.331-21.658,41.727-31.29ZM119.506,128.69c-4.74,1.276-9.414,2.706-14.026,4.269,28.621-16.723,62.503-34.254,80.35-34.254,18.06,0,52.858,17.689,82.259,34.598-25.679-8.546-53.856-13.081-82.644-13.081-22.887,0-45.073,2.849-65.939,8.467Z" fill="currentColor"/>
</svg>`;
export const LoginPage = ({ title = 'Sign In', loginApiPath = '/api/auth/login', redirectUrl = '/', tokenStorageKey = 'uv_access_token', brandName = 'Stitchmate', logo = DEFAULT_LOGO_SVG, backgroundUrl = '', googleAuthEnabled = false, googleAuthUrl = '/api/auth/google', ssoEnabled = false, ssoUrl = '/api/auth/sso', ssoButtonText = 'Sign In', ssoDescription = 'Only accessible via Metro One email addresses.', termsUrl = '#', privacyUrl = '#', }) => {
    const showTabs = googleAuthEnabled || ssoEnabled;
    return (_jsxs("html", { lang: "en", children: [_jsxs("head", { children: [_jsx("meta", { charSet: "utf-8" }), _jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), _jsx("title", { children: `${title} | ${brandName}` }), _jsx("script", { dangerouslySetInnerHTML: { __html: `
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
        ` } }), _jsx("link", { rel: "preconnect", href: "https://fonts.googleapis.com" }), _jsx("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }), _jsx("link", { href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap", rel: "stylesheet" }), _jsx("style", { dangerouslySetInnerHTML: { __html: `
          :root {
            --primary: #512fff;
            --primary-hover: #4120D9;
            --bg-slate-900: #0f172a;
            --bg-slate-950: #020617;
            --text-white: #f8fafc;
            --text-muted: #94a3b8;
            --border-slate: #334155;
            --card-bg: rgba(15, 23, 42, 0.45);
            --input-bg: rgba(2, 6, 23, 0.8);
          }
          
          html.light {
            --bg-slate-900: #f1f5f9;
            --bg-slate-950: #f8fafc;
            --text-white: #0f172a;
            --text-muted: #64748b;
            --border-slate: #cbd5e1;
            --card-bg: rgba(255, 255, 255, 0.75);
            --input-bg: rgba(255, 255, 255, 0.9);
          }
          
          .logo-svg path, .logo-svg g {
            fill: var(--text-white);
          }
          
          .password-input-wrapper {
            position: relative;
            width: 100%;
          }
          
          .password-toggle-btn {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0.25rem;
            transition: color 0.15s ease;
          }
          
          .password-toggle-btn:hover {
            color: var(--text-white);
          }
          
          .eye-icon {
            width: 1.25rem;
            height: 1.25rem;
          }
          
          .theme-toggle-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.25rem;
            height: 2.25rem;
            border-radius: 9999px;
            transition: all 0.2s ease;
          }
          
          .theme-toggle-btn:hover {
            color: var(--text-white);
            background: rgba(255, 255, 255, 0.05);
          }
          
          .theme-toggle-btn svg {
            width: 1.25rem;
            height: 1.25rem;
          }
          
          .hidden {
            display: none !important;
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
            flex-direction: column;
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
            display: flex;
            align-items: center;
            justify-content: center;
          }

          ${backgroundUrl ? `
            .bg-container {
              background-image: url('${backgroundUrl}');
            }
          ` : `
            .bg-container::before {
              content: '';
              position: absolute;
              width: 150%;
              height: 150%;
              background: radial-gradient(circle at 80% 20%, rgba(81, 47, 255, 0.15) 0%, transparent 50%),
                          radial-gradient(circle at 10% 80%, rgba(15, 23, 42, 0.8) 0%, transparent 60%);
              animation: rotateBg 40s infinite linear;
            }
          `}

          @keyframes rotateBg {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          header {
            width: 100%;
            padding: 1.5rem 2rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            z-index: 10;
            flex-shrink: 0;
          }

          .logo-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          main {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 8%;
            padding-left: 2rem;
            z-index: 10;
          }

          @media (max-width: 900px) {
            main {
              justify-content: center;
              padding-right: 2rem;
            }
          }

          .login-box {
            width: 100%;
            max-width: 440px;
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .card {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 1.25rem;
            padding: 2.25rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }

          .error-banner {
            background: rgba(239, 68, 68, 0.15);
            border-left: 4px solid #ef4444;
            color: #fca5a5;
            font-size: 0.875rem;
            padding: 0.75rem 1rem;
            border-radius: 0.375rem;
            margin-bottom: 1.5rem;
            text-align: left;
            display: none;
          }

          .tabs-list {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            background: rgba(30, 41, 59, 0.6);
            border-radius: 9999px;
            padding: 4px;
            margin-bottom: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }

          .tab-trigger {
            background: transparent;
            border: none;
            color: var(--text-muted);
            padding: 0.75rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: 'Inter', sans-serif;
          }

          .tab-trigger:hover {
            color: var(--text-white);
          }

          .tab-trigger.active {
            background-color: var(--primary);
            color: var(--text-white);
            box-shadow: 0 4px 12px rgba(81, 47, 255, 0.3);
          }

          .tab-content {
            animation: fadeIn 0.3s ease forwards;
          }

          .tab-content.hidden {
            display: none;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .form-title {
            font-family: 'Outfit', sans-serif;
            font-size: 2.25rem;
            font-weight: 300;
            margin-bottom: 1.75rem;
            text-align: center;
            letter-spacing: -0.02em;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1.25rem;
          }

          .form-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-white);
            opacity: 0.9;
          }

          .form-control {
            width: 100%;
            height: 3.25rem;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            border: 1px solid var(--border-slate);
            background-color: var(--input-bg);
            color: var(--text-white);
            font-size: 1rem;
            transition: all 0.2s ease;
            font-family: inherit;
          }

          .form-control:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(81, 47, 255, 0.2);
          }

          .btn {
            width: 100%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            font-family: inherit;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .btn-primary {
            height: 70px;
            border-radius: 9999px;
            background-color: var(--primary);
            color: white;
            font-size: 1.25rem;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(81, 47, 255, 0.4);
          }

          .btn-primary:hover {
            background-color: var(--primary-hover);
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(81, 47, 255, 0.5);
          }

          .btn-primary:active {
            transform: translateY(0);
          }

          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
          }

          .btn-outline {
            height: 70px;
            border-radius: 9999px;
            border: 1px solid var(--border-slate);
            background-color: white;
            color: var(--bg-slate-950);
            font-size: 1.25rem;
            font-weight: 500;
          }

          .btn-outline:hover {
            background-color: #f1f5f9;
            transform: translateY(-1px);
          }

          .btn-outline:active {
            transform: translateY(0);
          }

          .trouble-link-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 0.5rem;
          }

          .text-link {
            font-size: 0.875rem;
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.15s ease;
          }

          .text-link:hover {
            color: var(--text-white);
            text-decoration: underline;
          }

          .terms-text {
            font-size: 0.75rem;
            color: rgba(248, 250, 252, 0.5);
            line-height: 1.4;
            margin-top: 1.25rem;
            text-align: left;
          }

          .terms-text a {
            color: inherit;
            text-decoration: underline;
            cursor: pointer;
          }

          .sso-container {
            text-align: center;
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
            min-height: 300px;
            justify-content: center;
          }

          .sso-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.5rem;
            font-weight: 500;
            color: var(--text-white);
          }

          .sso-desc {
            font-size: 0.875rem;
            color: var(--text-muted);
            line-height: 1.5;
            margin-bottom: 0.5rem;
          }

          .divider {
            display: flex;
            align-items: center;
            width: 100%;
            margin: 0.5rem 0;
          }

          .divider::before, .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border-slate);
          }

          .divider-text {
            padding: 0 0.75rem;
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .google-icon {
            width: 1.5rem;
            height: 1.5rem;
          }

          .btn-sso {
            margin-top: 0.5rem;
          }

          footer {
            width: 100%;
            padding: 1.5rem;
            text-align: center;
            font-size: 0.75rem;
            color: var(--text-muted);
            z-index: 10;
            flex-shrink: 0;
          }
        ` } })] }), _jsxs("body", { children: [_jsx("div", { className: "bg-container" }), _jsxs("header", { style: { justifyContent: 'space-between' }, children: [logo && typeof logo === 'string' ? (_jsx("div", { className: "logo-container", dangerouslySetInnerHTML: { __html: logo }, style: { color: 'var(--text-white)' } })) : (_jsx("div", { className: "logo-container", style: { color: 'var(--text-white)' }, children: logo })), _jsxs("button", { type: "button", className: "theme-toggle-btn", id: "theme-toggle-btn", title: "Toggle theme", children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "sun-icon", children: [_jsx("circle", { cx: "12", cy: "12", r: "4" }), _jsx("path", { d: "M12 2v2" }), _jsx("path", { d: "M12 20v2" }), _jsx("path", { d: "m4.93 4.93 1.41 1.41" }), _jsx("path", { d: "m17.66 17.66 1.41 1.41" }), _jsx("path", { d: "M2 12h2" }), _jsx("path", { d: "M20 12h2" }), _jsx("path", { d: "m6.34 17.66-1.41 1.41" }), _jsx("path", { d: "m19.07 4.93-1.41 1.41" })] }), _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "moon-icon hidden", children: _jsx("path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }) })] })] }), _jsx("main", { children: _jsx("div", { className: "login-box", children: _jsxs("div", { className: "card", children: [_jsx("div", { id: "error-alert", className: "error-banner", role: "alert" }), showTabs && (_jsxs("div", { className: "tabs-list", children: [_jsx("button", { type: "button", className: "tab-trigger active", "data-tab": "client", children: "Client & Affiliate" }), _jsx("button", { type: "button", className: "tab-trigger", "data-tab": "employee", children: "Employee Login" })] })), showTabs ? (_jsxs("div", { id: "tab-client", className: "tab-content", children: [_jsx("h1", { className: "form-title", children: "Sign In" }), _jsxs("form", { id: "login-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", className: "form-label", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "username", className: "form-control", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", className: "form-label", children: "Password" }), _jsxs("div", { className: "password-input-wrapper", children: [_jsx("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", minLength: 5, className: "form-control", required: true, style: { paddingRight: '2.75rem' } }), _jsxs("button", { type: "button", className: "password-toggle-btn", title: "Toggle password visibility", children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "eye-icon eye-open", children: [_jsx("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }), _jsx("circle", { cx: "12", cy: "12", r: "3" })] }), _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "eye-icon eye-closed hidden", children: [_jsx("path", { d: "M9.88 9.88a3 3 0 1 0 4.24 4.24" }), _jsx("path", { d: "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" }), _jsx("path", { d: "M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" }), _jsx("line", { x1: "2", y1: "2", x2: "22", y2: "22" })] })] })] }), _jsx("div", { className: "trouble-link-container", children: _jsx("a", { href: "/login/reset-password", className: "text-link", children: "Trouble logging in?" }) })] }), _jsxs("p", { className: "terms-text", children: ["By Signing In, I have read, and I understand and agree to the", ' ', _jsx("a", { href: termsUrl, children: "Terms of Use" }), ' ', "and", ' ', _jsx("a", { href: privacyUrl, children: "Data Privacy Notice" }), "."] }), _jsx("button", { type: "submit", id: "submit-btn", className: "btn btn-primary", style: { marginTop: '1.5rem' }, children: "Sign In" })] })] })) : (_jsxs("form", { id: "login-form", children: [_jsx("h1", { className: "form-title", children: "Sign In" }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", className: "form-label", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "username", className: "form-control", required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "password", className: "form-label", children: "Password" }), _jsxs("div", { className: "password-input-wrapper", children: [_jsx("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", minLength: 5, className: "form-control", required: true, style: { paddingRight: '2.75rem' } }), _jsxs("button", { type: "button", className: "password-toggle-btn", title: "Toggle password visibility", children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "eye-icon eye-open", children: [_jsx("path", { d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }), _jsx("circle", { cx: "12", cy: "12", r: "3" })] }), _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "eye-icon eye-closed hidden", children: [_jsx("path", { d: "M9.88 9.88a3 3 0 1 0 4.24 4.24" }), _jsx("path", { d: "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" }), _jsx("path", { d: "M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" }), _jsx("line", { x1: "2", y1: "2", x2: "22", y2: "22" })] })] })] }), _jsx("div", { className: "trouble-link-container", children: _jsx("a", { href: "/login/reset-password", className: "text-link", children: "Trouble logging in?" }) })] }), _jsxs("p", { className: "terms-text", children: ["By Signing In, I have read, and I understand and agree to the", ' ', _jsx("a", { href: termsUrl, children: "Terms of Use" }), ' ', "and", ' ', _jsx("a", { href: privacyUrl, children: "Data Privacy Notice" }), "."] }), _jsx("button", { type: "submit", id: "submit-btn", className: "btn btn-primary", style: { marginTop: '1.5rem' }, children: "Sign In" })] })), showTabs && (_jsx("div", { id: "tab-employee", className: "tab-content hidden", children: _jsxs("div", { className: "sso-container", children: [ssoEnabled && (_jsxs(_Fragment, { children: [_jsxs("h2", { className: "sso-title", children: [brandName, " SSO Login"] }), _jsx("p", { className: "sso-desc", children: ssoDescription }), _jsx("button", { type: "button", id: "sso-btn", className: "btn btn-primary btn-sso", children: ssoButtonText })] })), ssoEnabled && googleAuthEnabled && (_jsx("div", { className: "divider", children: _jsx("span", { className: "divider-text", children: "or" }) })), googleAuthEnabled && (_jsxs("button", { type: "button", id: "google-btn", className: "btn btn-outline btn-google", children: [_jsxs("svg", { className: "google-icon", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })] }), "Sign in with Google"] }))] }) }))] }) }) }), _jsxs("footer", { children: ["\u00A9 ", new Date().getFullYear(), " ", brandName, ". All rights reserved."] }), _jsx("script", { dangerouslySetInnerHTML: { __html: `
          (function () {
            // Theme toggle initialization and click handler
            var themeToggleBtn = document.getElementById('theme-toggle-btn');
            if (themeToggleBtn) {
              var sunIcon = themeToggleBtn.querySelector('.sun-icon');
              var moonIcon = themeToggleBtn.querySelector('.moon-icon');
              
              function updateThemeButton(theme) {
                if (theme === 'light') {
                  sunIcon.classList.add('hidden');
                  moonIcon.classList.remove('hidden');
                } else {
                  sunIcon.classList.remove('hidden');
                  moonIcon.classList.add('hidden');
                }
              }

              var currentTheme = localStorage.getItem('theme') || 'dark';
              updateThemeButton(currentTheme);

              themeToggleBtn.addEventListener('click', function() {
                var theme = localStorage.getItem('theme') || 'dark';
                var nextTheme = theme === 'dark' ? 'light' : 'dark';
                localStorage.setItem('theme', nextTheme);
                if (nextTheme === 'light') {
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                }
                updateThemeButton(nextTheme);
              });
            }

            // Password visibility toggle
            var toggleBtns = document.querySelectorAll('.password-toggle-btn');
            toggleBtns.forEach(function (btn) {
              btn.addEventListener('click', function () {
                var input = btn.previousElementSibling;
                var eyeOpen = btn.querySelector('.eye-open');
                var eyeClosed = btn.querySelector('.eye-closed');
                if (input.type === 'password') {
                  input.type = 'text';
                  eyeOpen.classList.add('hidden');
                  eyeClosed.classList.remove('hidden');
                } else {
                  input.type = 'password';
                  eyeOpen.classList.remove('hidden');
                  eyeClosed.classList.add('hidden');
                }
              });
            });
            var errorAlert = document.getElementById('error-alert');
            var form = document.getElementById('login-form');
            var submitBtn = document.getElementById('submit-btn');
            
            var loginApiPath = ${JSON.stringify(loginApiPath)};
            var defaultRedirect = ${JSON.stringify(redirectUrl)};
            var tokenStorageKey = ${JSON.stringify(tokenStorageKey)};
            
            var searchParams = new URLSearchParams(window.location.search);
            var sourceUrl = searchParams.get('sourceUrl') || defaultRedirect;

            var initError = searchParams.get('error');
            if (initError) {
              showError(initError);
            }

            function showError(message) {
              errorAlert.textContent = message;
              errorAlert.style.display = 'block';
            }

            function hideError() {
              errorAlert.style.display = 'none';
              errorAlert.textContent = '';
            }

            var showTabs = ${JSON.stringify(showTabs)};
            if (showTabs) {
              var triggers = document.querySelectorAll('.tab-trigger');
              var clientPanel = document.getElementById('tab-client');
              var employeePanel = document.getElementById('tab-employee');

              triggers.forEach(function (btn) {
                btn.addEventListener('click', function () {
                  triggers.forEach(function (t) { t.classList.remove('active'); });
                  btn.classList.add('active');

                  var target = btn.getAttribute('data-tab');
                  if (target === 'client') {
                    clientPanel.classList.remove('hidden');
                    employeePanel.classList.add('hidden');
                  } else {
                    clientPanel.classList.add('hidden');
                    employeePanel.classList.remove('hidden');
                  }
                });
              });
            }

            if (form) {
              form.addEventListener('submit', async function (event) {
                event.preventDefault();
                hideError();
                submitBtn.disabled = true;

                try {
                  var response = await fetch(loginApiPath, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: document.getElementById('email').value.trim(),
                      password: document.getElementById('password').value,
                    }),
                  });

                  var payload = await response.json().catch(function () { return null; });
                  if (!response.ok) {
                    throw new Error((payload && payload.message) || 'Invalid credentials');
                  }

                  if (payload && payload.accessToken) {
                    localStorage.setItem(tokenStorageKey, payload.accessToken);
                    document.cookie = "uv_access_token=" + encodeURIComponent(payload.accessToken) + "; path=/; max-age=3600; SameSite=Lax";
                  }

                  window.location.href = sourceUrl;
                } catch (error) {
                  showError(error && error.message ? error.message : 'Login failed');
                  submitBtn.disabled = false;
                }
              });
            }

            var ssoBtn = document.getElementById('sso-btn');
            if (ssoBtn) {
              ssoBtn.addEventListener('click', function () {
                var ssoUrl = ${JSON.stringify(ssoUrl)};
                window.location.href = ssoUrl + '?RelayState=' + encodeURIComponent(sourceUrl);
              });
            }

            var googleBtn = document.getElementById('google-btn');
            if (googleBtn) {
              googleBtn.addEventListener('click', function () {
                var googleAuthUrl = ${JSON.stringify(googleAuthUrl)};
                window.location.href = googleAuthUrl + '?returnUrl=' + encodeURIComponent(sourceUrl);
              });
            }
          })();
        ` } })] })] }));
};
export function renderLoginPage(options = {}) {
    const markup = renderToStaticMarkup(_jsx(LoginPage, { ...options }));
    return `<!DOCTYPE html>\n${markup}`;
}
//# sourceMappingURL=login-page.js.map