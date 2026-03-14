// ============================================
// Prerequisites: Networking Fundamentals
// ============================================

export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Prerequisites</div>
    <h1 class="lesson-title">Networking Fundamentals</h1>
    <div class="lesson-meta">
      <span>⏱ ~45 min</span>
      <span>⚡ 100 XP</span>
      <span>📚 Foundation</span>
    </div>
  </div>

  <div class="story-intro">
    A penetration tester sat in a coffee shop across from a corporate office. Using nothing but a laptop and an understanding of how networks communicate, they mapped every server, every service, and every vulnerability in the building — without ever stepping inside. This is why networking isn't just theory. It's the language of hacking itself.
  </div>

  <!-- ==================== SECTION 1: Why Networking ==================== -->
  <h2>Why Networking Matters for Hacking</h2>

  <p>Every single thing you'll do as a pentester — scanning, exploiting, pivoting, exfiltrating — happens over a network. When you run <code>nmap</code>, you're sending network packets. When you pop a reverse shell, it's a network connection. When you steal data, it travels over the network.</p>

  <div class="hacker-note">
    If you don't understand networking, you're just typing commands you found on Google. You won't know why something works, why it fails, or how to adapt when things go sideways. Every great hacker is a networking expert first.
  </div>

  <!-- ==================== SECTION 2: What is a Network ==================== -->
  <h2>What is a Network?</h2>

  <p>A network is just two or more devices connected together so they can share information. That's it.</p>

  <div class="analogy">
    Think of a network like a postal system. You have an address (IP address), you put your message in an envelope (packet), you write where it's going (destination IP), and the postal system (routers) figures out how to get it there. Sometimes mail gets lost (packet loss), sometimes it arrives out of order (UDP), and sometimes the recipient confirms they got it (TCP).
  </div>

  <p>Networks come in different sizes:</p>
  <ul>
    <li><strong>LAN</strong> (Local Area Network) — Your home or office. All devices connected to the same router.</li>
    <li><strong>WAN</strong> (Wide Area Network) — Connects LANs together. The internet is the biggest WAN.</li>
    <li><strong>WLAN</strong> — Wireless LAN. Same as LAN but over WiFi.</li>
    <li><strong>VPN</strong> — Virtual Private Network. Creates a secure tunnel through the internet.</li>
  </ul>

  <div class="hacker-note">
    During a pentest, you'll usually start on one LAN segment and try to reach other segments. Understanding network boundaries tells you where to pivot and what you can reach.
  </div>

  <!-- ==================== SECTION 3: OSI Model ==================== -->
  <h2>The OSI Model — 7 Layers of Networking</h2>

  <p>The OSI model splits networking into 7 layers. Each layer has a specific job. You don't need to memorize all the details, but you MUST know what each layer does because different attacks happen at different layers.</p>

  <div class="key-point">
    Remember it with: <strong>"Please Do Not Throw Sausage Pizza Away"</strong> (Physical, Data Link, Network, Transport, Session, Presentation, Application) — from bottom to top.
  </div>

  <div class="interactive-box">
    <div class="interact-title">Interactive OSI Model — Click each layer</div>
    <div class="layer-stack" id="osi-stack">

      <div class="layer-item" style="background: rgba(255,51,102,0.15); border: 1px solid rgba(255,51,102,0.3);" data-layer="7">
        <span>Layer 7 — Application</span>
        <span style="font-size: 12px; color: var(--text-dim);">HTTP, FTP, SSH, DNS</span>
      </div>
      <div class="layer-detail" id="layer-7-detail">
        <strong>What you interact with.</strong> This is where web browsers, email clients, and apps live. Protocols: HTTP, HTTPS, FTP, SSH, DNS, SMTP, SNMP.<br><br>
        <strong>Attacks here:</strong> SQL injection, XSS, command injection, brute force — most of your web attacks happen at Layer 7.
      </div>

      <div class="layer-item" style="background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3);" data-layer="6">
        <span>Layer 6 — Presentation</span>
        <span style="font-size: 12px; color: var(--text-dim);">SSL/TLS, Encoding</span>
      </div>
      <div class="layer-detail" id="layer-6-detail">
        <strong>Translates data.</strong> Handles encryption (SSL/TLS), compression, and data formatting (ASCII, JPEG, etc.).<br><br>
        <strong>Attacks here:</strong> SSL stripping, downgrade attacks, exploiting weak encryption.
      </div>

      <div class="layer-item" style="background: rgba(0,212,255,0.15); border: 1px solid rgba(0,212,255,0.3);" data-layer="5">
        <span>Layer 5 — Session</span>
        <span style="font-size: 12px; color: var(--text-dim);">Sessions, Auth</span>
      </div>
      <div class="layer-detail" id="layer-5-detail">
        <strong>Manages connections.</strong> Opens, maintains, and closes sessions between applications. Handles authentication and reconnection.<br><br>
        <strong>Attacks here:</strong> Session hijacking, session fixation, cookie theft.
      </div>

      <div class="layer-item" style="background: rgba(0,255,136,0.15); border: 1px solid rgba(0,255,136,0.3);" data-layer="4">
        <span>Layer 4 — Transport</span>
        <span style="font-size: 12px; color: var(--text-dim);">TCP, UDP, Ports</span>
      </div>
      <div class="layer-detail" id="layer-4-detail">
        <strong>THE most important layer for scanning.</strong> This is where TCP and UDP live. Ports are a Layer 4 concept. When Nmap does a SYN scan, it's working at this layer.<br><br>
        TCP = reliable (confirms delivery). UDP = fast (fire and forget).<br><br>
        <strong>Attacks here:</strong> Port scanning, SYN floods, TCP hijacking. This is where Nmap operates.
      </div>

      <div class="layer-item" style="background: rgba(255,136,0,0.15); border: 1px solid rgba(255,136,0,0.3);" data-layer="3">
        <span>Layer 3 — Network</span>
        <span style="font-size: 12px; color: var(--text-dim);">IP, ICMP, Routing</span>
      </div>
      <div class="layer-detail" id="layer-3-detail">
        <strong>IP addresses and routing.</strong> This layer figures out HOW to get your packet from point A to point B across different networks. IP addresses, routers, and ICMP (ping) live here.<br><br>
        <strong>Attacks here:</strong> IP spoofing, ICMP redirect attacks, route manipulation. When you run <code>traceroute</code>, you're exploring Layer 3.
      </div>

      <div class="layer-item" style="background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3);" data-layer="2">
        <span>Layer 2 — Data Link</span>
        <span style="font-size: 12px; color: var(--text-dim);">MAC, ARP, Switches</span>
      </div>
      <div class="layer-detail" id="layer-2-detail">
        <strong>Local delivery.</strong> Uses MAC addresses to deliver frames within the same network. Switches work at this layer. ARP (Address Resolution Protocol) maps IP addresses to MAC addresses.<br><br>
        <strong>Attacks here:</strong> ARP spoofing/poisoning (MITM attacks), MAC flooding, VLAN hopping. This is how you intercept traffic on a local network.
      </div>

      <div class="layer-item" style="background: rgba(100,116,139,0.15); border: 1px solid rgba(100,116,139,0.3);" data-layer="1">
        <span>Layer 1 — Physical</span>
        <span style="font-size: 12px; color: var(--text-dim);">Cables, WiFi, Hardware</span>
      </div>
      <div class="layer-detail" id="layer-1-detail">
        <strong>Physical wires and signals.</strong> Ethernet cables, fiber optics, WiFi radio waves, USB. The actual electrical/optical/radio signals.<br><br>
        <strong>Attacks here:</strong> Cable tapping, rogue access points, USB drop attacks, hardware keyloggers.
      </div>

    </div>
  </div>

  <!-- ==================== SECTION 4: TCP/IP Model ==================== -->
  <h2>The TCP/IP Model — What's Actually Used</h2>

  <p>The OSI model is great for learning, but the real internet runs on the <strong>TCP/IP model</strong>, which simplifies everything into 4 layers:</p>

  <table class="port-table">
    <thead>
      <tr>
        <th>TCP/IP Layer</th>
        <th>OSI Equivalent</th>
        <th>What it Does</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong style="color: var(--accent-red);">Application</strong></td>
        <td>Layers 5-7</td>
        <td>HTTP, FTP, SSH, DNS — the apps and protocols you use</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-green);">Transport</strong></td>
        <td>Layer 4</td>
        <td>TCP and UDP — how data is delivered reliably (or not)</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-orange);">Internet</strong></td>
        <td>Layer 3</td>
        <td>IP addressing and routing — getting packets across networks</td>
      </tr>
      <tr>
        <td><strong style="color: var(--accent-yellow);">Network Access</strong></td>
        <td>Layers 1-2</td>
        <td>Physical connection + local delivery (Ethernet, WiFi, ARP)</td>
      </tr>
    </tbody>
  </table>

  <!-- ==================== SECTION 5: IP Addresses ==================== -->
  <h2>IP Addresses — Your Machine's Identity</h2>

  <p>Every device on a network has an IP address. Think of it as a phone number — it's how other devices find you and send data to you.</p>

  <h3>IPv4 — The One You'll Use 99% of the Time</h3>
  <p>Format: <code>192.168.1.5</code> — four numbers (0-255) separated by dots. Each number is one byte (8 bits), so an IPv4 address is 32 bits total. That gives us about 4.3 billion possible addresses.</p>

  <h3>Private vs Public IP Addresses</h3>

  <div class="analogy">
    Private IPs are like apartment numbers inside a building. They only make sense within the building. Public IPs are like the building's street address — that's how the outside world finds you. A router (NAT) translates between the two, like a doorman forwarding mail to the right apartment.
  </div>

  <table class="port-table">
    <thead>
      <tr>
        <th>Range</th>
        <th>Type</th>
        <th>Used For</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="port-num">10.0.0.0 – 10.255.255.255</td>
        <td>Private (Class A)</td>
        <td>Large organizations, cloud VPCs</td>
      </tr>
      <tr>
        <td class="port-num">172.16.0.0 – 172.31.255.255</td>
        <td>Private (Class B)</td>
        <td>Medium networks, Docker</td>
      </tr>
      <tr>
        <td class="port-num">192.168.0.0 – 192.168.255.255</td>
        <td>Private (Class C)</td>
        <td>Home networks, small offices</td>
      </tr>
      <tr>
        <td class="port-num">127.0.0.0 – 127.255.255.255</td>
        <td>Loopback</td>
        <td>Refers to yourself (localhost)</td>
      </tr>
      <tr>
        <td class="port-num">Everything else</td>
        <td>Public</td>
        <td>Internet-facing servers, websites</td>
      </tr>
    </tbody>
  </table>

  <div class="hacker-note">
    When you see <code>10.x.x.x</code> or <code>192.168.x.x</code> in a pentest, you're on an internal network. These addresses can't be reached from the internet — you need to be inside (or pivot through a compromised machine) to attack them.
  </div>

  <h3>Subnetting — The Basics</h3>
  <p>A subnet mask defines which part of an IP is the "network" and which part is the "host." The most common one you'll see:</p>

  <div class="code-block">
    <span class="code-label">Example</span>
