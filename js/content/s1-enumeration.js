// ============================================
// Section 1: Enumeration
// ============================================

export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Assessment Methodologies</div>
    <h1 class="lesson-title">Enumeration</h1>
    <div class="lesson-meta">
      <span>⏱ ~50 min</span>
      <span>⚡ 120 XP</span>
      <span>📚 Core Skill</span>
    </div>
  </div>

  <div class="story-intro">
    A junior pentester ran Nmap against a corporate network. Dozens of open ports stared back. Most people would have jumped straight to exploits. Instead, she noticed port 445 — SMB — with null session access. She connected, listed shares, and found one called "IT-Backup." Inside: a spreadsheet with every domain admin credential. No exploits needed. No buffer overflows. Just enumeration. The entire Active Directory fell in under an hour because someone left a door open and she bothered to look inside.
  </div>

  <!-- ==================== SECTION 1: What is Enumeration ==================== -->
  <h2>What is Enumeration?</h2>

  <p>Scanning told you <em>which doors exist</em>. Enumeration is walking up to each door, peering through the keyhole, checking if it's unlocked, and reading the nameplate. You're extracting as much information as possible from every discovered service — usernames, shares, software versions, misconfigurations, anything that helps you get in.</p>

  <div class="analogy">
    Imagine you've mapped every room in a building (that's scanning). Enumeration is going room by room: reading the nameplates on the doors, trying each handle to see which ones are unlocked, looking through windows, and writing down everything you see. The more thorough you are here, the easier exploitation becomes later.
  </div>

  <div class="key-point">
    <strong>Enumeration is the most important phase of penetration testing.</strong> Spend 80% of your time here. Poor enumeration means missed attack vectors. Thorough enumeration often gives you the keys without needing a single exploit.
  </div>

  <p>What you're looking for during enumeration:</p>
  <ul>
    <li><strong>Usernames and email addresses</strong> — for brute force and social engineering</li>
    <li><strong>Shares and directories</strong> — for sensitive data exposure</li>
    <li><strong>Service versions</strong> — for known CVEs and exploits</li>
    <li><strong>Default or weak credentials</strong> — for quick wins</li>
    <li><strong>Misconfigurations</strong> — null sessions, anonymous access, open databases</li>
    <li><strong>Network information</strong> — hostnames, internal IPs, DNS records</li>
  </ul>

  <!-- ==================== SECTION 2: SMB Enumeration ==================== -->
  <h2>SMB Enumeration (Ports 139 &amp; 445)</h2>

  <p>SMB (Server Message Block) is the protocol Windows uses for file sharing, printer sharing, and inter-process communication. It is one of the <strong>most targeted protocols in penetration testing</strong> because it often leaks enormous amounts of information and is frequently misconfigured.</p>

  <div class="hacker-note">
    If you see port 445 open on a target, your eyes should light up. SMB has been the entry point for some of the biggest hacks in history — WannaCry, NotPetya, and countless internal network compromises. Always enumerate SMB thoroughly.
  </div>

  <table class="port-table">
    <thead>
      <tr><th>Port</th><th>Protocol</th><th>Notes</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">139</td><td>NetBIOS over TCP</td><td>Legacy SMB. Older Windows systems.</td></tr>
      <tr><td class="port-num">445</td><td>SMB Direct (TCP)</td><td>Modern SMB. Primary target.</td></tr>
    </tbody>
  </table>

  <h3>Listing Shares with smbclient</h3>
  <p>The first thing to try: list available shares on the target. If null sessions are allowed, you don't even need a password.</p>

  <div class="code-block">
    <span class="code-label">List SMB Shares</span>
<span class="comment"># List shares with null session (no password)</span>
<span class="cmd">smbclient</span> <span class="flag">-L</span> //<span class="val">10.10.10.5</span> <span class="flag">-N</span>

<span class="comment"># List shares with credentials</span>
<span class="cmd">smbclient</span> <span class="flag">-L</span> //<span class="val">10.10.10.5</span> <span class="flag">-U</span> <span class="val">admin</span>
  </div>

  <h3>Connecting to a Share</h3>
  <p>Once you find an interesting share, connect and explore it like a file system:</p>

  <div class="code-block">
    <span class="code-label">Connect to a Share</span>
<span class="comment"># Connect to a specific share</span>
<span class="cmd">smbclient</span> //<span class="val">10.10.10.5</span>/<span class="val">Backups</span> <span class="flag">-N</span>

