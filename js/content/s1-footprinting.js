// ============================================
// Section 1: Footprinting & Scanning
// THE Nmap Lesson
// ============================================

export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Assessment Methodologies</div>
    <h1 class="lesson-title">Footprinting & Scanning</h1>
    <div class="lesson-meta">
      <span>⏱ ~50 min</span>
      <span>⚡ 120 XP</span>
      <span>📚 Core Skill</span>
    </div>
  </div>

  <div class="story-intro">
    A junior pentester ran a single Nmap scan against a client's /24 network. Buried in the output was port 8443 on a machine nobody remembered deploying. It turned out to be a development server from 2019, running an unpatched Jenkins instance with default credentials. That forgotten server became the entry point that led to full domain compromise. The lesson: scanning isn't just running a tool. It's knowing what to look for, how to look for it, and what the output is telling you. This is where your keyboard meets the target for the first time.
  </div>

  <!-- ==================== SECTION 1: What is Footprinting ==================== -->
  <h2>What is Footprinting & Scanning?</h2>

  <p>In the previous phase (passive recon), you gathered intel without ever touching the target. Now the gloves come off. <strong>Footprinting and scanning</strong> is the phase where you actively send packets to the target and analyze what comes back.</p>

  <div class="analogy">
    Think of passive recon like watching a building from across the street — noting the entrances, reading the company name on the door, checking public records. Footprinting and scanning is walking up to the building and trying every door handle, checking which windows are open, and reading the nameplates next to the buzzers. You're making contact.
  </div>

  <p>This phase answers three critical questions:</p>
  <ol>
    <li><strong>What hosts are alive?</strong> — Which machines on the network are actually running?</li>
    <li><strong>What ports are open?</strong> — Which services are exposed and listening?</li>
    <li><strong>What's running on those ports?</strong> — What software, what version, what OS?</li>
  </ol>

  <div class="warning">
    Active scanning generates network traffic that can be detected. IDS/IPS systems, firewalls, and SOC analysts can see your scans. In a real pentest, you have legal authorization. In the eJPT exam, you have a lab environment. Never scan targets you don't have explicit permission to scan.
  </div>

  <!-- ==================== SECTION 2: Host Discovery ==================== -->
  <h2>Host Discovery — Finding Alive Hosts</h2>

  <p>Before you can hack a machine, you need to know it exists. Host discovery is the process of figuring out which IP addresses on a network have a live machine behind them.</p>

  <h3>Ping Sweep (ICMP-based)</h3>

  <p>The simplest approach: send an ICMP echo request (ping) to every IP in a range and see who responds.</p>

  <div class="code-block">
    <span class="code-label">Ping Sweep — Find alive hosts on a /24</span>
<span class="cmd">nmap</span> <span class="flag">-sn</span> <span class="val">10.10.10.0/24</span>

<span class="comment"># -sn = "ping scan" — no port scan, just host discovery</span>
<span class="comment"># Sends ICMP echo, TCP SYN to 443, TCP ACK to 80, ICMP timestamp</span>
<span class="comment"># Fast way to map out a network segment</span>
  </div>

  <div class="key-point">
    The <code>-sn</code> flag tells Nmap "just find alive hosts, don't scan any ports." This used to be called <code>-sP</code> (ping scan) in older Nmap versions. You'll see both in documentation, but <code>-sn</code> is the modern way.
  </div>

  <h3>ARP Scanning — The Local Network King</h3>

  <p>When you're on the same local network (LAN) as your targets, ARP scanning is the most reliable method. ARP can't be blocked by a software firewall because it operates at Layer 2.</p>

  <div class="code-block">
    <span class="code-label">ARP Scan — Only works on local networks</span>
<span class="cmd">nmap</span> <span class="flag">-PR</span> <span class="val">10.10.10.0/24</span>

<span class="comment"># -PR = ARP ping scan</span>
<span class="comment"># Sends ARP "who-has" requests on the local subnet</span>
<span class="comment"># Nmap does this automatically when scanning a local subnet</span>
  </div>

  <div class="analogy">
    ARP scanning is like being inside a room and calling out "Who's here?" Everyone in the room has to answer because ARP is a fundamental protocol for local communication — you can't ignore it without going completely offline.
  </div>

  <h3>Why ICMP Might Be Blocked</h3>

  <p>Many organizations block ICMP at their firewalls. A machine can be alive and running services, but if ICMP is blocked, a basic ping won't reach it. This is why Nmap uses multiple techniques for host discovery, not just ICMP.</p>

  <div class="hacker-note">
    If a ping sweep shows zero hosts alive on a network you know has machines, don't panic. ICMP is probably blocked. Try: <code>nmap -Pn 10.10.10.0/24</code> — the <code>-Pn</code> flag skips host discovery entirely and scans every IP whether it responds to ping or not. This is slower but catches everything.
  </div>

  <div class="code-block">
    <span class="code-label">Other Host Discovery Techniques</span>
<span class="comment"># TCP SYN discovery on specific port</span>
<span class="cmd">nmap</span> <span class="flag">-PS80,443</span> <span class="val">10.10.10.0/24</span>

<span class="comment"># TCP ACK discovery</span>
<span class="cmd">nmap</span> <span class="flag">-PA80</span> <span class="val">10.10.10.0/24</span>

