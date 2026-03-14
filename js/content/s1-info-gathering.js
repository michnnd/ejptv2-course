// ============================================
// Section 1: Information Gathering (OSINT)
// Assessment Methodologies
// ============================================

export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Assessment Methodologies</div>
    <h1 class="lesson-title">Information Gathering</h1>
    <div class="lesson-meta">
      <span>⏱ ~40 min</span>
      <span>⚡ 100 XP</span>
      <span>📚 OSINT &amp; Recon</span>
    </div>
  </div>

  <div class="story-intro">
    In 2019, a security researcher found a company's internal admin panel by Googling <code>site:target.com inurl:admin</code>. From there, he found a forgotten staging server in their DNS records, discovered default credentials on it via Shodan, and walked straight into their production database. No exploits. No zero-days. Just information gathering. The entire compromise started with a search engine.
  </div>

  <!-- ==================== SECTION 1: What is Info Gathering ==================== -->
  <h2>What is Information Gathering?</h2>

  <p>Information gathering (also called <strong>reconnaissance</strong> or <strong>OSINT</strong> — Open Source Intelligence) is the first and most important phase of any penetration test. Before you hack anything, you need to know what you're hacking. What servers exist? What software are they running? Who works there? What's exposed to the internet?</p>

  <p>The more information you gather, the more attack surface you discover. Lazy recon = missed vulnerabilities. Thorough recon = finding the door nobody else noticed.</p>

  <div class="key-point">
    <strong>Recon is not optional.</strong> Professional pentesters spend 50-70% of their time on reconnaissance. Amateurs jump straight to running exploits. The difference? Pros find critical bugs that scanners miss because they understand the target deeply.
  </div>

  <h3>Passive vs Active Reconnaissance</h3>

  <p>There are two fundamentally different approaches to information gathering, and the distinction matters legally and tactically:</p>

  <div class="analogy">
    <strong>Passive Recon</strong> is like stalking someone's social media profiles. You're looking at publicly available information — their posts, their photos, their bio. They have no idea you're looking. You never interact with them directly.<br><br>
    <strong>Active Recon</strong> is like calling their office, pretending to be IT support, or walking up to their building and checking which doors are unlocked. You're directly interacting with the target, and they <em>could</em> detect you.
  </div>

  <table class="port-table">
    <thead>
      <tr><th>Aspect</th><th>Passive Recon</th><th>Active Recon</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Interaction</strong></td><td>No direct contact with target</td><td>Directly touches target systems</td></tr>
      <tr><td><strong>Detection risk</strong></td><td>Zero — target can't know</td><td>Can trigger alerts/logs</td></tr>
      <tr><td><strong>Legal risk</strong></td><td>Minimal — public information</td><td>Requires authorization</td></tr>
      <tr><td><strong>Sources</strong></td><td>Google, WHOIS, DNS, Shodan, social media</td><td>Port scans, zone transfers, banner grabs</td></tr>
      <tr><td><strong>Depth</strong></td><td>Broad surface-level intel</td><td>Detailed technical intel</td></tr>
    </tbody>
  </table>

  <div class="warning">
    <strong>Legal warning:</strong> Passive recon is generally legal because you're looking at public info. Active recon (scanning, probing, zone transfers) against a target you don't own or have written permission to test is <strong>illegal</strong> in most jurisdictions. Always have a signed Rules of Engagement before active recon.
  </div>

  <!-- ==================== SECTION 2: Passive Recon ==================== -->
  <h2>Passive Reconnaissance Techniques</h2>

  <h3>1. Google Dorking — Hacking with a Search Engine</h3>

  <p>Google indexes billions of pages, including things that should never be public: admin panels, password files, database dumps, internal documents. Google Dorking is using advanced search operators to find these exposed assets.</p>

  <div class="hacker-note">
    Google Dorking has been responsible for more data breaches than most exploit kits. Companies accidentally expose sensitive files, and Google helpfully indexes them for anyone to find. This is legal — you're just searching Google. But accessing the files you find might not be.
  </div>

  <p>The essential Google Dork operators:</p>

  <table class="port-table">
    <thead>
      <tr><th>Operator</th><th>What it Does</th><th>Example</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">site:</td><td>Limit results to a specific domain</td><td><code>site:target.com</code></td></tr>
      <tr><td class="port-num">inurl:</td><td>Find pages with a keyword in the URL</td><td><code>inurl:admin</code></td></tr>
      <tr><td class="port-num">intitle:</td><td>Find pages with a keyword in the title</td><td><code>intitle:"index of"</code></td></tr>
      <tr><td class="port-num">filetype:</td><td>Find specific file types</td><td><code>filetype:pdf</code></td></tr>
      <tr><td class="port-num">ext:</td><td>Same as filetype (alias)</td><td><code>ext:sql</code></td></tr>
      <tr><td class="port-num">intext:</td><td>Find keyword in page body</td><td><code>intext:"password"</code></td></tr>
      <tr><td class="port-num">cache:</td><td>View Google's cached version</td><td><code>cache:target.com</code></td></tr>
      <tr><td class="port-num">-</td><td>Exclude results</td><td><code>site:target.com -www</code></td></tr>
    </tbody>
  </table>

  <p>Power combinations for pentesting:</p>

  <div class="code-block">
    <span class="code-label">Google Dorks — Pentester Essentials</span>
