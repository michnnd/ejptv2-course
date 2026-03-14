// ============================================
// Fake Terminal Simulator
// ============================================

let history = [];
let historyIndex = -1;
let currentContext = {};

const COMMANDS = {
  help: () => `<span class="t-cyan t-bold">Available Commands:</span>
<span class="t-green">  nmap</span>        Network scanner
<span class="t-green">  whois</span>       Domain lookup
<span class="t-green">  dig</span>         DNS lookup
<span class="t-green">  ping</span>        Test connectivity
<span class="t-green">  traceroute</span>  Trace packet route
<span class="t-green">  netstat</span>     Network statistics
<span class="t-green">  ifconfig</span>    Network interfaces
<span class="t-green">  curl</span>        HTTP requests
<span class="t-green">  nikto</span>       Web vulnerability scanner
<span class="t-green">  gobuster</span>    Directory brute-forcer
<span class="t-green">  hydra</span>       Login brute-forcer
<span class="t-green">  searchsploit</span> Search exploit database
<span class="t-green">  msfconsole</span>  Metasploit Framework
<span class="t-green">  smbclient</span>   SMB client
<span class="t-green">  enum4linux</span>  SMB/Samba enumerator
<span class="t-green">  hashcat</span>     Password hash cracker
<span class="t-green">  john</span>        John the Ripper
<span class="t-green">  sqlmap</span>      SQL injection tool
<span class="t-green">  wpscan</span>      WordPress scanner
<span class="t-green">  clear</span>       Clear terminal
<span class="t-green">  whoami</span>      Current user
<span class="t-green">  id</span>          User identity
<span class="t-green">  uname</span>       System information

<span class="t-dim">Type any command to see simulated output. This is a training terminal.</span>`,

  clear: () => '__CLEAR__',

  whoami: () => '<span class="t-green">root</span>',

  id: () => 'uid=<span class="t-green">0</span>(root) gid=<span class="t-green">0</span>(root) groups=<span class="t-green">0</span>(root)',

  uname: (args) => {
    if (args.includes('-a')) return 'Linux kali 6.1.0-kali9-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    return 'Linux';
  },

  ping: (args) => {
    const target = args.find(a => !a.startsWith('-')) || '10.10.10.1';
    return `PING ${target} (${target}) 56(84) bytes of data.
64 bytes from ${target}: icmp_seq=1 ttl=64 time=<span class="t-green">0.842</span> ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=<span class="t-green">0.731</span> ms
64 bytes from ${target}: icmp_seq=3 ttl=64 time=<span class="t-green">0.659</span> ms

--- ${target} ping statistics ---
3 packets transmitted, <span class="t-green">3 received</span>, 0% packet loss, time 2004ms`;
  },

  ifconfig: () => `<span class="t-bold">eth0</span>: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet <span class="t-green">192.168.1.100</span>  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe8e:7a12  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:8e:7a:12  txqueuelen 1000  (Ethernet)

<span class="t-bold">lo</span>: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet <span class="t-green">127.0.0.1</span>  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>`,

  netstat: (args) => {
    if (args.includes('-tlnp') || args.includes('-tulnp')) {
      return `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
<span class="t-green">tcp</span>        0      0 0.0.0.0:<span class="t-cyan">22</span>              0.0.0.0:*               LISTEN      854/sshd
<span class="t-green">tcp</span>        0      0 0.0.0.0:<span class="t-cyan">80</span>              0.0.0.0:*               LISTEN      1023/apache2
<span class="t-green">tcp</span>        0      0 0.0.0.0:<span class="t-cyan">443</span>             0.0.0.0:*               LISTEN      1023/apache2
<span class="t-green">tcp</span>        0      0 127.0.0.1:<span class="t-cyan">3306</span>          0.0.0.0:*               LISTEN      945/mysqld
<span class="t-yellow">udp</span>        0      0 0.0.0.0:<span class="t-cyan">68</span>              0.0.0.0:*                           632/dhclient`;
    }
    return `<span class="t-dim">usage: netstat [-tlnp] [-tulnp]</span>`;
  },

  traceroute: (args) => {
    const target = args.find(a => !a.startsWith('-')) || '8.8.8.8';
    return `traceroute to ${target}, 30 hops max, 60 byte packets
 1  <span class="t-green">192.168.1.1</span>  1.234 ms  1.112 ms  0.987 ms
 2  <span class="t-green">10.0.0.1</span>     5.432 ms  5.321 ms  5.234 ms
 3  <span class="t-green">172.16.0.1</span>  12.345 ms  12.234 ms  12.123 ms
 4  <span class="t-green">${target}</span>   15.678 ms  15.567 ms  15.456 ms`;
  },

  nmap: (args) => {
    const target = args.find(a => !a.startsWith('-')) || '10.10.10.1';
    const hasVersion = args.includes('-sV');
    const hasScript = args.includes('-sC');
    const hasOS = args.includes('-O');
    const hasAll = args.includes('-A');

    let output = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-03-13 14:32 UTC
Nmap scan report for ${target}
Host is up (<span class="t-green">0.0042s</span> latency).
Not shown: 993 closed tcp ports

PORT      STATE  SERVICE`;

    if (hasVersion || hasAll) output += `       VERSION`;
    output += `
<span class="t-green">21/tcp</span>    open   ftp`;
    if (hasVersion || hasAll) output += `           vsftpd 3.0.3`;
    output += `
<span class="t-green">22/tcp</span>    open   ssh`;
    if (hasVersion || hasAll) output += `           OpenSSH 8.9p1 Ubuntu`;
    output += `
<span class="t-green">80/tcp</span>    open   http`;
    if (hasVersion || hasAll) output += `          Apache httpd 2.4.52`;
    output += `
<span class="t-green">139/tcp</span>   open   netbios-ssn`;
    if (hasVersion || hasAll) output += `   Samba smbd 4.6.2`;
    output += `
<span class="t-green">445/tcp</span>   open   microsoft-ds`;
    if (hasVersion || hasAll) output += `  Samba smbd 4.6.2`;
    output += `
<span class="t-green">3306/tcp</span>  open   mysql`;
    if (hasVersion || hasAll) output += `         MySQL 5.7.40`;
    output += `
<span class="t-green">8080/tcp</span>  open   http-proxy`;
    if (hasVersion || hasAll) output += `    Apache Tomcat 9.0.65`;

    if (hasScript || hasAll) {
      output += `

<span class="t-cyan">Host script results:</span>
|_<span class="t-cyan">smb2-security-mode</span>: Message signing enabled but not required
|_<span class="t-cyan">smb-os-discovery</span>: Unix; Samba 4.6.2
| <span class="t-cyan">ftp-anon</span>: Anonymous FTP login allowed
|   drwxr-xr-x    2 ftp      ftp          4096 Mar 13 backup
|_  -rw-r--r--    1 ftp      ftp          1523 Mar 13 note.txt`;
    }

    if (hasOS || hasAll) {
      output += `

<span class="t-orange">OS detection:</span>
Running: Linux 5.x
OS details: Linux 5.4 - 5.15
Network Distance: 2 hops`;
    }

    output += `

Nmap done: 1 IP address (1 host up) scanned in <span class="t-green">12.34</span> seconds`;
    return output;
  },

  whois: (args) => {
    const domain = args[0] || 'example.com';
    return `Domain Name: <span class="t-green">${domain.toUpperCase()}</span>
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar: GoDaddy.com, LLC
Updated Date: 2025-08-14T07:01:44Z
Creation Date: 2003-04-12T12:23:11Z
Registrar Registration Expiration Date: 2027-04-12T12:23:11Z
Registrar Abuse Contact Email: abuse@godaddy.com

Registrant Organization: Privacy Shield Corp.
Registrant State/Province: Arizona
Registrant Country: US

Name Server: ns1.${domain}
Name Server: ns2.${domain}`;
  },

  dig: (args) => {
    const domain = args.find(a => !a.startsWith('-') && !a.startsWith('+') && !a.startsWith('@')) || 'example.com';
    const type = args.find(a => ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'ANY'].includes(a.toUpperCase()))?.toUpperCase() || 'A';

    let answer = '';
    if (type === 'A') answer = `${domain}.         300     IN      A       <span class="t-green">93.184.216.34</span>`;
    else if (type === 'MX') answer = `${domain}.         300     IN      MX      10 <span class="t-green">mail.${domain}</span>.`;
    else if (type === 'NS') answer = `${domain}.         300     IN      NS      <span class="t-green">ns1.${domain}</span>.\n${domain}.         300     IN      NS      <span class="t-green">ns2.${domain}</span>.`;
    else if (type === 'TXT') answer = `${domain}.         300     IN      TXT     <span class="t-green">"v=spf1 include:_spf.google.com ~all"</span>`;
    else answer = `${domain}.         300     IN      ${type}      <span class="t-green">93.184.216.34</span>`;

    return `; <<>> DiG 9.18.19 <<>> ${domain} ${type}
;; QUESTION SECTION:
;${domain}.                    IN      ${type}

;; ANSWER SECTION:
${answer}

;; Query time: 23 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)`;
  },

  curl: (args) => {
    const hasHead = args.includes('-I') || args.includes('--head');
    const hasVerbose = args.includes('-v');
    const url = args.find(a => !a.startsWith('-')) || 'http://10.10.10.1';

    if (hasHead) {
      return `HTTP/1.1 <span class="t-green">200 OK</span>
Date: Thu, 13 Mar 2026 14:32:00 GMT
Server: <span class="t-orange">Apache/2.4.52 (Ubuntu)</span>
X-Powered-By: <span class="t-orange">PHP/8.1.2</span>
Content-Type: text/html; charset=UTF-8
Content-Length: 10918
Set-Cookie: PHPSESSID=abc123; path=/; HttpOnly`;
    }

    return `<!DOCTYPE html>
<html>
<head><title>Welcome to Target Server</title></head>
<body>
<h1>It works!</h1>
<p>Apache/2.4.52 default page.</p>
<!-- TODO: remove debug.php before production -->
</body>
</html>`;
  },

  nikto: (args) => {
    const target = args.find(a => !a.startsWith('-')) || '10.10.10.1';
    const host = args[args.indexOf('-h') + 1] || target;
    return `- Nikto v2.5.0
---------------------------------------------------------------------------
+ Target IP:          ${host}
+ Target Hostname:    ${host}
+ Target Port:        80
+ Start Time:         2026-03-13 14:32:00
---------------------------------------------------------------------------
+ Server: <span class="t-orange">Apache/2.4.52 (Ubuntu)</span>
+ <span class="t-red">/: The X-Content-Type-Options header is not set.</span>
+ <span class="t-red">/: The X-Frame-Options header is missing.</span>
+ <span class="t-orange">Apache/2.4.52 appears to be outdated (current is 2.4.58).</span>
+ <span class="t-green">/admin/</span>: Admin directory found.
+ <span class="t-green">/phpinfo.php</span>: PHP info file found.
+ <span class="t-green">/debug.php</span>: Debug script found. Contains database credentials.
+ <span class="t-green">/backup/</span>: Backup directory with listing enabled.
+ <span class="t-green">/wp-login.php</span>: WordPress login page found.
+ <span class="t-cyan">7 items found.</span>
+ End Time: 2026-03-13 14:33:15 (75 seconds)`;
  },

  gobuster: (args) => {
    const target = args[args.indexOf('-u') + 1] || 'http://10.10.10.1';
    return `===============================================================
Gobuster v3.6
===============================================================
[+] Url:            ${target}
[+] Wordlist:       /usr/share/wordlists/dirb/common.txt
[+] Status codes:   200,204,301,302,307,401,403
===============================================================
Starting gobuster
===============================================================
<span class="t-green">/admin</span>                (Status: <span class="t-cyan">301</span>) [Size: 312]
<span class="t-green">/api</span>                  (Status: <span class="t-cyan">200</span>) [Size: 45]
<span class="t-green">/backup</span>               (Status: <span class="t-cyan">200</span>) [Size: 1205]
<span class="t-green">/config</span>               (Status: <span class="t-orange">403</span>) [Size: 278]
<span class="t-green">/css</span>                  (Status: <span class="t-cyan">301</span>) [Size: 310]
<span class="t-green">/images</span>               (Status: <span class="t-cyan">301</span>) [Size: 313]
<span class="t-green">/js</span>                   (Status: <span class="t-cyan">301</span>) [Size: 309]
<span class="t-green">/login</span>                (Status: <span class="t-cyan">200</span>) [Size: 2341]
<span class="t-green">/phpmyadmin</span>           (Status: <span class="t-cyan">301</span>) [Size: 317]
<span class="t-green">/robots.txt</span>           (Status: <span class="t-cyan">200</span>) [Size: 128]
<span class="t-green">/uploads</span>              (Status: <span class="t-orange">403</span>) [Size: 278]
===============================================================
Finished
===============================================================`;
  },

  hydra: (args) => {
    const target = args.find(a => !a.startsWith('-') && !['ssh', 'ftp', 'http-post-form', '-l', '-L', '-p', '-P'].includes(a));
    const service = args.find(a => ['ssh', 'ftp', 'http-post-form', 'rdp', 'smb', 'mysql'].includes(a)) || 'ssh';
    return `Hydra v9.5 (c) 2023 by van Hauser/THC
[DATA] max 16 tasks per 1 server, overall 16 tasks
[DATA] attacking ${service}://${target || '10.10.10.1'}:22/
<span class="t-dim">[ATTEMPT] target ${target || '10.10.10.1'} - login "admin" - pass "password" - 1 of 1000</span>
<span class="t-dim">[ATTEMPT] target ${target || '10.10.10.1'} - login "admin" - pass "admin123" - 2 of 1000</span>
<span class="t-dim">[ATTEMPT] target ${target || '10.10.10.1'} - login "admin" - pass "letmein" - 3 of 1000</span>
<span class="t-green t-bold">[22][ssh] host: ${target || '10.10.10.1'}   login: admin   password: trustno1</span>
1 of 1 target successfully completed, <span class="t-green">1 valid password found</span>`;
  },

  searchsploit: (args) => {
    const query = args.join(' ') || 'apache';
    return `---------------------------------------------- ---------------------------------
 Exploit Title                                  |  Path
---------------------------------------------- ---------------------------------
<span class="t-green">Apache 2.4.49 - Path Traversal (CVE-2021-41773)</span> | exploits/multiple/webapps/50383.sh
<span class="t-green">Apache 2.4.50 - RCE (CVE-2021-42013)</span>            | exploits/multiple/webapps/50406.sh
<span class="t-green">Apache Tomcat 9.0 - Manager App Upload (Auth)</span>  | exploits/java/webapps/31433.py
<span class="t-green">vsftpd 2.3.4 - Backdoor Command Execution</span>     | exploits/unix/remote/17491.rb
<span class="t-green">Samba 3.x-4.x - Username Map Script RCE</span>       | exploits/unix/remote/16320.rb
---------------------------------------------- ---------------------------------
<span class="t-cyan">Shellcodes: No Results</span>`;
  },

  msfconsole: () => `<span class="t-cyan">
 __  __      _                     _       _ _
|  \\/  | ___| |_ __ _ ___ _ __ | | ___ (_) |_
| |\\/| |/ _ \\ __/ _\` / __| '_ \\| |/ _ \\| | __|
| |  | |  __/ || (_| \\__ \\ |_) | | (_) | | |_
|_|  |_|\\___|\\__\\__,_|___/ .__/|_|\\___/|_|\\__|
                         |_|
</span>
       =[ <span class="t-green">metasploit v6.3.44</span>                      ]
+ -- --=[ <span class="t-green">2376</span> exploits - <span class="t-green">1232</span> auxiliary - <span class="t-green">419</span> post      ]
+ -- --=[ <span class="t-green">1388</span> payloads - <span class="t-green">46</span> encoders - <span class="t-green">11</span> nops       ]
+ -- --=[ <span class="t-green">9</span> evasion                                       ]

<span class="t-dim">Tip: Use 'search' to find modules, 'use' to select one, 'show options' to configure.</span>

<span class="t-red">msf6 ></span> <span class="t-dim">Type 'help' for available commands in MSF context</span>`,

  smbclient: (args) => {
    const target = args.find(a => a.startsWith('//')) || '//10.10.10.1/share';
    return `<span class="t-green">Sharename       Type      Comment</span>
---------       ----      -------
print$          Disk      Printer Drivers
<span class="t-green">share</span>           Disk      Public Share
<span class="t-green">admin$</span>          Disk      Admin Share (requires auth)
IPC$            IPC       IPC Service
<span class="t-dim">Reconnecting with SMB1 for workgroup listing.</span>`;
  },

  enum4linux: (args) => {
    const target = args.find(a => !a.startsWith('-')) || '10.10.10.1';
    return `<span class="t-cyan">Starting enum4linux v0.9.1</span>
==============================
|    Target: ${target}    |
==============================

<span class="t-green">[+] Server ${target} allows sessions using username '', password ''</span>

<span class="t-cyan">====================================</span>
<span class="t-cyan">|    OS Information on ${target}    |</span>
<span class="t-cyan">====================================</span>
[+] OS: <span class="t-green">Unix (Samba 4.6.2)</span>
[+] Server: WORKGROUP

<span class="t-cyan">====================================</span>
<span class="t-cyan">|    Users on ${target}             |</span>
<span class="t-cyan">====================================</span>
[+] user:<span class="t-green">admin</span> rid:1000
[+] user:<span class="t-green">www-data</span> rid:33
[+] user:<span class="t-green">backup</span> rid:34
[+] user:<span class="t-green">ftp</span> rid:21

<span class="t-cyan">====================================</span>
<span class="t-cyan">|    Shares on ${target}            |</span>
<span class="t-cyan">====================================</span>
[+] <span class="t-green">//10.10.10.1/share</span> - READ/WRITE
[+] //10.10.10.1/print$ - READ ONLY
[+] <span class="t-green">//10.10.10.1/admin$</span> - DENIED`;
  },

  hashcat: (args) => `hashcat (v6.2.6)

<span class="t-dim">Session..........: hashcat
Status...........: Running
Hash.Mode........: 0 (MD5)
Input.Base.......: File (hashes.txt)
Input.Wordlist...: /usr/share/wordlists/rockyou.txt</span>

<span class="t-green">5f4dcc3b5aa765d61d8327deb882cf99:password</span>
<span class="t-green">e10adc3949ba59abbe56e057f20f883e:123456</span>
<span class="t-green">d8578edf8458ce06fbc5bb76a58c5ca4:qwerty</span>
<span class="t-green">25d55ad283aa400af464c76d713c07ad:12345678</span>

Session..........: hashcat
Status...........: <span class="t-green">Cracked</span>
Progress.........: 14344384/14344384 (100.00%)
Recovered........: <span class="t-green">4/4 (100.00%)</span> Digests`,

  john: (args) => `Using default input encoding: UTF-8
Loaded 4 password hashes with no different salts (Raw-MD5)
Press 'q' or Ctrl-C to abort

<span class="t-green">password</span>         (user1)
<span class="t-green">admin123</span>         (admin)
<span class="t-green">trustno1</span>         (root)

3 password hashes cracked, 1 left
Session completed.`,

  sqlmap: (args) => {
    const url = args.find(a => !a.startsWith('-')) || 'http://10.10.10.1/page.php?id=1';
    return `<span class="t-cyan">[*] starting @ 14:32:00</span>

<span class="t-green">[14:32:01] [INFO] testing connection to the target URL</span>
<span class="t-green">[14:32:02] [INFO] testing if the target URL is stable</span>
<span class="t-green">[14:32:03] [INFO] target URL is stable</span>
<span class="t-green">[14:32:04] [INFO] testing 'AND boolean-based blind'</span>
<span class="t-green">[14:32:05] [INFO] GET parameter 'id' is vulnerable</span>

<span class="t-red t-bold">sqlmap identified the following injection point(s):</span>
---
Parameter: id (GET)
    Type: boolean-based blind
    Payload: id=1' AND 1=1-- -

    Type: UNION query
    Payload: id=1' UNION SELECT NULL,NULL,CONCAT(username,':',password) FROM users-- -
---
<span class="t-green">[14:32:10] [INFO] the back-end DBMS is MySQL</span>
back-end DBMS: <span class="t-green">MySQL >= 5.7</span>

Database: webapp
[3 tables]
+----------+
| <span class="t-green">users</span>    |
| <span class="t-green">sessions</span> |
| <span class="t-green">config</span>   |
+----------+`;
  },

  wpscan: (args) => {
    const url = args.find((a, i) => args[i-1] === '--url') || 'http://10.10.10.1';
    return `<span class="t-cyan">_______________________________________________________________
         __          _______   _____
         \\ \\        / /  __ \\ / ____|
          \\ \\  /\\  / /| |__) | (___   ___  __ _ _ __
           \\ \\/  \\/ / |  ___/ \\___ \\ / __|/ _\` | '_ \\
            \\  /\\  /  | |     ____) | (__| (_| | | | |
             \\/  \\/   |_|    |_____/ \\___|\\__,_|_| |_|
</span>
[+] URL: ${url}/
[+] Effective URL: ${url}/

<span class="t-green">[+] WordPress version 6.1.1 identified (Insecure, released 2022-11-15)</span>
<span class="t-green">[+] WordPress theme in use: flavor</span>

<span class="t-red">[!] Title: WordPress < 6.3.2 - Unauthenticated Blind SSRF via DNS Rebinding</span>
    Reference: https://wpscan.com/vulnerability/xxx
    Fixed in: 6.3.2

<span class="t-green">[+] Enumerating Users (via Author ID Brute Forcing)</span>
[i] User(s) Identified:
[+] <span class="t-green">admin</span>
[+] <span class="t-green">editor</span>
[+] <span class="t-green">subscriber1</span>`;
  },
};

