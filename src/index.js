// Alexa Amundson — 20 Live Resume Dashboards
// Cloudflare Worker serving brand-locked resume pages with live KPI data

const ROLES = [
  { slug: 'devops', num: '01', title: 'Senior DevOps Engineer', accent: '#FF6B2B',
    summary: 'DevOps engineer operating a 7-node distributed infrastructure spanning edge devices and cloud, with 52 automated tasks, 256 managed systemd services, and 99 Cloudflare deployments.',
    sections: [
      { title: 'Infrastructure Operations', bullets: [
        'Operate 5 Raspberry Pi nodes + 2 DigitalOcean droplets with WireGuard mesh VPN',
        'Manage 256 systemd services and 35 timers with self-healing autonomy scripts',
        'Deploy and maintain Docker containers via Docker Swarm orchestration',
        'Route 48+ custom domains through 4 Cloudflare tunnels to backend services',
      ]},
      { title: 'CI/CD & Automation', bullets: [
        'Built 223 CLI tools for infrastructure management and deployment',
        'Maintain Mac cron jobs + fleet timers for continuous automation',
        'Operate GitHub Actions CI/CD and self-hosted Gitea (207 repos)',
        'Automated GitHub-to-Gitea relay syncing every 30 minutes',
      ]},
      { title: 'Cloud Infrastructure', bullets: [
        'Deployed 101 Pages projects, 25 D1 databases, 47 KV namespaces, 11 R2 buckets',
        'Manage Cloudflare Workers for edge compute and API routing',
      ]},
      { title: 'Monitoring & Reliability', bullets: [
        'Built daily KPI system tracking 60+ metrics across 9 collectors',
        'Fleet power optimization with CPU governor tuning and voltage monitoring',
        'Self-healing cron autonomy on all nodes (heartbeat 1m, heal 5m)',
      ]},
    ],
    skills: ['Linux/Debian', 'Docker Swarm', 'systemd', 'Nginx', 'WireGuard', 'Cloudflare', 'GitHub Actions', 'Bash', 'Python'],
    kpis: ['systemd_services', 'docker_containers', 'fleet_total', 'cf_pages', 'bin_tools', 'repos_total', 'nginx_sites'],
  },
  { slug: 'ai-ml', num: '02', title: 'AI/ML Engineer', accent: '#CC00AA',
    summary: 'AI/ML engineer operating 27 deployed language models (48.1 GB) across a distributed edge fleet with 52 TOPS of dedicated AI acceleration.',
    sections: [
      { title: 'Model Deployment & Operations', bullets: [
        'Deploy and manage 27 Ollama models (48.1 GB) across 3 edge nodes',
        'Fine-tuned 4 custom CECE personality models for domain-specific generation',
        'Operate 2x Hailo-8 NPUs (26 TOPS each = 52 TOPS total) for accelerated inference',
        'Built Ollama Bridge SSE proxy for streaming model responses to web clients',
      ]},
      { title: 'AI Infrastructure', bullets: [
        'Designed multi-node inference routing across Pi 5 fleet',
        'Built AI image generation hub with 4 backend agents (DALL-E, Flux, SDXL)',
        'Reduced inference node temperature from 73.8C to 57.9C by isolating runaway loops',
      ]},
      { title: 'Data & Knowledge Systems', bullets: [
        'Manage 230 SQLite databases for agent memory, metrics, and state',
        'Built FTS5 knowledge index across 156,675 memory entries',
        'Custom RoadC programming language with tree-walking interpreter',
      ]},
    ],
    skills: ['Ollama', 'Hailo-8 NPU', 'DALL-E', 'Flux', 'SDXL', 'FastAPI', 'Python', 'FTS5', 'Docker'],
    kpis: ['ollama_models', 'ollama_size_gb', 'total_loc', 'repos_total', 'sqlite_dbs', 'docker_containers'],
  },
  { slug: 'sre', num: '03', title: 'Site Reliability Engineer', accent: '#FF2255',
    summary: 'SRE managing a 7-node distributed fleet with 256 systemd services, 52 automated tasks, and self-healing autonomy. Tracks 60+ reliability metrics daily.',
    sections: [
      { title: 'Reliability & Uptime', bullets: [
        'Operate 5 Pi edge nodes + 2 cloud VMs with WireGuard mesh connectivity',
        'Self-healing cron automation: heartbeat every 1 minute, heal cycle every 5 minutes',
        'Monitor and resolve failed systemd units with automated restart policies',
      ]},
      { title: 'Incident Response', bullets: [
        'Resolved thermal throttling (73.8C to 57.9C) caused by runaway Ollama loops',
        'Fixed undervoltage via config.txt tuning (+95mV recovery)',
        'Discovered and removed obfuscated cron dropper (security incident)',
        'Migrated leaked credentials to secured env files (chmod 600)',
      ]},
      { title: 'Monitoring & Observability', bullets: [
        'Built 9-collector KPI system tracking 60+ metrics daily',
        'Distributed tracing database with nanosecond-precision spans',
        'Power monitoring deployed to all nodes (cron every 5 minutes)',
      ]},
    ],
    skills: ['systemd', 'cron', 'Nginx', 'Docker Swarm', 'WireGuard', 'Tailscale', 'distributed tracing', 'Bash', 'Python'],
    kpis: ['systemd_services', 'failed_units', 'fleet_total', 'fleet_online', 'avg_temp_c', 'docker_containers', 'nginx_sites'],
  },
  { slug: 'platform', num: '04', title: 'Platform Engineer', accent: '#8844FF',
    summary: 'Platform engineer who built a complete developer platform: 212 CLI tools, 1,810 repos, self-hosted Gitea, Cloudflare-native deployments, and daily automated observability.',
    sections: [
      { title: 'Developer Platform', bullets: [
        'Built 223 CLI tools (121 MB) for developer workflow automation',
        'Self-hosted Gitea with 207 repos across 7 organizations on fleet',
        '101 Cloudflare Pages projects with git-based CI/CD pipelines',
        'Custom code search engine indexing 354 repos with FTS5',
      ]},
      { title: 'Infrastructure Platform', bullets: [
        '7-node fleet with WireGuard mesh VPN and Tailscale overlay',
        '256 systemd services, 14 Docker containers, 48 Nginx sites',
        'RoadNet WiFi mesh (5 APs) for local device connectivity',
      ]},
      { title: 'Observability Platform', bullets: [
        '9-collector KPI system tracking 60+ metrics daily',
        'Fleet-wide power monitoring with thermal management',
        'Automated resume and reporting pipeline from live metrics',
      ]},
    ],
    skills: ['Cloudflare Pages/Workers', 'Gitea', 'GitHub Actions', 'Docker Swarm', 'CLI tooling', 'Bash', 'Python', 'FTS5'],
    kpis: ['bin_tools', 'repos_total', 'cf_pages', 'systemd_services', 'docker_containers', 'total_loc'],
  },
  { slug: 'fullstack', num: '05', title: 'Full-Stack Engineer', accent: '#4488FF',
    summary: 'Full-stack engineer with 7.2M+ lines of code across 1,600+ repositories in 20 languages. Builds end-to-end applications deployed across 101 Cloudflare Pages and 7 backend nodes.',
    sections: [
      { title: 'Frontend', bullets: [
        '75 design templates (HTML/JSX) with brand-locked design system',
        '101 Cloudflare Pages projects deployed across 48+ custom domains',
        'React/Next.js applications with real-time WebSocket integration',
      ]},
      { title: 'Backend', bullets: [
        'FastAPI services (CECE API, TTS API, Lucidia API) on edge fleet',
        'Node.js/Express services for API routing and webhooks',
        '48 Nginx reverse proxy sites routing to backend services',
      ]},
      { title: 'Databases', bullets: [
        '11 PostgreSQL + 230 SQLite + 25 D1 + 47 KV databases',
        'FTS5 full-text search indexing 354 repos',
      ]},
    ],
    skills: ['React', 'Next.js', 'FastAPI', 'Node.js', 'PostgreSQL', 'SQLite', 'Cloudflare D1/KV/R2', 'Docker', 'Nginx'],
    kpis: ['total_loc', 'repos_total', 'cf_pages', 'postgres_dbs', 'sqlite_dbs', 'nginx_sites', 'docker_containers'],
  },
  { slug: 'cloud', num: '06', title: 'Cloud Engineer', accent: '#00D4FF',
    summary: 'Cloud engineer managing hybrid edge-cloud infrastructure: 101 Pages, 25 D1, 47 KV, 11 R2, 2 droplets, and 5 edge nodes connected via WireGuard mesh.',
    sections: [
      { title: 'Cloudflare Platform', bullets: [
        '101 Pages projects with git-based CI/CD',
        '25 D1 serverless databases for application state',
        '47 KV namespaces for edge config and caching',
        '11 R2 object storage buckets for assets and models',
        '48+ custom domains through 4 Cloudflare tunnels',
      ]},
      { title: 'Hybrid Cloud Architecture', bullets: [
        '5 Pi edge nodes + 2 DigitalOcean droplets',
        'WireGuard mesh VPN + Tailscale overlay (9 peers)',
        'RoadNet WiFi mesh (5 APs) for local connectivity',
      ]},
    ],
    skills: ['Cloudflare Pages/Workers/D1/KV/R2/Tunnels', 'DigitalOcean', 'WireGuard', 'Tailscale', 'Docker', 'Nginx'],
    kpis: ['cf_pages', 'cf_d1_databases', 'cf_kv_namespaces', 'cf_r2_buckets', 'fleet_total', 'nginx_sites'],
  },
  { slug: 'infrastructure', num: '07', title: 'Infrastructure Engineer', accent: '#FF6B2B',
    summary: '7-node fleet infrastructure: 5 Raspberry Pi nodes, 2 cloud VMs, 52 TOPS AI acceleration, WireGuard mesh, and 707 GB distributed storage.',
    sections: [
      { title: 'Fleet Hardware', bullets: [
        '5 Raspberry Pi nodes (4x Pi 5, 1x Pi 400) + 2 DigitalOcean droplets',
        '2x Hailo-8 AI accelerators (52 TOPS total)',
        '20 GB fleet RAM, 707 GB fleet storage',
        'NVMe, USB peripherals, IR receivers, OLED displays',
      ]},
      { title: 'Network Infrastructure', bullets: [
        'WireGuard mesh VPN across all nodes (10.8.0.x)',
        '4 Cloudflare tunnels routing 48+ domains',
        'RoadNet WiFi mesh (5 APs, 5 subnets)',
        '48 Nginx reverse proxy sites',
      ]},
      { title: 'System Management', bullets: [
        '256 systemd services, 35 timers',
        'Power optimization: CPU governors, voltage tuning, thermal management',
        'Self-healing autonomy on all nodes',
      ]},
    ],
    skills: ['Raspberry Pi', 'Linux', 'WireGuard', 'Nginx', 'systemd', 'Docker Swarm', 'Hailo-8', 'NVMe'],
    kpis: ['fleet_total', 'fleet_online', 'fleet_disk_total_gb', 'fleet_mem_total_mb', 'systemd_services', 'nginx_sites'],
  },
  { slug: 'backend', num: '08', title: 'Backend Engineer', accent: '#FF2255',
    summary: 'Backend engineer operating 6+ production APIs, 283 databases across 5 engines, 14 Docker containers, and distributed services across a 7-node fleet.',
    sections: [
      { title: 'APIs & Services', bullets: [
        'CECE API (FastAPI) — custom LLM interaction and TTS',
        'Lucidia API (FastAPI) — application platform',
        'AI image generation API with 4 backend agents',
        'Code search engine indexing 354 repos',
        'Fleet health and KPI collection APIs',
      ]},
      { title: 'Databases (283 total)', bullets: [
        '11 PostgreSQL databases for relational data',
        '230 SQLite databases (1.4 GB) for app state',
        '22 Cloudflare D1 for serverless apps',
        '47 KV namespaces for edge caching',
        'FTS5 full-text search across 156K entries',
      ]},
    ],
    skills: ['Python/FastAPI', 'Node.js', 'PostgreSQL', 'SQLite/FTS5', 'D1', 'KV', 'Docker', 'Nginx', 'Redis'],
    kpis: ['postgres_dbs', 'sqlite_dbs', 'cf_d1_databases', 'cf_kv_namespaces', 'docker_containers', 'total_loc'],
  },
  { slug: 'systems', num: '09', title: 'Systems Engineer', accent: '#CC00AA',
    summary: 'Systems engineer: kernel tuning, Hailo-8 NPU integration, 256 systemd services, fleet power optimization, and custom hardware configurations across 5 Pi nodes.',
    sections: [
      { title: 'Kernel & System Tuning', bullets: [
        'CPU governor optimization (conservative mode, frequency capping)',
        'Swappiness, dirty_ratio, and VM tuning via sysctl',
        'GPU memory reduction (256MB to 16MB) for headless operation',
        'Overclock removal and voltage stabilization (+95mV recovery)',
      ]},
      { title: 'Hardware Integration', bullets: [
        '2x Hailo-8 NPU (52 TOPS) — PCIe driver, firmware, /dev/hailo0',
        'NVMe SSD on Octavia (1TB)',
        'USB peripherals: UART, SuperDrive, keyboards, microphones',
        'I2C OLED displays, IR receivers, GPIO management',
      ]},
      { title: 'Service Management', bullets: [
        '256 systemd services, 35 timers across fleet',
        'Self-healing watchdogs and autonomy scripts',
        'Power monitoring deployed to all nodes (cron */5)',
      ]},
    ],
    skills: ['Linux kernel', 'systemd', 'sysctl', 'PCIe', 'I2C', 'GPIO', 'Hailo-8', 'NVMe', 'Bash', 'Python'],
    kpis: ['systemd_services', 'systemd_timers', 'fleet_total', 'avg_temp_c', 'fleet_mem_total_mb', 'fleet_disk_total_gb'],
  },
  { slug: 'edge', num: '10', title: 'Edge Computing Engineer', accent: '#8844FF',
    summary: 'Edge computing engineer: 5 Pi nodes with on-device AI (52 TOPS), WiFi mesh network, local inference, and self-healing distributed services.',
    sections: [
      { title: 'Edge Nodes', bullets: [
        '5 Raspberry Pi nodes (4x Pi 5, 1x Pi 400) running Debian',
        '2x Hailo-8 AI accelerators for on-device inference',
        '27 Ollama models deployed across 3 inference nodes',
        'NVMe storage, OLED displays, IR receivers',
      ]},
      { title: 'Mesh Networking', bullets: [
        'RoadNet WiFi mesh: 5 APs, 5 subnets (10.10.x.0/24)',
        'WireGuard encrypted tunnels between all nodes',
        'Tailscale overlay for remote management (9 peers)',
        'Pi-hole DNS + custom DNS zones (.cece, .blackroad)',
      ]},
      { title: 'Edge AI', bullets: [
        'On-device LLM inference with thermal management',
        'Streaming SSE proxy for real-time model responses',
        '4 custom fine-tuned CECE models',
      ]},
    ],
    skills: ['Raspberry Pi', 'Hailo-8', 'Ollama', 'WireGuard', 'WiFi mesh', 'Pi-hole', 'Docker', 'Linux'],
    kpis: ['fleet_total', 'fleet_online', 'ollama_models', 'avg_temp_c', 'tailscale_peers', 'fleet_disk_total_gb'],
  },
  { slug: 'automation', num: '11', title: 'Automation Engineer', accent: '#4488FF',
    summary: 'Automation engineer: 212 CLI tools, 52 automated tasks, 9 KPI data collectors, self-healing fleet, and automated resume generation from live metrics.',
    sections: [
      { title: 'CLI Tools & Scripts', bullets: [
        '223 CLI tools (121 MB) in ~/bin for every operational task',
        '91 shell scripts for fleet management and deployment',
        'Custom brand compliance auditing and mass update tools',
        'Automated GitHub-to-Gitea relay syncing every 30 minutes',
      ]},
      { title: 'Scheduled Automation', bullets: [
        '17 Mac cron jobs + 35 fleet timers = 52 automated tasks',
        'Daily KPI collection at 6 AM across 9 data sources',
        'Self-healing autonomy scripts (heartbeat 1m, heal 5m)',
        'Power monitoring every 5 minutes on all nodes',
      ]},
      { title: 'Data Collection', bullets: [
        '9 collectors: GitHub, GitHub-deep, all-orgs, Gitea, fleet, services, autonomy, LOC, local, Cloudflare',
        '60+ KPIs tracked daily with day-over-day deltas',
        'Automated resume update pipeline from verified metrics',
      ]},
    ],
    skills: ['Bash', 'Python', 'cron', 'systemd timers', 'GitHub Actions', 'SSH automation', 'jq', 'curl'],
    kpis: ['bin_tools', 'home_scripts', 'mac_cron_jobs', 'systemd_timers', 'fleet_cron_jobs', 'repos_total'],
  },
  { slug: 'database', num: '12', title: 'Database Engineer', accent: '#00D4FF',
    summary: 'Database engineer managing 283 databases across 5 engines: PostgreSQL, SQLite, Cloudflare D1, KV stores, and Qdrant vector DB. FTS5 search across 156K entries.',
    sections: [
      { title: 'Database Fleet (283 total)', bullets: [
        '11 PostgreSQL databases for relational application data',
        '230 SQLite databases (1.4 GB) for agent memory and metrics',
        '22 Cloudflare D1 serverless databases',
        '47 KV namespaces for edge configuration',
        'Qdrant vector database for semantic search',
      ]},
      { title: 'Search & Indexing', bullets: [
        'FTS5 full-text search across 156,675 memory entries',
        'Code search engine indexing 354 repos',
        '111 registered systems in systems database',
      ]},
    ],
    skills: ['PostgreSQL', 'SQLite/FTS5', 'Cloudflare D1', 'KV stores', 'Qdrant', 'SQL', 'Python', 'database design'],
    kpis: ['postgres_dbs', 'sqlite_dbs', 'cf_d1_databases', 'cf_kv_namespaces', 'fts5_entries', 'systems_registered'],
  },
  { slug: 'network', num: '13', title: 'Network Engineer', accent: '#FF6B2B',
    summary: 'Network engineer: WireGuard mesh VPN, Tailscale overlay, RoadNet WiFi mesh (5 APs), 4 Cloudflare tunnels, 48 Nginx sites, Pi-hole DNS.',
    sections: [
      { title: 'VPN & Mesh', bullets: [
        'WireGuard mesh VPN connecting all nodes (10.8.0.x)',
        'Tailscale overlay network with 9 peers',
        'RoadNet WiFi mesh: 5 APs, channels 1/6/11, auto-failover',
        '4 Cloudflare tunnels routing 48+ domains',
      ]},
      { title: 'DNS & Routing', bullets: [
        'Pi-hole DNS for ad blocking and local resolution',
        'PowerDNS Docker for custom zones',
        'Custom DNS zones: .cece, .blackroad, .entity, .soul, .dream',
        '48 Nginx reverse proxy sites with health checking',
      ]},
      { title: 'Security', bullets: [
        'Zero-trust architecture via Cloudflare tunnels',
        'UFW firewall policies on edge nodes',
        'Credential management via secured env files',
      ]},
    ],
    skills: ['WireGuard', 'Tailscale', 'Nginx', 'Cloudflare Tunnels', 'Pi-hole', 'PowerDNS', 'UFW', 'iptables'],
    kpis: ['nginx_sites', 'tailscale_peers', 'fleet_total', 'cf_pages', 'fleet_connections', 'systemd_services'],
  },
  { slug: 'security', num: '14', title: 'Security Engineer', accent: '#FF2255',
    summary: 'Security engineer: malware discovery and removal, zero-trust architecture, credential rotation, fleet hardening, and incident response across distributed infrastructure.',
    sections: [
      { title: 'Incident Response', bullets: [
        'Discovered and removed obfuscated cron dropper on Cecilia',
        'Identified leaked GitHub PAT in service files — rotated credentials',
        'Found xmrig (crypto miner) reference on Lucidia — removed',
        'Migrated plaintext credentials to secured env files (chmod 600)',
      ]},
      { title: 'Zero-Trust Architecture', bullets: [
        'Cloudflare tunnels for all external access (no open ports)',
        'WireGuard encryption for inter-node communication',
        'SSH key management across 50+ authorized keys per node',
        'NOPASSWD sudo audit across all fleet nodes',
      ]},
      { title: 'Hardening', bullets: [
        'UFW firewall with INPUT DROP policy',
        'Disabled unnecessary services (cups, rpcbind, nfs, lightdm)',
        'GitHub security scanning workflows for credential detection',
        'Fleet-wide security audit tooling',
      ]},
    ],
    skills: ['incident response', 'malware analysis', 'credential rotation', 'WireGuard', 'Cloudflare tunnels', 'UFW', 'SSH', 'Linux hardening'],
    kpis: ['failed_units', 'fleet_total', 'systemd_services', 'tailscale_peers', 'nginx_sites', 'fleet_online'],
  },
  { slug: 'data', num: '15', title: 'Data Engineer', accent: '#CC00AA',
    summary: 'Data engineer: 9 automated collectors, 60+ KPIs tracked daily, 283 databases, distributed data pipelines across edge and cloud infrastructure.',
    sections: [
      { title: 'Data Collection Pipeline', bullets: [
        '9 collectors: GitHub, GitHub-deep, all-orgs, Gitea, fleet, services, autonomy, LOC, local, Cloudflare',
        '60+ KPIs tracked daily with JSON snapshots and aggregation',
        'Day-over-day delta tracking and trend analysis',
        'Automated daily reports with terminal dashboard and Slack notifications',
      ]},
      { title: 'Data Infrastructure', bullets: [
        '283 databases across PostgreSQL, SQLite, D1, KV, Qdrant',
        'FTS5 full-text search across 156K entries',
        'Distributed data collection via SSH probes to fleet nodes',
        'Automated metric-to-resume pipeline (verified data flow)',
      ]},
    ],
    skills: ['Python', 'PostgreSQL', 'SQLite/FTS5', 'Cloudflare D1', 'data pipelines', 'SSH probes', 'JSON', 'Bash'],
    kpis: ['total_loc', 'repos_total', 'postgres_dbs', 'sqlite_dbs', 'cf_d1_databases', 'systems_registered'],
  },
  { slug: 'architect', num: '16', title: 'Solutions Architect', accent: '#8844FF',
    summary: 'Solutions architect: designed full hybrid edge-cloud architecture spanning 7 nodes, 184 Cloudflare resources, 48+ domains, and distributed AI inference.',
    sections: [
      { title: 'Architecture Design', bullets: [
        'Hybrid edge-cloud: 5 Pi nodes + 2 cloud VMs + Cloudflare serverless',
        'WireGuard mesh + Cloudflare tunnels + Tailscale for multi-layer networking',
        'AI inference distributed across 3 nodes with 52 TOPS acceleration',
        '283 databases across 5 engines for different workload patterns',
      ]},
      { title: 'Cloudflare Stack', bullets: [
        '101 Pages + 25 D1 + 47 KV + 11 R2 = 178 resources',
        '4 tunnels routing 48+ domains to fleet services',
        'Workers for edge compute and API routing',
      ]},
    ],
    skills: ['system design', 'Cloudflare', 'WireGuard', 'distributed systems', 'edge computing', 'AI infrastructure'],
    kpis: ['cf_pages', 'cf_d1_databases', 'cf_kv_namespaces', 'cf_r2_buckets', 'fleet_total', 'repos_total'],
  },
  { slug: 'lead', num: '17', title: 'Technical Lead', accent: '#4488FF',
    summary: 'Technical lead: 51,211 commits in 2026 (3,582 in a single day peak), 4,019 PRs merged, 1,810 repos across 17 organizations, 20 languages, 7.2M+ lines of code.',
    sections: [
      { title: 'Code Velocity', bullets: [
        '51,000+ commits YTD sustained across all repositories',
        '4,019 PRs merged all-time',
        '1,603 GitHub repos across 17 organizations',
        '207 Gitea repos across 7 self-hosted organizations',
      ]},
      { title: 'Technical Breadth', bullets: [
        '20 programming languages: Python, JavaScript, TypeScript, Shell, Go, C, and more',
        '7.2M+ lines of code with daily LOC tracking',
        '223 CLI tools built for operational efficiency',
        'Custom programming language (RoadC) with interpreter',
      ]},
    ],
    skills: ['Python', 'JavaScript', 'TypeScript', 'Bash', 'Go', 'C', 'React', 'FastAPI', 'system design', 'mentorship'],
    kpis: ['commits_ytd', 'commits_today', 'prs_merged_total', 'repos_total', 'total_loc', 'github_language_count', 'bin_tools'],
  },
  { slug: 'python', num: '18', title: 'Python Developer', accent: '#00D4FF',
    summary: 'Python developer: 470 Python repos, FastAPI APIs, AI model integration, data pipelines, SSH automation, and KPI collection systems.',
    sections: [
      { title: 'Python Applications', bullets: [
        '470 Python repositories across all organizations',
        'FastAPI services: CECE API, TTS API, Lucidia API, fleet probes',
        'AI integration: Ollama client, image generation agents, model management',
        'KPI data collection and aggregation pipelines',
      ]},
      { title: 'Python Infrastructure', bullets: [
        'SSH-based fleet probes piped as Python scripts to remote nodes',
        'FTS5 search engine with 156K indexed entries',
        'Custom RoadC language interpreter (lexer + parser + tree-walker)',
        'Automated reporting: terminal dashboards, Slack, markdown, resume generation',
      ]},
    ],
    skills: ['Python', 'FastAPI', 'SQLite', 'PostgreSQL', 'Ollama', 'asyncio', 'subprocess', 'json', 'data pipelines'],
    kpis: ['total_loc', 'repos_total', 'postgres_dbs', 'sqlite_dbs', 'ollama_models', 'systems_registered'],
  },
  { slug: 'product', num: '19', title: 'Product Engineer', accent: '#FF6B2B',
    summary: 'Product engineer: 99 live sites, 75 design templates, brand-locked design system, AI image generation, and full SaaS surface coverage.',
    sections: [
      { title: 'Product Development', bullets: [
        '101 Cloudflare Pages projects deployed across 48+ domains',
        '75 design templates with brand-locked system (gradients, typography, spacing)',
        '15 page types: landing, pricing, blog, docs, dashboard, auth, portfolio, status',
        'AI image generation hub with 4 backend agents',
      ]},
      { title: 'Brand System', bullets: [
        'Brand-lock enforced: gradient spectrum, Space Grotesk + JetBrains Mono, golden ratio spacing',
        'Automated brand compliance auditing tools',
        'Mass brand update tooling across all 99 sites',
      ]},
    ],
    skills: ['React', 'Next.js', 'HTML/CSS', 'Cloudflare Pages', 'design systems', 'brand management', 'Figma'],
    kpis: ['cf_pages', 'templates', 'repos_total', 'total_loc', 'nginx_sites', 'bin_tools'],
  },
  { slug: 'cto', num: '20', title: 'Startup CTO', accent: '#CC00AA',
    summary: 'Technical founder who built BlackRoad OS from zero to a production platform: 7.2M LOC, 1,810 repos, 7-node fleet, 99 cloud deployments, 27 AI models, 283 databases, and 48+ live domains. Solo.',
    sections: [
      { title: 'Built From Zero', bullets: [
        '7.2M+ lines of code across 1,603 GitHub + 207 Gitea repos',
        '20 programming languages, 51,000+ commits YTD sustained velocity',
        '223 CLI tools built for operational efficiency',
        '4,019 PRs merged all-time',
      ]},
      { title: 'Infrastructure', bullets: [
        '5 Pi edge nodes + 2 cloud VMs + Cloudflare serverless',
        'WireGuard mesh VPN + 4 tunnels + Tailscale (9 peers)',
        '256 systemd services, 14 Docker containers, 48 Nginx sites',
        '707 GB storage, 20 GB RAM, 52 TOPS AI compute',
      ]},
      { title: 'AI/ML', bullets: [
        '27 Ollama models (48.1 GB) across 3 inference nodes',
        '4 custom fine-tuned models, 2x Hailo-8 NPU',
        'AI image generation with 4 backend agents',
      ]},
      { title: 'Cloud & Data', bullets: [
        '101 Pages, 25 D1, 47 KV, 11 R2, 48+ domains',
        '283 databases across 5 engines',
        '52 automated tasks, 60+ KPIs tracked daily',
      ]},
    ],
    skills: ['everything'],
    kpis: ['commits_ytd', 'total_loc', 'repos_total', 'prs_merged_total', 'fleet_total', 'ollama_models', 'cf_pages', 'cf_workers', 'cf_domains', 'docker_containers', 'systemd_services', 'nginx_sites'],
  },
];