<span class="comment"># Once connected, use these commands:</span>
smb: \\> <span class="cmd">ls</span>                  <span class="comment"># List files</span>
smb: \\> <span class="cmd">cd</span> <span class="val">directory_name</span>   <span class="comment"># Change directory</span>
smb: \\> <span class="cmd">get</span> <span class="val">filename.txt</span>    <span class="comment"># Download a file</span>
smb: \\> <span class="cmd">mget</span> <span class="val">*</span>              <span class="comment"># Download all files</span>
smb: \\> <span class="cmd">put</span> <span class="val">payload.exe</span>     <span class="comment"># Upload a file (if writable)</span>
  </div>

  <h3>Automated SMB Enumeration</h3>
  <p>Manual enumeration is important to understand, but these tools automate the entire process:</p>

  <div class="code-block">
    <span class="code-label">enum4linux — All-in-One SMB Enumerator</span>
<span class="comment"># Full automated enumeration (users, shares, OS, groups, policies)</span>
<span class="cmd">enum4linux</span> <span class="flag">-a</span> <span class="val">10.10.10.5</span>

<span class="comment"># Specific checks</span>
<span class="cmd">enum4linux</span> <span class="flag">-U</span> <span class="val">10.10.10.5</span>   <span class="comment"># Enumerate users</span>
<span class="cmd">enum4linux</span> <span class="flag">-S</span> <span class="val">10.10.10.5</span>   <span class="comment"># Enumerate shares</span>
<span class="cmd">enum4linux</span> <span class="flag">-G</span> <span class="val">10.10.10.5</span>   <span class="comment"># Enumerate groups</span>
  </div>

  <div class="code-block">
    <span class="code-label">smbmap — Permission-Aware Share Mapping</span>
<span class="comment"># Check share permissions with null session</span>
<span class="cmd">smbmap</span> <span class="flag">-H</span> <span class="val">10.10.10.5</span>

<span class="comment"># With credentials</span>
<span class="cmd">smbmap</span> <span class="flag">-H</span> <span class="val">10.10.10.5</span> <span class="flag">-u</span> <span class="val">admin</span> <span class="flag">-p</span> <span class="val">password123</span>

<span class="comment"># Recursive listing of files</span>
<span class="cmd">smbmap</span> <span class="flag">-H</span> <span class="val">10.10.10.5</span> <span class="flag">-R</span>
  </div>

  <div class="code-block">
    <span class="code-label">crackmapexec — Network-Wide SMB Enumeration</span>
<span class="comment"># Check SMB signing and OS info across a network</span>
<span class="cmd">crackmapexec</span> smb <span class="val">10.10.10.0/24</span>

<span class="comment"># Enumerate shares with creds</span>
<span class="cmd">crackmapexec</span> smb <span class="val">10.10.10.5</span> <span class="flag">-u</span> <span class="val">admin</span> <span class="flag">-p</span> <span class="val">password</span> <span class="flag">--shares</span>

<span class="comment"># Enumerate users</span>
<span class="cmd">crackmapexec</span> smb <span class="val">10.10.10.5</span> <span class="flag">-u</span> <span class="val">admin</span> <span class="flag">-p</span> <span class="val">password</span> <span class="flag">--users</span>
  </div>

  <div class="key-point">
    <strong>Null Sessions:</strong> A null session is an unauthenticated connection to SMB. If allowed, you can enumerate users, shares, groups, and policies without any credentials. Always try null sessions first — they're one of the most common misconfigurations in Windows environments.
  </div>

  <div class="warning">
    <strong>Don't skip SMB.</strong> On the eJPT exam, SMB shares frequently contain passwords, configuration files, SSH keys, and other credentials that unlock further access. Always check every share, every file.
  </div>

  <div class="try-it">
    <p>Practice these SMB enumeration commands:</p>
    <button class="try-cmd">smbclient -L //10.10.10.5 -N</button>
    <button class="try-cmd">enum4linux -a 10.10.10.5</button>
    <button class="try-cmd">smbmap -H 10.10.10.5</button>
  </div>

  <!-- ==================== SECTION 3: FTP Enumeration ==================== -->
  <h2>FTP Enumeration (Port 21)</h2>

  <p>FTP (File Transfer Protocol) is used for transferring files between machines. It is old, insecure (sends everything in plaintext), and often misconfigured. The number one thing to check: <strong>anonymous login</strong>.</p>

  <div class="hacker-note">
    FTP anonymous login is enabled by default on many servers. The username is literally "anonymous" and the password can be anything (or blank). If it works, you can browse files on the server, download sensitive data, and sometimes even upload malicious files.
  </div>

  <h3>Connecting and Checking Anonymous Access</h3>

  <div class="code-block">
    <span class="code-label">FTP Anonymous Login</span>
<span class="comment"># Connect to FTP</span>
<span class="cmd">ftp</span> <span class="val">10.10.10.5</span>

<span class="comment"># When prompted:</span>
Name: <span class="val">anonymous</span>
Password: <span class="val">(press Enter or type anything)</span>