export function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  // Welcome message
  appendOutput(`<span class="t-green t-bold">eJPTv2 Training Terminal v1.0</span>
<span class="t-dim">Type 'help' for available commands. This is a simulated environment for practice.</span>
`);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (cmd) {
        history.push(cmd);
        historyIndex = history.length;
        processCommand(cmd);
      }
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    }
  });
}

function processCommand(cmdStr) {
  const output = document.getElementById('terminal-output');
  appendOutput(`<span class="t-green">root@ejpt:~#</span> ${escapeHtml(cmdStr)}`);

  const parts = cmdStr.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (COMMANDS[cmd]) {
    const result = COMMANDS[cmd](args);
    if (result === '__CLEAR__') {
      output.innerHTML = '';
    } else {
      appendOutput(result);
    }
  } else {
    appendOutput(`<span class="t-red">Command not found: ${escapeHtml(cmd)}</span>
<span class="t-dim">Type 'help' for available commands.</span>`);
  }
}

function appendOutput(html) {
  const output = document.getElementById('terminal-output');
  if (!output) return;
  const div = document.createElement('div');
  div.innerHTML = html;
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function setTerminalContext(ctx) {
  currentContext = ctx || {};
}

export function toggleTerminal() {
  const panel = document.getElementById('terminal-panel');
  const input = document.getElementById('terminal-input');
  if (!panel) return;

  panel.classList.toggle('terminal-hidden');
  if (!panel.classList.contains('terminal-hidden')) {
    setTimeout(() => input?.focus(), 100);
  }
}