const KPI_LABELS = {
  total_loc: 'Lines of Code',
  commits_today: 'Commits Today',
  commits_ytd: 'Commits (2026)',
  prs_merged_total: 'PRs Merged',
  prs_open: 'PRs Open',
  repos_total: 'Total Repos',
  repos_github: 'GitHub Repos',
  repos_gitea: 'Gitea Repos',
  github_org_count: 'GitHub Orgs',
  github_language_count: 'Languages',
  cf_workers: 'CF Workers',
  cf_domains: 'Custom Domains',
  fleet_total: 'Fleet Nodes',
  fleet_online: 'Nodes Online',
  avg_temp_c: 'Avg Temp',
  fleet_mem_total_mb: 'Fleet RAM (MB)',
  fleet_mem_used_mb: 'RAM Used (MB)',
  fleet_disk_total_gb: 'Fleet Storage (GB)',
  fleet_disk_used_gb: 'Disk Used (GB)',
  fleet_connections: 'Net Connections',
  fleet_processes: 'Processes',
  systemd_services: 'Systemd Services',
  systemd_timers: 'Systemd Timers',
  docker_containers: 'Docker Containers',
  docker_images: 'Docker Images',
  nginx_sites: 'Nginx Sites',
  ollama_models: 'AI Models',
  ollama_size_gb: 'Model Size (GB)',
  postgres_dbs: 'PostgreSQL DBs',
  sqlite_dbs: 'SQLite DBs',
  cf_pages: 'CF Pages',
  cf_d1_databases: 'D1 Databases',
  cf_kv_namespaces: 'KV Namespaces',
  cf_r2_buckets: 'R2 Buckets',
  failed_units: 'Failed Units',
  tailscale_peers: 'Tailscale Peers',
  bin_tools: 'CLI Tools',
  home_scripts: 'Shell Scripts',
  templates: 'Templates',
  mac_cron_jobs: 'Mac Crons',
  fleet_cron_jobs: 'Fleet Crons',
  fts5_entries: 'FTS5 Entries',
  systems_registered: 'Systems Registered',
};

