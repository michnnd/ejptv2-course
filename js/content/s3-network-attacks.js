export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Host & Network Pentesting</div>
    <h1 class="lesson-title">Network-Based Attacks</h1>
    <div class="lesson-meta">
      <span>⏱ ~40 min</span>
      <span>⚡ 120 XP</span>
      <span>📶 Section 3</span>
    </div>
  </div>

  <div class="story-intro">
    The pentester connected to the hotel WiFi, ran a single command, and within minutes could see every website the CEO was visiting, every password being typed, every email being sent. The CEO was sitting three tables away, sipping coffee, completely unaware. This is the power of network-based attacks.
  </div>

  <h2>What Are Network-Based Attacks?</h2>
  <p>Network attacks target the communication between devices rather than the devices themselves. Instead of exploiting a vulnerability in a service, you exploit weaknesses in <strong>how data travels</strong> across the network.</p>

  <div class="key-point">
    Most network attacks require you to be on the <strong>same network</strong> as the target (internal pentest). From the internet, these attacks are generally not possible — which is why internal network security is so critical.
  </div>

  <h2>ARP Spoofing / ARP Poisoning</h2>
  <p>The foundation of most local network attacks. ARP has <strong>no authentication</strong>, so anyone can send fake ARP replies.</p>

  <div class="analogy">
    Imagine you're in a classroom and the teacher asks "Who is student #5?" Normally, student #5 raises their hand. But in ARP spoofing, YOU raise your hand and say "I'm student #5!" — and the teacher believes you because there's no ID check. Now all messages meant for student #5 come to you.
  </div>

  <h3>How ARP Spoofing Enables MITM</h3>
  <ol>
    <li>Attacker tells the <strong>victim</strong>: "I'm the gateway (router)"</li>
    <li>Attacker tells the <strong>gateway</strong>: "I'm the victim"</li>
    <li>Both update their ARP tables with the attacker's MAC address</li>
    <li>Now ALL traffic between victim and internet flows through the attacker</li>
    <li>Attacker can read, modify, or drop packets</li>
  </ol>

  <div class="code-block">
    <span class="code-label">ARP Spoofing with arpspoof</span>
<span class="comment"># Enable IP forwarding (so traffic still reaches its destination)</span>
<span class="cmd">echo 1 > /proc/sys/net/ipv4/ip_forward</span>

<span class="comment"># Tell victim (192.168.1.10) that we are the gateway (192.168.1.1)</span>
<span class="cmd">arpspoof</span> <span class="flag">-i eth0</span> <span class="flag">-t</span> <span class="val">192.168.1.10</span> <span class="val">192.168.1.1</span>

<span class="comment"># In another terminal: tell the gateway that we are the victim</span>
<span class="cmd">arpspoof</span> <span class="flag">-i eth0</span> <span class="flag">-t</span> <span class="val">192.168.1.1</span> <span class="val">192.168.1.10</span>
  </div>

  <div class="warning">
    If you forget to enable IP forwarding, the victim loses internet connectivity — which is extremely noisy and will alert them (and the SOC). Always enable forwarding before spoofing.
  </div>

  <h2>Man-in-the-Middle (MITM) Attacks</h2>
  <p>Once you're positioned between the victim and the gateway via ARP spoofing, you can:</p>

  <ul>
    <li><strong>Sniff credentials</strong> — Capture HTTP login forms, FTP passwords, Telnet sessions</li>
    <li><strong>Modify traffic</strong> — Inject malicious content into web pages</li>
    <li><strong>DNS spoofing</strong> — Redirect domains to your server</li>
    <li><strong>SSL stripping</strong> — Downgrade HTTPS to HTTP</li>
  </ul>

  <h3>Tools for MITM</h3>
  <table class="port-table">
    <thead>
      <tr><th>Tool</th><th>Purpose</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">ettercap</td><td>All-in-one MITM framework (ARP spoof + sniff + inject)</td></tr>
      <tr><td class="port-num">bettercap</td><td>Modern MITM framework, Swiss Army knife for network attacks</td></tr>
      <tr><td class="port-num">mitmproxy</td><td>Interactive HTTPS proxy for inspecting/modifying web traffic</td></tr>
      <tr><td class="port-num">Wireshark</td><td>Packet capture and analysis</td></tr>
      <tr><td class="port-num">tcpdump</td><td>Command-line packet capture</td></tr>
    </tbody>
  </table>

  <h2>Packet Sniffing with Wireshark</h2>
  <p>Wireshark captures and analyzes network packets. After a MITM attack, you can capture the victim's traffic and analyze it.</p>

  <div class="key-point">
    <strong>Useful Wireshark filters:</strong><br>
    <code>http.request.method == "POST"</code> — Find login forms<br>
    <code>ftp</code> — Find FTP traffic (credentials in plain text)<br>
    <code>tcp.port == 23</code> — Find Telnet traffic<br>
    <code>dns</code> — Find DNS queries (see what sites the victim visits)<br>
    <code>http.cookie</code> — Find session cookies
  </div>

  <div class="hacker-note">
    Modern HTTPS encryption prevents you from reading encrypted web traffic even with MITM positioning. But many internal services still use plain HTTP, FTP, Telnet, or SNMP — and those are completely visible.
  </div>

  <h2>DNS Poisoning</h2>
  <p>After positioning yourself as MITM, you can intercept DNS queries and return fake responses:</p>

  <ol>
    <li>Victim's browser asks: "What's the IP of bank.com?"</li>
    <li>You intercept the DNS query</li>
    <li>You respond: "bank.com is at 192.168.1.100" (your machine)</li>
    <li>Victim's browser connects to YOUR server instead of the real bank</li>
    <li>You serve a fake login page, capture credentials</li>
  </ol>

  <h2>DHCP Attacks</h2>

  <h3>DHCP Starvation</h3>
  <p>Flood the DHCP server with fake requests to exhaust its IP pool. New legitimate devices can't get IP addresses.</p>

  <h3>Rogue DHCP Server</h3>
  <p>Set up your own DHCP server that responds faster than the real one. Assign YOUR machine as the default gateway → instant MITM without ARP spoofing.</p>

  <h2>Wireless Network Attacks</h2>

  <h3>WPA/WPA2 Cracking</h3>
  <div class="code-block">
    <span class="code-label">WiFi Cracking Flow</span>
