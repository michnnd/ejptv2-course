export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Assessment Methodologies</div>
    <h1 class="lesson-title">Vulnerability Assessment</h1>
    <div class="lesson-meta">
      <span>⏱ ~35 min</span>
      <span>⚡ 100 XP</span>
      <span>📋 Section 1</span>
    </div>
  </div>

  <div class="story-intro">
    The vulnerability scanner returned 247 findings. The junior analyst panicked. The senior pentester smiled — she knew only 3 of them actually mattered. Knowing the difference between a real vulnerability and scanner noise is what separates script kiddies from professionals.
  </div>

  <h2>What is Vulnerability Assessment?</h2>
  <p>Vulnerability assessment is the process of <strong>identifying, quantifying, and prioritizing</strong> security weaknesses in a system. Unlike penetration testing, you typically don't exploit the vulnerabilities — you find and report them.</p>

  <div class="analogy">
    Think of it like a building inspector. They walk through the building, check every door lock, window latch, and fire exit. They write a report saying "this door doesn't lock, that window is cracked." They don't actually break in — they just tell you what's weak. A pentester would be the person who actually tries to break in through those weak points.
  </div>

  <div class="key-point">
    In the real world (and on the eJPT), vulnerability assessment and penetration testing overlap heavily. You scan for vulns, then exploit the promising ones. The assessment phase tells you WHERE to focus your exploitation efforts.
  </div>

  <h2>The Vulnerability Assessment Process</h2>
  <ol>
    <li><strong>Asset Discovery</strong> — What's on the network? (You did this in scanning)</li>
    <li><strong>Vulnerability Scanning</strong> — Automated tools check for known weaknesses</li>
    <li><strong>Analysis</strong> — Review results, eliminate false positives</li>
    <li><strong>Prioritization</strong> — Focus on what matters most (CVSS scoring)</li>
    <li><strong>Reporting</strong> — Document findings with remediation advice</li>
  </ol>

  <h2>Vulnerability Scanners</h2>

  <h3>Nessus — The Industry Standard</h3>
  <p>Nessus is the most widely used vulnerability scanner. It has a massive database of known vulnerabilities and checks systems against them.</p>

  <p><strong>How Nessus works:</strong></p>
  <ol>
    <li>You define a scan target (IP range, specific hosts)</li>
    <li>Choose a scan policy (basic, full, web app, compliance)</li>
    <li>Nessus connects to each target, checks versions, tests for known vulns</li>
    <li>Results are categorized: Critical, High, Medium, Low, Info</li>
  </ol>

  <div class="code-block">
    <span class="code-label">Nessus Workflow</span>
<span class="comment"># 1. Start Nessus</span>
<span class="cmd">sudo systemctl start nessusd</span>

<span class="comment"># 2. Access the web interface</span>
<span class="val">https://localhost:8834</span>

<span class="comment"># 3. Create a new scan → Basic Network Scan</span>
<span class="comment"># 4. Enter target IPs</span>
<span class="comment"># 5. Launch scan and wait</span>
<span class="comment"># 6. Review results sorted by severity</span>
  </div>

  <h3>OpenVAS — Free Alternative</h3>
  <p>OpenVAS (now Greenbone) is the open-source alternative to Nessus. Less polished UI but functionally similar and completely free.</p>

  <h3>Nmap NSE for Vuln Scanning</h3>
  <p>Nmap itself can do basic vulnerability scanning using its scripting engine:</p>

  <div class="code-block">
    <span class="code-label">Nmap Vuln Scan</span>
<span class="comment"># Run all vuln category scripts</span>
<span class="cmd">nmap</span> <span class="flag">--script vuln</span> <span class="val">10.10.10.5</span>