<span class="comment"># If it works, you're in. Browse around:</span>
ftp> <span class="cmd">ls</span>              <span class="comment"># List files</span>
ftp> <span class="cmd">ls -la</span>           <span class="comment"># List with hidden files</span>
ftp> <span class="cmd">cd</span> <span class="val">directory</span>    <span class="comment"># Change directory</span>
ftp> <span class="cmd">get</span> <span class="val">file.txt</span>    <span class="comment"># Download a file</span>
ftp> <span class="cmd">binary</span>           <span class="comment"># Switch to binary mode (for non-text files)</span>
ftp> <span class="cmd">mget</span> <span class="val">*</span>           <span class="comment"># Download everything</span>
ftp> <span class="cmd">bye</span>              <span class="comment"># Disconnect</span>
  </div>

  <h3>Banner Grabbing</h3>
  <p>FTP servers announce their software and version when you connect. This tells you exactly what to search for on exploit databases:</p>

  <div class="code-block">
    <span class="code-label">FTP Banner Grabbing</span>
<span class="comment"># Nmap script for FTP enumeration</span>
<span class="cmd">nmap</span> <span class="flag">-sV</span> <span class="flag">-p 21</span> <span class="flag">--script=ftp-anon,ftp-bounce,ftp-syst</span> <span class="val">10.10.10.5</span>

<span class="comment"># Or simply use netcat</span>
<span class="cmd">nc</span> <span class="flag">-nv</span> <span class="val">10.10.10.5</span> <span class="val">21</span>

<span class="comment"># Example banner: "220 ProFTPD 1.3.5 Server"</span>
<span class="comment"># → Search: searchsploit ProFTPD 1.3.5</span>
  </div>

  <div class="key-point">
    <strong>What to look for on FTP servers:</strong> configuration files (.conf, .cfg, .ini), backup files (.bak, .old, .zip), credential files (passwords.txt, .htpasswd), SSH keys (id_rsa), and web application source code.
  </div>

  <!-- ==================== SECTION 4: SSH Enumeration ==================== -->
  <h2>SSH Enumeration (Port 22)</h2>

  <p>SSH (Secure Shell) provides encrypted remote access. It's usually well-configured, but you can still extract useful information and attempt brute force attacks.</p>

  <h3>Banner Grabbing for Version</h3>

  <div class="code-block">
    <span class="code-label">SSH Version Detection</span>
<span class="comment"># Nmap version scan</span>
<span class="cmd">nmap</span> <span class="flag">-sV</span> <span class="flag">-p 22</span> <span class="val">10.10.10.5</span>

<span class="comment"># Netcat banner grab</span>
<span class="cmd">nc</span> <span class="flag">-nv</span> <span class="val">10.10.10.5</span> <span class="val">22</span>

<span class="comment"># Example output: SSH-2.0-OpenSSH_7.2p2 Ubuntu-4ubuntu2.8</span>
<span class="comment"># This tells you: OpenSSH version AND the OS (Ubuntu)</span>
  </div>

  <div class="hacker-note">
    The SSH banner often reveals the exact OS version. "OpenSSH_7.2p2 Ubuntu-4ubuntu2.8" tells you it's Ubuntu 16.04. "OpenSSH_8.2p1 Ubuntu-4ubuntu0.5" is Ubuntu 20.04. Older versions may have known CVEs — always check.
  </div>

  <h3>Brute Force with Hydra</h3>
  <p>If you've found usernames during other enumeration, try brute forcing SSH:</p>

  <div class="code-block">
    <span class="code-label">SSH Brute Force</span>
<span class="comment"># Brute force a single user</span>
<span class="cmd">hydra</span> <span class="flag">-l</span> <span class="val">admin</span> <span class="flag">-P</span> <span class="val">/usr/share/wordlists/rockyou.txt</span> <span class="val">10.10.10.5</span> <span class="flag">ssh</span>

<span class="comment"># Brute force with a user list</span>
<span class="cmd">hydra</span> <span class="flag">-L</span> <span class="val">users.txt</span> <span class="flag">-P</span> <span class="val">/usr/share/wordlists/rockyou.txt</span> <span class="val">10.10.10.5</span> <span class="flag">ssh</span>

<span class="comment"># Limit threads to avoid lockouts</span>
<span class="cmd">hydra</span> <span class="flag">-l</span> <span class="val">admin</span> <span class="flag">-P</span> <span class="val">passwords.txt</span> <span class="flag">-t 4</span> <span class="val">10.10.10.5</span> <span class="flag">ssh</span>
  </div>

  <div class="warning">
    <strong>Brute force is noisy and slow.</strong> Only use it when you've exhausted other options. In real pentests, account lockout policies can lock you out permanently. In CTFs and exams, try common credentials first (admin:admin, root:root, root:toor) before launching a full wordlist attack.
  </div>

  <!-- ==================== SECTION 5: HTTP/HTTPS Enumeration ==================== -->
  <h2>HTTP/HTTPS Enumeration (Ports 80 &amp; 443)</h2>

  <p>Web servers are almost always present on a target. HTTP enumeration is a deep topic — entire courses are built around web application testing. Here we cover the essentials for the eJPT.</p>

  <div class="hacker-note">
    Web enumeration is where most people find their way in. Hidden directories, admin panels, default credentials, exposed config files — the web is a goldmine. Never skip this even if it looks like a basic default page.
  </div>

  <h3>Directory Brute Forcing</h3>
  <p>Discover hidden directories and files that aren't linked from the main site:</p>

  <div class="code-block">
    <span class="code-label">Directory Enumeration Tools</span>