const KPI_SOURCES = {
  total_loc: 'loc.sh — cloc + fleet SSH',
  commits_today: 'github.sh — gh api events',
  prs_merged_total: 'github.sh — gh api search/issues',
  prs_open: 'github.sh — gh api search/issues',
  repos_total: 'github-all-orgs.sh — gh api repos (17 owners)',
  repos_github: 'github-all-orgs.sh — gh api repos (17 owners)',
  repos_gitea: 'gitea.sh — Gitea REST API',
  github_org_count: 'github-all-orgs.sh — unique owner count',
  github_language_count: 'github-all-orgs.sh — repo language field',
  fleet_total: 'fleet.sh — SSH probe to all nodes',
  fleet_online: 'fleet.sh — SSH probe to all nodes',
  avg_temp_c: 'fleet.sh — /sys/class/thermal via SSH',
  fleet_mem_total_mb: 'fleet.sh — /proc/meminfo via SSH',
  fleet_mem_used_mb: 'fleet.sh — /proc/meminfo via SSH',
  fleet_disk_total_gb: 'fleet.sh — df via SSH',
  fleet_disk_used_gb: 'fleet.sh — df via SSH',
  fleet_connections: 'services.sh — ss -tun via SSH',
  fleet_processes: 'services.sh — /proc count via SSH',
  systemd_services: 'services.sh — systemctl list-units via SSH',
  systemd_timers: 'services.sh — systemctl list-timers via SSH',
  docker_containers: 'services.sh — docker ps via SSH',
  docker_images: 'services.sh — docker images via SSH',
  nginx_sites: 'services.sh — /etc/nginx/sites-enabled via SSH',
  ollama_models: 'services.sh — ollama list via SSH',
  ollama_size_gb: 'services.sh — ollama list via SSH',
  postgres_dbs: 'services.sh — psql -l via SSH',
  sqlite_dbs: 'local.sh — find ~/.blackroad -name *.db',
  cf_pages: 'cloudflare.sh — wrangler pages list',
  cf_d1_databases: 'cloudflare.sh — wrangler d1 list --json',
  cf_kv_namespaces: 'cloudflare.sh — wrangler kv list',
  cf_r2_buckets: 'cloudflare.sh — wrangler r2 bucket list',
  failed_units: 'services.sh — systemctl --failed via SSH',
  tailscale_peers: 'services.sh — tailscale status via SSH',
  bin_tools: 'local.sh — ls ~/bin | wc -l',
  home_scripts: 'local.sh — find ~/ -name *.sh',
  templates: 'local.sh — ls ~/Desktop/templates',
  mac_cron_jobs: 'local.sh — crontab -l | wc -l',
  fleet_cron_jobs: 'autonomy.sh — crontab -l via SSH',
  fts5_entries: 'local.sh — sqlite3 FTS5 count',
  systems_registered: 'local.sh — sqlite3 systems count',
};

