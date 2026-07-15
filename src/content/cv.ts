/**
 * Single source of truth for all real CV content.
 * Every room component imports from here — nothing is hardcoded in components,
 * so a CV update is a one-file change.
 *
 * Confidentiality boundary (from the brief): employer names are public
 * (Forge-Tech, Antematter, Blutech Consulting); client names stay anonymized.
 */

export const identity = {
  name: 'Muhammad Musayyab',
  title: 'DevOps Engineer',
  location: 'Islamabad, Pakistan',
  thesis: 'I make deployments less stressful.',
  email: 'itsmusayyab@gmail.com',
  linkedin: 'https://www.linkedin.com/in/musayyabmuhammad/',
} as const

/** Hero boot sequence — typed out line by line. */
export const bootSequence = [
  { prompt: 'whoami', output: 'Muhammad Musayyab — DevOps Engineer' },
  { prompt: 'location', output: 'Islamabad, Pakistan' },
  { prompt: 'status', output: 'Available — building cloud infrastructure since 2025' },
  { prompt: 'scroll to enter_', output: '' },
] as const

export interface Stage {
  id: string
  num: string
  name: string
  heading: string
  copy: string[]
  facts?: { label: string; detail: string }[]
  footnote?: string
}

export const stages: Stage[] = [
  {
    id: 'linux-core',
    num: '01',
    name: 'Linux Core',
    heading: 'Everything here runs on the same foundation.',
    copy: [
      'Before the cloud, before the pipelines — Linux administration. Users, permissions, services, SSH, patching. It is the layer every other room in this building depends on, and it is where I started.',
    ],
    facts: [
      { label: 'Education', detail: 'BS Software Engineering — Virtual University, 2025' },
      { label: 'Networking', detail: 'CCNA fundamentals — routing, switching, DNS, load balancing' },
    ],
    footnote: 'systemctl · ssh · chmod · least-privilege by default',
  },
  {
    id: 'container-bay',
    num: '02',
    name: 'Container Bay',
    heading: 'Ship the same thing everywhere.',
    copy: [
      'Docker and Docker Compose across every role: deploying and monitoring containerized applications at Forge-Tech, migrating a US healthcare client off an EC2-based Docker setup at Antematter, and containerizing a web app with automated tests in the CI pipeline for my final year project.',
    ],
    facts: [
      { label: 'Forge-Tech', detail: 'Deployed and monitored Docker-based applications in production' },
      { label: 'Antematter', detail: 'Migrated a US healthcare client from EC2 + Docker to GCP Cloud Run + Cloud SQL' },
      { label: 'FYP', detail: 'Containerized a static web app with automated testing in CI' },
    ],
  },
  {
    id: 'cicd-tunnel',
    num: '03',
    name: 'CI/CD Launch Tunnel',
    heading: 'A commit goes in. A deployment comes out.',
    copy: [
      'GitHub Actions pipelines maintained and improved at Forge-Tech — more consistent deployments, fewer manual steps. At Antematter, an end-to-end automated deployment flow for a client SaaS platform: ECR, App Runner, RDS, Secrets Manager, S3, all triggered from GitHub Actions.',
    ],
    facts: [
      { label: 'Build', detail: 'Push-triggered pipelines — tests run before anything ships' },
      { label: 'Test', detail: 'Automated testing gates in CI, no manual promotion' },
      { label: 'Deploy', detail: 'ECR → App Runner with RDS, Secrets Manager, and S3 wired in' },
    ],
  },
  {
    id: 'iac-control',
    num: '04',
    name: 'IaC Control Room',
    heading: 'The building you are walking through was written first.',
    copy: [
      'Infrastructure as code is the point of this whole site: configuration becoming real infrastructure. Terraform for provisioning — from my final year project through client work at Antematter — and AWS CDK to define and version-control a client SaaS platform’s cloud resources, so every environment is repeatable instead of hand-built.',
    ],
    facts: [
      { label: 'Terraform', detail: 'Automated infra provisioning — ECS, ECR, CloudWatch stack' },
      { label: 'AWS CDK', detail: 'Client cloud resources defined in code, version-controlled, repeatable' },
    ],
    footnote: 'terraform plan → terraform apply — watch the racks resolve',
  },
  {
    id: 'monitoring',
    num: '05',
    name: 'Monitoring Observatory',
    heading: 'Things break. The job is noticing first.',
    copy: [
      'CloudWatch, Prometheus, Grafana, and Loki for visibility. A daily cloud cost reporting system built on Lambda, EventBridge, SNS, and Cost Explorer that surfaced and cut real waste. Route 53 DNS and subdomain provisioning automated with Bash.',
      'And the unglamorous part that is actually the job: resolving rollout incidents across service accounts, secrets, Cloud SQL connectivity, VPC access, environment variables, and Cloud Run revisions — red back to green.',
    ],
    facts: [
      { label: 'Observability', detail: 'CloudWatch · Prometheus/Grafana · Loki' },
      { label: 'Cost control', detail: 'Daily cost reports — Lambda + EventBridge + SNS + Cost Explorer' },
      { label: 'Incidents', detail: 'Cloud Run rollout issues traced through IAM, secrets, VPC, and revisions' },
    ],
  },
  {
    id: 'data-annex',
    num: '06',
    name: 'Data Engineering Annex',
    heading: 'A different wing. The same discipline.',
    copy: [
      'Two internships at Blutech Consulting, on the data side of the building. Cloudera administration: HDFS, YARN, cluster health checks, and the ingest path — load to HDFS, convert to Parquet, query with Spark SQL — with warehousing concepts (OLTP vs OLAP, star and snowflake schemas) mapped to Hive and Impala.',
      'Before that, data engineering: writing and tuning SQL, designing tables, keys, and indexes for performance, and running bulk INSERT / UPDATE / MERGE operations cleanly.',
    ],
    facts: [
      { label: 'Cloudera Administration', detail: 'Oct – Nov 2025 · HDFS, YARN, ingest → Parquet → Spark SQL' },
      { label: 'Data Engineering', detail: 'May – Jul 2025 · SQL tuning, schema and index design, bulk operations' },
    ],
  },
  {
    id: 'projects-hangar',
    num: '07',
    name: 'Projects Hangar',
    heading: 'The nameable things.',
    copy: [
      'Concrete outputs — what was built, on what stack, and what changed because of it.',
    ],
  },
]