<span class="comment"># gobuster — fast, Go-based</span>
<span class="cmd">gobuster</span> dir <span class="flag">-u</span> <span class="val">http://10.10.10.5</span> <span class="flag">-w</span> <span class="val">/usr/share/wordlists/dirb/common.txt</span>

<span class="comment"># gobuster with extensions</span>
<span class="cmd">gobuster</span> dir <span class="flag">-u</span> <span class="val">http://10.10.10.5</span> <span class="flag">-w</span> <span class="val">/usr/share/wordlists/dirb/common.txt</span> <span class="flag">-x</span> <span class="val">php,txt,html,bak</span>

<span class="comment"># dirb — classic, recursive by default</span>
<span class="cmd">dirb</span> <span class="val">http://10.10.10.5</span> <span class="val">/usr/share/wordlists/dirb/common.txt</span>

<span class="comment"># feroxbuster — fast, recursive, Rust-based</span>
<span class="cmd">feroxbuster</span> <span class="flag">-u</span> <span class="val">http://10.10.10.5</span> <span class="flag">-w</span> <span class="val">/usr/share/wordlists/dirb/common.txt</span>
  </div>

  <h3>Low-Hanging Fruit Files</h3>
  <p>Always check these manually before running a full scan:</p>

  <div class="code-block">
    <span class="code-label">Files to Check First</span>
<span class="comment"># robots.txt — tells search engines what NOT to index (juicy paths)</span>
<span class="cmd">curl</span> <span class="val">http://10.10.10.5/robots.txt</span>

<span class="comment"># sitemap.xml — full map of the site</span>
<span class="cmd">curl</span> <span class="val">http://10.10.10.5/sitemap.xml</span>

<span class="comment"># Common admin panels</span>
<span class="comment"># /admin, /administrator, /wp-admin, /phpmyadmin, /login</span>
  </div>

  <div class="analogy">
    robots.txt is like a sign on a building that says "Employees Only — Do Not Enter." To a hacker, that's basically a map of all the interesting rooms. If they don't want you to see it, it's probably worth seeing.
  </div>

  <h3>Vulnerability Scanning with Nikto</h3>

  <div class="code-block">
    <span class="code-label">Nikto Web Scanner</span>
<span class="comment"># Basic scan — checks for thousands of known issues</span>
<span class="cmd">nikto</span> <span class="flag">-h</span> <span class="val">http://10.10.10.5</span>

<span class="comment"># Scan specific port</span>
<span class="cmd">nikto</span> <span class="flag">-h</span> <span class="val">http://10.10.10.5</span> <span class="flag">-p</span> <span class="val">8080</span>

<span class="comment"># Nikto checks for: outdated software, default files,</span>
<span class="comment"># misconfigurations, dangerous HTTP methods, known vulnerabilities</span>
  </div>

  <h3>Technology Identification</h3>
  <p>Knowing what technology a website runs helps you find targeted exploits:</p>

  <div class="code-block">
    <span class="code-label">Identify Web Technologies</span>
<span class="comment"># whatweb — identifies CMS, frameworks, server software</span>
<span class="cmd">whatweb</span> <span class="val">http://10.10.10.5</span>

<span class="comment"># Aggressive mode for more detail</span>
<span class="cmd">whatweb</span> <span class="flag">-a 3</span> <span class="val">http://10.10.10.5</span>

<span class="comment"># Browser extension: Wappalyzer does the same thing visually</span>
  </div>

  <h3>Source Code Analysis</h3>

  <div class="key-point">
    <strong>Always view the page source.</strong> Right-click → View Source (or Ctrl+U). Look for:
    <ul>
      <li>HTML comments with credentials, internal paths, or developer notes</li>
      <li>Hidden form fields with sensitive values</li>
      <li>JavaScript files that reveal API endpoints</li>
      <li>Version numbers in script/link tags</li>
      <li>Internal IP addresses or hostnames leaked in the HTML</li>
    </ul>
  </div>

  <div class="try-it">
    <p>Practice these HTTP enumeration commands:</p>
    <button class="try-cmd">gobuster dir -u http://10.10.10.5 -w /usr/share/wordlists/dirb/common.txt</button>
    <button class="try-cmd">nikto -h http://10.10.10.5</button>
    <button class="try-cmd">whatweb http://10.10.10.5</button>
    <button class="try-cmd">curl http://10.10.10.5/robots.txt</button>
  </div>

  <!-- ==================== SECTION 6: DNS Enumeration ==================== -->
  <h2>DNS Enumeration (Port 53)</h2>

  <p>DNS enumeration reveals the hidden structure of a target's infrastructure — subdomains, mail servers, internal hostnames. A misconfigured DNS server can hand you the entire network map on a silver platter.</p>

  <h3>Zone Transfers (AXFR)</h3>
  <p>A zone transfer copies ALL DNS records from a server. If the server allows it to anyone (misconfiguration), you get everything:</p>

  <div class="code-block">
    <span class="code-label">DNS Zone Transfer</span>