IP:      <span class="val">192.168.1</span>.<span class="cmd">105</span>
Mask:    <span class="val">255.255.255</span>.<span class="cmd">0</span>
CIDR:    192.168.1.0<span class="flag">/24</span>

<span class="comment"># Network part: 192.168.1 (first 24 bits)</span>
<span class="comment"># Host part: .105 (last 8 bits)</span>
<span class="comment"># This network can have 254 hosts (.1 to .254)</span>
<span class="comment"># .0 = network address, .255 = broadcast address</span>
  </div>

  <p>Common CIDR notations you'll encounter:</p>
  <table class="port-table">
    <thead>
      <tr><th>CIDR</th><th>Subnet Mask</th><th>Hosts</th><th>Where You See It</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">/8</td><td>255.0.0.0</td><td>16 million</td><td>Large private networks (10.0.0.0/8)</td></tr>
      <tr><td class="port-num">/16</td><td>255.255.0.0</td><td>65,534</td><td>Medium networks</td></tr>
      <tr><td class="port-num">/24</td><td>255.255.255.0</td><td>254</td><td>Most common — home, office, labs</td></tr>
      <tr><td class="port-num">/32</td><td>255.255.255.255</td><td>1</td><td>Single host (used in firewall rules)</td></tr>
    </tbody>
  </table>

  <!-- ==================== SECTION 6: TCP vs UDP ==================== -->
  <h2>TCP vs UDP — Two Ways to Send Data</h2>

  <h3>TCP (Transmission Control Protocol)</h3>
  <p>TCP is like a phone call — you establish a connection, confirm the other person is there, and both sides acknowledge every piece of information exchanged.</p>

  <div class="key-point">
    <strong>The TCP 3-Way Handshake:</strong><br>
    1. <strong>SYN</strong> → Client says "Hey, I want to connect"<br>
    2. <strong>SYN-ACK</strong> → Server says "Got it, I'm ready too"<br>
    3. <strong>ACK</strong> → Client says "Great, let's go"<br><br>
    This is CRITICAL for understanding port scanning. When Nmap does a SYN scan, it sends a SYN packet. If it gets a SYN-ACK back, the port is <strong>open</strong>. If it gets a RST (reset), the port is <strong>closed</strong>. If nothing comes back, the port is <strong>filtered</strong> (firewall is blocking it).
  </div>

  <h3>UDP (User Datagram Protocol)</h3>
  <p>UDP is like sending a letter — you drop it in the mailbox and hope it arrives. No confirmation, no handshake. This makes it faster but unreliable.</p>

  <table class="port-table">
    <thead>
      <tr><th>Feature</th><th>TCP</th><th>UDP</th></tr>
    </thead>
    <tbody>
      <tr><td>Connection</td><td>Connection-oriented (handshake)</td><td>Connectionless (fire and forget)</td></tr>
      <tr><td>Reliability</td><td>Guaranteed delivery, ordered</td><td>No guarantee, may arrive out of order</td></tr>
      <tr><td>Speed</td><td>Slower (overhead from confirmations)</td><td>Faster (no overhead)</td></tr>
      <tr><td>Use cases</td><td>HTTP, SSH, FTP, SMTP, databases</td><td>DNS, DHCP, SNMP, streaming, VoIP</td></tr>
      <tr><td>Scanning</td><td>Fast and reliable (SYN scan)</td><td>Slow and unreliable</td></tr>
    </tbody>
  </table>

  <div class="hacker-note">
    Most people only scan TCP ports. UDP scanning is slow and painful, which means defenders often leave UDP services unprotected. Always run a UDP scan too — you might find SNMP (port 161) with a default community string, or TFTP (port 69) with no authentication.
  </div>

  <!-- ==================== SECTION 7: Ports ==================== -->
  <h2>Ports — Doors Into a Machine</h2>

  <p>An IP address gets you to the machine. A <strong>port number</strong> gets you to the specific service running on it. There are 65,535 possible ports (0-65535).</p>

  <div class="analogy">
    Imagine a huge hotel (the server). The hotel's street address is its IP. Each room number is a port. Room 80 always has the web server. Room 22 has SSH. Room 21 has FTP. When you "scan ports," you're knocking on every door to see which rooms are occupied.
  </div>

  <h3>Ports You MUST Know for the eJPT</h3>

  <table class="port-table">
    <thead>
      <tr><th>Port</th><th>Service</th><th>Protocol</th><th>Why Hackers Care</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">21</td><td>FTP</td><td>TCP</td><td>Anonymous login, weak creds, plain text</td></tr>
      <tr><td class="port-num">22</td><td>SSH</td><td>TCP</td><td>Brute force, key-based auth bypass</td></tr>
      <tr><td class="port-num">23</td><td>Telnet</td><td>TCP</td><td>No encryption — sniff credentials off the wire</td></tr>
      <tr><td class="port-num">25</td><td>SMTP</td><td>TCP</td><td>Email — user enumeration via VRFY/EXPN</td></tr>
      <tr><td class="port-num">53</td><td>DNS</td><td>TCP/UDP</td><td>Zone transfers leak internal hostnames</td></tr>
      <tr><td class="port-num">80</td><td>HTTP</td><td>TCP</td><td>Web apps — SQLi, XSS, RCE, everything</td></tr>
      <tr><td class="port-num">110</td><td>POP3</td><td>TCP</td><td>Email retrieval — often plain text</td></tr>
      <tr><td class="port-num">111</td><td>RPCbind</td><td>TCP/UDP</td><td>NFS enumeration</td></tr>
      <tr><td class="port-num">135</td><td>MSRPC</td><td>TCP</td><td>Windows RPC — used in many Windows exploits</td></tr>
      <tr><td class="port-num">139</td><td>NetBIOS</td><td>TCP</td><td>Windows file sharing (legacy)</td></tr>
      <tr><td class="port-num">143</td><td>IMAP</td><td>TCP</td><td>Email — another plain text protocol</td></tr>
      <tr><td class="port-num">161</td><td>SNMP</td><td>UDP</td><td>Default community strings leak system info</td></tr>
      <tr><td class="port-num">443</td><td>HTTPS</td><td>TCP</td><td>Encrypted web — still vulnerable to app-level attacks</td></tr>
      <tr><td class="port-num">445</td><td>SMB</td><td>TCP</td><td>EternalBlue, pass-the-hash, file shares</td></tr>
      <tr><td class="port-num">993</td><td>IMAPS</td><td>TCP</td><td>Encrypted IMAP</td></tr>
      <tr><td class="port-num">995</td><td>POP3S</td><td>TCP</td><td>Encrypted POP3</td></tr>
      <tr><td class="port-num">1433</td><td>MSSQL</td><td>TCP</td><td>Microsoft SQL Server — xp_cmdshell RCE</td></tr>
      <tr><td class="port-num">2049</td><td>NFS</td><td>TCP</td><td>Network File System — mount remote drives</td></tr>
      <tr><td class="port-num">3306</td><td>MySQL</td><td>TCP</td><td>Database — SQL injection leads here</td></tr>
      <tr><td class="port-num">3389</td><td>RDP</td><td>TCP</td><td>Windows Remote Desktop — brute force, BlueKeep</td></tr>
      <tr><td class="port-num">5432</td><td>PostgreSQL</td><td>TCP</td><td>Database access</td></tr>
      <tr><td class="port-num">5900</td><td>VNC</td><td>TCP</td><td>Remote desktop — often weak/no auth</td></tr>
      <tr><td class="port-num">6379</td><td>Redis</td><td>TCP</td><td>Often no auth — write SSH keys, RCE</td></tr>
      <tr><td class="port-num">8080</td><td>HTTP-Alt</td><td>TCP</td><td>Alternate web server, Tomcat, proxies</td></tr>
      <tr><td class="port-num">8443</td><td>HTTPS-Alt</td><td>TCP</td><td>Alternate HTTPS, admin panels</td></tr>
    </tbody>
  </table>

  <!-- ==================== SECTION 8: DNS ==================== -->
  <h2>DNS — The Internet's Phone Book</h2>

  <p>DNS (Domain Name System) translates human-readable names like <code>google.com</code> into IP addresses like <code>142.250.185.46</code>. Without DNS, you'd have to memorize IP addresses for every website.</p>

  <h3>How DNS Resolution Works</h3>
  <ol>
    <li>You type <code>example.com</code> in your browser</li>
    <li>Your computer checks its <strong>local cache</strong> — "Do I already know this?"</li>
    <li>If not, it asks your <strong>DNS resolver</strong> (usually your ISP or 8.8.8.8)</li>
    <li>The resolver asks the <strong>root DNS server</strong> — "Where are .com domains?"</li>
    <li>Root server says — "Ask the <strong>.com TLD server</strong>"</li>
    <li>TLD server says — "example.com's nameserver is ns1.example.com"</li>
    <li>Your resolver asks <strong>ns1.example.com</strong> — "What's example.com's IP?"</li>
    <li>Answer: <code>93.184.216.34</code> — cached for future use</li>
  </ol>

  <h3>DNS Record Types</h3>
  <table class="port-table">
    <thead>
      <tr><th>Record</th><th>Purpose</th><th>Hacker Use</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">A</td><td>Maps domain to IPv4 address</td><td>Find the server's IP</td></tr>
      <tr><td class="port-num">AAAA</td><td>Maps domain to IPv6 address</td><td>Find IPv6 (often less protected)</td></tr>
      <tr><td class="port-num">MX</td><td>Mail server for the domain</td><td>Find email infrastructure</td></tr>
      <tr><td class="port-num">NS</td><td>Nameservers for the domain</td><td>Target DNS infrastructure</td></tr>
      <tr><td class="port-num">TXT</td><td>Arbitrary text (SPF, DKIM, etc.)</td><td>Leak info about services used</td></tr>
      <tr><td class="port-num">CNAME</td><td>Alias pointing to another domain</td><td>Subdomain takeover if target is dead</td></tr>
      <tr><td class="port-num">PTR</td><td>Reverse lookup (IP → domain)</td><td>Find what domain an IP belongs to</td></tr>
    </tbody>
  </table>

  <div class="hacker-note">
    <strong>DNS Zone Transfer</strong> is a goldmine. If a DNS server allows zone transfers (AXFR) to anyone, you can download ALL DNS records for a domain — every subdomain, every internal hostname. Try: <code>dig axfr @ns1.target.com target.com</code>
  </div>

  <div class="try-it">
    <p>Open the terminal (press <kbd>\`</kbd>) and try these commands:</p>
    <button class="try-cmd">dig example.com A</button>
    <button class="try-cmd">dig example.com MX</button>
    <button class="try-cmd">dig example.com NS</button>
    <button class="try-cmd">whois example.com</button>
  </div>

  <!-- ==================== SECTION 9: ARP ==================== -->
  <h2>ARP — How Local Devices Find Each Other</h2>

  <p>ARP (Address Resolution Protocol) maps IP addresses to MAC addresses on a local network. It works at Layer 2.</p>

  <div class="analogy">
    Imagine you're in a room full of people. You know someone's name (IP address) but not their face (MAC address). So you shout: "Who is 192.168.1.5?" The person with that IP raises their hand and says "That's me, my MAC is AA:BB:CC:DD:EE:FF." Now you can talk directly to them. That's ARP.
  </div>

  <p>The problem? <strong>ARP has no authentication.</strong> Anyone can respond to an ARP request. So an attacker can say "I'm 192.168.1.1 (the gateway)" when they're not — this is <strong>ARP spoofing/poisoning</strong>, the foundation of Man-in-the-Middle attacks on local networks.</p>

  <!-- ==================== SECTION 10: DHCP ==================== -->
  <h2>DHCP — Automatic IP Assignment</h2>

  <p>DHCP (Dynamic Host Configuration Protocol) automatically assigns IP addresses to devices when they join a network. The process is called <strong>DORA</strong>:</p>

  <ol>
    <li><strong>D</strong>iscover — Device broadcasts "I need an IP address!"</li>
    <li><strong>O</strong>ffer — DHCP server responds "Here, use 192.168.1.50"</li>
    <li><strong>R</strong>equest — Device says "I'll take that one, thanks"</li>
    <li><strong>A</strong>cknowledge — Server confirms "It's yours for 24 hours"</li>
  </ol>

  <div class="hacker-note">
    Rogue DHCP attacks: An attacker sets up their own DHCP server on the network. When a device asks for an IP, the attacker responds first and assigns their machine as the default gateway — routing all victim traffic through the attacker's machine. Instant MITM.
  </div>

  <!-- ==================== SECTION 11: NAT ==================== -->
  <h2>NAT — Private to Public Translation</h2>

  <p>NAT (Network Address Translation) allows multiple devices on a private network to share one public IP address. Your home router does this.</p>

  <p>When your phone (192.168.1.10) visits google.com, the router:</p>
  <ol>
    <li>Replaces your private IP with its public IP (e.g., 85.250.100.50)</li>
    <li>Remembers which internal device made the request (using port numbers)</li>
    <li>When Google responds, the router forwards it back to your phone</li>
  </ol>

  <div class="hacker-note">
    NAT hides internal network structure from the outside. During external pentesting, you can't directly reach internal IPs — you need to find a vulnerability in an exposed service and pivot inward.
  </div>

  <!-- ==================== SECTION 12: Key Network Devices ==================== -->
  <h2>Network Devices You Need to Know</h2>

  <table class="port-table">
    <thead>
      <tr><th>Device</th><th>Layer</th><th>What it Does</th><th>Hacking Relevance</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Router</strong></td><td>Layer 3</td><td>Connects different networks, routes packets by IP</td><td>Controls network boundaries. Compromise = control traffic flow</td></tr>
      <tr><td><strong>Switch</strong></td><td>Layer 2</td><td>Connects devices on the same network, forwards by MAC</td><td>MAC flooding can make it act like a hub (broadcast all traffic)</td></tr>
      <tr><td><strong>Firewall</strong></td><td>Layer 3-7</td><td>Filters traffic based on rules</td><td>The main obstacle. Bypass with tunneling, port forwarding</td></tr>
      <tr><td><strong>Hub</strong></td><td>Layer 1</td><td>Broadcasts all traffic to all ports (legacy)</td><td>If you find one, you can sniff ALL traffic — no ARP spoofing needed</td></tr>
      <tr><td><strong>WAP</strong></td><td>Layer 1-2</td><td>Provides WiFi access</td><td>Rogue APs, evil twins, WPA cracking</td></tr>
      <tr><td><strong>Load Balancer</strong></td><td>Layer 4-7</td><td>Distributes traffic across servers</td><td>Can hide the real server behind it</td></tr>
      <tr><td><strong>IDS/IPS</strong></td><td>Layer 3-7</td><td>Detects/prevents malicious traffic</td><td>Your enemy. Needs to be evaded or avoided</td></tr>
    </tbody>
  </table>

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
    question: 'Nmap sends a SYN packet to port 445 and gets a SYN-ACK back. What does this mean?',
    options: [
      'The port is closed',
      'The port is open',
      'The port is filtered by a firewall',
      'The service is crashed'
    ],
    correct: 1,
    explanation: 'A SYN-ACK response to a SYN packet means the port is open and ready to complete the TCP 3-way handshake. A RST would mean closed. No response = filtered.'
  },
  {
    type: 'mcq',
    question: 'You see the IP address 10.0.5.23 on a target. What does this tell you?',
    options: [
      'It\'s a public server on the internet',
      'It\'s on a private/internal network',
      'It\'s a loopback address',
      'It\'s an IPv6 address'
    ],
    correct: 1,
    explanation: '10.0.0.0 - 10.255.255.255 is a private (Class A) range. These IPs are only valid inside a private network and can\'t be routed on the internet.'
  },
  {
    type: 'mcq',
    question: 'Which protocol has NO authentication and can be used for Man-in-the-Middle attacks on a local network?',
    options: [
      'DNS',
      'DHCP',
      'ARP',
      'TCP'
    ],
    correct: 2,
    explanation: 'ARP (Address Resolution Protocol) has no authentication. Anyone can respond to an ARP request claiming to be any IP, which is the basis of ARP spoofing/poisoning attacks.'
  },
  {
    type: 'drag-match',
    question: 'Match each port to its service:',
    pairs: [
      { label: 'Port 22', value: 'SSH' },
      { label: 'Port 445', value: 'SMB' },
      { label: 'Port 3306', value: 'MySQL' },
      { label: 'Port 80', value: 'HTTP' },
      { label: 'Port 53', value: 'DNS' },
    ]
  },
  {
    type: 'mcq',
    question: 'What OSI layer does a firewall primarily operate at?',
    options: [
      'Layer 1 (Physical)',
      'Layer 2 (Data Link)',
      'Layers 3-7 (Network through Application)',
      'Layer 4 (Transport) only'
    ],
    correct: 2,
    explanation: 'Modern firewalls operate from Layer 3 (IP filtering) up to Layer 7 (application-level inspection). They can filter by IP, port, protocol, and even HTTP content.'
  },
  {
    type: 'type-command',
    question: 'You want to look up all DNS records of type MX (mail servers) for "target.com". Write the dig command:',
    scenario: 'Find the mail servers for target.com using dig.',
    validAnswers: [
      'dig target.com MX',
      'dig MX target.com',
      'dig target.com mx',
    ],
    hint: 'dig [domain] [record type]',
    explanation: 'The dig command queries DNS records. dig target.com MX returns all mail exchange records for the domain.'
  },
  {
    type: 'mcq',
    question: 'Why is UDP scanning slower than TCP scanning?',
    options: [
      'UDP packets are larger',
      'UDP has no handshake, so open ports may not respond at all',
      'UDP uses encryption',
      'Firewalls block all UDP traffic'
    ],
    correct: 1,
    explanation: 'With TCP, you get a clear SYN-ACK (open) or RST (closed). With UDP, open ports might not respond at all, so the scanner has to wait for a timeout before concluding a port might be open. This makes it very slow.'
  },
  {
    type: 'mcq',
    question: 'What is a /24 subnet? How many usable hosts can it have?',
    options: [
      '24 hosts',
      '256 hosts',
      '254 hosts',
      '128 hosts'
    ],
    correct: 2,
    explanation: 'A /24 subnet has 256 addresses (2^8), but .0 is the network address and .255 is the broadcast address, leaving 254 usable host addresses.'
  },
  {
    type: 'mcq',
    question: 'An attacker sets up a rogue DHCP server on the network. What can they achieve?',
    options: [
      'Encrypt all network traffic',
      'Assign themselves as the default gateway for MITM attacks',
      'Crash the DNS server',
      'Bypass the firewall'
    ],
    correct: 1,
    explanation: 'A rogue DHCP server can assign the attacker\'s machine as the default gateway. All victim traffic then routes through the attacker, enabling Man-in-the-Middle attacks.'
  },
  {
    type: 'type-command',
    question: 'You want to scan a target at 10.10.10.5 to find open ports and detect service versions. Write the nmap command:',
    scenario: 'Scan 10.10.10.5 with service version detection enabled.',
    validAnswers: [
      'nmap -sV 10.10.10.5',
      'nmap 10.10.10.5 -sV',
      'nmap -sV -sC 10.10.10.5',
      'nmap -A 10.10.10.5',
    ],
    hint: 'nmap -sV ...',
    explanation: 'nmap -sV enables version detection, probing open ports to determine service/version info. -A is also valid as it enables OS detection, version detection, script scanning, and traceroute.'
  },
];

// ==================== INTERACTIVES ====================
export function bindInteractives() {
  // OSI layer click interaction
  const layerItems = document.querySelectorAll('.layer-item');
  layerItems.forEach(item => {
    item.addEventListener('click', () => {
      const layer = item.dataset.layer;
      const detail = document.getElementById(`layer-${layer}-detail`);

      // Close other details
      document.querySelectorAll('.layer-detail').forEach(d => {
        if (d !== detail) d.classList.remove('show');
      });
      document.querySelectorAll('.layer-item').forEach(i => {
        if (i !== item) i.classList.remove('active');
      });

      // Toggle this one
      detail.classList.toggle('show');
      item.classList.toggle('active');
    });
  });
}