<span class="comment"># Check for specific vulnerabilities</span>
<span class="cmd">nmap</span> <span class="flag">--script smb-vuln-ms17-010</span> <span class="val">10.10.10.5</span>  <span class="comment"># EternalBlue</span>
<span class="cmd">nmap</span> <span class="flag">--script http-shellshock</span> <span class="val">10.10.10.5</span>     <span class="comment"># Shellshock</span>
  </div>

  <div class="try-it">
    <p>Try running a vulnerability scan in the terminal:</p>
    <button class="try-cmd">nmap --script vuln 10.10.10.5</button>
  </div>

  <h2>CVE and CVSS — Understanding Vulnerability Severity</h2>

  <h3>CVE — Common Vulnerabilities and Exposures</h3>
  <p>Every known vulnerability gets a unique ID called a <strong>CVE</strong>. Format: <code>CVE-YEAR-NUMBER</code></p>

  <p>Examples:</p>
  <ul>
    <li><code>CVE-2017-0144</code> — EternalBlue (SMB RCE on Windows)</li>
    <li><code>CVE-2021-44228</code> — Log4Shell (Java logging library RCE)</li>
    <li><code>CVE-2021-41773</code> — Apache path traversal</li>
    <li><code>CVE-2014-6271</code> — Shellshock (Bash RCE)</li>
  </ul>

  <div class="hacker-note">
    When you find a service version (via nmap -sV), search for CVEs: <code>searchsploit apache 2.4.49</code> or search exploit-db.com. The CVE tells you what's vulnerable and there's usually a public exploit available.
  </div>

  <h3>CVSS — Scoring Vulnerability Severity</h3>
  <p>CVSS (Common Vulnerability Scoring System) rates vulnerabilities from <strong>0.0 to 10.0</strong>:</p>

  <table class="port-table">
    <thead>
      <tr><th>Score</th><th>Severity</th><th>Action</th><th>Example</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">9.0 - 10.0</td><td style="color: var(--accent-red);">Critical</td><td>Fix immediately</td><td>EternalBlue, Log4Shell</td></tr>
      <tr><td class="port-num">7.0 - 8.9</td><td style="color: var(--accent-orange);">High</td><td>Fix within days</td><td>SQL injection, RCE with auth</td></tr>
      <tr><td class="port-num">4.0 - 6.9</td><td style="color: var(--accent-yellow);">Medium</td><td>Fix within weeks</td><td>XSS, CSRF, info disclosure</td></tr>
      <tr><td class="port-num">0.1 - 3.9</td><td style="color: var(--accent-cyan);">Low</td><td>Fix when possible</td><td>Missing headers, version exposure</td></tr>
      <tr><td class="port-num">0.0</td><td style="color: var(--text-dim);">None</td><td>Informational</td><td>Open ports (not vulnerabilities)</td></tr>
    </tbody>
  </table>

  <p>CVSS considers several factors:</p>
  <ul>
    <li><strong>Attack Vector</strong> — Network (remote) vs Local vs Physical</li>
    <li><strong>Attack Complexity</strong> — How hard is it to exploit?</li>
    <li><strong>Privileges Required</strong> — Need to be authenticated?</li>
    <li><strong>User Interaction</strong> — Does the victim need to click something?</li>
    <li><strong>Impact</strong> — Confidentiality, Integrity, Availability</li>
  </ul>

  <div class="key-point">
    A vulnerability with <strong>Network attack vector + Low complexity + No privileges + No user interaction</strong> is the most dangerous kind — anyone on the internet can exploit it automatically. EternalBlue (CVSS 9.8) is exactly this type.
  </div>

  <h2>False Positives vs False Negatives</h2>

  <table class="port-table">
    <thead>
      <tr><th>Type</th><th>What it Means</th><th>Problem</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>False Positive</strong></td><td>Scanner says it's vulnerable, but it's not</td><td>Wastes time investigating non-issues</td></tr>
      <tr><td><strong>False Negative</strong></td><td>Scanner says it's safe, but it IS vulnerable</td><td>You miss a real vulnerability — much worse</td></tr>
    </tbody>
  </table>

  <div class="warning">
    Automated scanners are noisy. A typical scan might return 200+ findings, but 60-70% could be false positives. Your job is to validate findings — either by manual testing or by confirming the exact version matches the vulnerable version. Never trust a scanner blindly.
  </div>

  <h2>Prioritizing Vulnerabilities</h2>
  <p>When you get scan results, focus on these in order:</p>

  <ol>
    <li><strong>Remote Code Execution (RCE)</strong> — Can run commands? Game over. Exploit first.</li>
    <li><strong>Authentication Bypass</strong> — Can skip login? High priority.</li>
    <li><strong>SQL Injection</strong> — Can dump the database? High priority.</li>
    <li><strong>Default/Weak Credentials</strong> — Easy win, always check.</li>
    <li><strong>File Upload/Inclusion</strong> — Can upload a shell? Medium-high.</li>
    <li><strong>Information Disclosure</strong> — Leaks useful data for further attacks.</li>
    <li><strong>Missing Headers/Configs</strong> — Low severity, note and move on.</li>
  </ol>

  <h2>Vulnerability Databases</h2>
  <table class="port-table">
    <thead>
      <tr><th>Resource</th><th>URL</th><th>What it Has</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Exploit-DB</strong></td><td>exploit-db.com</td><td>Exploits with POC code</td></tr>
      <tr><td><strong>CVE Details</strong></td><td>cvedetails.com</td><td>CVE info and CVSS scores</td></tr>
      <tr><td><strong>NVD</strong></td><td>nvd.nist.gov</td><td>Official US vulnerability database</td></tr>
      <tr><td><strong>SearchSploit</strong></td><td>CLI tool (local)</td><td>Offline Exploit-DB search</td></tr>
      <tr><td><strong>Packet Storm</strong></td><td>packetstormsecurity.com</td><td>Exploits and advisories</td></tr>
    </tbody>
  </table>

  <div class="try-it">
    <p>Search for exploits in the terminal:</p>
    <button class="try-cmd">searchsploit apache 2.4</button>
    <button class="try-cmd">searchsploit vsftpd</button>
    <button class="try-cmd">searchsploit samba</button>
  </div>

  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">8 questions on vulnerability assessment. Score 70%+ for full XP.</p>
    <button class="btn-primary quiz-start-btn" id="start-quiz-btn">Start Field Test</button>
    <br><br>
    <button class="btn-secondary" id="complete-topic-btn">Mark as Complete (Skip Quiz)</button>
  </div>