<span class="comment"># Attempt a zone transfer</span>
<span class="cmd">dig</span> <span class="flag">axfr</span> <span class="val">target.com</span> <span class="flag">@</span><span class="val">ns1.target.com</span>

<span class="comment"># First find the nameservers</span>
<span class="cmd">dig</span> <span class="val">NS</span> <span class="val">target.com</span>

<span class="comment"># Then try zone transfer against each nameserver</span>
<span class="cmd">dig</span> <span class="flag">axfr</span> <span class="val">target.com</span> <span class="flag">@</span><span class="val">ns1.target.com</span>
<span class="cmd">dig</span> <span class="flag">axfr</span> <span class="val">target.com</span> <span class="flag">@</span><span class="val">ns2.target.com</span>
  </div>

  <div class="hacker-note">
    A successful zone transfer is like finding the blueprint of a building. You'll see every subdomain — dev.target.com, staging.target.com, vpn.target.com, internal-db.target.com — many of which are unprotected. This is a goldmine for expanding your attack surface.
  </div>

  <h3>Subdomain Brute Forcing</h3>

  <div class="code-block">
    <span class="code-label">Subdomain Enumeration</span>
<span class="comment"># dnsrecon — versatile DNS enumeration</span>
<span class="cmd">dnsrecon</span> <span class="flag">-d</span> <span class="val">target.com</span> <span class="flag">-t</span> <span class="val">axfr</span>     <span class="comment"># Try zone transfer</span>
<span class="cmd">dnsrecon</span> <span class="flag">-d</span> <span class="val">target.com</span> <span class="flag">-t</span> <span class="val">brt</span>      <span class="comment"># Brute force subdomains</span>

<span class="comment"># dnsenum — automated DNS enumeration</span>
<span class="cmd">dnsenum</span> <span class="val">target.com</span>

<span class="comment"># fierce — lightweight DNS scanner</span>
<span class="cmd">fierce</span> <span class="flag">--domain</span> <span class="val">target.com</span>
  </div>

  <!-- ==================== SECTION 7: SNMP Enumeration ==================== -->
  <h2>SNMP Enumeration (Port 161/UDP)</h2>

  <p>SNMP (Simple Network Management Protocol) is used to manage and monitor network devices. It uses <strong>community strings</strong> as passwords — and the defaults are almost never changed.</p>

  <div class="analogy">
    SNMP community strings are like skeleton keys labeled "public" and "private" that come with every network device. "public" gives read access, "private" gives read-write access. Admins are supposed to change them, but they rarely do. It's like leaving the default password on your router — except this one tells you everything about the network.
  </div>

  <table class="port-table">
    <thead>
      <tr><th>Community String</th><th>Access Level</th><th>What You Get</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">public</td><td>Read-only</td><td>System info, running processes, network interfaces, installed software</td></tr>
      <tr><td class="port-num">private</td><td>Read-write</td><td>Everything above + ability to modify device configuration</td></tr>
    </tbody>
  </table>

  <div class="code-block">
    <span class="code-label">SNMP Enumeration Commands</span>
<span class="comment"># Walk the entire SNMP tree (dump everything)</span>
<span class="cmd">snmpwalk</span> <span class="flag">-v2c</span> <span class="flag">-c</span> <span class="val">public</span> <span class="val">10.10.10.5</span>

<span class="comment"># Get specific info — system description</span>
<span class="cmd">snmpwalk</span> <span class="flag">-v2c</span> <span class="flag">-c</span> <span class="val">public</span> <span class="val">10.10.10.5</span> <span class="val">1.3.6.1.2.1.1</span>

<span class="comment"># Brute force community strings</span>
<span class="cmd">onesixtyone</span> <span class="flag">-c</span> <span class="val">/usr/share/seclists/Discovery/SNMP/common-snmp-community-strings.txt</span> <span class="val">10.10.10.5</span>