<span class="comment"># 1. Put wireless card in monitor mode</span>
<span class="cmd">airmon-ng start</span> <span class="val">wlan0</span>

<span class="comment"># 2. Discover nearby networks</span>
<span class="cmd">airodump-ng</span> <span class="val">wlan0mon</span>

<span class="comment"># 3. Capture handshake from target network</span>
<span class="cmd">airodump-ng</span> <span class="flag">-c 6 --bssid AA:BB:CC:DD:EE:FF -w capture</span> <span class="val">wlan0mon</span>

<span class="comment"># 4. Force a client to reconnect (deauth attack)</span>
<span class="cmd">aireplay-ng</span> <span class="flag">-0 5 -a AA:BB:CC:DD:EE:FF</span> <span class="val">wlan0mon</span>

<span class="comment"># 5. Crack the captured handshake</span>
<span class="cmd">aircrack-ng</span> <span class="flag">-w /usr/share/wordlists/rockyou.txt</span> <span class="val">capture-01.cap</span>
  </div>

  <h3>Evil Twin Attack</h3>
  <p>Create a fake WiFi access point with the same name as a legitimate network. Victims connect to your AP instead, routing all traffic through you.</p>

  <h2>LLMNR/NBT-NS Poisoning (Windows Networks)</h2>
  <p>When a Windows machine can't resolve a hostname via DNS, it falls back to <strong>LLMNR</strong> (Link-Local Multicast Name Resolution) and <strong>NBT-NS</strong> (NetBIOS Name Service) — which broadcast the query to the entire local network.</p>

  <div class="code-block">
    <span class="code-label">Responder — LLMNR Poisoning</span>
<span class="comment"># Start Responder to capture hashes</span>
<span class="cmd">responder</span> <span class="flag">-I eth0 -rdwv</span>

<span class="comment"># When a Windows machine broadcasts a name query,</span>
<span class="comment"># Responder responds with YOUR IP</span>
<span class="comment"># The victim authenticates to you → you capture their NTLMv2 hash</span>

<span class="comment"># Crack the captured hash</span>
<span class="cmd">hashcat</span> <span class="flag">-m 5600</span> <span class="val">hash.txt</span> <span class="val">/usr/share/wordlists/rockyou.txt</span>
  </div>

  <div class="hacker-note">
    LLMNR poisoning with Responder is one of the most effective attacks during an internal Windows pentest. You can often capture domain credentials within minutes of being plugged into the network. This is a must-know for the eJPT and real-world pentesting.
  </div>

  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">10 questions on network attacks. Score 70%+ for full XP.</p>
    <button class="btn-primary quiz-start-btn" id="start-quiz-btn">Start Field Test</button>
    <br><br>
    <button class="btn-secondary" id="complete-topic-btn">Mark as Complete (Skip Quiz)</button>
  </div>
