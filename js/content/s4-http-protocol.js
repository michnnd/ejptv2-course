export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Web App Pentesting</div>
    <h1 class="lesson-title">HTTP Protocol Deep Dive</h1>
    <div class="lesson-meta">
      <span>⏱ ~35 min</span>
      <span>⚡ 100 XP</span>
      <span>🔗 Section 4</span>
    </div>
  </div>

  <div class="story-intro">
    The pentester inspected one HTTP response header and found the web server was leaking its internal IP address, the PHP version, and a debug cookie that granted admin access. The developers never thought anyone would look at the raw HTTP traffic. Every web attack starts with understanding HTTP.
  </div>

  <h2>HTTP — The Language of the Web</h2>
  <p>HTTP (HyperText Transfer Protocol) is how web browsers talk to web servers. Every time you visit a website, your browser sends an HTTP <strong>request</strong> and the server sends back an HTTP <strong>response</strong>. Understanding this exchange is fundamental to web hacking.</p>

  <h2>HTTP Request Structure</h2>
  <div class="code-block">
    <span class="code-label">HTTP Request</span>
<span class="cmd">GET</span> <span class="val">/login?user=admin</span> <span class="flag">HTTP/1.1</span>
<span class="t-cyan">Host:</span> www.target.com
<span class="t-cyan">User-Agent:</span> Mozilla/5.0 (Windows NT 10.0; Win64; x64)
<span class="t-cyan">Accept:</span> text/html,application/xhtml+xml
<span class="t-cyan">Cookie:</span> session=abc123def456
<span class="t-cyan">Authorization:</span> Bearer eyJhbGciOiJIUzI1NiJ9...
<span class="t-cyan">Referer:</span> https://www.target.com/
<span class="t-cyan">Connection:</span> keep-alive
  </div>

  <h2>HTTP Methods</h2>
  <table class="port-table">
    <thead>
      <tr><th>Method</th><th>Purpose</th><th>Hacking Relevance</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">GET</td><td>Retrieve data</td><td>Parameters in URL — visible in logs, bookmarks, history</td></tr>
      <tr><td class="port-num">POST</td><td>Submit data</td><td>Parameters in body — login forms, file uploads</td></tr>
      <tr><td class="port-num">PUT</td><td>Upload/replace resource</td><td>If allowed, can upload web shells!</td></tr>
      <tr><td class="port-num">DELETE</td><td>Remove a resource</td><td>Can delete files if misconfigured</td></tr>
      <tr><td class="port-num">HEAD</td><td>Like GET but no body</td><td>Fingerprint server without downloading content</td></tr>
      <tr><td class="port-num">OPTIONS</td><td>Show allowed methods</td><td>Reveals what methods the server accepts</td></tr>
      <tr><td class="port-num">PATCH</td><td>Partial update</td><td>API manipulation</td></tr>
    </tbody>
  </table>

  <div class="hacker-note">
    Always check which HTTP methods are allowed: <code>curl -X OPTIONS http://target/ -i</code>. If PUT is enabled, you might be able to upload a web shell directly. If DELETE is enabled, you might be able to remove security files.
  </div>

  <h2>HTTP Response Structure</h2>
  <div class="code-block">
    <span class="code-label">HTTP Response</span>
<span class="flag">HTTP/1.1</span> <span class="cmd">200 OK</span>
<span class="t-cyan">Server:</span> <span class="t-orange">Apache/2.4.52 (Ubuntu)</span>
<span class="t-cyan">X-Powered-By:</span> <span class="t-orange">PHP/8.1.2</span>
<span class="t-cyan">Set-Cookie:</span> session=xyz789; HttpOnly; Secure; SameSite=Strict
<span class="t-cyan">Content-Type:</span> text/html; charset=UTF-8
<span class="t-cyan">Content-Length:</span> 3842
<span class="t-cyan">X-Frame-Options:</span> DENY
<span class="t-cyan">Content-Security-Policy:</span> default-src 'self'