<span class="comment"># snmp-check — formatted output</span>
<span class="cmd">snmp-check</span> <span class="val">10.10.10.5</span>
  </div>

  <div class="warning">
    <strong>SNMP runs over UDP.</strong> If you only ran a TCP port scan, you won't find it. Always run a UDP scan (<code>nmap -sU</code>) against at least the common UDP ports (53, 69, 123, 161, 162, 500).
  </div>

  <div class="key-point">
    SNMP can reveal: hostnames, OS versions, network interfaces with IP addresses, running processes, installed software, open TCP connections, user accounts, and ARP tables. On Windows, SNMPv1/v2 with the "public" community string can dump user accounts and running services.
  </div>

  <!-- ==================== SECTION 8: SMTP Enumeration ==================== -->
  <h2>SMTP Enumeration (Port 25)</h2>

  <p>SMTP (Simple Mail Transfer Protocol) handles email delivery. For pentesters, it's valuable because you can use it to <strong>enumerate valid usernames</strong> on the system.</p>

  <h3>VRFY Command — User Enumeration</h3>
  <p>The VRFY command asks the server if a specific user exists:</p>

  <div class="code-block">
    <span class="code-label">SMTP User Enumeration</span>
<span class="comment"># Manual VRFY via telnet/netcat</span>
<span class="cmd">nc</span> <span class="flag">-nv</span> <span class="val">10.10.10.5</span> <span class="val">25</span>
VRFY <span class="val">admin</span>           <span class="comment"># 250 = user exists, 550 = doesn't exist</span>
VRFY <span class="val">root</span>
VRFY <span class="val">bob</span>

<span class="comment"># Automated user enumeration</span>
<span class="cmd">smtp-user-enum</span> <span class="flag">-M</span> <span class="val">VRFY</span> <span class="flag">-U</span> <span class="val">/usr/share/wordlists/names.txt</span> <span class="flag">-t</span> <span class="val">10.10.10.5</span>

<span class="comment"># Try RCPT TO method if VRFY is disabled</span>
<span class="cmd">smtp-user-enum</span> <span class="flag">-M</span> <span class="val">RCPT</span> <span class="flag">-U</span> <span class="val">users.txt</span> <span class="flag">-t</span> <span class="val">10.10.10.5</span>

<span class="comment"># Try EXPN method (expand mailing list)</span>
<span class="cmd">smtp-user-enum</span> <span class="flag">-M</span> <span class="val">EXPN</span> <span class="flag">-U</span> <span class="val">users.txt</span> <span class="flag">-t</span> <span class="val">10.10.10.5</span>
  </div>

  <div class="hacker-note">
    Valid usernames from SMTP enumeration feed directly into SSH/FTP brute force attacks. Find 5 valid usernames via SMTP VRFY, then point Hydra at SSH with those usernames and a password list. This is how services chain together during a pentest.
  </div>

  <!-- ==================== SECTION 9: NFS Enumeration ==================== -->
  <h2>NFS Enumeration (Port 2049)</h2>

  <p>NFS (Network File System) lets you mount remote directories as if they were local drives. If a share is exported to "everyone," you can mount it and access (or even modify) files without any authentication.</p>

  <div class="code-block">
    <span class="code-label">NFS Enumeration &amp; Mounting</span>
<span class="comment"># Show exported (shared) directories on the target</span>
<span class="cmd">showmount</span> <span class="flag">-e</span> <span class="val">10.10.10.5</span>

<span class="comment"># Example output:</span>
<span class="comment"># /home/backup  *          ← shared with everyone!</span>
<span class="comment"># /var/www      10.10.10.0/24  ← restricted to a subnet</span>

<span class="comment"># Mount the remote share locally</span>
<span class="cmd">mkdir</span> <span class="val">/tmp/nfs_mount</span>
<span class="cmd">mount</span> <span class="flag">-t nfs</span> <span class="val">10.10.10.5:/home/backup</span> <span class="val">/tmp/nfs_mount</span>

<span class="comment"># Browse it like a local directory</span>
<span class="cmd">ls -la</span> <span class="val">/tmp/nfs_mount</span>

<span class="comment"># When done, unmount</span>
<span class="cmd">umount</span> <span class="val">/tmp/nfs_mount</span>
  </div>

  <div class="key-point">
    <strong>NFS + SSH key theft = instant access.</strong> If an NFS share exports a user's home directory, you can read their <code>.ssh/id_rsa</code> private key, copy it to your machine, and SSH in as that user — no password needed. You might also find <code>.bash_history</code> with commands revealing credentials.
  </div>

  <div class="warning">
    <strong>Root squashing:</strong> By default, NFS maps remote root users to the "nobody" account (root squashing). If <code>no_root_squash</code> is set in the export config, you can act as root on the mounted share — write SUID binaries, modify system files, and escalate privileges.
  </div>

  <!-- ==================== SECTION 10: MySQL Enumeration ==================== -->
  <h2>MySQL Enumeration (Port 3306)</h2>

  <p>MySQL is one of the most popular databases. If it's exposed to the network (not just localhost), it's worth trying to connect — especially with default or weak credentials.</p>

  <div class="code-block">
    <span class="code-label">MySQL Enumeration</span>