<span class="comment"># Find PDFs on the target (reports, internal docs, org charts)</span>
<span class="cmd">site:</span>target.com <span class="flag">filetype:pdf</span>

<span class="comment"># Find exposed admin panels</span>
<span class="cmd">site:</span>target.com <span class="flag">inurl:admin</span>

<span class="comment"># Find directory listings (misconfigured web servers)</span>
<span class="cmd">intitle:</span><span class="val">"index of"</span> <span class="cmd">site:</span>target.com

<span class="comment"># Find exposed database files / SQL dumps / logs</span>
<span class="cmd">site:</span>target.com <span class="flag">ext:sql | ext:db | ext:log</span>

<span class="comment"># Find login pages</span>
<span class="cmd">site:</span>target.com <span class="flag">inurl:login | inurl:signin | inurl:portal</span>

<span class="comment"># Find configuration files</span>
<span class="cmd">site:</span>target.com <span class="flag">ext:xml | ext:conf | ext:cnf | ext:cfg | ext:ini | ext:env</span>

<span class="comment"># Find exposed backup files</span>
<span class="cmd">site:</span>target.com <span class="flag">ext:bak | ext:old | ext:backup</span>

<span class="comment"># Find subdomains indexed by Google</span>
<span class="cmd">site:</span>*.target.com <span class="flag">-www</span>

<span class="comment"># Find pages with "password" or "username" in the content</span>
<span class="cmd">site:</span>target.com <span class="flag">intext:"password" | intext:"username"</span>
  </div>

  <div class="key-point">
    <strong>Google Hacking Database (GHDB):</strong> The Exploit Database maintains a massive list of proven Google dorks at <code>exploit-db.com/google-hacking-database</code>. These are categorized by what they find — files containing passwords, sensitive directories, vulnerable servers, etc. Bookmark it.
  </div>

  <h3>2. WHOIS Lookups</h3>

  <p>WHOIS is a protocol that reveals domain registration information: who registered it, when, which registrar they used, nameservers, and sometimes contact details (email, phone, address).</p>

  <div class="code-block">
    <span class="code-label">WHOIS Lookup</span>
<span class="cmd">whois</span> target.com

<span class="comment"># What you're looking for:</span>
<span class="comment"># - Registrant name and organization</span>
<span class="comment"># - Registrant email (for social engineering / phishing)</span>
<span class="comment"># - Nameservers (NS records — where DNS is hosted)</span>
<span class="comment"># - Registration/expiry dates</span>
<span class="comment"># - Registrar (where the domain was bought)</span>
  </div>

  <div class="hacker-note">
    Many companies use WHOIS privacy protection, hiding their real contact info. But older domains registered before privacy became common often still show real names, emails, and addresses. Also check the <strong>nameservers</strong> — they reveal what infrastructure the target uses (Cloudflare, AWS Route53, self-hosted, etc.).
  </div>

  <h3>3. DNS Enumeration (Passive)</h3>

  <p>DNS records are a treasure trove of intel. You can discover subdomains, mail servers, IP addresses, and sometimes internal hostnames — all without touching the target directly.</p>

  <div class="code-block">
    <span class="code-label">DNS Enumeration Commands</span>
