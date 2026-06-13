export interface NewPasswordPageOptions {
  title?: string;
  brandName?: string;
  logo?: string;
  backgroundUrl?: string;
  apiPath?: string;
  loginPath?: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const DEFAULT_LOGO_SVG = `<svg viewBox="0 0 1000 201" style="max-height: 48px; width: auto;" class="logo-svg" xmlns="http://www.w3.org/2000/svg">
  <g>
    <path d="M373.684,148.475h-10.867l47.677-90.412h11.57l46.509,90.412h-10.867l-37.629-73.597-3.857-8.407-3.973,8.407-38.563,73.597Z" fill="#fff"/>
    <path d="M505.047,116.572v-58.509h9.816v59.315c0,14.396,11.686,23.381,35.291,23.381,19.281,0,33.888-8.178,33.888-23.266v-59.43h9.816v59.315c0,21.076-17.295,32.364-44.055,32.364-26.527,0-44.757-10.136-44.757-33.17Z" fill="#fff"/>
    <path d="M658.763,148.475h-9.816V58.063h56.443c13.205,0,20.802,4.377,24.656,11.173,1.987,3.57,3.156,7.831,3.156,13.705,0,5.644-.935,10.481-2.804,13.706-3.04,5.413-8.998,9.213-15.776,9.79l27.812,42.039h-11.92l-26.293-40.426h-21.652l-5.011-8.868h29.234c7.595,0,12.504-2.303,14.608-6.565,1.167-2.303,1.751-5.759,1.751-8.868,0-3.571-.584-7.256-1.751-9.328-2.572-4.723-8.063-7.256-17.414-7.256h-45.224v81.313Z" fill="#fff"/>
    <path d="M789.89,58.063h10.051v90.412h-10.051V58.063Z" fill="#fff"/>
    <path d="M884.202,102.405l-40.901-44.342h12.62l34.357,37.087,35.407-37.087h12.038l-41.719,43.767,42.77,46.645h-12.62l-36.226-39.389-37.745,39.389h-12.038l44.057-46.07Z" fill="#fff"/>
  </g>
  <path d="M312.112,152.829l-125.516-114.769-125.37,114.965,3.529,4.915c17.295-10.472,36.182-18.512,56.192-23.899,20.397-5.492,42.098-8.277,64.499-8.277,45.159,0,88.738,11.358,123.106,32.025l3.561-4.959ZM186.601,45.573l80.599,73.698c-12.717-9.665-26.21-19.774-38.636-28.631-30.51-21.746-38.659-24.535-42.351-24.535s-11.739,2.763-41.699,24.305c-11.803,8.487-24.626,18.169-36.798,27.5l78.883-72.337ZM147.751,94.909c28.149-20.241,36.181-23.263,38.464-23.263,2.299,0,10.44,3.054,39.134,23.506,13.704,9.768,28.737,21.084,42.58,31.637-29.526-16.845-63.311-33.625-82.099-33.625-18.505,0-51.113,16.427-79.806,33.036,13.598-10.464,28.331-21.658,41.727-31.29ZM119.506,128.69c-4.74,1.276-9.414,2.706-14.026,4.269,28.621-16.723,62.503-34.254,80.35-34.254,18.06,0,52.858,17.689,82.259,34.598-25.679-8.546-53.856-13.081-82.644-13.081-22.887,0-45.073,2.849-65.939,8.467Z" fill="#fff"/>
</svg>`;

export function renderNewPasswordPage(options: NewPasswordPageOptions = {}): string {
  const title = options.title ?? 'Change Password';
  const brandName = options.brandName ?? 'Stitchmate';
  const logo = options.logo ?? DEFAULT_LOGO_SVG;
  const backgroundUrl = options.backgroundUrl ?? '';
  const apiPath = options.apiPath ?? '/api/auth/reset-password/change';
  const loginPath = options.loginPath ?? '/login';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | ${escapeHtml(brandName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      --primary: #512fff;
      --primary-hover: #4120D9;
      --bg-slate-900: #0f172a;
      --bg-slate-950: #020617;
      --text-white: #f8fafc;
      --text-muted: #94a3b8;
      --border-slate: #334155;
      --color-success: #22c55e;
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
      background: rgba(15, 23, 42, 0.45);
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

    .success-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      animation: fadeIn 0.3s ease forwards;
    }

    .success-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.75rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .success-desc {
      font-size: 0.95rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .form-title {
      font-family: 'Outfit', sans-serif;
      font-size: 2rem;
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
      background-color: rgba(2, 6, 23, 0.8);
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

    .btn-primary:hover:not(:disabled) {
      background-color: var(--primary-hover);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(81, 47, 255, 0.5);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .footer-links-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1.5rem;
      gap: 0.5rem;
    }

    .text-link {
      font-size: 0.875rem;
      color: var(--primary);
      text-decoration: none;
      transition: color 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
    }

    .text-link:hover {
      color: var(--text-white);
      text-decoration: underline;
    }

    /* Password Requirements UI */
    .req-list {
      list-style: none;
      margin-top: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .req-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-muted);
      transition: color 0.2s ease;
    }

    .req-dot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      border: 1px solid var(--border-slate);
      background-color: rgba(30, 41, 59, 0.3);
      transition: all 0.2s ease;
    }

    .req-item.valid {
      color: var(--color-success);
    }

    .req-item.valid .req-dot {
      border-color: var(--color-success);
      background-color: var(--color-success);
      color: white;
    }

    .checkmark {
      display: none;
      width: 0.625rem;
      height: 0.625rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .req-item.valid .checkmark {
      display: block;
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
  </style>
</head>
<body>
  <div class="bg-container"></div>
  
  <header>
    <div class="logo-container">
      ${logo}
    </div>
  </header>

  <main>
    <div class="login-box">
      <div class="card" id="form-card">
        <div id="error-alert" class="error-banner" role="alert"></div>

        <div id="change-view">
          <h1 class="form-title">Change your password</h1>
          <form id="change-form">
            <div class="form-group">
              <label for="password" class="form-label">New Password</label>
              <input id="password" name="password" type="password" autocomplete="new-password" class="form-control" required autofocus />
            </div>

            <div class="form-group">
              <label for="confirm-password" class="form-label">Confirm Password</label>
              <input id="confirm-password" name="confirm-password" type="password" autocomplete="new-password" class="form-control" required />
            </div>

            <ul class="req-list">
              <li id="req-length" class="req-item">
                <span class="req-dot">
                  <svg class="checkmark" viewBox="0 0 10 10">
                    <polyline points="2 5.5 4 7.5 8 3" />
                  </svg>
                </span>
                Password is at least 8 characters long
              </li>
              <li id="req-uppercase" class="req-item">
                <span class="req-dot">
                  <svg class="checkmark" viewBox="0 0 10 10">
                    <polyline points="2 5.5 4 7.5 8 3" />
                  </svg>
                </span>
                Contains at least one uppercase letter
              </li>
              <li id="req-lowercase" class="req-item">
                <span class="req-dot">
                  <svg class="checkmark" viewBox="0 0 10 10">
                    <polyline points="2 5.5 4 7.5 8 3" />
                  </svg>
                </span>
                Contains at least one lowercase letter
              </li>
              <li id="req-number" class="req-item">
                <span class="req-dot">
                  <svg class="checkmark" viewBox="0 0 10 10">
                    <polyline points="2 5.5 4 7.5 8 3" />
                  </svg>
                </span>
                Contains at least one number
              </li>
              <li id="req-match" class="req-item">
                <span class="req-dot">
                  <svg class="checkmark" viewBox="0 0 10 10">
                    <polyline points="2 5.5 4 7.5 8 3" />
                  </svg>
                </span>
                Passwords match
              </li>
            </ul>

            <button type="submit" id="submit-btn" class="btn btn-primary" style="margin-top: 1.5rem;" disabled>Change Password</button>
          </form>
        </div>
      </div>
    </div>
  </main>

  <footer>
    &copy; ${new Date().getFullYear()} ${escapeHtml(brandName)}. All rights reserved.
  </footer>

  <script>
    (function () {
      var errorAlert = document.getElementById('error-alert');
      var form = document.getElementById('change-form');
      var submitBtn = document.getElementById('submit-btn');
      var card = document.getElementById('form-card');
      
      var passwordInput = document.getElementById('password');
      var confirmInput = document.getElementById('confirm-password');
      
      var reqLength = document.getElementById('req-length');
      var reqUppercase = document.getElementById('req-uppercase');
      var reqLowercase = document.getElementById('req-lowercase');
      var reqNumber = document.getElementById('req-number');
      var reqMatch = document.getElementById('req-match');

      var apiPath = ${JSON.stringify(apiPath)};
      var loginPath = ${JSON.stringify(loginPath)};

      // Extract token from URL path or parameters
      var searchParams = new URLSearchParams(window.location.search);
      var token = searchParams.get('token') || '';

      // Fallback: check path segments for token
      if (!token) {
        var pathSegments = window.location.pathname.split('/');
        // If path matches /login/reset-password/abc123xyz
        token = pathSegments[pathSegments.length - 1] || '';
      }

      function showError(message) {
        errorAlert.textContent = message;
        errorAlert.style.display = 'block';
      }

      function hideError() {
        errorAlert.style.display = 'none';
        errorAlert.textContent = '';
      }

      function validateForm() {
        var val = passwordInput.value;
        var confirmVal = confirmInput.value;

        var meetsLength = val.length >= 8;
        var meetsUpper = /[A-Z]/.test(val);
        var meetsLower = /[a-z]/.test(val);
        var meetsNumber = /[0-9]/.test(val);
        var meetsMatch = val.length > 0 && val === confirmVal;

        toggleReq(reqLength, meetsLength);
        toggleReq(reqUppercase, meetsUpper);
        toggleReq(reqLowercase, meetsLower);
        toggleReq(reqNumber, meetsNumber);
        toggleReq(reqMatch, meetsMatch);

        var isValid = meetsLength && meetsUpper && meetsLower && meetsNumber && meetsMatch;
        submitBtn.disabled = !isValid;
      }

      function toggleReq(el, isValid) {
        if (isValid) {
          el.classList.add('valid');
        } else {
          el.classList.remove('valid');
        }
      }

      passwordInput.addEventListener('input', validateForm);
      confirmInput.addEventListener('input', validateForm);

      if (form) {
        form.addEventListener('submit', async function (event) {
          event.preventDefault();
          hideError();
          submitBtn.disabled = true;

          try {
            var response = await fetch(apiPath, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                token: token,
                password: passwordInput.value,
              }),
            });

            var payload = await response.json().catch(function () { return null; });
            if (!response.ok) {
              throw new Error((payload && payload.message) || 'Request failed');
            }

            // Replace card content with Success Panel
            card.innerHTML = [
              '<div class="success-panel">',
                '<h2 class="success-title">Password changed</h2>',
                '<p class="success-desc">',
                  'Your password has been changed successfully.',
                '</p>',
                '<div class="footer-links-container" style="justify-content: flex-start; margin-top: 1rem;">',
                  '<a href="' + loginPath + '" class="text-link">',
                    'Login &rarr;',
                  '</a>',
                '</div>',
              '</div>'
            ].join('');

          } catch (error) {
            showError(error && error.message ? error.message : 'Failed to change password');
            validateForm(); // resets submitBtn status
          }
        });
      }
    })();
  </script>
</body>
</html>`;
}