<span class="t-dim">[HTML body here]</span>
  </div>

  <h2>HTTP Status Codes</h2>
  <table class="port-table">
    <thead>
      <tr><th>Code</th><th>Meaning</th><th>Hacking Relevance</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">200</td><td>OK</td><td>Request succeeded — normal response</td></tr>
      <tr><td class="port-num">301/302</td><td>Redirect</td><td>Follow redirects to find hidden pages, open redirect vulns</td></tr>
      <tr><td class="port-num">400</td><td>Bad Request</td><td>Your payload broke the request format</td></tr>
      <tr><td class="port-num">401</td><td>Unauthorized</td><td>Needs authentication — try default creds, brute force</td></tr>
      <tr><td class="port-num">403</td><td>Forbidden</td><td>Access denied — try bypasses (path traversal, method change)</td></tr>
      <tr><td class="port-num">404</td><td>Not Found</td><td>Page doesn't exist — useful for directory brute forcing</td></tr>
      <tr><td class="port-num">405</td><td>Method Not Allowed</td><td>Try a different HTTP method</td></tr>
      <tr><td class="port-num">500</td><td>Internal Server Error</td><td>Your input caused a crash — possible injection point!</td></tr>
      <tr><td class="port-num">502</td><td>Bad Gateway</td><td>Reverse proxy issue — might reveal internal architecture</td></tr>
      <tr><td class="port-num">503</td><td>Service Unavailable</td><td>Server overloaded or under maintenance</td></tr>
    </tbody>
  </table>

  <div class="key-point">
    <strong>500 Internal Server Error</strong> is your best friend during web testing. If you can trigger a 500, it means your input is reaching the server-side code and causing an error — a strong indicator of a potential injection vulnerability.
  </div>

  <h2>Important HTTP Headers for Hacking</h2>

  <h3>Request Headers to Manipulate</h3>
  <table class="port-table">
    <thead>
      <tr><th>Header</th><th>What it Does</th><th>How Hackers Abuse It</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">Cookie</td><td>Session identification</td><td>Session hijacking, cookie manipulation</td></tr>
      <tr><td class="port-num">User-Agent</td><td>Identifies browser/OS</td><td>Can hide attacks, trigger different server behavior</td></tr>
      <tr><td class="port-num">X-Forwarded-For</td><td>Original client IP (behind proxy)</td><td>IP spoofing to bypass IP-based access controls</td></tr>
      <tr><td class="port-num">Referer</td><td>Previous page URL</td><td>Bypass referer-based access controls</td></tr>
      <tr><td class="port-num">Authorization</td><td>Auth credentials</td><td>Token manipulation, JWT attacks</td></tr>
      <tr><td class="port-num">Content-Type</td><td>Body data format</td><td>Change to bypass WAF or trigger different parsing</td></tr>
    </tbody>
  </table>

  <h3>Response Headers That Leak Info</h3>
  <table class="port-table">
    <thead>
      <tr><th>Header</th><th>What It Leaks</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">Server</td><td>Web server software and version (Apache/2.4.52)</td></tr>
      <tr><td class="port-num">X-Powered-By</td><td>Backend technology (PHP/8.1.2, ASP.NET)</td></tr>
      <tr><td class="port-num">X-Debug-Token</td><td>Debug info — often exposes internal data</td></tr>
      <tr><td class="port-num">Via</td><td>Proxy servers in the chain</td></tr>
    </tbody>
  </table>

  <h2>Cookies and Sessions</h2>
  <p>HTTP is <strong>stateless</strong> — each request is independent. Cookies solve this by storing a session identifier that links your requests together.</p>

  <h3>Cookie Security Flags</h3>
  <table class="port-table">
    <thead>
      <tr><th>Flag</th><th>What it Does</th><th>Without It</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">HttpOnly</td><td>Cookie can't be read by JavaScript</td><td>XSS can steal the cookie with document.cookie</td></tr>
      <tr><td class="port-num">Secure</td><td>Cookie only sent over HTTPS</td><td>Cookie visible on unencrypted HTTP connections</td></tr>
      <tr><td class="port-num">SameSite</td><td>Cookie not sent with cross-site requests</td><td>CSRF attacks can use the victim's cookie</td></tr>
    </tbody>
  </table>

  <h2>HTTPS and TLS</h2>
  <p>HTTPS = HTTP + TLS encryption. It protects data in transit but does NOT prevent application-level attacks.</p>

  <div class="warning">
    HTTPS encrypts the connection, but SQL injection, XSS, CSRF, and other web attacks still work over HTTPS. Encryption protects the transport, not the application logic.
  </div>

  <div class="try-it">
    <p>Try these HTTP inspection commands in the terminal:</p>
    <button class="try-cmd">curl -I http://10.10.10.1</button>
    <button class="try-cmd">curl -v http://10.10.10.1</button>
  </div>

  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">10 questions on HTTP protocol. Score 70%+ for full XP.</p>
    <button class="btn-primary quiz-start-btn" id="start-quiz-btn">Start Field Test</button>
    <br><br>
    <button class="btn-secondary" id="complete-topic-btn">Mark as Complete (Skip Quiz)</button>
  </div>