<span class="comment"># Look up the A record (IP address)</span>
<span class="cmd">dig</span> target.com <span class="flag">A</span>
<span class="cmd">host</span> target.com
<span class="cmd">nslookup</span> target.com

<span class="comment"># Find mail servers</span>
<span class="cmd">dig</span> target.com <span class="flag">MX</span>

<span class="comment"># Find nameservers</span>
<span class="cmd">dig</span> target.com <span class="flag">NS</span>

<span class="comment"># Get TXT records (SPF, DKIM — reveals email services)</span>
<span class="cmd">dig</span> target.com <span class="flag">TXT</span>

<span class="comment"># Get ALL records at once</span>
<span class="cmd">dig</span> target.com <span class="flag">ANY</span>

<span class="comment"># Reverse DNS lookup — find the domain for an IP</span>
<span class="cmd">dig</span> <span class="flag">-x</span> 93.184.216.34
  </div>

  <div class="analogy">
    Think of DNS enumeration as reading the building directory in a lobby. It tells you which companies are in which offices (subdomains to IPs), where to send mail (MX records), and who manages the building (NS records). You're just reading a public directory — nobody knows you're doing it.
  </div>

  <h3>4. Email Harvesting with theHarvester</h3>

  <p><strong>theHarvester</strong> is a tool that collects emails, names, subdomains, IPs, and URLs from public sources like search engines, PGP key servers, and the Shodan database.</p>

  <div class="code-block">
    <span class="code-label">theHarvester</span>
<span class="comment"># Basic email harvest from Google</span>
<span class="cmd">theHarvester</span> <span class="flag">-d</span> target.com <span class="flag">-b</span> google

<span class="comment"># Harvest from multiple sources</span>
<span class="cmd">theHarvester</span> <span class="flag">-d</span> target.com <span class="flag">-b</span> google,bing,linkedin,dnsdumpster

<span class="comment"># Limit results</span>
<span class="cmd">theHarvester</span> <span class="flag">-d</span> target.com <span class="flag">-b</span> google <span class="flag">-l</span> 200

<span class="comment"># What you get:</span>
<span class="comment"># - Employee email addresses (j.smith@target.com)</span>
<span class="comment"># - Subdomains (dev.target.com, staging.target.com)</span>
<span class="comment"># - IP addresses associated with the domain</span>
  </div>

  <div class="hacker-note">
    Harvested email addresses are gold for two reasons: (1) You can use them for password spraying attacks against the company's login portals, and (2) the email format reveals naming conventions. If you find <code>j.smith@target.com</code>, you know the format is first-initial.lastname — and you can generate email addresses for any employee you find on LinkedIn.
  </div>

  <h3>5. Social Media Reconnaissance</h3>

  <p>Employees are the weakest link. Social media reveals:</p>

  <ul>
    <li><strong>LinkedIn:</strong> Employee names, titles, tech stack (job postings reveal what software they use), organizational structure</li>
    <li><strong>Twitter/X:</strong> Developers sometimes share screenshots with internal URLs, tool names, or server details visible</li>
    <li><strong>GitHub:</strong> Developers accidentally push API keys, credentials, internal URLs, and .env files to public repositories</li>
    <li><strong>Stack Overflow:</strong> Developers ask questions about internal systems, sometimes pasting real code or configs</li>
  </ul>

  <div class="warning">
    Check the target's GitHub organization. Search their repos for filenames like <code>.env</code>, <code>config.yml</code>, <code>credentials</code>, <code>password</code>. Use GitHub dorks: <code>org:targetcompany password</code> or <code>org:targetcompany filename:.env</code>. You would be shocked how often real credentials are sitting in public repos.
  </div>

  <h3>6. Shodan — The Search Engine for Hackers</h3>

  <p>While Google indexes websites, <strong>Shodan</strong> indexes internet-connected devices — servers, routers, webcams, industrial systems, databases. It crawls the internet scanning ports and recording what it finds.</p>

  <div class="code-block">
    <span class="code-label">Shodan Queries</span>
<span class="comment"># Find all devices for a target organization</span>
<span class="cmd">org:</span><span class="val">"Target Company"</span>

