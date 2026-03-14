export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Auditing Fundamentals</div>
    <h1 class="lesson-title">Auditing Fundamentals</h1>
    <div class="lesson-meta">
      <span>⏱ ~25 min</span>
      <span>⚡ 80 XP</span>
      <span>📝 Section 2</span>
    </div>
  </div>

  <div class="story-intro">
    During a routine compliance audit at a Fortune 500 company, the auditor noticed something strange — unauthorized outbound connections from a database server. What started as a checkbox exercise uncovered an APT group that had been silently exfiltrating customer data for 18 months. Sometimes the most boring part of security saves everything.
  </div>

  <h2>What is Security Auditing?</h2>
  <p>Security auditing is the systematic evaluation of an organization's security posture against established standards, policies, and best practices. It answers the question: <strong>"Are we actually as secure as we think we are?"</strong></p>

  <div class="analogy">
    Think of a security audit like a health checkup. A doctor doesn't just treat you when you're sick — they run regular checkups to catch problems before they become emergencies. A security audit is a checkup for your organization's defenses.
  </div>

  <h2>Why Auditing Matters for Pentesters</h2>
  <p>As a pentester, understanding auditing helps you in several ways:</p>
  <ul>
    <li><strong>Scope understanding</strong> — Audits define what's in/out of scope for testing</li>
    <li><strong>Compliance context</strong> — Many pentests are driven by compliance requirements</li>
    <li><strong>Reporting</strong> — Your pentest report maps to audit frameworks</li>
    <li><strong>Career growth</strong> — Many senior security roles blend pentesting with auditing</li>
  </ul>

  <h2>Major Compliance Frameworks</h2>

  <table class="port-table">
    <thead>
      <tr><th>Framework</th><th>Full Name</th><th>Who Needs It</th><th>Focus</th></tr>
    </thead>
    <tbody>
      <tr><td class="port-num">PCI-DSS</td><td>Payment Card Industry Data Security Standard</td><td>Anyone handling credit cards</td><td>Protecting cardholder data</td></tr>
      <tr><td class="port-num">HIPAA</td><td>Health Insurance Portability and Accountability Act</td><td>Healthcare organizations (US)</td><td>Protecting patient health information</td></tr>
      <tr><td class="port-num">ISO 27001</td><td>International Standard for Information Security</td><td>Any organization globally</td><td>Information Security Management System</td></tr>
      <tr><td class="port-num">SOC 2</td><td>Service Organization Control 2</td><td>Service providers (SaaS, cloud)</td><td>Trust principles: security, availability, etc.</td></tr>
      <tr><td class="port-num">GDPR</td><td>General Data Protection Regulation</td><td>Anyone with EU customer data</td><td>Data privacy and protection</td></tr>
      <tr><td class="port-num">NIST</td><td>National Institute of Standards and Technology</td><td>US government agencies</td><td>Comprehensive security controls</td></tr>
    </tbody>
  </table>

  <div class="hacker-note">
    PCI-DSS <strong>requires</strong> annual penetration testing. Many of your pentest clients will hire you specifically because PCI compliance demands it. Understanding what PCI requires helps you scope and report effectively.
  </div>

  <h2>The CIA Triad</h2>
  <p>The foundation of all information security:</p>

  <ul>
    <li><strong style="color: var(--accent-green);">Confidentiality</strong> — Only authorized people can access data. Threats: data breaches, unauthorized access, eavesdropping.</li>
    <li><strong style="color: var(--accent-cyan);">Integrity</strong> — Data hasn't been tampered with. Threats: unauthorized modifications, man-in-the-middle attacks, SQL injection.</li>
    <li><strong style="color: var(--accent-orange);">Availability</strong> — Systems are accessible when needed. Threats: DDoS attacks, ransomware, hardware failure.</li>
  </ul>

  <div class="key-point">
    Every vulnerability you find in a pentest violates one or more parts of the CIA triad. When writing your report, frame findings in CIA terms: "This SQL injection vulnerability compromises <strong>Confidentiality</strong> (data extraction) and <strong>Integrity</strong> (data modification)."
  </div>

  <h2>Security Controls</h2>
  <p>Controls are the safeguards organizations put in place. They fall into three categories:</p>

  <table class="port-table">
    <thead>
      <tr><th>Type</th><th>Purpose</th><th>Examples</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Preventive</strong></td><td>Stop attacks before they happen</td><td>Firewalls, access controls, encryption, MFA</td></tr>
      <tr><td><strong>Detective</strong></td><td>Identify attacks in progress</td><td>IDS/IPS, SIEM, log monitoring, antivirus</td></tr>
      <tr><td><strong>Corrective</strong></td><td>Fix problems after they occur</td><td>Backups, incident response, patching</td></tr>
    </tbody>
  </table>

  <p>Controls can also be:</p>
  <ul>
    <li><strong>Technical</strong> — Technology-based (firewalls, encryption)</li>
    <li><strong>Administrative</strong> — Policy-based (security policies, training)</li>
    <li><strong>Physical</strong> — Physical barriers (locked doors, cameras, guards)</li>
  </ul>

  <h2>Risk Assessment</h2>
  <p>Risk is calculated as: <strong>Risk = Threat × Vulnerability × Impact</strong></p>

  <div class="analogy">
    Your house has a window (vulnerability). There are burglars in your neighborhood (threat). You have expensive jewelry inside (impact/asset value). The combination of all three determines your risk level. No burglars = low risk even with a weak window. No valuables = low impact even if someone breaks in.
  </div>

  <h2>Types of Security Assessments</h2>
  <table class="port-table">
    <thead>
      <tr><th>Assessment</th><th>Depth</th><th>Exploits?</th><th>Goal</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Vulnerability Scan</strong></td><td>Shallow — automated</td><td>No</td><td>Find known vulnerabilities</td></tr>
      <tr><td><strong>Vulnerability Assessment</strong></td><td>Medium — scan + analysis</td><td>No</td><td>Find and prioritize vulnerabilities</td></tr>
      <tr><td><strong>Penetration Test</strong></td><td>Deep — manual + automated</td><td>Yes</td><td>Prove exploitability, test defenses</td></tr>
      <tr><td><strong>Red Team</strong></td><td>Full — adversary simulation</td><td>Yes, stealth</td><td>Test detection and response capabilities</td></tr>
    </tbody>
  </table>

  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">8 questions on auditing fundamentals. Score 70%+ for full XP.</p>
    <button class="btn-primary quiz-start-btn" id="start-quiz-btn">Start Field Test</button>
    <br><br>
    <button class="btn-secondary" id="complete-topic-btn">Mark as Complete (Skip Quiz)</button>
  </div>