<span class="comment"># Try connecting with default root (no password)</span>
<span class="cmd">mysql</span> <span class="flag">-u</span> <span class="val">root</span> <span class="flag">-h</span> <span class="val">10.10.10.5</span>

<span class="comment"># Try with a password</span>
<span class="cmd">mysql</span> <span class="flag">-u</span> <span class="val">root</span> <span class="flag">-p</span> <span class="flag">-h</span> <span class="val">10.10.10.5</span>

<span class="comment"># Once connected, enumerate everything:</span>
<span class="cmd">SHOW DATABASES;</span>
<span class="cmd">USE</span> <span class="val">database_name</span>;
<span class="cmd">SHOW TABLES;</span>
<span class="cmd">SELECT * FROM</span> <span class="val">users</span>;

<span class="comment"># Nmap MySQL scripts</span>
<span class="cmd">nmap</span> <span class="flag">-sV</span> <span class="flag">-p 3306</span> <span class="flag">--script=mysql-info,mysql-enum,mysql-empty-password</span> <span class="val">10.10.10.5</span>

<span class="comment"># Brute force with Hydra</span>
<span class="cmd">hydra</span> <span class="flag">-l</span> <span class="val">root</span> <span class="flag">-P</span> <span class="val">/usr/share/wordlists/rockyou.txt</span> <span class="val">10.10.10.5</span> <span class="flag">mysql</span>
  </div>

  <div class="hacker-note">
    Common default MySQL credentials: root with no password, root:root, root:mysql, root:password. Always try these before brute forcing. If you get in, look for user tables — web app passwords are often stored here (sometimes in plaintext or weak hashes).
  </div>

  <div class="key-point">
    <strong>MySQL to shell:</strong> If you have MySQL root access and the server runs as a privileged user, you may be able to read files from the OS (<code>LOAD_FILE('/etc/passwd')</code>), write files (<code>INTO OUTFILE</code>), or even execute system commands via User Defined Functions (UDFs). This is a common privilege escalation path.
  </div>

  <!-- ==================== SECTION: Enumeration Checklist ==================== -->
  <h2>The Enumeration Checklist</h2>

  <p>When you find an open port, follow this workflow:</p>

  <table class="port-table">
    <thead>
      <tr><th>Port</th><th>Service</th><th>First Things to Try</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">21</td><td>FTP</td><td>Anonymous login, banner grab, check for sensitive files</td></tr>
      <tr><td class="port-num">22</td><td>SSH</td><td>Banner (OS version), brute force if you have usernames</td></tr>
      <tr><td class="port-num">25</td><td>SMTP</td><td>VRFY user enumeration, check for open relay</td></tr>
      <tr><td class="port-num">53</td><td>DNS</td><td>Zone transfer (dig axfr), subdomain brute force</td></tr>
      <tr><td class="port-num">80/443</td><td>HTTP(S)</td><td>robots.txt, directory brute force, nikto, whatweb, source code</td></tr>
      <tr><td class="port-num">139/445</td><td>SMB</td><td>Null session, list shares, enum4linux, smbmap</td></tr>
      <tr><td class="port-num">161</td><td>SNMP</td><td>Community string "public", snmpwalk, onesixtyone</td></tr>
      <tr><td class="port-num">2049</td><td>NFS</td><td>showmount -e, mount shares, look for SSH keys</td></tr>
      <tr><td class="port-num">3306</td><td>MySQL</td><td>Default creds (root with no pass), enumerate databases</td></tr>
    </tbody>
  </table>

  <div class="try-it">
    <p>Key enumeration commands to practice:</p>
    <button class="try-cmd">enum4linux -a 10.10.10.5</button>
    <button class="try-cmd">showmount -e 10.10.10.5</button>
    <button class="try-cmd">snmpwalk -v2c -c public 10.10.10.5</button>
    <button class="try-cmd">dig axfr target.com @ns1.target.com</button>
  </div>

  <!-- ==================== QUIZ SECTION ==================== -->
  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">10 questions covering everything above. Score 70%+ to earn full XP.</p>
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
    question: 'You run smbclient -L //10.10.10.5 -N and get a list of shares. What does the -N flag do?',
    options: [
      'Enables verbose output',
      'Suppresses the password prompt (null session)',
      'Uses NTLM authentication',
      'Scans all NetBIOS names'
    ],
    correct: 1,
    explanation: 'The -N flag tells smbclient to not prompt for a password, attempting a null session (unauthenticated) connection. This is the first thing to try when enumerating SMB.'
  },
  {
    type: 'type-command',
    question: 'You want to list all SMB shares on target 10.10.10.5 without providing a password. Write the smbclient command:',
    scenario: 'Enumerate SMB shares with a null session.',
    validAnswers: [
      'smbclient -L //10.10.10.5 -N',
      'smbclient -N -L //10.10.10.5',
      'smbclient -L //10.10.10.5/ -N',
    ],
    hint: 'smbclient -L //target -N',
    explanation: 'smbclient -L lists shares, //target specifies the host, and -N means no password (null session). This is the bread-and-butter SMB enumeration command.'
  },
  {
    type: 'mcq',
    question: 'You connect to FTP on port 21 and try the username "anonymous" with a blank password. It works. What is this called?',
    options: [
      'A buffer overflow',
      'Anonymous FTP access',
      'FTP injection',
      'A brute force attack'
    ],
    correct: 1,
    explanation: 'Anonymous FTP access allows anyone to log in with the username "anonymous" and no real password. It\'s a common misconfiguration that can expose sensitive files.'
  },
  {
    type: 'mcq',
    question: 'What SMTP command can be used to check whether a specific username exists on the mail server?',
    options: [
      'HELO',
      'MAIL FROM',
      'VRFY',
      'DATA'
    ],
    correct: 2,
    explanation: 'The VRFY (verify) command asks the SMTP server to confirm whether a mailbox/user exists. A 250 response means the user exists, 550 means they don\'t. This is a classic user enumeration technique.'
  },
  {
    type: 'drag-match',
    question: 'Match each enumeration tool to what it enumerates:',
    pairs: [
      { label: 'enum4linux', value: 'SMB shares, users, groups' },
      { label: 'gobuster', value: 'Web directories and files' },
      { label: 'snmpwalk', value: 'SNMP data (OID tree)' },
      { label: 'showmount -e', value: 'NFS exported shares' },
      { label: 'smtp-user-enum', value: 'Valid email/system users' },
    ]
  },
  {
    type: 'mcq',
    question: 'You run "dig axfr target.com @ns1.target.com" and get a list of all DNS records. What happened?',
    options: [
      'You performed a DNS brute force attack',
      'The DNS server allowed a zone transfer to your IP',
      'You exploited a DNS buffer overflow',
      'You poisoned the DNS cache'
    ],
    correct: 1,
    explanation: 'A successful AXFR (zone transfer) means the DNS server is misconfigured to allow anyone to download all DNS records. This reveals every subdomain, hostname, and IP in the zone.'
  },
  {
    type: 'type-command',
    question: 'You want to discover hidden directories on a web server at http://10.10.10.5 using gobuster with the common.txt wordlist. Write the command:',
    scenario: 'Brute force web directories with gobuster.',
    validAnswers: [
      'gobuster dir -u http://10.10.10.5 -w /usr/share/wordlists/dirb/common.txt',
      'gobuster dir -w /usr/share/wordlists/dirb/common.txt -u http://10.10.10.5',
    ],
    hint: 'gobuster dir -u [URL] -w [wordlist]',
    explanation: 'gobuster dir mode brute forces directories and files. The -u flag sets the target URL and -w specifies the wordlist. common.txt from dirb is a good starting wordlist.'
  },
  {
    type: 'mcq',
    question: 'What is the default SNMP community string for read-only access that most admins forget to change?',
    options: [
      'admin',
      'password',
      'public',
      'default'
    ],
    correct: 2,
    explanation: '"public" is the default read-only community string for SNMPv1/v2. It\'s essentially a password, and most administrators never change it, giving attackers access to system info, running processes, and network configurations.'
  },
  {
    type: 'mcq',
    question: 'You mount an NFS share and find a user\'s .ssh directory with an id_rsa file. What can you do with it?',
    options: [
      'Nothing — you need the password too',
      'Use it to SSH into the target as that user without a password',
      'Decrypt the HTTPS traffic on the server',
      'Gain SNMP read-write access'
    ],
    correct: 1,
    explanation: 'An id_rsa file is an SSH private key. If it\'s not passphrase-protected, you can use it directly: ssh -i id_rsa user@target. This gives you shell access as that user without needing their password.'
  },
  {
    type: 'type-command',
    question: 'You want to see what directories the NFS server at 10.10.10.5 is sharing. Write the command:',
    scenario: 'List NFS exports on a remote target.',
    validAnswers: [
      'showmount -e 10.10.10.5',
      'showmount --exports 10.10.10.5',
    ],
    hint: 'showmount -e [target]',
    explanation: 'showmount -e queries the NFS server and lists all exported (shared) directories along with which hosts are allowed to mount them. A "*" means anyone can mount it.'
  },
];

// ==================== INTERACTIVES ====================
export function bindInteractives() {
  // No custom interactives for this module — try-it buttons
  // and quiz are handled by the main app framework.
}