<span class="comment"># Find devices on a target's IP range</span>
<span class="cmd">net:</span><span class="val">203.0.113.0/24</span>

<span class="comment"># Find specific services on a target's domain</span>
<span class="cmd">hostname:</span><span class="val">target.com</span>

<span class="comment"># Find exposed databases</span>
<span class="cmd">product:</span><span class="val">"MySQL"</span> <span class="cmd">org:</span><span class="val">"Target Company"</span>

<span class="comment"># Find default credential pages</span>
<span class="cmd">http.title:</span><span class="val">"Dashboard"</span> <span class="cmd">hostname:</span><span class="val">target.com</span>

<span class="comment"># CLI usage</span>
<span class="cmd">shodan</span> search <span class="flag">hostname:target.com</span>
<span class="cmd">shodan</span> host <span class="flag">203.0.113.50</span>
  </div>

  <div class="analogy">
    Shodan is like driving through a city and noting every building with an unlocked door, an open window, or a sign saying "security cameras offline." Except the city is the entire internet, and Shodan has already done the driving for you.
  </div>

  <h3>7. Wayback Machine (web.archive.org)</h3>

  <p>The Wayback Machine archives snapshots of websites over time. This is incredibly useful for finding:</p>

  <ul>
    <li><strong>Old pages</strong> that have been removed but may still be accessible on the live server</li>
    <li><strong>Old JavaScript files</strong> that reference internal API endpoints</li>
    <li><strong>Robots.txt history</strong> — pages they were trying to hide from search engines</li>
    <li><strong>Old technology stacks</strong> — they may have upgraded the frontend but left the old backend running</li>
    <li><strong>Removed employee info,</strong> contact pages, and internal links</li>
  </ul>

  <div class="code-block">
    <span class="code-label">Wayback Machine Tools</span>
<span class="comment"># Use waybackurls to extract all archived URLs for a domain</span>
<span class="cmd">echo</span> target.com | <span class="cmd">waybackurls</span>

<span class="comment"># Filter for interesting file types</span>
<span class="cmd">echo</span> target.com | <span class="cmd">waybackurls</span> | <span class="cmd">grep</span> <span class="flag">-E</span> <span class="val">"\\.js$|\\.json$|\\.xml$|\\.conf$"</span>

<span class="comment"># Check old robots.txt files manually:</span>
<span class="comment"># https://web.archive.org/web/*/target.com/robots.txt</span>
  </div>

  <h3>8. Certificate Transparency Logs (crt.sh)</h3>

  <p>When a company gets an SSL/TLS certificate, it's logged in a public <strong>certificate transparency log</strong>. These logs reveal subdomains — including internal ones that aren't meant to be public.</p>

  <div class="code-block">
    <span class="code-label">Certificate Transparency — crt.sh</span>
<span class="comment"># Web interface:</span>
<span class="comment"># https://crt.sh/?q=%.target.com</span>

<span class="comment"># API query from command line</span>
<span class="cmd">curl</span> <span class="flag">-s</span> <span class="val">"https://crt.sh/?q=%.target.com&output=json"</span> | <span class="cmd">jq</span> <span class="flag">-r</span> <span class="val">'.[].name_value'</span> | <span class="cmd">sort</span> <span class="flag">-u</span>

<span class="comment"># This reveals subdomains like:</span>
<span class="comment"># mail.target.com</span>
<span class="comment"># vpn.target.com</span>
<span class="comment"># staging.target.com    &lt;-- juicy</span>
<span class="comment"># dev-api.target.com    &lt;-- very juicy</span>
<span class="comment"># internal.target.com   &lt;-- extremely juicy</span>
  </div>

  <div class="key-point">
    Certificate transparency is one of the best subdomain discovery methods. Companies often get certificates for internal subdomains (like <code>staging</code>, <code>dev</code>, <code>internal</code>) that they don't want the public to know about. But the certificate logs are public. Every. Single. One.
  </div>

  <!-- ==================== SECTION 3: Active Recon ==================== -->
  <h2>Active Reconnaissance</h2>

  <p>Active recon means you're directly interacting with the target's systems. This gives deeper, more accurate information — but it leaves traces in their logs, and it requires authorization.</p>

  <h3>1. DNS Zone Transfers (AXFR)</h3>

  <p>A DNS zone transfer is meant to replicate DNS records between authoritative servers. If a DNS server is misconfigured to allow zone transfers to anyone, you can download the <strong>entire DNS zone</strong> — every subdomain, every IP, every record.</p>

  <div class="code-block">
    <span class="code-label">DNS Zone Transfer</span>