</article>`;
}

export const quiz = [
  {
    type: 'mcq',
    question: 'What does the "I" in the CIA triad stand for?',
    options: ['Intelligence', 'Integration', 'Integrity', 'Infrastructure'],
    correct: 2,
    explanation: 'CIA = Confidentiality, Integrity, Availability. Integrity means data hasn\'t been tampered with or modified by unauthorized parties.'
  },
  {
    type: 'mcq',
    question: 'Which compliance framework REQUIRES annual penetration testing?',
    options: ['GDPR', 'HIPAA', 'PCI-DSS', 'ISO 27001'],
    correct: 2,
    explanation: 'PCI-DSS (Payment Card Industry Data Security Standard) explicitly requires annual penetration testing for organizations handling credit card data.'
  },
  {
    type: 'drag-match',
    question: 'Match each security control to its type:',
    pairs: [
      { label: 'Firewall', value: 'Preventive' },
      { label: 'IDS/IPS', value: 'Detective' },
      { label: 'Backup restore', value: 'Corrective' },
      { label: 'Security camera', value: 'Detective' },
    ]
  },
  {
    type: 'mcq',
    question: 'What is the main difference between a penetration test and a red team engagement?',
    options: [
      'Red teams use automated tools only',
      'Penetration tests don\'t use exploits',
      'Red teams simulate real adversaries with stealth, testing detection capabilities',
      'There is no difference'
    ],
    correct: 2,
    explanation: 'Red team engagements simulate real adversaries — they operate stealthily over extended periods to test if the organization can detect and respond to attacks. Pentests are more focused and don\'t emphasize stealth.'
  },
  {
    type: 'mcq',
    question: 'A SQL injection vulnerability that allows an attacker to read and modify database records violates which parts of the CIA triad?',
    options: [
      'Only Confidentiality',
      'Only Integrity',
      'Confidentiality and Integrity',
      'All three: Confidentiality, Integrity, and Availability'
    ],
    correct: 2,
    explanation: 'Reading data = Confidentiality breach. Modifying data = Integrity breach. Unless the attacker also causes a denial of service, Availability is not affected.'
  },
  {
    type: 'mcq',
    question: 'Risk = Threat × Vulnerability × ___?',
    options: ['Exposure', 'Impact', 'Probability', 'Cost'],
    correct: 1,
    explanation: 'Risk = Threat × Vulnerability × Impact. Even a highly exploitable vulnerability with no valuable assets behind it represents low risk because the impact is minimal.'
  },
  {
    type: 'mcq',
    question: 'Which type of security control is a company security policy?',
    options: ['Technical', 'Administrative', 'Physical', 'Corrective'],
    correct: 1,
    explanation: 'Security policies are administrative controls — they\'re policy-based rules and procedures. Technical controls are technology (firewalls, encryption). Physical controls are barriers (locks, cameras).'
  },
  {
    type: 'mcq',
    question: 'Your client handles medical records in the US. Which compliance framework are they most likely subject to?',
    options: ['PCI-DSS', 'HIPAA', 'SOC 2', 'GDPR'],
    correct: 1,
    explanation: 'HIPAA (Health Insurance Portability and Accountability Act) governs the protection of patient health information in the United States.'
  },
];

export function bindInteractives() {}