<span class="comment"># UDP discovery</span>
<span class="cmd">nmap</span> <span class="flag">-PU53</span> <span class="val">10.10.10.0/24</span>

<span class="comment"># Skip discovery — treat all hosts as online</span>
<span class="cmd">nmap</span> <span class="flag">-Pn</span> <span class="val">10.10.10.0/24</span>
  </div>

  <div class="try-it">
    <p>Practice host discovery commands (in your lab):</p>
    <button class="try-cmd">nmap -sn 10.10.10.0/24</button>
    <button class="try-cmd">nmap -PR 192.168.1.0/24</button>
    <button class="try-cmd">nmap -Pn -p 80 10.10.10.0/24</button>
  </div>

  <!-- ==================== SECTION 3: Port Scanning ==================== -->
  <h2>Port Scanning with Nmap — THE Core Skill</h2>

  <p>This is it. The skill you'll use more than any other. Port scanning tells you what doors are open on a target, and Nmap is the undisputed king of port scanners. If you take one thing from this entire course: <strong>learn Nmap cold.</strong></p>

  <h3>SYN Scan (-sS) — The King of Scans</h3>

  <p>The SYN scan (also called "half-open" or "stealth" scan) is Nmap's default scan type when run as root. It's fast, reliable, and relatively stealthy.</p>

  <div class="code-block">
    <span class="code-label">SYN Scan — Default and recommended</span>
<span class="cmd">sudo nmap</span> <span class="flag">-sS</span> <span class="val">10.10.10.5</span>

<span class="comment"># Requires root/sudo (needs raw socket access)</span>
<span class="comment"># Sends SYN → gets SYN-ACK (open) or RST (closed)</span>
<span class="comment"># Never completes the TCP handshake → harder to detect</span>
  </div>

  <div class="key-point">
    <strong>How SYN scan works step by step:</strong><br>
    1. Nmap sends a <strong>SYN</strong> packet to the target port (like starting a handshake)<br>
    2. If the port is <strong>open</strong>: target responds with <strong>SYN-ACK</strong> ("I'm ready to connect"). Nmap sends RST to tear down — handshake never completes.<br>
    3. If the port is <strong>closed</strong>: target responds with <strong>RST</strong> ("Nothing here, go away").<br>
    4. If the port is <strong>filtered</strong>: no response at all (firewall silently drops the packet).<br><br>
    Because the three-way handshake is never completed, the connection is never fully established, so many older logging mechanisms don't record it. That's why it's called "stealth" — though modern IDS/IPS will still catch it.
  </div>

  <h3>Connect Scan (-sT) — Full TCP Handshake</h3>

  <p>When you don't have root privileges, Nmap falls back to a connect scan. It completes the full TCP three-way handshake for every port.</p>

  <div class="code-block">
    <span class="code-label">Connect Scan — No root needed but noisy</span>
<span class="cmd">nmap</span> <span class="flag">-sT</span> <span class="val">10.10.10.5</span>

<span class="comment"># Uses the OS connect() call — full TCP handshake</span>
<span class="comment"># Slower than SYN scan</span>
<span class="comment"># Gets LOGGED by the target (connection is fully established)</span>
<span class="comment"># Use when you can't run as root</span>
  </div>

  <div class="warning">
    Connect scans leave traces in the target's logs because a full TCP connection is made and then immediately closed. If stealth matters, avoid <code>-sT</code> and use <code>-sS</code> with sudo instead.
  </div>

  <h3>UDP Scan (-sU) — The Hidden Goldmine</h3>

  <p>Most people skip UDP scanning because it's slow. That's exactly why defenders leave UDP services unprotected. SNMP, TFTP, DNS, NTP — all run on UDP, and all are frequently misconfigured.</p>

  <div class="code-block">
    <span class="code-label">UDP Scan — Slow but finds hidden services</span>
<span class="cmd">sudo nmap</span> <span class="flag">-sU</span> <span class="val">10.10.10.5</span>

<span class="comment"># Very slow — no handshake means Nmap must wait for timeouts</span>
<span class="comment"># Open port: no response (or protocol-specific response)</span>
<span class="comment"># Closed port: ICMP "port unreachable"</span>
<span class="comment"># Pro tip: combine with -sS to scan both TCP and UDP</span>
<span class="cmd">sudo nmap</span> <span class="flag">-sS -sU</span> <span class="val">10.10.10.5</span>
  </div>

  <div class="hacker-note">
    In the eJPT exam, don't skip UDP. If you're stuck and can't find an entry point on TCP, run <code>sudo nmap -sU --top-ports 20 &lt;target&gt;</code> to quickly check the most common UDP ports. SNMP on port 161 with a default "public" community string is a classic exam finding.
  </div>

  <h3>FIN, Xmas & Null Scans — Firewall Bypass Tricks</h3>

  <p>These scan types exploit a quirk in the TCP RFC: if a closed port receives a packet without the SYN, RST, or ACK flags set, it must respond with RST. An open port should silently drop the packet. Some basic firewalls only filter SYN packets, so these scans can slip through.</p>

  <div class="code-block">
    <span class="code-label">Stealth Scans — Bypass simple packet filters</span>
<span class="comment"># FIN scan — sends a packet with only FIN flag</span>
<span class="cmd">sudo nmap</span> <span class="flag">-sF</span> <span class="val">10.10.10.5</span>