<span class="comment"># First, find the nameservers</span>
<span class="cmd">dig</span> target.com <span class="flag">NS</span>

<span class="comment"># Attempt a zone transfer against each nameserver</span>
<span class="cmd">dig</span> <span class="flag">axfr</span> target.com <span class="flag">@ns1.target.com</span>

<span class="comment"># Using host command</span>
<span class="cmd">host</span> <span class="flag">-t axfr</span> target.com ns1.target.com

<span class="comment"># If successful, you get EVERYTHING:</span>
<span class="comment"># - All A records (subdomains and IPs)</span>
<span class="comment"># - All MX records (mail servers)</span>
<span class="comment"># - All CNAME records (aliases)</span>
<span class="comment"># - Internal hostnames like dc01.internal.target.com</span>
  </div>

  <div class="hacker-note">
    Zone transfers are rarely allowed on well-configured servers, but when they work, it's like someone handing you the blueprints to the entire building. Always try it. It takes 5 seconds and the payoff can be enormous. On the eJPT, if you see a DNS server, attempt a zone transfer.
  </div>

  <h3>2. Port Scanning (Introduction)</h3>

  <p>Port scanning is sending packets to a target's ports to determine which ones are open, closed, or filtered. This is covered in depth in the next module, but here's the key concept:</p>

  <div class="code-block">
    <span class="code-label">Basic Port Scanning</span>
<span class="comment"># Quick TCP scan of common ports</span>
<span class="cmd">nmap</span> <span class="flag">-sV</span> target.com

<span class="comment"># Scan all 65535 ports</span>
<span class="cmd">nmap</span> <span class="flag">-p-</span> target.com

<span class="comment"># Scan specific ports</span>
<span class="cmd">nmap</span> <span class="flag">-p 80,443,22,21,3306</span> target.com
  </div>

  <p>Port scanning is the bridge between recon and exploitation — it tells you exactly which services are exposed and vulnerable.</p>

  <h3>3. Banner Grabbing</h3>

  <p>Banner grabbing is connecting to an open port and reading the service's welcome message (banner). This reveals the software name and version — critical for finding known vulnerabilities.</p>

  <div class="code-block">
    <span class="code-label">Banner Grabbing Techniques</span>
<span class="comment"># Using netcat</span>
<span class="cmd">nc</span> <span class="flag">-nv</span> target.com <span class="val">80</span>
<span class="comment"># Then type: HEAD / HTTP/1.0 and press Enter twice</span>

<span class="comment"># Using curl for HTTP headers</span>
<span class="cmd">curl</span> <span class="flag">-I</span> http://target.com
<span class="comment"># Look for: Server: Apache/2.4.49 (this version has path traversal RCE!)</span>

<span class="comment"># Grab SSH banner</span>
<span class="cmd">nc</span> <span class="flag">-nv</span> target.com <span class="val">22</span>
<span class="comment"># Output: SSH-2.0-OpenSSH_7.2p2 Ubuntu</span>

<span class="comment"># Grab SMTP banner</span>
<span class="cmd">nc</span> <span class="flag">-nv</span> target.com <span class="val">25</span>
<span class="comment"># Output: 220 mail.target.com ESMTP Postfix</span>

<span class="comment"># Using nmap for automated banner grabbing</span>
<span class="cmd">nmap</span> <span class="flag">-sV --script=banner</span> target.com
  </div>

  <div class="analogy">
    Banner grabbing is like calling a business and hearing the receptionist say "Hello, you've reached Acme Corp, we're running Receptionist Software version 3.2." They just told you exactly what system they use. Now you can go search for known bugs in version 3.2.
  </div>

  <!-- ==================== SECTION 4: Google Dorking Deep Dive ==================== -->
  <h2>Google Dorking Deep Dive</h2>

  <p>Let's go deeper on Google Dorking because it's one of the highest-value, lowest-effort recon techniques. These are the dorks that consistently find gold:</p>

  <h3>Finding Exposed Files</h3>

  <div class="code-block">
    <span class="code-label">File Discovery Dorks</span>
