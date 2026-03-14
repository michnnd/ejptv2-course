// ============================================
// Prerequisites: Web Applications Basics
// ============================================

export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Prerequisites</div>
    <h1 class="lesson-title">Web Applications Basics</h1>
    <div class="lesson-meta">
      <span>⏱ ~40 min</span>
      <span>⚡ 100 XP</span>
      <span>📚 Foundation</span>
    </div>
  </div>

  <div class="story-intro">
    A bug bounty hunter opened a browser, right-clicked, and hit "Inspect." Within minutes, she found a hidden API endpoint leaking admin credentials in plain JSON. No exploit kit. No zero-day. Just a deep understanding of how web applications work under the hood. Before you can hack the web, you need to speak its language.
  </div>

  <!-- ==================== SECTION 1: How the Web Works ==================== -->
  <h2>How the Web Works — The Client-Server Model</h2>

  <p>Every time you visit a website, you're participating in a conversation between two computers. Your browser (the <strong>client</strong>) sends a request, and a remote machine (the <strong>server</strong>) sends back a response. That's the entire web in one sentence.</p>

  <div class="analogy">
    Think of it like a restaurant. You (the <strong>client/customer</strong>) sit at a table and place an order. The <strong>waiter</strong> (HTTP protocol) carries your order to the <strong>kitchen</strong> (the server). The kitchen prepares your food (processes the request, queries a database) and the waiter brings it back to you (the HTTP response). You never walk into the kitchen yourself — the waiter is the middleman. That's exactly how HTTP works between your browser and a web server.
  </div>

  <p>Here's what actually happens when you type <code>https://example.com</code> in your browser:</p>
  <ol>
    <li><strong>DNS Lookup</strong> — Your browser asks "What IP address is example.com?" and gets back something like <code>93.184.216.34</code></li>
    <li><strong>TCP Connection</strong> — Your browser opens a TCP connection to that IP on port 443 (HTTPS) or 80 (HTTP)</li>
    <li><strong>TLS Handshake</strong> — If HTTPS, encryption is negotiated (more on this later)</li>
    <li><strong>HTTP Request</strong> — Your browser sends: "GET / HTTP/1.1" — "Give me the homepage"</li>
    <li><strong>Server Processing</strong> — The server runs code, queries databases, builds the page</li>
    <li><strong>HTTP Response</strong> — The server sends back HTML, CSS, JS, images, etc.</li>
    <li><strong>Rendering</strong> — Your browser assembles everything into the page you see</li>
  </ol>

  <div class="hacker-note">
    Every single step above is an attack surface. DNS can be spoofed. TCP connections can be hijacked. TLS can be downgraded. HTTP requests can be intercepted and modified with a proxy like Burp Suite. Server-side processing can be exploited (SQLi, RCE). Responses can leak sensitive data. Understanding this flow is the foundation of web hacking.
  </div>

  <!-- ==================== SECTION 2: URLs ==================== -->
  <h2>URLs — Anatomy of a Web Address</h2>

  <p>A URL (Uniform Resource Locator) is the address you type to reach a specific resource on the web. Every part of a URL has meaning, and hackers pay close attention to each piece.</p>

  <div class="code-block">
    <span class="code-label">URL Breakdown</span>
<span class="cmd">https</span>://<span class="val">admin</span>:<span class="flag">password123</span>@<span class="cmd">www.example.com</span>:<span class="val">8443</span><span class="flag">/dashboard/users</span>?<span class="val">role=admin</span>&<span class="val">page=2</span>#<span class="cmd">section3</span>