<span class="comment"># Xmas scan — FIN + PSH + URG flags ("lit up like a Christmas tree")</span>
<span class="cmd">sudo nmap</span> <span class="flag">-sX</span> <span class="val">10.10.10.5</span>

<span class="comment"># Null scan — no flags set at all</span>
<span class="cmd">sudo nmap</span> <span class="flag">-sN</span> <span class="val">10.10.10.5</span>
  </div>

  <div class="analogy">
    Imagine a nightclub bouncer (firewall) is told "stop anyone who walks in the front door" (SYN packets). A FIN/Xmas/Null scan is like climbing through a side window — same building, different entrance. It doesn't always work, but if the bouncer only watches the front door, you're in.
  </div>

  <h3>Understanding Port States</h3>

  <p>Nmap doesn't just say "open" or "closed." There are six possible port states, and understanding them is critical for the exam:</p>

  <table class="port-table">
    <thead>
      <tr><th>State</th><th>What it Means</th><th>What You See</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong style="color: #0f0;">open</strong></td>
        <td>A service is actively listening and accepting connections</td>
        <td>SYN-ACK response (TCP) or response from service (UDP)</td>
      </tr>
      <tr>
        <td><strong style="color: #f33;">closed</strong></td>
        <td>No service is listening, but the port is reachable (no firewall)</td>
        <td>RST response (TCP) or ICMP port unreachable (UDP)</td>
      </tr>
      <tr>
        <td><strong style="color: #fa0;">filtered</strong></td>
        <td>A firewall is blocking the port — Nmap can't tell if it's open or closed</td>
        <td>No response at all, or ICMP unreachable with certain error codes</td>
      </tr>
      <tr>
        <td><strong style="color: #fa0;">unfiltered</strong></td>
        <td>The port is reachable but Nmap can't tell if it's open or closed</td>
        <td>Only from ACK scans — ACK gets through but can't determine state</td>
      </tr>
      <tr>
        <td><strong style="color: #fa0;">open|filtered</strong></td>
        <td>Nmap can't determine whether the port is open or filtered</td>
        <td>Common with UDP scans — no response could mean either state</td>
      </tr>
      <tr>
        <td><strong style="color: #fa0;">closed|filtered</strong></td>
        <td>Nmap can't determine whether the port is closed or filtered</td>
        <td>Rare — only with IP ID idle scans</td>
      </tr>
    </tbody>
  </table>

  <div class="key-point">
    For the eJPT, focus on three states: <strong>open</strong> (service is there, go attack it), <strong>closed</strong> (nothing to do), and <strong>filtered</strong> (firewall is in the way — try a different scan type or port). If you see <strong>open|filtered</strong> on a UDP port, it usually means the port is probably open but Nmap can't confirm it.
  </div>

  <!-- ==================== SECTION 4: Nmap Options Deep Dive ==================== -->
  <h2>Nmap Options Deep Dive</h2>

  <p>Knowing which scan type to use is only half the battle. The real power is in Nmap's options. Here's every flag you need for the eJPT.</p>

  <h3>Port Selection</h3>

  <div class="code-block">
    <span class="code-label">Controlling Which Ports to Scan</span>
<span class="comment"># Scan a single port</span>
<span class="cmd">nmap</span> <span class="flag">-p 80</span> <span class="val">10.10.10.5</span>

<span class="comment"># Scan multiple specific ports</span>
<span class="cmd">nmap</span> <span class="flag">-p 80,443,8080</span> <span class="val">10.10.10.5</span>

<span class="comment"># Scan a range of ports</span>
<span class="cmd">nmap</span> <span class="flag">-p 1-1000</span> <span class="val">10.10.10.5</span>

<span class="comment"># Scan ALL 65535 ports (takes time but thorough)</span>
<span class="cmd">nmap</span> <span class="flag">-p-</span> <span class="val">10.10.10.5</span>

<span class="comment"># Scan the top N most common ports</span>
<span class="cmd">nmap</span> <span class="flag">--top-ports 100</span> <span class="val">10.10.10.5</span>

<span class="comment"># Scan top 1000 ports (Nmap's default behavior)</span>
<span class="cmd">nmap</span> <span class="val">10.10.10.5</span>
  </div>

  <div class="hacker-note">
    Nmap's default only scans the top 1000 ports. That misses ~64,535 ports. If you're doing a thorough assessment or stuck in the eJPT exam, always run <code>-p-</code> at least once. Services love to hide on high ports like 8443, 9090, 27017, or 50000.
  </div>

  <h3>Service Version Detection (-sV)</h3>

  <p>Knowing a port is open isn't enough. You need to know what software is running and what version. This is how you find exploitable vulnerabilities.</p>

  <div class="code-block">
    <span class="code-label">Service/Version Detection</span>
<span class="cmd">nmap</span> <span class="flag">-sV</span> <span class="val">10.10.10.5</span>

<span class="comment"># Probes open ports to determine service name and version</span>
<span class="comment"># Example output:</span>
<span class="comment"># 22/tcp   open  ssh     OpenSSH 7.6p1 Ubuntu</span>
<span class="comment"># 80/tcp   open  http    Apache httpd 2.4.29</span>
<span class="comment"># 3306/tcp open  mysql   MySQL 5.7.31</span>