<span class="comment"># Find PDF documents (org charts, policies, network diagrams)</span>
<span class="cmd">site:</span>target.com <span class="flag">filetype:pdf</span>

<span class="comment"># Find Excel/CSV files (sometimes contain credentials, user lists)</span>
<span class="cmd">site:</span>target.com <span class="flag">filetype:xlsx | filetype:csv</span>

<span class="comment"># Find SQL database dumps</span>
<span class="cmd">site:</span>target.com <span class="flag">ext:sql</span>

<span class="comment"># Find log files</span>
<span class="cmd">site:</span>target.com <span class="flag">ext:log</span>

<span class="comment"># Find configuration files</span>
<span class="cmd">site:</span>target.com <span class="flag">ext:conf | ext:cfg | ext:ini</span>

<span class="comment"># Find environment files (.env often has API keys and DB passwords)</span>
<span class="cmd">site:</span>target.com <span class="flag">ext:env</span>
  </div>

  <h3>Finding Vulnerable Pages</h3>

  <div class="code-block">
    <span class="code-label">Vulnerability Discovery Dorks</span>
<span class="comment"># Directory listings — misconfigured servers showing all files</span>
<span class="cmd">intitle:</span><span class="val">"index of"</span> <span class="cmd">site:</span>target.com

<span class="comment"># Admin panels</span>
<span class="cmd">site:</span>target.com <span class="flag">inurl:admin | inurl:administrator | inurl:dashboard</span>

<span class="comment"># phpMyAdmin (database management — often with weak creds)</span>
<span class="cmd">site:</span>target.com <span class="flag">inurl:phpmyadmin</span>

<span class="comment"># WordPress admin</span>
<span class="cmd">site:</span>target.com <span class="flag">inurl:wp-admin | inurl:wp-login</span>

<span class="comment"># Error messages that leak info</span>
<span class="cmd">site:</span>target.com <span class="flag">intext:"sql syntax near" | intext:"mysql_fetch"</span>

<span class="comment"># Pages with "password" in them</span>
<span class="cmd">site:</span>target.com <span class="flag">intext:"password" filetype:txt</span>
  </div>

  <div class="warning">
    <strong>Don't just copy-paste these.</strong> Adapt them to your target. Replace <code>target.com</code> with the actual domain. Combine operators. Look at each result carefully — one finding can completely change your attack strategy.
  </div>

  <!-- ==================== SECTION 5: Tools Overview ==================== -->
  <h2>Essential OSINT Tools</h2>

  <table class="port-table">
    <thead>
      <tr><th>Tool</th><th>Purpose</th><th>Key Command / URL</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong style="color: var(--accent-red);">theHarvester</strong></td>
        <td>Harvest emails, subdomains, IPs from public sources</td>
        <td><code>theHarvester -d target.com -b google</code></td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-green);">recon-ng</strong></td>
        <td>Full recon framework (modular, like Metasploit for OSINT)</td>
        <td><code>recon-ng</code> then load modules</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-purple);">Maltego</strong></td>
        <td>Visual link analysis — maps relationships between entities</td>
        <td>GUI tool — graph-based investigation</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-orange);">Shodan</strong></td>
        <td>Search engine for internet-connected devices</td>
        <td><code>shodan search hostname:target.com</code></td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-yellow);">crt.sh</strong></td>
        <td>Certificate transparency log search — find subdomains</td>
        <td><code>https://crt.sh/?q=%.target.com</code></td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-red);">Amass</strong></td>
        <td>Subdomain enumeration — the most comprehensive tool</td>
        <td><code>amass enum -d target.com</code></td>
      </tr>
    </tbody>
  </table>

  <h3>recon-ng Quick Start</h3>

  <p><strong>recon-ng</strong> is a modular reconnaissance framework. Think of it as Metasploit but for OSINT — you load modules, set targets, and run them.</p>

  <div class="code-block">
    <span class="code-label">recon-ng Basics</span>
<span class="comment"># Start recon-ng</span>
<span class="cmd">recon-ng</span>

<span class="comment"># Create a workspace for your target</span>
[recon-ng] > <span class="cmd">workspaces create</span> <span class="val">target-recon</span>