</article>`;
}

export const quiz = [
  { type: 'mcq', question: 'You send a request and get HTTP 500 Internal Server Error. What does this likely indicate?', options: ['The page doesn\'t exist', 'You\'re not authorized', 'Your input caused a server-side error — possible injection point', 'The server is down'], correct: 2, explanation: 'A 500 error means your input reached the server and caused an error. This is a strong indicator of potential injection vulnerabilities.' },
  { type: 'drag-match', question: 'Match each HTTP method to its purpose:', pairs: [ { label: 'GET', value: 'Retrieve data' }, { label: 'POST', value: 'Submit data' }, { label: 'PUT', value: 'Upload/replace' }, { label: 'OPTIONS', value: 'Show allowed methods' } ] },
  { type: 'mcq', question: 'What does the HttpOnly cookie flag prevent?', options: ['The cookie from being sent over HTTP', 'JavaScript from reading the cookie (document.cookie)', 'The cookie from being sent to other domains', 'The cookie from expiring'], correct: 1, explanation: 'HttpOnly prevents client-side JavaScript from accessing the cookie, protecting it from XSS-based cookie theft.' },
  { type: 'type-command', question: 'Use curl to see only the HTTP response headers from http://target.com:', scenario: 'Fetch just the headers, not the body.', validAnswers: ['curl -I http://target.com', 'curl --head http://target.com', 'curl -I target.com'], hint: 'curl -I ...', explanation: 'curl -I (or --head) sends a HEAD request, returning only headers without the response body.' },
  { type: 'mcq', question: 'Which response header leaks the backend technology?', options: ['Content-Type', 'X-Powered-By', 'Content-Length', 'Cache-Control'], correct: 1, explanation: 'X-Powered-By reveals the server-side technology (e.g., PHP/8.1, ASP.NET) which helps attackers find version-specific vulnerabilities.' },
  { type: 'mcq', question: 'HTTPS protects against which of the following?', options: ['SQL Injection', 'XSS', 'Eavesdropping on network traffic', 'CSRF'], correct: 2, explanation: 'HTTPS (TLS) encrypts data in transit, preventing eavesdropping. It does NOT prevent application-level attacks like SQLi, XSS, or CSRF.' },
  { type: 'mcq', question: 'HTTP 403 Forbidden means:', options: ['Page not found', 'Server error', 'You need to authenticate', 'Access is denied — the server refuses to fulfill the request'], correct: 3, explanation: '403 means the server understood the request but refuses to authorize it. Unlike 401, authentication won\'t help — you lack the required permissions.' },
  { type: 'mcq', question: 'What request header can be manipulated to bypass IP-based access controls?', options: ['User-Agent', 'Cookie', 'X-Forwarded-For', 'Accept'], correct: 2, explanation: 'X-Forwarded-For is used by proxies to pass the original client IP. If the server trusts this header, an attacker can spoof their IP to bypass IP whitelists.' },
  { type: 'mcq', question: 'Why is HTTP considered stateless?', options: ['It doesn\'t use encryption', 'Each request is independent — the server doesn\'t remember previous requests', 'It can\'t handle file uploads', 'It only supports GET requests'], correct: 1, explanation: 'HTTP is stateless — each request is independent. The server doesn\'t inherently know if two requests come from the same user. Cookies and sessions were invented to add state.' },
  { type: 'type-command', question: 'Check which HTTP methods are allowed on http://target.com:', scenario: 'Send an OPTIONS request to discover allowed methods.', validAnswers: ['curl -X OPTIONS http://target.com -i', 'curl -X OPTIONS http://target.com', 'curl -i -X OPTIONS http://target.com'], hint: 'curl -X OPTIONS ...', explanation: 'An OPTIONS request returns the Allow header listing supported HTTP methods on the target.' },
];

export function bindInteractives() {}