<span class="comment"># Scheme:    https           (protocol — HTTP or HTTPS)</span>
<span class="comment"># Userinfo:  admin:password123  (credentials — rare, dangerous if exposed)</span>
<span class="comment"># Host:      www.example.com (domain name or IP address)</span>
<span class="comment"># Port:      8443            (if omitted: 80 for HTTP, 443 for HTTPS)</span>
<span class="comment"># Path:      /dashboard/users (resource location on the server)</span>
<span class="comment"># Query:     ?role=admin&page=2 (parameters sent to the server)</span>
<span class="comment"># Fragment:  #section3       (client-side only — never sent to the server)</span>
  </div>

  <div class="key-point">
    <strong>Query parameters</strong> (<code>?key=value</code>) are the #1 place to test for injection vulnerabilities. Every parameter you see in a URL is user input that the server processes. Try injecting <code>'</code>, <code>"</code>, <code>&lt;script&gt;</code>, <code>../</code>, and see what happens.
  </div>

  <div class="hacker-note">
    The <strong>fragment</strong> (#section3) is never sent to the server — it's handled entirely by the browser. This means server-side logging won't capture it, but it CAN be exploited client-side for DOM-based XSS attacks.
  </div>

  <!-- ==================== SECTION 3: HTTP Methods ==================== -->
  <h2>HTTP Methods — What You're Asking the Server to Do</h2>

  <p>When your browser (or tool) talks to a server, it uses an HTTP <strong>method</strong> (also called a verb) to say what kind of action it wants. Think of methods as different types of orders at a restaurant.</p>

  <table class="port-table">
    <thead>
      <tr><th>Method</th><th>Purpose</th><th>Has Body?</th><th>Hacking Relevance</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">GET</td><td>Retrieve data (load a page)</td><td>No</td><td>Parameters in URL — visible in logs, bookmarks, referrer headers</td></tr>
      <tr><td class="port-num">POST</td><td>Submit data (login, forms)</td><td>Yes</td><td>Parameters in body — test for SQLi, XSS, command injection</td></tr>
      <tr><td class="port-num">PUT</td><td>Upload/replace a resource</td><td>Yes</td><td>If enabled, you might upload a web shell directly</td></tr>
      <tr><td class="port-num">DELETE</td><td>Delete a resource</td><td>Optional</td><td>If unrestricted, delete other users' data (IDOR)</td></tr>
      <tr><td class="port-num">PATCH</td><td>Partially update a resource</td><td>Yes</td><td>Modify fields you shouldn't — e.g., change role to admin</td></tr>
      <tr><td class="port-num">OPTIONS</td><td>Ask what methods are allowed</td><td>No</td><td>Reveals allowed methods — check if PUT/DELETE are enabled</td></tr>
      <tr><td class="port-num">HEAD</td><td>Same as GET but no body returned</td><td>No</td><td>Fingerprint servers, check if resources exist without downloading</td></tr>
    </tbody>
  </table>

  <div class="hacker-note">
    Always send an <code>OPTIONS</code> request to interesting endpoints. If the server responds with <code>Allow: GET, POST, PUT, DELETE</code>, you might be able to upload files (PUT) or delete resources (DELETE) that were never meant to be accessible. Misconfigured APIs often leave dangerous methods enabled.
  </div>

  <div class="try-it">
    <p>Open the terminal (press <kbd>\`</kbd>) and try these commands:</p>
    <button class="try-cmd">curl -X OPTIONS http://example.com -i</button>
    <button class="try-cmd">curl -X HEAD http://example.com -i</button>
    <button class="try-cmd">curl -v http://example.com</button>
  </div>

  <!-- ==================== SECTION 4: HTTP Status Codes ==================== -->
  <h2>HTTP Status Codes — What the Server Is Telling You</h2>

  <p>Every HTTP response comes with a three-digit status code. These codes tell you whether your request succeeded, failed, or something else happened. As a hacker, status codes are breadcrumbs that reveal how the application behaves.</p>

  <table class="port-table">
    <thead>
      <tr><th>Code</th><th>Meaning</th><th>Category</th><th>What It Tells a Hacker</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">200</td><td>OK</td><td>Success</td><td>Request worked — the page or resource exists</td></tr>
      <tr><td class="port-num">301</td><td>Moved Permanently</td><td>Redirect</td><td>Resource moved — follow the Location header. Check for open redirects</td></tr>
      <tr><td class="port-num">302</td><td>Found (Temporary Redirect)</td><td>Redirect</td><td>Often used after login — can sometimes be bypassed by ignoring the redirect</td></tr>
      <tr><td class="port-num">403</td><td>Forbidden</td><td>Client Error</td><td>Resource exists but you're not allowed. Try bypasses: path traversal, verb tampering, header tricks</td></tr>
      <tr><td class="port-num">404</td><td>Not Found</td><td>Client Error</td><td>Resource doesn't exist — useful for directory brute-forcing (200 vs 404)</td></tr>
      <tr><td class="port-num">405</td><td>Method Not Allowed</td><td>Client Error</td><td>Wrong HTTP method — try switching GET to POST or vice versa</td></tr>
      <tr><td class="port-num">500</td><td>Internal Server Error</td><td>Server Error</td><td>The server crashed — your input might have broken something (good sign for injection)</td></tr>
      <tr><td class="port-num">502</td><td>Bad Gateway</td><td>Server Error</td><td>Reverse proxy can't reach the backend — architecture info leak</td></tr>
      <tr><td class="port-num">503</td><td>Service Unavailable</td><td>Server Error</td><td>Server overloaded or down for maintenance</td></tr>
    </tbody>
  </table>

  <div class="key-point">
    <strong>The difference between 403 and 404 is critical.</strong> A 403 means "this exists but you can't have it." A 404 means "this doesn't exist." When directory brute-forcing, 403 responses on paths like <code>/admin</code>, <code>/backup</code>, <code>/config</code> confirm those directories are real — you just need to find a way in.
  </div>

  <div class="hacker-note">
    If you send a SQL injection payload and get a <strong>500 Internal Server Error</strong> instead of the normal page, that's a strong indicator the application is vulnerable. The server tried to run your injected SQL, it broke the query, and the app crashed. Time to refine the payload.
  </div>

  <!-- ==================== SECTION 5: HTTP Headers ==================== -->
  <h2>HTTP Headers — The Metadata of Every Request</h2>

  <p>HTTP headers are key-value pairs sent with every request and response. They carry metadata — authentication tokens, content types, caching rules, security policies, and more. Headers are invisible to casual users but critical for hackers.</p>

  <h3>Important Request Headers</h3>
  <table class="port-table">
    <thead>
      <tr><th>Header</th><th>What It Does</th><th>Hacking Use</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">Cookie</td><td>Sends session cookies to the server</td><td>Steal this = steal the session. Session hijacking.</td></tr>
      <tr><td class="port-num">Authorization</td><td>Sends credentials (Basic, Bearer token)</td><td>If leaked in logs or JS files, instant account takeover</td></tr>
      <tr><td class="port-num">Content-Type</td><td>Tells the server what format the body is in</td><td>Change to <code>application/json</code> or <code>application/xml</code> to bypass WAFs</td></tr>
      <tr><td class="port-num">User-Agent</td><td>Identifies the client (browser, bot, tool)</td><td>Spoof to bypass restrictions or fingerprint-based blocks</td></tr>
      <tr><td class="port-num">Referer</td><td>Where the request came from</td><td>Some apps check Referer for authorization — easily spoofed</td></tr>
      <tr><td class="port-num">X-Forwarded-For</td><td>Original client IP (behind proxy/LB)</td><td>Spoof to bypass IP-based restrictions or rate limiting</td></tr>
      <tr><td class="port-num">Host</td><td>Which website on the server to serve</td><td>Host header injection — password reset poisoning, cache poisoning</td></tr>
    </tbody>
  </table>

  <h3>Important Response Headers</h3>
  <table class="port-table">
    <thead>
      <tr><th>Header</th><th>What It Does</th><th>What to Look For</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">Set-Cookie</td><td>Server tells browser to store a cookie</td><td>Check for missing HttpOnly, Secure, SameSite flags</td></tr>
      <tr><td class="port-num">Server</td><td>Identifies the web server software</td><td><code>Server: Apache/2.4.49</code> — now search for CVEs for that version</td></tr>
      <tr><td class="port-num">X-Powered-By</td><td>Identifies the backend technology</td><td><code>X-Powered-By: PHP/7.2</code> — reveals tech stack for targeted attacks</td></tr>
      <tr><td class="port-num">Content-Security-Policy</td><td>Controls what resources the page can load</td><td>Weak or missing CSP = easier XSS exploitation</td></tr>
      <tr><td class="port-num">Access-Control-Allow-Origin</td><td>CORS — who can make cross-origin requests</td><td>If set to <code>*</code> or reflects attacker's origin, possible data theft</td></tr>
      <tr><td class="port-num">Location</td><td>Where to redirect (with 301/302)</td><td>Check for open redirect — can you inject a URL here?</td></tr>
    </tbody>
  </table>

  <div class="try-it">
    <p>Open the terminal (press <kbd>\`</kbd>) and inspect real headers:</p>
    <button class="try-cmd">curl -I https://example.com</button>
    <button class="try-cmd">curl -v https://example.com 2>&1 | head -30</button>
    <button class="try-cmd">curl -H "X-Forwarded-For: 127.0.0.1" http://example.com -I</button>
  </div>

  <!-- ==================== SECTION 6: Cookies and Sessions ==================== -->
  <h2>Cookies and Sessions — How Websites Remember You</h2>

  <p>HTTP is <strong>stateless</strong> — the server doesn't inherently remember who you are between requests. Every request is a stranger. So how does a website keep you logged in? <strong>Sessions and cookies.</strong></p>

  <div class="analogy">
    Imagine a nightclub with a strict bouncer. You show your ID once at the door (login), and the bouncer gives you a wristband (session cookie). For the rest of the night, you just flash the wristband — no need to show your ID again. If someone steals your wristband, they get in as you. If the wristband never expires, it works forever. That's exactly how session cookies work.
  </div>

  <p>Here's the flow:</p>
  <ol>
    <li>You send your username and password to the server (POST /login)</li>
    <li>The server verifies your credentials and creates a <strong>session</strong> — a temporary record on the server tied to a random ID</li>
    <li>The server sends back a <code>Set-Cookie: PHPSESSID=abc123def456</code> header</li>
    <li>Your browser stores this cookie and sends it with <strong>every subsequent request</strong></li>
    <li>The server sees <code>PHPSESSID=abc123def456</code>, looks it up, and knows it's you</li>
  </ol>

  <h3>Cookie Security Flags</h3>
  <table class="port-table">
    <thead>
      <tr><th>Flag</th><th>What It Does</th><th>If Missing...</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">HttpOnly</td><td>Cookie can't be accessed by JavaScript</td><td>XSS can steal it with <code>document.cookie</code></td></tr>
      <tr><td class="port-num">Secure</td><td>Cookie only sent over HTTPS</td><td>Cookie sent in plaintext over HTTP — sniffable on the network</td></tr>
      <tr><td class="port-num">SameSite</td><td>Controls cross-site cookie sending (Strict, Lax, None)</td><td>Vulnerable to CSRF attacks — attacker site can trigger actions on your behalf</td></tr>
      <tr><td class="port-num">Domain</td><td>Which domains the cookie is valid for</td><td>Overly broad domain = cookie sent to subdomains attacker might control</td></tr>
      <tr><td class="port-num">Path</td><td>Which paths the cookie is valid for</td><td>Usually / (all paths)</td></tr>
      <tr><td class="port-num">Expires/Max-Age</td><td>When the cookie expires</td><td>Session cookie (deleted when browser closes) vs persistent cookie</td></tr>
    </tbody>
  </table>

  <div class="hacker-note">
    <strong>Session hijacking checklist:</strong> (1) Can you steal the cookie via XSS? Check if HttpOnly is missing. (2) Is the session ID predictable? Try sequential IDs. (3) Does the session ID change after login? If not, it's vulnerable to session fixation. (4) Can you brute-force short session IDs? Always check cookie security flags first — they tell you your attack path.
  </div>

  <!-- ==================== SECTION 7: HTML Forms and Parameters ==================== -->
  <h2>HTML Forms and Parameters — How Data Gets Sent</h2>

  <p>Forms are the primary way users submit data to web applications — login pages, search bars, registration forms, comment boxes. Understanding how form data travels is essential for injection attacks.</p>

  <h3>GET vs POST — Two Ways to Send Data</h3>

  <div class="code-block">
    <span class="code-label">GET Request — Data in the URL</span>
GET <span class="flag">/search?q=hacking&page=1</span> HTTP/1.1
Host: example.com

<span class="comment"># Parameters visible in the URL</span>
<span class="comment"># Saved in browser history, server logs, referrer headers</span>
<span class="comment"># Limited length (~2048 chars)</span>
<span class="comment"># Used for: searches, filters, pagination</span>
  </div>

  <div class="code-block">
    <span class="code-label">POST Request — Data in the Body</span>
POST <span class="flag">/login</span> HTTP/1.1
Host: example.com
Content-Type: application/x-www-form-urlencoded

<span class="val">username=admin&password=secret123</span>

<span class="comment"># Parameters in the request body (not in the URL)</span>
<span class="comment"># Not saved in browser history or logs (usually)</span>
<span class="comment"># No length limit</span>
<span class="comment"># Used for: logins, file uploads, data submission</span>
  </div>

  <div class="key-point">
    <strong>Both GET and POST parameters are equally injectable.</strong> It's a common misconception that POST is "safer" — it just hides data from the URL bar. SQL injection, XSS, and command injection work the same way regardless of the HTTP method. Always test both.
  </div>

  <p>Common content types for POST bodies:</p>
  <ul>
    <li><code>application/x-www-form-urlencoded</code> — Standard form data: <code>key1=value1&key2=value2</code></li>
    <li><code>multipart/form-data</code> — File uploads. Each field is a separate "part" with boundaries</li>
    <li><code>application/json</code> — API data: <code>{"username": "admin", "password": "secret"}</code></li>
    <li><code>application/xml</code> — XML data (potential for XXE attacks)</li>
  </ul>

  <div class="hacker-note">
    Try switching content types. If a form sends <code>application/x-www-form-urlencoded</code>, try sending the same data as <code>application/json</code>. Some WAFs (Web Application Firewalls) only inspect one format. You might bypass filters entirely just by changing the Content-Type header.
  </div>

  <!-- ==================== SECTION 8: Same-Origin Policy and CORS ==================== -->
  <h2>Same-Origin Policy and CORS — Browser Security Boundaries</h2>

  <p>The <strong>Same-Origin Policy (SOP)</strong> is the most fundamental security mechanism in web browsers. It prevents a script on one website from reading data from a different website.</p>

  <div class="analogy">
    Imagine every website is a separate apartment in a building. SOP is like locked apartment doors — the JavaScript running in apartment A (evil.com) can't walk into apartment B (yourbank.com) and read your bank balance. Each apartment is isolated. CORS is like giving someone a key to your apartment — you explicitly allow specific outsiders in.
  </div>

  <p>Two URLs have the <strong>same origin</strong> if they share the same <strong>scheme + host + port</strong>:</p>

  <table class="port-table">
    <thead>
      <tr><th>URL A</th><th>URL B</th><th>Same Origin?</th><th>Why</th></tr>
    </thead>
    <tbody>
      <tr><td>http://example.com/page1</td><td>http://example.com/page2</td><td>Yes</td><td>Same scheme, host, port</td></tr>
      <tr><td>http://example.com</td><td>https://example.com</td><td>No</td><td>Different scheme (http vs https)</td></tr>
      <tr><td>http://example.com</td><td>http://example.com:8080</td><td>No</td><td>Different port (80 vs 8080)</td></tr>
      <tr><td>http://example.com</td><td>http://api.example.com</td><td>No</td><td>Different host (subdomain counts)</td></tr>
    </tbody>
  </table>

  <h3>CORS — Cross-Origin Resource Sharing</h3>
  <p>CORS is how servers selectively relax the Same-Origin Policy. The server sends headers saying "I allow requests from these origins."</p>

  <div class="code-block">
    <span class="code-label">CORS Response Headers</span>
<span class="comment"># Server says: "Only trust.com can read my responses"</span>
Access-Control-Allow-Origin: <span class="val">https://trust.com</span>

<span class="comment"># DANGEROUS: Server says "anyone can read my responses"</span>
Access-Control-Allow-Origin: <span class="flag">*</span>

<span class="comment"># VERY DANGEROUS: Server reflects whatever origin you send</span>
Access-Control-Allow-Origin: <span class="flag">https://evil.com</span>
Access-Control-Allow-Credentials: <span class="flag">true</span>

<span class="comment"># ^ If the server reflects your Origin header AND allows credentials,</span>
<span class="comment">#   an attacker's site can steal authenticated data from the victim.</span>
  </div>

  <div class="hacker-note">
    To test for CORS misconfiguration, send a request with a custom Origin header: <code>curl -H "Origin: https://evil.com" -I https://target.com/api/user</code>. If the response contains <code>Access-Control-Allow-Origin: https://evil.com</code>, the server blindly reflects origins. Combined with <code>Access-Control-Allow-Credentials: true</code>, this is a high-severity vulnerability — you can steal user data cross-site.
  </div>

  <!-- ==================== SECTION 9: HTTPS and TLS ==================== -->
  <h2>HTTPS and TLS — Encryption on the Web</h2>

  <p>HTTPS is just HTTP wrapped in a TLS (Transport Layer Security) encryption layer. It protects data <strong>in transit</strong> — between your browser and the server.</p>

  <h3>What TLS Protects</h3>
  <ul>
    <li><strong>Confidentiality</strong> — No one on the network can read the traffic (passwords, cookies, data)</li>
    <li><strong>Integrity</strong> — No one can modify the data in transit without detection</li>
    <li><strong>Authentication</strong> — The server proves its identity via a certificate (you know you're talking to the real bank.com)</li>
  </ul>

  <h3>What TLS Does NOT Protect</h3>
  <ul>
    <li>Application-layer attacks — SQLi, XSS, CSRF all work over HTTPS</li>
    <li>The server itself — If the server is compromised, encryption doesn't help</li>
    <li>Data at rest — TLS only protects data while it's moving across the network</li>
    <li>The destination host — An attacker can see WHICH domain you're connecting to (via SNI), just not the content</li>
  </ul>

  <div class="key-point">
    <strong>HTTPS does NOT mean a site is safe.</strong> A phishing page can have a perfectly valid HTTPS certificate. HTTPS only means the connection is encrypted — it says nothing about whether the server is trustworthy or the application is secure. Every web vulnerability (SQLi, XSS, RCE) works identically over HTTP and HTTPS.
  </div>

  <div class="hacker-note">
    Tools like Burp Suite work by acting as a TLS proxy. Your browser connects to Burp (which has its own certificate), and Burp connects to the real server. This lets you intercept, read, and modify HTTPS traffic in plaintext. That's why you install Burp's CA certificate in your browser — you're telling the browser "trust Burp as a certificate authority."
  </div>

  <div class="try-it">
    <p>Open the terminal (press <kbd>\`</kbd>) and inspect TLS details:</p>
    <button class="try-cmd">curl -vI https://example.com 2>&1 | grep -E "SSL|TLS|subject|issuer|expire"</button>
    <button class="try-cmd">openssl s_client -connect example.com:443 -brief</button>
  </div>

  <!-- ==================== SECTION 10: Web Server Tech Stacks ==================== -->
  <h2>Web Server Tech Stacks — Know Your Target</h2>

  <p>Before attacking a web app, you need to know what it's built with. Different technologies have different vulnerabilities, default configurations, and known exploits.</p>

  <h3>Common Web Servers</h3>
  <table class="port-table">
    <thead>
      <tr><th>Server</th><th>OS</th><th>Key Facts</th><th>Things to Try</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">Apache</td><td>Linux (usually)</td><td>Most popular, .htaccess config files</td><td>Check for .htaccess, mod_status (/server-status), directory listing</td></tr>
      <tr><td class="port-num">Nginx</td><td>Linux (usually)</td><td>Fast, reverse proxy, misconfig-prone</td><td>Off-by-slash path traversal, alias misconfiguration, stub_status</td></tr>
      <tr><td class="port-num">IIS</td><td>Windows</td><td>Microsoft's server, ASP.NET</td><td>Short filename brute-force (~1 vuln), web.config exposure, PUT method upload</td></tr>
      <tr><td class="port-num">Tomcat</td><td>Cross-platform</td><td>Java servlets/JSP, manager panel</td><td>Default creds on /manager (tomcat:tomcat), WAR file upload for RCE</td></tr>
    </tbody>
  </table>

  <h3>Common CMS (Content Management Systems)</h3>
  <table class="port-table">
    <thead>
      <tr><th>CMS</th><th>How to Identify</th><th>Attack Tools</th><th>Common Vulns</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">WordPress</td><td>/wp-login.php, /wp-admin/, /wp-content/</td><td>WPScan</td><td>Plugin vulns, xmlrpc.php brute-force, user enum (?author=1)</td></tr>
      <tr><td class="port-num">Joomla</td><td>/administrator/, /components/, Joomla meta tag</td><td>JoomScan</td><td>Component vulns, admin panel brute-force</td></tr>
      <tr><td class="port-num">Drupal</td><td>/node/, CHANGELOG.txt, /core/</td><td>Droopescan</td><td>Drupalgeddon (RCE), module vulns</td></tr>
    </tbody>
  </table>

  <div class="hacker-note">
    <strong>Fingerprinting checklist:</strong> (1) Check response headers — <code>Server</code> and <code>X-Powered-By</code> often reveal exact versions. (2) Look at default files — <code>/robots.txt</code>, <code>/sitemap.xml</code>, <code>/README.md</code>, <code>/CHANGELOG.txt</code>. (3) Check HTML source for generator meta tags. (4) Use tools: <code>whatweb</code>, <code>wappalyzer</code>, or <code>nikto</code>. The more you know about the stack, the more targeted your attacks become.
  </div>

  <div class="try-it">
    <p>Open the terminal (press <kbd>\`</kbd>) and try fingerprinting:</p>
    <button class="try-cmd">curl -I http://example.com</button>
    <button class="try-cmd">curl -s http://example.com/robots.txt</button>
    <button class="try-cmd">curl -s http://example.com | grep -i "generator\|powered\|wp-content\|joomla"</button>
  </div>

  <!-- ==================== QUIZ SECTION ==================== -->
  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">8 questions covering everything above. Score 70%+ to earn full XP.</p>
    <button class="btn-primary quiz-start-btn" id="start-quiz-btn">Start Field Test</button>
    <br><br>
    <button class="btn-secondary" id="complete-topic-btn">Mark as Complete (Skip Quiz)</button>
  </div>

</article>
  `;
}

// ==================== QUIZ DATA ====================
export const quiz = [
  {
    type: 'mcq',
    question: 'You send a request to /admin and get a 403 status code. You send a request to /secretpanel and get a 404. What can you conclude?',
    options: [
      'Both pages exist but are restricted',
      '/admin exists but you\'re forbidden; /secretpanel does not exist',
      'Neither page exists',
      'Both pages are accessible'
    ],
    correct: 1,
    explanation: '403 Forbidden means the resource exists but access is denied. 404 Not Found means the resource does not exist. This distinction is critical when directory brute-forcing — 403 confirms a real path worth investigating.'
  },
  {
    type: 'mcq',
    question: 'A cookie is set without the HttpOnly flag. What attack does this enable?',
    options: [
      'SQL Injection',
      'CSRF (Cross-Site Request Forgery)',
      'XSS can steal the cookie via document.cookie',
      'Brute-force attack on the session ID'
    ],
    correct: 2,
    explanation: 'Without HttpOnly, JavaScript can access the cookie via document.cookie. If the site has an XSS vulnerability, an attacker can inject a script that steals the session cookie and sends it to their server — instant session hijacking.'
  },
  {
    type: 'type-command',
    question: 'You want to see the HTTP response headers (only headers, no body) from https://target.com. Write the curl command:',
    scenario: 'Fetch only the response headers from a target website.',
    validAnswers: [
      'curl -I https://target.com',
      'curl --head https://target.com',
      'curl -I https://target.com/',
      'curl --head https://target.com/',
    ],
    hint: 'curl -I ...',
    explanation: 'curl -I (or --head) sends a HEAD request and displays only the response headers. This is the fastest way to fingerprint a web server and check for security headers.'
  },
  {
    type: 'drag-match',
    question: 'Match each HTTP method to its purpose:',
    pairs: [
      { label: 'GET', value: 'Retrieve a resource' },
      { label: 'POST', value: 'Submit data to the server' },
      { label: 'PUT', value: 'Upload or replace a resource' },
      { label: 'DELETE', value: 'Remove a resource' },
      { label: 'OPTIONS', value: 'Check allowed methods' },
    ]
  },
  {
    type: 'mcq',
    question: 'You send a request with the header "Origin: https://evil.com" and the server responds with "Access-Control-Allow-Origin: https://evil.com" and "Access-Control-Allow-Credentials: true". What does this mean?',
    options: [
      'The server is secure against cross-origin attacks',
      'The server has a CORS misconfiguration that allows cross-site data theft',
      'The server blocks all cross-origin requests',
      'The server is using HTTPS so it\'s safe'
    ],
    correct: 1,
    explanation: 'The server blindly reflects the attacker\'s Origin header AND allows credentials (cookies). This means an attacker\'s website can make authenticated requests to this server and read the responses — stealing user data cross-origin. This is a critical CORS misconfiguration.'
  },
  {
    type: 'mcq',
    question: 'Which of the following is TRUE about HTTPS?',
    options: [
      'HTTPS prevents SQL injection attacks',
      'HTTPS means the website is trustworthy and not malicious',
      'HTTPS encrypts data in transit but does not prevent application-level attacks',
      'HTTPS makes cookies impossible to steal'
    ],
    correct: 2,
    explanation: 'HTTPS only encrypts data between client and server (in transit). It does NOT protect against application-layer attacks like SQLi, XSS, or CSRF. A phishing site can have HTTPS. All web vulnerabilities work identically over HTTP and HTTPS.'
  },
  {
    type: 'type-command',
    question: 'You want to see the full request and response (verbose mode) when visiting http://target.com. Write the curl command:',
    scenario: 'Make a verbose HTTP request to see all headers exchanged.',
    validAnswers: [
      'curl -v http://target.com',
      'curl --verbose http://target.com',
      'curl -v http://target.com/',
      'curl --verbose http://target.com/',
    ],
    hint: 'curl -v ...',
    explanation: 'curl -v (verbose) shows the full conversation: the request headers your client sends AND the response headers the server returns. Essential for understanding exactly what\'s happening in an HTTP exchange.'
  },
  {
    type: 'mcq',
    question: 'You find a login form that sends credentials via GET request: /login?user=admin&pass=secret. Why is this a security issue?',
    options: [
      'GET requests are slower than POST',
      'GET requests can\'t send passwords',
      'Credentials appear in URL, browser history, server logs, and Referer headers',
      'GET requests are not encrypted'
    ],
    correct: 2,
    explanation: 'GET parameters are embedded in the URL, which gets saved in browser history, bookmarked, logged by web servers, proxy servers, and sent in the Referer header to other sites. Credentials should always be sent via POST body to avoid this exposure.'
  },
];

// ==================== INTERACTIVES ====================
export function bindInteractives() {
  // No custom interactive elements beyond the standard try-it buttons and quiz
  // which are handled by the main app framework.
}
