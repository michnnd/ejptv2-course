export function render() {
  return `
<article class="lesson">
  <div class="lesson-header">
    <div class="lesson-section-tag">Host & Network Pentesting</div>
    <h1 class="lesson-title">Social Engineering</h1>
    <div class="lesson-meta">
      <span>⏱ ~20 min</span>
      <span>⚡ 80 XP</span>
      <span>🎭 Section 3</span>
    </div>
  </div>

  <div class="story-intro">
    The company had spent millions on firewalls, IDS/IPS, and endpoint protection. The pentester bypassed all of it with a single phone call. "Hi, this is Jake from IT support. We're seeing some unusual activity on your account — could you verify your password for me?" Three seconds of silence, then the employee read it out loud. No exploit code. No vulnerability scan. Just human nature.
  </div>

  <h2>What is Social Engineering?</h2>
  <p>Social engineering is the art of <strong>manipulating people</strong> into giving up confidential information or performing actions that compromise security. It targets the weakest link in any security system: <strong>humans</strong>.</p>

  <div class="analogy">
    The best lock in the world doesn't help if someone convinces the homeowner to open the door. Social engineering is the art of getting people to open doors they shouldn't.
  </div>

  <h2>Cialdini's 6 Principles of Influence</h2>
  <p>These psychological principles are the foundation of all social engineering:</p>

  <table class="port-table">
    <thead>
      <tr><th>Principle</th><th>How It Works</th><th>Attack Example</th></tr>
    </thead>
    <tbody>
      <tr><td><strong style="color: var(--accent-green);">Authority</strong></td><td>People obey authority figures</td><td>"I'm calling from the CEO's office..."</td></tr>
      <tr><td><strong style="color: var(--accent-cyan);">Urgency</strong></td><td>Time pressure bypasses critical thinking</td><td>"Your account will be locked in 5 minutes!"</td></tr>
      <tr><td><strong style="color: var(--accent-orange);">Social Proof</strong></td><td>People follow what others do</td><td>"Everyone in your department has already updated..."</td></tr>
      <tr><td><strong style="color: var(--accent-red);">Reciprocity</strong></td><td>People feel obligated to return favors</td><td>"I just fixed your printer issue, could you help me with..."</td></tr>
      <tr><td><strong style="color: var(--accent-purple);">Liking</strong></td><td>People comply with those they like</td><td>Building rapport before making requests</td></tr>
      <tr><td><strong style="color: var(--accent-yellow);">Scarcity</strong></td><td>Limited availability increases desire</td><td>"Only 2 spots left in the security training..."</td></tr>
    </tbody>
  </table>

  <h2>Types of Social Engineering Attacks</h2>

  <h3>Phishing</h3>
  <p>Sending fraudulent emails that appear to come from trusted sources to steal credentials or deliver malware.</p>
  <ul>
    <li><strong>Mass Phishing</strong> — Generic emails sent to thousands of people</li>
    <li><strong>Spear Phishing</strong> — Targeted at specific individuals with personalized content</li>
    <li><strong>Whaling</strong> — Spear phishing targeting executives (CEO, CFO)</li>
    <li><strong>Clone Phishing</strong> — Copying a legitimate email and replacing links/attachments</li>
  </ul>

  <div class="hacker-note">
    Phishing is the #1 initial access vector in real-world breaches. Most APT groups start with a spear phishing email. As a pentester, being able to craft convincing phishing campaigns is a valuable skill.
  </div>

  <h3>Vishing (Voice Phishing)</h3>
  <p>Phone-based social engineering. Calling targets while pretending to be IT support, a vendor, or authority figure.</p>

  <h3>Smishing (SMS Phishing)</h3>
  <p>Phishing via text messages. "Your package delivery failed, click here to reschedule."</p>

  <h3>Pretexting</h3>
  <p>Creating a fabricated scenario (pretext) to engage the victim. Example: pretending to be a new employee who needs help accessing systems.</p>

  <h3>Baiting</h3>
  <p>Leaving infected USB drives in parking lots, lobbies, or common areas. Curiosity drives people to plug them in.</p>

  <div class="key-point">
    A study found that <strong>45% of people</strong> who found a USB drive in a parking lot plugged it into their computer. Label it "Confidential - Salary Data" and that number goes even higher.
  </div>

  <h3>Tailgating / Piggybacking</h3>
  <p>Following an authorized person through a secure door. "Hey, could you hold the door? My badge isn't working."</p>

  <h2>Social Engineering Toolkit (SET)</h2>
  <p>SET is a tool in Kali Linux for automating social engineering attacks:</p>

  <div class="code-block">
    <span class="code-label">SET Features</span>
<span class="cmd">setoolkit</span>

<span class="comment"># Options include:</span>
<span class="comment"># 1. Spear-Phishing Attack Vectors (email with payload)</span>
<span class="comment"># 2. Website Attack Vectors (credential harvester, site cloner)</span>
<span class="comment"># 3. Infectious Media Generator (autorun USB payloads)</span>
<span class="comment"># 4. QRCode Generator (malicious QR codes)</span>
  </div>

  <h3>Credential Harvester with SET</h3>
  <p>Clone a website's login page and host it on your machine. When the victim enters their credentials, you capture them:</p>
  <ol>
    <li>SET > Social-Engineering Attacks > Website Attack Vectors</li>
    <li>Credential Harvester Attack Method</li>
    <li>Site Cloner > Enter target URL (e.g., gmail.com)</li>
    <li>SET hosts the cloned page on your IP</li>
    <li>Send the victim a link to your IP (via phishing email)</li>
    <li>Victim enters credentials → you capture them</li>
  </ol>

  <h2>Defending Against Social Engineering</h2>
  <ul>
    <li><strong>Security awareness training</strong> — Regular phishing simulations</li>
    <li><strong>Multi-factor authentication</strong> — Stolen passwords alone aren't enough</li>
    <li><strong>Verification procedures</strong> — Always verify identity through a separate channel</li>
    <li><strong>Clear policies</strong> — "IT will never ask for your password"</li>
    <li><strong>Physical security</strong> — Badge access, no tailgating, visitor policies</li>
  </ul>

  <div class="section-complete">
    <div class="check">🎯</div>
    <h2>Ready to Test Your Knowledge?</h2>
    <p style="color: var(--text-dim); margin-bottom: 8px;">8 questions on social engineering. Score 70%+ for full XP.</p>
    <button class="btn-primary quiz-start-btn" id="start-quiz-btn">Start Field Test</button>
    <br><br>
    <button class="btn-secondary" id="complete-topic-btn">Mark as Complete (Skip Quiz)</button>
  </div>
</article>`;
}