function fmt(key, val) {
  if (val === undefined || val === null) return '—';
  if (key === 'total_loc' || key === 'prs_merged_total' || key === 'fts5_entries') {
    return typeof val === 'number' ? val.toLocaleString() : val;
  }
  if (key === 'avg_temp_c') return typeof val === 'number' ? val.toFixed(1) + '\u00b0C' : val;
  if (key === 'ollama_size_gb') return typeof val === 'number' ? val.toFixed(1) + ' GB' : val;
  if (typeof val === 'number') return val.toLocaleString();
  return val;
}

function css() {
  return `*{margin:0;padding:0;box-sizing:border-box}
html{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;scroll-behavior:smooth}
:root{--g:linear-gradient(90deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF);--g135:linear-gradient(135deg,#FF6B2B,#FF2255,#CC00AA,#8844FF,#4488FF,#00D4FF);--bg:#000;--white:#fff;--border:#1a1a1a;--sg:'Space Grotesk',sans-serif;--jb:'JetBrains Mono',monospace}
body{background:var(--bg);color:var(--white);font-family:var(--sg);line-height:1.618}
a{color:var(--white);text-decoration:none}
.grad-bar{height:4px;background:var(--g)}
nav{display:flex;align-items:center;justify-content:space-between;padding:16px 48px;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(0,0,0,.92);backdrop-filter:blur(20px);z-index:100}
.nav-logo{font-weight:700;font-size:18px;display:flex;align-items:center;gap:10px}
.nav-mark{width:28px;height:4px;border-radius:2px;background:var(--g)}
.nav-right{display:flex;align-items:center;gap:24px;font-size:13px}
.nav-right a{opacity:.4;transition:opacity .2s}
.nav-right a:hover{opacity:1}
.live-clock{font-family:var(--jb);font-size:12px;opacity:.5;letter-spacing:.05em}
.live-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:6px;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes countUp{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}

.hero{padding:100px 48px 60px;text-align:center;position:relative;overflow:hidden;animation:fadeUp .6s}
.hero-orb{position:absolute;border-radius:50%;filter:blur(120px);opacity:.07;pointer-events:none}
.hero-orb-1{width:500px;height:500px;top:-100px;left:5%}
.hero-orb-2{width:400px;height:400px;top:0;right:5%}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border:1px solid var(--border);border-radius:20px;font-size:12px;font-weight:500;margin-bottom:24px;font-family:var(--jb)}
.hero h1{font-size:52px;font-weight:700;line-height:1.1;margin-bottom:16px;max-width:800px;margin-left:auto;margin-right:auto}
.hero-role{background:var(--g135);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:17px;opacity:.5;max-width:600px;margin:0 auto 40px;line-height:1.7}
.hero-links{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.hero-links a{padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600;transition:all .2s}
.btn-solid{background:var(--white);color:#000}
.btn-solid:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,255,255,.15)}
.btn-outline{border:1px solid var(--border)}
.btn-outline:hover{border-color:#444}

.kpi-strip{display:flex;justify-content:center;gap:48px;padding:48px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);flex-wrap:wrap;animation:fadeUp .8s}
.kpi-item{text-align:center;animation:countUp .6s both}
.kpi-val{font-size:36px;font-weight:700;font-family:var(--jb)}
.kpi-label{font-size:11px;opacity:.35;text-transform:uppercase;letter-spacing:.1em;margin-top:4px;font-family:var(--jb)}

.section{max-width:900px;margin:0 auto;padding:64px 48px}
.section-title{font-size:14px;text-transform:uppercase;letter-spacing:.15em;opacity:.3;margin-bottom:32px;font-family:var(--jb)}

.exp-block{margin-bottom:40px;padding:32px;border:1px solid var(--border);border-radius:12px;position:relative;transition:border-color .2s}
.exp-block:hover{border-color:#333}
.exp-block::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:12px 12px 0 0;background:var(--g);opacity:.5;transition:opacity .2s}
.exp-block:hover::before{opacity:1}
.exp-block h3{font-size:18px;font-weight:600;margin-bottom:16px}
.exp-block ul{list-style:none;padding:0}
.exp-block li{padding:6px 0;padding-left:20px;position:relative;font-size:14px;opacity:.7;line-height:1.7}
.exp-block li::before{content:'';position:absolute;left:0;top:14px;width:6px;height:6px;border-radius:50%;background:var(--g135)}

.skills-grid{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
.skill-tag{padding:6px 14px;border:1px solid var(--border);border-radius:6px;font-size:13px;font-family:var(--jb);transition:all .2s}
.skill-tag:hover{border-color:#444;transform:translateY(-1px)}

.metrics-table{width:100%;border-collapse:collapse;margin-top:16px}
.metrics-table tr{border-bottom:1px solid var(--border);transition:background .2s}
.metrics-table tr:hover{background:rgba(255,255,255,.02)}
.metrics-table td{padding:14px 16px;font-size:14px}
.metrics-table td:first-child{font-family:var(--jb);font-size:12px;opacity:.5;text-transform:uppercase;letter-spacing:.08em;width:180px}
.metrics-table td:nth-child(2){font-weight:600;text-align:right;font-family:var(--jb);font-size:18px;width:120px}
.metrics-table td:last-child{font-family:var(--jb);font-size:10px;opacity:.25;text-align:right;padding-left:24px}

.collected-at{text-align:center;padding:24px;font-size:12px;opacity:.3;font-family:var(--jb)}

footer{border-top:1px solid var(--border);padding:48px;text-align:center}
.footer-roles{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:24px;max-width:900px;margin-left:auto;margin-right:auto}
.footer-roles a{padding:4px 12px;border:1px solid var(--border);border-radius:4px;font-size:11px;font-family:var(--jb);opacity:.4;transition:all .2s}
.footer-roles a:hover{opacity:1;border-color:#444}
.footer-roles a.active{opacity:1;border-color:#444}
.footer-copy{font-size:12px;opacity:.25;margin-top:16px}

@media(max-width:768px){
  nav{padding:14px 20px}
  .hero{padding:60px 20px 40px}
  .hero h1{font-size:32px}
  .kpi-strip{gap:24px;padding:32px 20px}
  .kpi-val{font-size:28px}
  .section{padding:40px 20px}
  .exp-block{padding:20px}
  .metrics-table td:first-child{width:140px}
  footer{padding:32px 20px}
}`;
}