<span class="comment"># Increase version detection intensity (0-9, default 7)</span>
<span class="cmd">nmap</span> <span class="flag">-sV --version-intensity 9</span> <span class="val">10.10.10.5</span>
  </div>

  <div class="key-point">
    Always run <code>-sV</code>. The version number is how you find exploits. "Apache 2.4.29" tells you exactly what CVEs to search for. "http" alone tells you nothing useful. On the eJPT exam, version detection is mandatory for every scan.
  </div>

  <h3>OS Detection (-O)</h3>

  <div class="code-block">
    <span class="code-label">Operating System Detection</span>
<span class="cmd">sudo nmap</span> <span class="flag">-O</span> <span class="val">10.10.10.5</span>

<span class="comment"># Requires root — analyzes TCP/IP stack fingerprinting</span>
<span class="comment"># Looks at TTL values, TCP window sizes, DF bit, etc.</span>
<span class="comment"># Output example: "OS details: Linux 4.15 - 5.6"</span>
  </div>

  <h3>Script Scanning (-sC)</h3>

  <p>Nmap comes with hundreds of built-in scripts (the Nmap Scripting Engine). The <code>-sC</code> flag runs a set of safe "default" scripts — things like grabbing HTTP titles, checking for anonymous FTP, pulling SSH host keys, and more.</p>

  <div class="code-block">
    <span class="code-label">Default Script Scan</span>
<span class="cmd">nmap</span> <span class="flag">-sC</span> <span class="val">10.10.10.5</span>

<span class="comment"># Runs all scripts in the "default" category</span>
<span class="comment"># Safe to use — won't crash anything</span>
<span class="comment"># Equivalent to: --script=default</span>
  </div>

  <h3>Aggressive Scan (-A) — The All-In-One</h3>

  <div class="code-block">
    <span class="code-label">Aggressive Scan — Combines the big four</span>
<span class="cmd">sudo nmap</span> <span class="flag">-A</span> <span class="val">10.10.10.5</span>

<span class="comment"># -A = -sV + -O + -sC + --traceroute</span>
<span class="comment"># Service versions + OS detection + default scripts + route tracing</span>
<span class="comment"># Use for thorough scanning when stealth isn't a concern</span>
  </div>

  <div class="hacker-note">
    <code>-A</code> is your go-to flag in the eJPT exam. The lab environment doesn't care about stealth, so hit it with everything. A typical exam command: <code>sudo nmap -A -p- -T4 &lt;target&gt;</code>
  </div>

  <h3>Timing Templates (-T0 to -T5)</h3>

  <p>Nmap's timing controls how fast it sends packets. Faster = louder. Slower = stealthier but takes forever.</p>

  <table class="port-table">
    <thead>
      <tr><th>Flag</th><th>Name</th><th>Speed</th><th>When to Use</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">-T0</td><td>Paranoid</td><td>5 min between probes</td><td>Extreme stealth / IDS evasion</td></tr>
      <tr><td class="port-num">-T1</td><td>Sneaky</td><td>15 sec between probes</td><td>Slow IDS evasion</td></tr>
      <tr><td class="port-num">-T2</td><td>Polite</td><td>0.4 sec between probes</td><td>Reduce network load</td></tr>
      <tr><td class="port-num">-T3</td><td>Normal</td><td>Default timing</td><td>Standard scans</td></tr>
      <tr><td class="port-num">-T4</td><td>Aggressive</td><td>Fast with smart timeouts</td><td>Reliable fast networks (labs, exams)</td></tr>
      <tr><td class="port-num">-T5</td><td>Insane</td><td>Max speed, may drop results</td><td>When you need results NOW (unreliable)</td></tr>
    </tbody>
  </table>

  <div class="key-point">
    For the eJPT exam, use <code>-T4</code>. It's fast enough to save time but reliable enough not to miss open ports. <code>-T5</code> can actually miss ports on congested networks because it times out too quickly.
  </div>

  <h3>Output Formats</h3>

  <p>Always save your scan results. You'll need to reference them later, and re-running scans wastes precious exam time.</p>

  <div class="code-block">
    <span class="code-label">Saving Nmap Output</span>
<span class="comment"># Normal output (human-readable)</span>
<span class="cmd">nmap</span> <span class="val">10.10.10.5</span> <span class="flag">-oN scan.txt</span>

<span class="comment"># XML output (for tools like searchsploit)</span>
<span class="cmd">nmap</span> <span class="val">10.10.10.5</span> <span class="flag">-oX scan.xml</span>

<span class="comment"># Greppable output (easy to parse with grep/awk)</span>
<span class="cmd">nmap</span> <span class="val">10.10.10.5</span> <span class="flag">-oG scan.gnmap</span>

<span class="comment"># ALL formats at once (best practice)</span>
<span class="cmd">nmap</span> <span class="val">10.10.10.5</span> <span class="flag">-oA scan</span>
<span class="comment"># Creates: scan.nmap, scan.xml, scan.gnmap</span>
  </div>

  <div class="hacker-note">
    Always use <code>-oA</code> so you have every format. The greppable format is fantastic for quickly pulling specific info: <code>grep "open" scan.gnmap</code> shows you all open ports across all hosts at a glance.
  </div>

  <h3>Verbosity</h3>

  <div class="code-block">
    <span class="code-label">See What Nmap is Doing</span>