export const quiz = [
  { type: 'mcq', question: 'Which social engineering principle is used when an attacker says "Your account will be locked in 5 minutes unless you verify your password"?', options: ['Authority', 'Reciprocity', 'Urgency/Scarcity', 'Social Proof'], correct: 2, explanation: 'Creating time pressure (urgency) bypasses critical thinking and makes people act without verifying.' },
  { type: 'drag-match', question: 'Match each attack type to its description:', pairs: [ { label: 'Mass fraudulent emails', value: 'Phishing' }, { label: 'Phone-based deception', value: 'Vishing' }, { label: 'Following through secure doors', value: 'Tailgating' }, { label: 'Infected USB drives', value: 'Baiting' } ] },
  { type: 'mcq', question: 'What is spear phishing?', options: ['Random mass emails to millions', 'Targeted phishing aimed at specific individuals', 'Phone-based social engineering', 'Physical break-in attempts'], correct: 1, explanation: 'Spear phishing targets specific individuals with personalized content based on research about the target, making it much more convincing than mass phishing.' },
  { type: 'mcq', question: 'What tool in Kali Linux can clone a website\'s login page to capture credentials?', options: ['Nmap', 'Metasploit', 'Social Engineering Toolkit (SET)', 'Burp Suite'], correct: 2, explanation: 'SET\'s Website Attack Vectors > Credential Harvester > Site Cloner can clone any login page and capture credentials entered by victims.' },
  { type: 'mcq', question: 'What is the BEST defense against phishing attacks?', options: ['Stronger firewalls', 'Better antivirus', 'Security awareness training + MFA', 'Blocking all email'], correct: 2, explanation: 'Training helps people recognize phishing, and MFA ensures that even if credentials are stolen, the attacker can\'t access accounts without the second factor.' },
  { type: 'mcq', question: 'Whaling is a form of phishing that specifically targets:', options: ['Random employees', 'IT administrators', 'C-level executives (CEO, CFO)', 'Security teams'], correct: 2, explanation: 'Whaling targets high-value individuals like executives, who often have elevated access and authority to approve financial transactions.' },
  { type: 'mcq', question: 'An attacker calls the helpdesk pretending to be a new employee who needs a password reset. This is an example of:', options: ['Phishing', 'Pretexting', 'Baiting', 'Tailgating'], correct: 1, explanation: 'Pretexting involves creating a fabricated scenario (pretext) to manipulate the target. The fake "new employee" story is a classic pretext.' },
  { type: 'mcq', question: 'What percentage of people who find a USB drive in a parking lot will plug it into their computer?', options: ['About 5%', 'About 15%', 'About 45%', 'About 80%'], correct: 2, explanation: 'Studies have shown approximately 45% of people who find a USB drive will plug it in. Curiosity is a powerful motivator that bypasses security training.' },
];

export function bindInteractives() {}