</article>`;
}

export const quiz = [
  {
    type: 'mcq',
    question: 'What must you enable before performing ARP spoofing to avoid disconnecting the victim?',
    options: ['Port forwarding', 'IP forwarding', 'DNS forwarding', 'MAC forwarding'],
    correct: 1,
    explanation: 'IP forwarding (echo 1 > /proc/sys/net/ipv4/ip_forward) ensures traffic is forwarded to its real destination after passing through your machine. Without it, the victim loses connectivity.'
  },
  {
    type: 'mcq',
    question: 'Why does ARP spoofing work?',
    options: [
      'ARP uses strong encryption',
      'ARP has no authentication — anyone can send fake ARP replies',
      'ARP only works on wireless networks',
      'Routers don\'t check ARP packets'
    ],
    correct: 1,
    explanation: 'ARP is a trust-based protocol with zero authentication. Any device can claim to be any IP address by sending forged ARP replies.'
  },
  {
    type: 'mcq',
    question: 'What tool captures NTLMv2 hashes by responding to LLMNR/NBT-NS broadcasts on Windows networks?',
    options: ['Wireshark', 'Nmap', 'Responder', 'Metasploit'],
    correct: 2,
    explanation: 'Responder is specifically designed to poison LLMNR, NBT-NS, and MDNS queries and capture authentication hashes from Windows machines.'
  },
  {
    type: 'drag-match',
    question: 'Match each tool to its primary purpose:',
    pairs: [
      { label: 'Wireshark', value: 'Packet analysis' },
      { label: 'arpspoof', value: 'ARP poisoning' },
      { label: 'aircrack-ng', value: 'WiFi cracking' },
      { label: 'Responder', value: 'LLMNR poisoning' },
    ]
  },
  {
    type: 'mcq',
    question: 'During a MITM attack, why can\'t you read HTTPS traffic?',
    options: [
      'HTTPS uses a different port',
      'HTTPS encrypts data end-to-end, so intercepted packets are unreadable',
      'HTTPS blocks MITM attacks automatically',
      'You can always read HTTPS traffic in MITM'
    ],
    correct: 1,
    explanation: 'HTTPS encrypts traffic using TLS. Even if you intercept the packets via MITM, the data is encrypted and unreadable without the server\'s private key.'
  },
  {
    type: 'type-command',
    question: 'Start Wireshark-style capture of all FTP traffic. What Wireshark display filter shows only FTP packets?',
    scenario: 'Write the Wireshark display filter for FTP traffic.',
    validAnswers: ['ftp'],
    hint: 'It\'s just the protocol name...',
    explanation: 'In Wireshark, you can filter by protocol name. "ftp" shows all FTP control traffic. "ftp-data" shows FTP data transfers.'
  },
  {
    type: 'mcq',
    question: 'In a WiFi deauthentication attack, what is the purpose of sending deauth packets?',
    options: [
      'To crash the access point',
      'To force clients to reconnect, so you can capture the WPA handshake',
      'To change the WiFi password',
      'To decrypt existing traffic'
    ],
    correct: 1,
    explanation: 'Deauth packets force clients to disconnect and reconnect. During reconnection, the WPA 4-way handshake occurs, which you can capture and then crack offline.'
  },
  {
    type: 'mcq',
    question: 'What hashcat mode (-m) is used to crack NTLMv2 hashes captured by Responder?',
    options: ['-m 0 (MD5)', '-m 1000 (NTLM)', '-m 5600 (NTLMv2)', '-m 1800 (sha512crypt)'],
    correct: 2,
    explanation: 'Responder captures NTLMv2 (Net-NTLMv2) hashes, which use hashcat mode 5600. Don\'t confuse with NTLM (mode 1000) which is from SAM/hashdump.'
  },
  {
    type: 'mcq',
    question: 'What is an Evil Twin attack?',
    options: [
      'Cloning a target\'s MAC address',
      'Creating a fake WiFi access point with the same SSID as a legitimate network',
      'Running two instances of Metasploit',
      'Using two network interfaces simultaneously'
    ],
    correct: 1,
    explanation: 'An Evil Twin is a rogue WiFi access point that mimics a legitimate network\'s SSID. Victims connect to it thinking it\'s the real network, routing all their traffic through the attacker.'
  },
  {
    type: 'mcq',
    question: 'Most network-based attacks (ARP spoofing, MITM, LLMNR poisoning) require the attacker to be:',
    options: [
      'On the internet',
      'On the same local network as the target',
      'On a different subnet',
      'Connected via VPN'
    ],
    correct: 1,
    explanation: 'ARP, LLMNR, and similar protocols operate at Layer 2 (local network). The attacker must be on the same LAN segment as the target for these attacks to work.'
  },
];

export function bindInteractives() {}