<span class="comment"># Verbose — shows open ports as they're found</span>
<span class="cmd">nmap</span> <span class="flag">-v</span> <span class="val">10.10.10.5</span>

<span class="comment"># Very verbose — even more detail</span>
<span class="cmd">nmap</span> <span class="flag">-vv</span> <span class="val">10.10.10.5</span>

<span class="comment"># Pro tip: press 'v' during a running scan to increase verbosity</span>
<span class="comment"># Press 'd' for debug output, or any key for a status update</span>
  </div>

  <div class="try-it">
    <p>Build your muscle memory with these essential scan commands:</p>
    <button class="try-cmd">sudo nmap -sS -sV -sC -T4 -p- 10.10.10.5</button>
    <button class="try-cmd">sudo nmap -A -T4 10.10.10.5 -oA full_scan</button>
    <button class="try-cmd">sudo nmap -sU --top-ports 20 10.10.10.5</button>
    <button class="try-cmd">nmap -sV -p 80,443,8080,8443 10.10.10.5</button>
  </div>

  <!-- ==================== SECTION 5: NSE ==================== -->
  <h2>Nmap Scripting Engine (NSE)</h2>

  <p>NSE is what turns Nmap from a port scanner into a full-blown vulnerability assessment tool. It has over 600 scripts that can detect vulnerabilities, brute force credentials, enumerate users, and more.</p>

  <h3>NSE Script Categories</h3>

  <table class="port-table">
    <thead>
      <tr><th>Category</th><th>What it Does</th><th>Example Use</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong style="color: var(--accent-green);">default</strong></td>
        <td>Safe, useful scripts (run with -sC)</td>
        <td>Grab banners, HTTP titles, SSH host keys</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-green);">discovery</strong></td>
        <td>Actively discover more information</td>
        <td>SNMP enumeration, broadcast discovery</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-orange);">vuln</strong></td>
        <td>Check for known vulnerabilities</td>
        <td>EternalBlue, Heartbleed, Shellshock</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-red);">exploit</strong></td>
        <td>Actively exploit vulnerabilities</td>
        <td>Use with caution — can damage systems</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-yellow);">auth</strong></td>
        <td>Authentication-related checks</td>
        <td>Anonymous FTP, default credentials</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-yellow);">broadcast</strong></td>
        <td>Discover hosts via broadcast</td>
        <td>Find devices on the local network</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-yellow);">brute</strong></td>
        <td>Brute-force credentials</td>
        <td>SSH, FTP, HTTP login brute force</td>
      </tr>
    </tbody>
  </table>

  <h3>Using NSE Scripts</h3>

  <div class="code-block">
    <span class="code-label">NSE Script Usage</span>
<span class="comment"># Run all vuln scripts against a target</span>
<span class="cmd">nmap</span> <span class="flag">--script=vuln</span> <span class="val">10.10.10.5</span>

<span class="comment"># Run a specific script</span>
<span class="cmd">nmap</span> <span class="flag">--script=smb-os-discovery</span> <span class="val">10.10.10.5</span>

<span class="comment"># Run multiple specific scripts</span>
<span class="cmd">nmap</span> <span class="flag">--script=http-enum,http-headers</span> <span class="val">10.10.10.5</span>

<span class="comment"># Run all scripts in a category</span>
<span class="cmd">nmap</span> <span class="flag">--script=discovery</span> <span class="val">10.10.10.5</span>

<span class="comment"># Pass arguments to a script</span>
<span class="cmd">nmap</span> <span class="flag">--script=http-brute --script-args userdb=users.txt,passdb=pass.txt</span> <span class="val">10.10.10.5</span>
  </div>

  <h3>Must-Know NSE Scripts for eJPT</h3>

  <div class="code-block">
    <span class="code-label">High-Value Scripts</span>
<span class="comment"># Check for SMB vulnerabilities (EternalBlue, etc.)</span>
<span class="cmd">nmap</span> <span class="flag">--script=smb-vuln*</span> <span class="flag">-p 445</span> <span class="val">10.10.10.5</span>

<span class="comment"># Discover SMB shares</span>
<span class="cmd">nmap</span> <span class="flag">--script=smb-enum-shares</span> <span class="flag">-p 445</span> <span class="val">10.10.10.5</span>

<span class="comment"># Get OS info via SMB</span>
<span class="cmd">nmap</span> <span class="flag">--script=smb-os-discovery</span> <span class="flag">-p 445</span> <span class="val">10.10.10.5</span>

<span class="comment"># Enumerate web directories and files</span>
<span class="cmd">nmap</span> <span class="flag">--script=http-enum</span> <span class="flag">-p 80</span> <span class="val">10.10.10.5</span>

<span class="comment"># Check for anonymous FTP</span>
<span class="cmd">nmap</span> <span class="flag">--script=ftp-anon</span> <span class="flag">-p 21</span> <span class="val">10.10.10.5</span>

<span class="comment"># Enumerate SNMP info (great for UDP)</span>
<span class="cmd">nmap</span> <span class="flag">-sU --script=snmp-info</span> <span class="flag">-p 161</span> <span class="val">10.10.10.5</span>
  </div>

  <h3>Finding Scripts on Your System</h3>

  <div class="code-block">
    <span class="code-label">Browse Nmap Scripts</span>