<span class="comment"># Search for modules</span>
[recon-ng] > <span class="cmd">marketplace search</span> <span class="val">domains</span>

<span class="comment"># Install a module</span>
[recon-ng] > <span class="cmd">marketplace install</span> <span class="val">recon/domains-hosts/hackertarget</span>

<span class="comment"># Load and run a module</span>
[recon-ng] > <span class="cmd">modules load</span> <span class="val">recon/domains-hosts/hackertarget</span>
[recon-ng] > <span class="cmd">options set SOURCE</span> <span class="val">target.com</span>
[recon-ng] > <span class="cmd">run</span>

<span class="comment"># View collected data</span>
[recon-ng] > <span class="cmd">show hosts</span>
  </div>

  <h3>Amass — Subdomain Enumeration Beast</h3>

  <div class="code-block">
    <span class="code-label">Amass</span>
<span class="comment"># Passive subdomain enumeration (no direct contact with target)</span>
<span class="cmd">amass enum</span> <span class="flag">-passive</span> <span class="flag">-d</span> target.com

<span class="comment"># Active enumeration (includes DNS resolution and zone transfers)</span>
<span class="cmd">amass enum</span> <span class="flag">-d</span> target.com

<span class="comment"># Output to a file</span>
<span class="cmd">amass enum</span> <span class="flag">-d</span> target.com <span class="flag">-o</span> subdomains.txt
  </div>

  <div class="key-point">
    <strong>Recon workflow summary:</strong><br>
    1. Google Dork the target for low-hanging fruit<br>
    2. WHOIS to find registrant info and nameservers<br>
    3. crt.sh for subdomain discovery via cert transparency<br>
    4. theHarvester for emails and additional subdomains<br>
    5. Amass for comprehensive subdomain enumeration<br>
    6. Shodan to check what's exposed on their IPs<br>
    7. Wayback Machine to find old/hidden pages<br>
    8. DNS zone transfer attempt (active)<br>
    9. Banner grabbing on discovered services<br>
    10. Compile everything into a target profile before attacking
  </div>

  <div class="try-it">
    <p>Practice these commands in the terminal (press <kbd>\`</kbd>):</p>
    <button class="try-cmd">whois example.com</button>
    <button class="try-cmd">dig example.com ANY</button>
    <button class="try-cmd">dig axfr @nsztm1.digi.ninja zonetransfer.me</button>
    <button class="try-cmd">theHarvester -d example.com -b google</button>
    <button class="try-cmd">curl -I http://example.com</button>
  </div>

  <!-- ==================== QUIZ SECTION ==================== -->
  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">10 questions covering OSINT and information gathering. Score 70%+ to earn full XP.</p>
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
    question: 'You\'re performing recon on a target. You search Google for "site:target.com filetype:pdf". What type of reconnaissance is this?',
    options: [
      'Active reconnaissance — you\'re querying the target directly',
      'Passive reconnaissance — you\'re using a third-party (Google) without touching the target',
      'Social engineering — you\'re manipulating Google\'s results',
      'Exploitation — you\'re accessing their files'
    ],
    correct: 1,
    explanation: 'Google Dorking is passive reconnaissance because you\'re querying Google\'s index, not the target directly. The target has no way to know you searched for their files on Google.'
  },
  {
    type: 'type-command',
    question: 'You want to attempt a DNS zone transfer on "target.com" using its nameserver "ns1.target.com". Write the dig command:',
    scenario: 'Extract all DNS records from target.com via zone transfer.',
    validAnswers: [
      'dig axfr target.com @ns1.target.com',
      'dig axfr @ns1.target.com target.com',
    ],
    hint: 'dig axfr [domain] @[nameserver]',
    explanation: 'dig axfr requests a full zone transfer (AXFR). You specify the domain and the nameserver to ask. If the server allows it, you get every DNS record for the domain.'
  },
  {
    type: 'mcq',
    question: 'Which Google Dork operator would you use to find directory listings on a target\'s web server?',
    options: [
      'site:target.com inurl:directory',
      'intitle:"index of" site:target.com',
      'filetype:dir site:target.com',
      'intext:"directory" site:target.com'
    ],
    correct: 1,
    explanation: 'Directory listings have "Index of" in the page title. The dork intitle:"index of" site:target.com finds misconfigured web servers that expose their file structure.'
  },
  {
    type: 'drag-match',
    question: 'Match each recon technique to its category (Passive or Active):',
    pairs: [
      { label: 'Google Dorking', value: 'Passive' },
      { label: 'DNS Zone Transfer', value: 'Active' },
      { label: 'WHOIS Lookup', value: 'Passive' },
      { label: 'Port Scanning', value: 'Active' },
      { label: 'Shodan Search', value: 'Passive' },
    ]
  },
  {
    type: 'mcq',
    question: 'You run "curl -I http://target.com" and see "Server: Apache/2.4.49". What technique did you just use, and why is the result significant?',
    options: [
      'DNS enumeration — it reveals the DNS server version',
      'Banner grabbing — Apache 2.4.49 has a known path traversal/RCE vulnerability',
      'Port scanning — you just scanned port 80',
      'WHOIS lookup — it reveals the web server software'
    ],
    correct: 1,
    explanation: 'curl -I grabs HTTP headers, which is a form of banner grabbing. Apache 2.4.49 is notable because it\'s vulnerable to CVE-2021-41773 (path traversal leading to RCE). Knowing the exact version is critical for finding known exploits.'
  },
  {
    type: 'type-command',
    question: 'You want to use theHarvester to find email addresses for "target.com" using Google as the source. Write the command:',
    scenario: 'Harvest email addresses associated with target.com.',
    validAnswers: [
      'theHarvester -d target.com -b google',
      'theharvester -d target.com -b google',
    ],
    hint: 'theHarvester -d [domain] -b [source]',
    explanation: 'theHarvester uses -d for domain and -b for the data source (google, bing, linkedin, etc.). This searches Google for any pages containing email addresses @target.com.'
  },
  {
    type: 'mcq',
    question: 'What does crt.sh reveal about a target domain, and why is it valuable for pentesting?',
    options: [
      'Active port scan results stored in a public database',
      'Subdomains from certificate transparency logs — reveals internal/hidden subdomains',
      'Employee names from social media profiles',
      'Historical WHOIS records showing previous owners'
    ],
    correct: 1,
    explanation: 'crt.sh searches certificate transparency logs. When companies get SSL certificates (even for internal subdomains like staging.target.com or dev.target.com), they\'re logged publicly. This reveals subdomains the company didn\'t intend to be public.'
  },
  {
    type: 'drag-match',
    question: 'Match each tool to its primary purpose:',
    pairs: [
      { label: 'theHarvester', value: 'Email & subdomain harvesting' },
      { label: 'Shodan', value: 'Internet-connected device search' },
      { label: 'Amass', value: 'Subdomain enumeration' },
      { label: 'Maltego', value: 'Visual link analysis' },
      { label: 'recon-ng', value: 'Modular recon framework' },
    ]
  },
  {
    type: 'mcq',
    question: 'Why would you check the Wayback Machine during reconnaissance?',
    options: [
      'To scan the target\'s ports without being detected',
      'To find archived pages, old endpoints, robots.txt history, and removed content',
      'To perform a DNS zone transfer through a cached server',
      'To bypass the target\'s WAF (Web Application Firewall)'
    ],
    correct: 1,
    explanation: 'The Wayback Machine archives website snapshots over time. Old pages may reveal endpoints that are still live, old robots.txt files show what they tried to hide, and removed pages may contain sensitive info or internal references.'
  },
  {
    type: 'type-command',
    question: 'You want to grab the HTTP headers from "http://target.com" to identify the web server software. Write the curl command:',
    scenario: 'Perform a banner grab on target.com\'s web server.',
    validAnswers: [
      'curl -I http://target.com',
      'curl -I target.com',
      'curl --head http://target.com',
      'curl --head target.com',
    ],
    hint: 'curl with the flag for headers only',
    explanation: 'curl -I (or --head) sends a HEAD request and displays only the response headers. The "Server" header often reveals the web server software and version, which is essential for finding known vulnerabilities.'
  },
];

// ==================== INTERACTIVES ====================
export function bindInteractives() {
  // No interactive elements in this module beyond try-it buttons
  // which are handled globally by the app
}