function indexPage(kpis) {
  const s = kpis || {};
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Alexa Amundson — Resume Portfolio</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${css()}
.roles-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;max-width:1200px;margin:0 auto;padding:0 48px 64px}
.role-card{border:1px solid var(--border);border-radius:12px;padding:28px;transition:all .3s;position:relative;overflow:hidden;cursor:pointer;text-decoration:none;display:block;animation:fadeUp .6s both}
.role-card:hover{border-color:#444;transform:translateY(-4px);box-shadow:0 12px 40px rgba(255,29,108,.08)}
.role-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--g);opacity:0;transition:opacity .3s}
.role-card:hover::before{opacity:1}
.role-num{font-family:var(--jb);font-size:11px;opacity:.3;margin-bottom:8px}
.role-title{font-size:18px;font-weight:600;margin-bottom:8px}
.role-summary{font-size:13px;opacity:.45;line-height:1.6;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.role-kpis{display:flex;gap:16px;margin-top:16px;flex-wrap:wrap}
.role-kpi{font-family:var(--jb);font-size:11px;opacity:.5}
.role-kpi b{opacity:1;font-size:14px;display:block}
@media(max-width:768px){.roles-grid{grid-template-columns:1fr;padding:0 20px 40px}}
</style>
</head>
<body>
<div class="grad-bar"></div>
<nav>
  <div class="nav-logo"><div class="nav-mark"></div> Alexa Amundson</div>
  <div class="nav-right">
    <a href="mailto:amundsonalexa@gmail.com">Contact</a>
    <a href="https://github.com/blackboxprogramming">GitHub</a>
    <span class="live-clock"><span class="live-dot"></span><span id="clock"></span></span>
  </div>
</nav>
<section class="hero">
  <div class="hero-orb hero-orb-1" style="background:#FF2255"></div>
  <div class="hero-orb hero-orb-2" style="background:#4488FF"></div>
  <div class="hero-badge"><span class="live-dot"></span> Live Metrics</div>
  <h1>20 Roles. <span class="hero-role">One Platform.</span></h1>
  <p>Every number machine-verified from live automated KPI collection across BlackRoad OS infrastructure. Updated daily.</p>
</section>
<div class="kpi-strip">
  <div class="kpi-item"><div class="kpi-val">${(s.commits_ytd||0).toLocaleString()}</div><div class="kpi-label">Commits (2026)</div></div>
  <div class="kpi-item"><div class="kpi-val">${(s.total_loc||0).toLocaleString()}</div><div class="kpi-label">Lines of Code</div></div>
  <div class="kpi-item"><div class="kpi-val">${(s.repos_total||0).toLocaleString()}</div><div class="kpi-label">Repositories</div></div>
  <div class="kpi-item"><div class="kpi-val">${s.ollama_models||0}</div><div class="kpi-label">AI Models</div></div>
  <div class="kpi-item"><div class="kpi-val">${s.cf_pages||0}</div><div class="kpi-label">Cloud Deployments</div></div>
  <div class="kpi-item"><div class="kpi-val">${s.bin_tools||0}</div><div class="kpi-label">CLI Tools</div></div>
</div>
<section class="section"><div class="section-title">Select a Role</div></section>
<div class="roles-grid">
${ROLES.map((r, i) => {
  const topKpis = r.kpis.slice(0, 3);
  return `<a href="/${r.slug}" class="role-card" style="animation-delay:${i * 0.05}s">
    <div class="role-num">${r.num}</div>
    <div class="role-title">${r.title}</div>
    <div class="role-summary">${r.summary}</div>
    <div class="role-kpis">${topKpis.map(k => `<div class="role-kpi"><b>${fmt(k, s[k])}</b>${KPI_LABELS[k]||k}</div>`).join('')}</div>
  </a>`;
}).join('\n')}
</div>
<section class="section">
  <div class="section-title">Data Sources &mdash; 10 Collectors</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px">
    <div class="exp-block" style="padding:20px;margin:0"><h3 style="font-size:13px">github.sh</h3><p style="font-size:12px;opacity:.4">Commits, PRs, events via GitHub API (gh cli)</p></div>
    <div class="exp-block" style="padding:20px;margin:0"><h3 style="font-size:13px">github-deep.sh</h3><p style="font-size:12px;opacity:.4">Stars, forks, profile, org breakdown</p></div>
    <div class="exp-block" style="padding:20px;margin:0"><h3 style="font-size:13px">github-all-orgs.sh</h3><p style="font-size:12px;opacity:.4">Full scan of 17 GitHub owners, deduped</p></div>
    <div class="exp-block" style="padding:20px;margin:0"><h3 style="font-size:13px">gitea.sh</h3><p style="font-size:12px;opacity:.4">Self-hosted Gitea REST API (207 repos)</p></div>
    <div class="exp-block" style="padding:20px;margin:0"><h3 style="font-size:13px">fleet.sh</h3><p style="font-size:12px;opacity:.4">SSH probe: uptime, CPU, RAM, disk, temp</p></div>
    <div class="exp-block" style="padding:20px;margin:0"><h3 style="font-size:13px">services.sh</h3><p style="font-size:12px;opacity:.4">Docker, Ollama, Nginx, systemd, PostgreSQL</p></div>
    <div class="exp-block" style="padding:20px;margin:0"><h3 style="font-size:13px">autonomy.sh</h3><p style="font-size:12px;opacity:.4">Self-healing events, restarts, cron jobs</p></div>
    <div class="exp-block" style="padding:20px;margin:0"><h3 style="font-size:13px">loc.sh</h3><p style="font-size:12px;opacity:.4">Lines of code via cloc + fleet SSH</p></div>
    <div class="exp-block" style="padding:20px;margin:0"><h3 style="font-size:13px">local.sh</h3><p style="font-size:12px;opacity:.4">Mac: ~/bin, scripts, DBs, brew, cron, disk</p></div>
    <div class="exp-block" style="padding:20px;margin:0"><h3 style="font-size:13px">cloudflare.sh</h3><p style="font-size:12px;opacity:.4">Pages, D1, KV, R2 via wrangler CLI</p></div>
  </div>
  <p style="font-size:11px;opacity:.25;margin-top:16px;font-family:var(--jb);text-align:center">Pipeline: collect (6am cron) &rarr; aggregate (daily JSON) &rarr; push to KV &rarr; Worker serves live &rarr; updated every request</p>
</section>
<div class="collected-at">Last collected: ${s._collected_at || 'pending'} &mdash; Updated daily at 06:00 &mdash; <a href="/api/kpis" style="opacity:.5">Raw JSON API</a></div>
<footer>
  <div class="footer-copy">All metrics verified from live automated KPI collection &mdash; <a href="https://github.com/blackboxprogramming/blackroad-os-kpis" style="opacity:.5">blackroad-os-kpis</a><br>&copy; 2026 Alexa Amundson &mdash; BlackRoad OS, Inc.</div>
</footer>
<div class="grad-bar"></div>
<script>
function tick(){const d=new Date();document.getElementById('clock').textContent=d.toLocaleString('en-US',{timeZone:'America/Chicago',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true})+' CST'}
tick();setInterval(tick,1000);
</script>
</body>
</html>`;
}

function resumePage(role, kpis) {
  const s = kpis || {};
  const prevSlug = ROLES[ROLES.indexOf(role) - 1]?.slug;
  const nextSlug = ROLES[ROLES.indexOf(role) + 1]?.slug;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Alexa Amundson — ${role.title}</title>
<meta name="description" content="${role.summary}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>${css()}</style>
</head>
<body>
<div class="grad-bar"></div>
<nav>
  <div class="nav-logo"><a href="/"><div class="nav-mark"></div> Alexa Amundson</a></div>
  <div class="nav-right">
    ${prevSlug ? `<a href="/${prevSlug}">&larr; Prev</a>` : ''}
    <a href="/">All Roles</a>
    ${nextSlug ? `<a href="/${nextSlug}">Next &rarr;</a>` : ''}
    <a href="mailto:amundsonalexa@gmail.com">Contact</a>
    <a href="https://github.com/blackboxprogramming">GitHub</a>
    <span class="live-clock"><span class="live-dot"></span><span id="clock"></span></span>
  </div>
</nav>

<section class="hero">
  <div class="hero-orb hero-orb-1" style="background:${role.accent}"></div>
  <div class="hero-orb hero-orb-2" style="background:#4488FF"></div>
  <div class="hero-badge"><span class="live-dot"></span> Live Data &mdash; ${s._date || 'loading'}</div>
  <h1><span class="hero-role">${role.title}</span></h1>
  <p>${role.summary}</p>
  <div class="hero-links">
    <a href="mailto:amundsonalexa@gmail.com" class="btn-solid">amundsonalexa@gmail.com</a>
    <a href="https://github.com/blackboxprogramming" class="btn-outline">github.com/blackboxprogramming</a>
  </div>
</section>

<div class="kpi-strip">
  ${role.kpis.slice(0, 6).map((k, i) => `<div class="kpi-item" style="animation-delay:${i*0.1}s"><div class="kpi-val">${fmt(k, s[k])}</div><div class="kpi-label">${KPI_LABELS[k]||k}</div></div>`).join('\n  ')}
</div>

<section class="section">
  <div class="section-title">Experience &mdash; BlackRoad OS | 2025&ndash;Present</div>
  ${role.sections.map(sec => `
  <div class="exp-block">
    <h3>${sec.title}</h3>
    <ul>${sec.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
  </div>`).join('')}
</section>

<section class="section">
  <div class="section-title">Technical Skills</div>
  <div class="skills-grid">
    ${(role.skills[0] === 'everything'
      ? ['Python','JavaScript','TypeScript','Bash','Go','C','React','Next.js','FastAPI','Docker','Linux','Nginx','WireGuard','Cloudflare','PostgreSQL','SQLite','systemd','Hailo-8','Ollama','GitHub Actions']
      : role.skills
    ).map(s => `<span class="skill-tag">${s}</span>`).join('')}
  </div>
</section>

<section class="section">
  <div class="section-title">Live Metrics Dashboard</div>
  <table class="metrics-table">
    <tr style="border-bottom:2px solid var(--border)"><td style="opacity:.3;font-size:10px">METRIC</td><td style="opacity:.3;font-size:10px;text-align:right">VALUE</td><td style="opacity:.15;font-size:10px;text-align:right">SOURCE</td></tr>
    ${role.kpis.map(k => `<tr><td>${KPI_LABELS[k]||k}</td><td>${fmt(k, s[k])}</td><td>${KPI_SOURCES[k]||'—'}</td></tr>`).join('\n    ')}
  </table>
</section>

<div class="collected-at">Last collected: ${s._collected_at || 'pending'} &mdash; Updated daily at 06:00 &mdash; <a href="/api/kpis" style="opacity:.5">Raw JSON API</a></div>

<footer>
  <div class="footer-roles">
    ${ROLES.map(r => `<a href="/${r.slug}" class="${r.slug === role.slug ? 'active' : ''}">${r.num} ${r.title}</a>`).join('')}
  </div>
  <div class="footer-copy">Every metric sourced from <a href="https://github.com/blackboxprogramming/blackroad-os-kpis" style="opacity:.5">blackroad-os-kpis</a> &mdash; 10 collectors, 80+ keys, updated daily<br>&copy; 2026 Alexa Amundson &mdash; BlackRoad OS, Inc.</div>
</footer>
<div class="grad-bar"></div>
<script>
function tick(){const d=new Date();document.getElementById('clock').textContent=d.toLocaleString('en-US',{timeZone:'America/Chicago',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true})+' CST'}
tick();setInterval(tick,1000);

// Animate KPI numbers counting up
document.querySelectorAll('.kpi-val').forEach(el => {
  const target = parseInt(el.textContent.replace(/,/g, ''));
  if (isNaN(target) || target < 2) return;
  const duration = 1200;
  const start = performance.now();
  const initial = Math.max(0, Math.floor(target * 0.7));
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(initial + (target - initial) * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
});
</script>
</body>
</html>`;
}

function apiResponse(kpis) {
  return new Response(JSON.stringify(kpis || {}, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    // Load KPI data from KV
    let kpis = {};
    try {
      const raw = await env.KPIS.get('latest', 'json');
      if (raw) kpis = raw;
    } catch (e) {}

    // API endpoint
    if (path === '/api/kpis') return apiResponse(kpis);

    // Sitemap
    if (path === '/sitemap.xml') {
      const base = url.origin;
      const urls = ['/', ...ROLES.map(r => `/${r.slug}`)];
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${base}${u}</loc><changefreq>daily</changefreq></url>`).join('\n')}
</urlset>`;
      return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
    }

    // Index
    if (path === '/') {
      return new Response(indexPage(kpis), {
        headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public, max-age=300' },
      });
    }

    // Resume pages
    const slug = path.slice(1);
    const role = ROLES.find(r => r.slug === slug || r.num + '-' + r.slug === slug);
    if (role) {
      return new Response(resumePage(role, kpis), {
        headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public, max-age=300' },
      });
    }

    // 404
    return new Response(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>404</title>
<style>body{background:#000;color:#fff;font-family:'Space Grotesk',sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center}
a{color:#fff;opacity:.5}</style></head><body><div><h1>404</h1><p><a href="/">Back to Portfolio</a></p></div></body></html>`, {
      status: 404,
      headers: { 'Content-Type': 'text/html;charset=utf-8' },
    });
  },
};