<span class="comment"># All scripts live here</span>
<span class="cmd">ls</span> <span class="val">/usr/share/nmap/scripts/</span>

<span class="comment"># Search for SMB-related scripts</span>
<span class="cmd">ls</span> <span class="val">/usr/share/nmap/scripts/</span> <span class="comment">| grep smb</span>

<span class="comment"># Search for HTTP-related scripts</span>
<span class="cmd">ls</span> <span class="val">/usr/share/nmap/scripts/</span> <span class="comment">| grep http</span>

<span class="comment"># Read a script's help</span>
<span class="cmd">nmap</span> <span class="flag">--script-help=http-enum</span>
  </div>

  <div class="hacker-note">
    Before running random scripts, read what they do with <code>--script-help</code>. Some scripts in the "exploit" category can actually crash services. In a real engagement, crashing a production server is a very bad day. In the eJPT lab, go wild.
  </div>

  <!-- ==================== SECTION 6: Reading Output ==================== -->
  <h2>Reading Nmap Output — What It's Telling You</h2>

  <p>Raw Nmap output is packed with information. Knowing how to read it quickly is the difference between a 2-hour assessment and a 10-hour one.</p>

  <div class="code-block">
    <span class="code-label">Typical Nmap Output Breakdown</span>
<span class="comment"># Command: sudo nmap -A -T4 10.10.10.5</span>