</article>`;
}

export const quiz = [
  {
    type: 'mcq',
    question: 'What is the main difference between vulnerability assessment and penetration testing?',
    options: [
      'Vulnerability assessment uses automated tools, pentesting uses manual tools',
      'Vulnerability assessment identifies weaknesses, pentesting actually exploits them',
      'Vulnerability assessment is faster',
      'There is no difference'
    ],
    correct: 1,
    explanation: 'Vulnerability assessment focuses on finding and reporting vulnerabilities. Penetration testing goes further by actually exploiting those vulnerabilities to demonstrate real impact.'
  },
  {
    type: 'mcq',
    question: 'A vulnerability has CVSS score 9.8 with Network attack vector, Low complexity, No privileges required. What type of vulnerability is this?',
    options: [
      'A local privilege escalation',
      'A critical remote code execution that anyone can exploit',
      'A medium-severity XSS',
      'A denial of service'
    ],
    correct: 1,
    explanation: 'Network vector + Low complexity + No auth = remotely exploitable by anyone with zero effort. Score 9.8 is Critical. Think EternalBlue or Log4Shell.'
  },
  {
    type: 'type-command',
    question: 'You want to use Nmap to check if a target at 10.10.10.5 is vulnerable to EternalBlue (MS17-010). Write the command:',
    scenario: 'Check for EternalBlue vulnerability using Nmap scripts.',
    validAnswers: [
      'nmap --script smb-vuln-ms17-010 10.10.10.5',
      'nmap 10.10.10.5 --script smb-vuln-ms17-010',
      'nmap --script=smb-vuln-ms17-010 10.10.10.5',
    ],
    hint: 'nmap --script smb-vuln-...',
    explanation: 'nmap --script smb-vuln-ms17-010 checks specifically for the EternalBlue vulnerability (CVE-2017-0144).'
  },
  {
    type: 'mcq',
    question: 'Which is MORE dangerous: a false positive or a false negative?',
    options: [
      'False positive — it clutters the report',
      'False negative — you miss a real vulnerability',
      'They are equally dangerous',
      'Neither is dangerous'
    ],
    correct: 1,
    explanation: 'A false negative means the scanner says you\'re safe when you\'re actually vulnerable. This is much worse than a false positive (which just wastes investigation time).'
  },
  {
    type: 'drag-match',
    question: 'Match each CVE to its vulnerability:',
    pairs: [
      { label: 'CVE-2017-0144', value: 'EternalBlue' },
      { label: 'CVE-2021-44228', value: 'Log4Shell' },
      { label: 'CVE-2014-6271', value: 'Shellshock' },
      { label: 'CVE-2021-41773', value: 'Apache Path Traversal' },
    ]
  },
  {
    type: 'mcq',
    question: 'You ran a Nessus scan and got 200 findings. What should you do first?',
    options: [
      'Report all 200 findings as-is',
      'Sort by severity and focus on Critical/High findings first',
      'Ignore all of them — scanners are unreliable',
      'Only look at Low severity findings'
    ],
    correct: 1,
    explanation: 'Always sort by severity and focus on Critical/High first. Many findings will be false positives or informational. Validate the high-severity ones manually.'
  },
  {
    type: 'type-command',
    question: 'Search for known exploits for "vsftpd" using the local exploit database:',
    scenario: 'Find exploits for vsftpd in the offline database.',
    validAnswers: [
      'searchsploit vsftpd',
    ],
    hint: 'searchsploit ...',
    explanation: 'searchsploit searches the local copy of Exploit-DB for matching exploits.'
  },
  {
    type: 'mcq',
    question: 'Which vulnerability should you exploit FIRST during a pentest?',
    options: [
      'Missing X-Frame-Options header',
      'Remote Code Execution on an exposed service',
      'Self-signed SSL certificate',
      'Server version disclosure'
    ],
    correct: 1,
    explanation: 'RCE is the highest impact vulnerability — it gives you direct command execution on the target. Always prioritize RCE over information disclosure or missing headers.'
  },
];

export function bindInteractives() {}