export interface Project {
  name: string
  org: string
  summary: string
  outcome: string
  stack: string[]
}

export const projects: Project[] = [
  {
    name: 'Healthcare Stack Migration',
    org: 'Antematter — US healthcare client',
    summary:
      'Migrated a live stack from EC2-based Docker to GCP Cloud Run + Cloud SQL, then resolved the rollout issues that followed: service accounts, secrets, Cloud SQL connectivity, VPC access, env vars, and Cloud Run revisions.',
    outcome: 'Serverless runtime, managed database, and a deploy path that no longer depends on a hand-tended VM.',
    stack: ['GCP Cloud Run', 'Cloud SQL', 'Docker', 'VPC', 'Secret Manager'],
  },
  {
    name: 'CageCalls Deployment Flow',
    org: 'Antematter — client SaaS platform',
    summary:
      'End-to-end automated deployment: GitHub Actions builds to ECR, App Runner serves, RDS stores, Secrets Manager and S3 wired in — with AWS CDK defining every resource in version-controlled code.',
    outcome: 'A full release happens from a git push. Environments are reproducible from the CDK definitions.',
    stack: ['AWS CDK', 'GitHub Actions', 'ECR', 'App Runner', 'RDS', 'S3'],
  },
  {
    name: 'Cloud Cost Reporting System',
    org: 'Antematter',
    summary:
      'Daily automated cost reports: EventBridge schedules a Lambda that queries Cost Explorer and publishes to SNS, putting spend in front of the team every morning.',
    outcome: 'Surfaced idle resources and cut real waste from the monthly bill.',
    stack: ['Lambda', 'EventBridge', 'SNS', 'Cost Explorer'],
  },
  {
    name: 'Route 53 DNS Automation',
    org: 'Antematter',
    summary:
      'Bash automation for DNS record and subdomain provisioning in Route 53 — what used to be a console ritual became a script argument.',
    outcome: 'New client subdomains provisioned in seconds, consistently, with no console clicking.',
    stack: ['Route 53', 'Bash', 'AWS CLI'],
  },
  {
    name: 'DevOps Pipeline Simulation',
    org: 'Final Year Project — Virtual University',
    summary:
      'A working CI/CD pipeline built from scratch: Docker containerization, GitHub Actions running tests and builds on push, Terraform provisioning ECS/ECR, CloudWatch handling monitoring, logging, and alerting.',
    outcome: 'Push-to-deploy with tests, provisioned entirely from code, observable end to end.',
    stack: ['Terraform', 'GitHub Actions', 'Docker', 'ECS', 'ECR', 'CloudWatch'],
  },
  {
    name: 'Cloudera Cluster Operations',
    org: 'Blutech Consulting',
    summary:
      'Hands-on Cloudera administration: Manager, HDFS, and YARN onboarding, dev access setup, cluster health checks, and the ingest-to-lake flow — HDFS load, Parquet conversion, Spark SQL queries.',
    outcome: 'A documented ingest path and warehousing concepts mapped to the Hive/Impala toolchain.',
    stack: ['Cloudera', 'HDFS', 'YARN', 'Spark SQL', 'Hive', 'Impala'],
  },
]

export interface Role {
  company: string
  title: string
  period: string
  note?: string
}

/** Compact employment record for the Comms Deck / footer area. */
export const roles: Role[] = [
  { company: 'Forge-Tech (Croatia, remote)', title: 'DevOps Engineer', period: 'Mar 2025 — Present' },
  { company: 'Antematter', title: 'DevOps Engineer Intern', period: 'Nov 2025 — Mar 2026' },
  { company: 'Blutech Consulting', title: 'Cloudera Administration Intern', period: 'Oct — Nov 2025' },
  { company: 'Blutech Consulting', title: 'Data Engineering Intern', period: 'May — Jul 2025' },
]

/** Terminal panes floating in the Linux Core room — real, harmless commands. */
export const linuxCommands = [
  '$ systemctl status nginx',
  '$ ssh -i key.pem admin@10.0.1.4',
  '$ chmod 600 ~/.ssh/authorized_keys',
  '$ journalctl -u docker --since today',
] as const

/** Container labels in the Container Bay — real project names. */
export const containerLabels = ['forge-tech/app', 'healthcare-migration', 'cagecalls', 'fyp-pipeline'] as const

export const skills = {
  'Cloud Platforms': ['AWS', 'GCP', 'Azure'],
  'IaC & Automation': ['Terraform', 'AWS CDK', 'Bash'],
  'Containers & CI/CD': ['Docker', 'Docker Compose', 'GitHub Actions', 'Kubernetes basics'],
  'Monitoring': ['CloudWatch', 'Prometheus', 'Grafana', 'Loki'],
  'Data': ['PostgreSQL', 'SQL', 'Cloudera', 'Spark SQL'],
  'Networking': ['CCNA fundamentals', 'DNS', 'Cloudflare', 'Load balancers'],
} as const