Starting Nmap 7.94 ( https://nmap.org ) at 2025-01-15 09:12 UTC
Nmap scan report for <span class="val">10.10.10.5</span>
Host is up (0.032s latency).
Not shown: 996 closed tcp ports (reset)

PORT     STATE  SERVICE  VERSION
<span class="val">22/tcp</span>   <span class="cmd">open</span>   ssh      <span class="flag">OpenSSH 7.6p1 Ubuntu 4ubuntu0.3</span>
| ssh-hostkey:
|   2048 a1:b2:c3... (RSA)
<span class="val">80/tcp</span>   <span class="cmd">open</span>   http     <span class="flag">Apache httpd 2.4.29 ((Ubuntu))</span>
|_http-title: Apache2 Ubuntu Default Page
|_http-server-header: Apache/2.4.29 (Ubuntu)
<span class="val">445/tcp</span>  <span class="cmd">open</span>   smb      <span class="flag">Samba smbd 4.7.6-Ubuntu</span>
| smb-os-discovery:
|   OS: Windows 6.1 (Samba 4.7.6-Ubuntu)
|   Workgroup: WORKGROUP
<span class="val">3306/tcp</span> <span class="cmd">open</span>   mysql    <span class="flag">MySQL 5.7.31-0ubuntu0.18.04.1</span>

OS: Linux 4.15 - 5.6
Network Distance: 2 hops
  </div>

  <div class="key-point">
    <strong>What to look for immediately:</strong><br>
    1. <strong>Open ports</strong> — each one is a potential attack vector<br>
    2. <strong>Service versions</strong> — search these in <code>searchsploit</code> or Google for known exploits<br>
    3. <strong>Script output</strong> — default scripts often reveal critical info (anonymous access, default pages, OS details)<br>
    4. <strong>OS detection</strong> — tells you if it's Linux or Windows, which determines your exploit choice<br>
    5. <strong>"Not shown: 996 closed ports"</strong> — confirms scanning worked and the host is alive
  </div>

  <div class="try-it">
    <p>Practice reading scan output — run these and study every line:</p>
    <button class="try-cmd">sudo nmap -A -T4 10.10.10.5 -oA initial_scan</button>
    <button class="try-cmd">nmap --script=vuln -p 80,445 10.10.10.5</button>
    <button class="try-cmd">ls /usr/share/nmap/scripts/ | grep smb</button>
  </div>

  <!-- ==================== SECTION 7: Other Scanning Tools ==================== -->
  <h2>Other Scanning Tools</h2>

  <p>Nmap is king, but it's not the only option. Here are other tools you should know about:</p>

  <h3>Masscan — When Speed is Everything</h3>

  <div class="code-block">
    <span class="code-label">Masscan — Scan the entire internet in 6 minutes</span>
<span class="comment"># Masscan is insanely fast but less accurate than Nmap</span>
<span class="cmd">masscan</span> <span class="val">10.10.10.0/24</span> <span class="flag">-p 1-65535 --rate 1000</span>

<span class="comment"># Common workflow: use masscan to find open ports fast,</span>
<span class="comment"># then use nmap for detailed version scanning on those ports</span>
<span class="cmd">masscan</span> <span class="val">10.10.10.0/24</span> <span class="flag">-p 1-65535 --rate 1000 -oL ports.txt</span>
<span class="comment"># Then: nmap -sV -p <discovered ports> 10.10.10.x</span>
  </div>

  <h3>Rustscan — Nmap's Fast Friend</h3>

  <div class="code-block">
    <span class="code-label">Rustscan — Fast port discovery + Nmap integration</span>
<span class="comment"># Scans all 65535 ports in seconds, then pipes to Nmap</span>
<span class="cmd">rustscan</span> <span class="flag">-a</span> <span class="val">10.10.10.5</span> <span class="flag">-- -A</span>

<span class="comment"># The -- separates rustscan flags from nmap flags</span>
<span class="comment"># Everything after -- gets passed to nmap for the found ports</span>
  </div>

  <h3>Zenmap — Nmap with a GUI</h3>

  <p>Zenmap is the official Nmap GUI. It's useful for visualizing network topology and saving scan profiles. Good for beginners to build scan commands visually, but in the exam and real life, you'll use the CLI.</p>

  <div class="hacker-note">
    The pro workflow is: <strong>Rustscan</strong> (or masscan) for fast port discovery, then <strong>Nmap</strong> with <code>-sV -sC</code> on the discovered ports for detailed enumeration. This gives you speed AND accuracy. But for the eJPT exam, straight Nmap with <code>-A -T4 -p-</code> is perfectly fine.
  </div>

  <!-- ==================== SECTION 8: Putting It All Together ==================== -->
  <h2>The Scanning Methodology — Putting It All Together</h2>

  <p>Here's the battle-tested scanning workflow you should follow on every engagement and in the eJPT exam:</p>

  <div class="code-block">
    <span class="code-label">Step-by-Step Scanning Methodology</span>
<span class="comment"># STEP 1: Host Discovery — Find alive hosts</span>
<span class="cmd">nmap</span> <span class="flag">-sn</span> <span class="val">10.10.10.0/24</span> <span class="flag">-oA hosts</span>

<span class="comment"># STEP 2: Quick port scan on discovered hosts</span>
<span class="cmd">nmap</span> <span class="flag">-T4</span> <span class="val">10.10.10.5</span> <span class="flag">-oA quick</span>

<span class="comment"># STEP 3: Full port scan (all 65535 ports)</span>
<span class="cmd">nmap</span> <span class="flag">-p- -T4</span> <span class="val">10.10.10.5</span> <span class="flag">-oA allports</span>

<span class="comment"># STEP 4: Detailed scan on discovered open ports</span>
<span class="cmd">sudo nmap</span> <span class="flag">-sV -sC -O -p 22,80,445,3306</span> <span class="val">10.10.10.5</span> <span class="flag">-oA detailed</span>

<span class="comment"># STEP 5: UDP scan on common ports</span>
<span class="cmd">sudo nmap</span> <span class="flag">-sU --top-ports 20</span> <span class="val">10.10.10.5</span> <span class="flag">-oA udp</span>

<span class="comment"># STEP 6: Vulnerability scripts if needed</span>
<span class="cmd">nmap</span> <span class="flag">--script=vuln -p 22,80,445,3306</span> <span class="val">10.10.10.5</span> <span class="flag">-oA vulns</span>
  </div>

  <div class="key-point">
    <strong>Save everything with <code>-oA</code>.</strong> You never want to re-scan because you forgot to save the output. Name your files descriptively — <code>hosts</code>, <code>quick</code>, <code>allports</code>, <code>detailed</code>, <code>udp</code>, <code>vulns</code>. When you're writing your report or answering exam questions, you'll thank yourself.
  </div>

  <!-- ==================== QUIZ SECTION ==================== -->
  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">12 questions covering Nmap, scanning techniques, and footprinting. Score 70%+ to earn full XP.</p>
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
    question: 'You run nmap -sn 10.10.10.0/24 and get zero hosts up, but you know machines are on this network. What is most likely happening?',
    options: [
      'Nmap is broken and needs to be reinstalled',
      'The network uses IPv6 exclusively',
      'ICMP is blocked by a firewall — hosts are alive but not responding to ping',
      'All ports on the network are closed'
    ],
    correct: 2,
    explanation: 'Many firewalls block ICMP (ping). The hosts are alive but not responding to ping probes. Use -Pn to skip host discovery and scan anyway.'
  },
  {
    type: 'mcq',
    question: 'What makes a SYN scan (-sS) "stealthy" compared to a connect scan (-sT)?',
    options: [
      'SYN scan encrypts the packets',
      'SYN scan never completes the TCP 3-way handshake, so the connection is never fully established',
      'SYN scan uses UDP instead of TCP',
      'SYN scan only works on localhost'
    ],
    correct: 1,
    explanation: 'A SYN scan sends SYN, receives SYN-ACK, then sends RST instead of completing the handshake with ACK. Since the connection is never fully established, older logging systems don\'t record it.'
  },
  {
    type: 'type-command',
    question: 'Scan ALL 65535 TCP ports on 10.10.10.5 with service version detection, timing T4, and save output in all formats as "fullscan":',
    scenario: 'You need a thorough scan of all ports with version info on a lab target.',
    validAnswers: [
      'nmap -p- -sV -T4 -oA fullscan 10.10.10.5',
      'nmap -sV -p- -T4 -oA fullscan 10.10.10.5',
      'nmap -p- -sV -T4 10.10.10.5 -oA fullscan',
      'nmap -sV -T4 -p- 10.10.10.5 -oA fullscan',
      'nmap -T4 -sV -p- -oA fullscan 10.10.10.5',
      'nmap -sV -p- -T4 10.10.10.5 -oA fullscan',
    ],
    hint: 'You need -p- for all ports, -sV for versions, -T4 for timing, and -oA for all output formats.',
    explanation: 'The key flags are: -p- (all 65535 ports), -sV (version detection), -T4 (aggressive timing for labs), and -oA fullscan (save in all three output formats).'
  },
  {
    type: 'mcq',
    question: 'You scan a port and Nmap reports it as "filtered." What does this mean?',
    options: [
      'The port is open but the service is not responding',
      'A firewall is silently dropping packets — Nmap cannot determine if the port is open or closed',
      'The port is closed and running no service',
      'Nmap detected malware on that port'
    ],
    correct: 1,
    explanation: '"Filtered" means Nmap sent probes but got no response (or an ICMP unreachable error). A firewall is blocking the traffic, so Nmap can\'t determine the port\'s actual state.'
  },
  {
    type: 'drag-match',
    question: 'Match each Nmap flag to its purpose:',
    pairs: [
      { label: '-sS', value: 'SYN (stealth) scan' },
      { label: '-sV', value: 'Service version detection' },
      { label: '-O', value: 'OS detection' },
      { label: '-sC', value: 'Default script scan' },
      { label: '-Pn', value: 'Skip host discovery' },
    ]
  },
  {
    type: 'mcq',
    question: 'Which Nmap flag combines service version detection, OS detection, default scripts, AND traceroute into one option?',
    options: [
      '-sA',
      '-A',
      '-sV -O',
      '--all'
    ],
    correct: 1,
    explanation: 'The -A flag enables "aggressive" scanning, which combines -sV (service versions), -O (OS detection), -sC (default scripts), and --traceroute all in one.'
  },
  {
    type: 'type-command',
    question: 'Run all NSE vulnerability scripts against port 445 on target 10.10.10.5:',
    scenario: 'You found SMB on port 445 and want to check for known vulnerabilities like EternalBlue.',
    validAnswers: [
      'nmap --script=vuln -p 445 10.10.10.5',
      'nmap --script vuln -p 445 10.10.10.5',
      'nmap -p 445 --script=vuln 10.10.10.5',
      'nmap -p 445 --script vuln 10.10.10.5',
      'nmap --script=vuln -p445 10.10.10.5',
    ],
    hint: 'Use --script=vuln to run all vulnerability scripts, and -p to specify the port.',
    explanation: 'The --script=vuln flag runs all scripts in the "vuln" category against the specified ports. This will check for known vulnerabilities on the target SMB service.'
  },
  {
    type: 'mcq',
    question: 'Why is UDP scanning (-sU) much slower than TCP SYN scanning (-sS)?',
    options: [
      'UDP packets are encrypted and need decryption',
      'UDP has no handshake — open ports may not respond, so Nmap waits for timeouts before concluding',
      'UDP ports are always filtered by firewalls',
      'UDP scanning requires root and has to wait for kernel permission'
    ],
    correct: 1,
    explanation: 'TCP gives clear responses: SYN-ACK for open, RST for closed. UDP has no handshake, so an open port might just silently accept the packet and say nothing. Nmap must wait for a timeout before marking it as open|filtered, making it very slow.'
  },
  {
    type: 'mcq',
    question: 'Which timing template should you use in the eJPT exam environment?',
    options: [
      '-T0 (Paranoid) for maximum stealth',
      '-T2 (Polite) to avoid detection',
      '-T4 (Aggressive) for fast but reliable results',
      '-T5 (Insane) for maximum speed'
    ],
    correct: 2,
    explanation: '-T4 is the sweet spot for lab/exam environments. It\'s fast enough to save time but reliable enough not to miss ports. -T5 can actually drop results on congested networks, and -T0/-T1 are too slow for an exam.'
  },
  {
    type: 'drag-match',
    question: 'Match each scan type to its description:',
    pairs: [
      { label: '-sT', value: 'Full TCP connect (logged by target)' },
      { label: '-sU', value: 'UDP scan (slow, finds hidden services)' },
      { label: '-sX', value: 'Xmas scan (FIN+PSH+URG flags)' },
      { label: '-sN', value: 'Null scan (no flags set)' },
    ]
  },
  {
    type: 'type-command',
    question: 'Perform a ping sweep to discover alive hosts on the 192.168.1.0/24 network and save results in all formats as "discovery":',
    scenario: 'First step of an engagement — find what hosts are alive on the network.',
    validAnswers: [
      'nmap -sn 192.168.1.0/24 -oA discovery',
      'nmap -sn -oA discovery 192.168.1.0/24',
    ],
    hint: 'Use -sn for ping sweep (no port scan), the network range, and -oA for all output formats.',
    explanation: 'The -sn flag tells Nmap to only perform host discovery without port scanning. Combined with -oA, you save the results in normal, XML, and greppable formats for later reference.'
  },
  {
    type: 'mcq',
    question: 'You need to find Nmap scripts related to FTP on your Kali machine. Which command helps you find them?',
    options: [
      'nmap --list-scripts ftp',
      'ls /usr/share/nmap/scripts/ | grep ftp',
      'nmap --script=find-ftp',
      'apt search nmap-ftp'
    ],
    correct: 1,
    explanation: 'All NSE scripts are stored in /usr/share/nmap/scripts/. Piping ls through grep is the quickest way to find scripts for a specific protocol. You can also use nmap --script-help=ftp* to get help text.'
  },
];

// ==================== INTERACTIVES ====================
export function bindInteractives() {
  // Currently no custom interactive elements beyond the
  // try-it buttons and quiz which are handled by the framework.
}
