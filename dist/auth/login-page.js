function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
export function renderLoginPage(options = {}) {
    const title = options.title ?? 'Sign In';
    const loginApiPath = options.loginApiPath ?? '/api/auth/login';
    const redirectUrl = options.redirectUrl ?? '/';
    const tokenStorageKey = options.tokenStorageKey ?? 'uv_access_token';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: #f8fafc; }
    .card { width: min(420px, calc(100vw - 2rem)); padding: 2rem; border-radius: 1rem; background: rgba(15, 23, 42, 0.85); box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35); }
    h1 { margin: 0 0 1.5rem; font-size: 2rem; font-weight: 500; text-align: center; }
    label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; }
    input { width: 100%; box-sizing: border-box; margin-bottom: 1rem; padding: 0.875rem 1rem; border: 1px solid #334155; border-radius: 0.5rem; background: #020617; color: inherit; }
    button { width: 100%; padding: 0.875rem 1rem; border: 0; border-radius: 999px; background: #4f46e5; color: white; font-size: 1.125rem; cursor: pointer; }
    button:disabled { opacity: 0.7; cursor: wait; }
    .error { min-height: 1.25rem; margin-top: 0.75rem; color: #fca5a5; font-size: 0.875rem; text-align: center; }
  </style>
</head>
<body>
  <main class="card">
    <h1>${escapeHtml(title)}</h1>
    <form id="login-form">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" autocomplete="username" required />
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" minlength="5" required />
      <button type="submit">Sign In</button>
      <p id="error" class="error" role="alert"></p>
    </form>
  </main>
  <script>
    (function () {
      var form = document.getElementById('login-form');
      var errorEl = document.getElementById('error');
      var loginApiPath = ${JSON.stringify(loginApiPath)};
      var defaultRedirect = ${JSON.stringify(redirectUrl)};
      var tokenStorageKey = ${JSON.stringify(tokenStorageKey)};

      function getRedirectUrl() {
        var params = new URLSearchParams(window.location.search);
        return params.get('sourceUrl') || defaultRedirect;
      }

      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        errorEl.textContent = '';
        form.querySelector('button').disabled = true;

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
          }

          window.location.href = getRedirectUrl();
        } catch (error) {
          errorEl.textContent = error && error.message ? error.message : 'Login failed';
          form.querySelector('button').disabled = false;
        }
      });
    })();
  </script>
</body>
</html>`;
}
//# sourceMappingURL=login-page.js.map