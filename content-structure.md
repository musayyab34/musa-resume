# Portfolio Website — Content & Structure Plan

**Type:** Single-page site with sticky nav + smooth-scroll anchors
**Owner:** Muhammad Musayyab — DevOps Engineer
**Source:** Musayyab CV.pdf

---

## Global

- **Site title / tab title:** Muhammad Musayyab — DevOps Engineer
- **Nav bar (sticky top):** Logo/Initials (MM) · About · Experience · Skills · Projects · Education · Contact
- **Theme direction:** Dark, terminal/infra-inspired aesthetic (fits DevOps identity) — dark navy/charcoal background, one accent color (e.g. teal or amber), monospace touches for headings/labels. (Open to alternatives — can discuss.)
- **Resume download:** "Download Resume (PDF)" button in nav or hero — link to the PDF file.

---

## 1. Hero / Header Section

- **Name:** Muhammad Musayyab
- **Title:** DevOps Engineer
- **One-line tagline** (new, punchier version of "About Me" opener):
  *"I make deployments less stressful — Linux, cloud infra, and CI/CD done the right way, not just the fast way."*
- **Location:** Islamabad, Pakistan
- **CTA buttons:** "Get in Touch" (scrolls to Contact) · "Download Resume"
- **Contact icons/links:** Email, Phone, (LinkedIn/GitHub — placeholders until you provide links)

---

## 2. About Section

Full "About Me" text from resume, lightly presented (maybe as a short paragraph + 3-4 highlight chips):

> I'm a DevOps Engineer who genuinely enjoys the problem-solving that comes with the role. My foundation is Linux administration, but over the past couple of years I've built solid experience with AWS, GCP, Azure, Docker, Terraform, and GitHub Actions, working on real projects across CI/CD, infrastructure provisioning, and cloud migrations. I'm detail-oriented and methodical, and I care about doing things the right way rather than just the fast way. I work well with developers and like being the person who makes deployments less stressful for everyone involved.

**Highlight chips (optional visual element):** Linux Admin · Multi-Cloud (AWS/GCP/Azure) · CI/CD · IaC · Cost Optimization

---

## 3. Experience Section (reverse chronological timeline or stacked cards)

### Remote DevOps Engineer — Forge-Tech, Croatia
**March 2025 – Present**
- Maintained and improved GitHub Actions CI/CD pipelines, making deployments more consistent and reducing manual steps.
- Automated repetitive deployment and maintenance tasks using Bash/Python scripts, saving time and reducing human error.
- Provisioned and managed cloud infrastructure across AWS and Azure, supporting reliable application environments.
- Deployed and monitored Docker-based applications, improving reliability and day-to-day operations.
- Managed SSH access, IAM roles, security patches, and OS updates using least-privilege principles.
- Collaborated with developers to troubleshoot deployment issues and improve delivery speed.

### DevOps Engineer Intern — Antematter
**November 2025 – March 2026**
- Delivered DevOps work across AWS and GCP for live client/internal projects.
- Helped migrate a US healthcare client's stack from EC2-based Docker to GCP Cloud Run + Cloud SQL.
- Resolved rollout issues across service accounts, secrets, Cloud SQL connectivity, VPC access, env vars, and Cloud Run revisions.
- Helped build an end-to-end automated deployment flow for a client SaaS platform (ECR, App Runner, RDS, Secrets Manager, S3, GitHub Actions).
- Used AWS CDK as IaC to manage client cloud resources in a repeatable, version-controlled way.
- Built daily cloud cost reporting with AWS Lambda, EventBridge, SNS, and Cost Explorer; reduced waste.
- Automated Route 53 DNS/subdomain provisioning with Bash.
- Hands-on with Terraform, Docker, Kubernetes, Cloudflare, monitoring, and serverless tooling.

### Cloudera Administration Internship — Blutech Consulting
**October 2025 – November 2025**
- Onboarded to Cloudera (Manager, HDFS, YARN); set up dev access and ran cluster health checks.
- Practiced ingest → lake flow: HDFS load, Parquet conversion, Spark SQL queries.
- Studied/documented data-warehousing concepts (OLTP vs OLAP, star/snowflake, partitioning, file formats), mapped to Hive/Impala.
- Basic Linux administration.

### Data Engineering Internship — Blutech Consulting
**May 2025 – July 2025**
- Wrote and tuned SQL queries for analytics and ad-hoc requests.
- Designed/modified tables, keys, and indexes to boost performance.
- Performed data-cleansing and bulk updates (INSERT/UPDATE/MERGE).
- Explored core data-warehouse concepts (star schema, OLTP vs OLAP).

*(Design note: The two Blutech internships could be visually "de-emphasized" — smaller cards or collapsed by default — since they're data-focused rather than DevOps, while Forge-Tech and Antematter get full-size featured cards.)*

---

## 4. Skills Section (grouped, badge/pill style)

- **Cloud Platforms:** AWS (EC2, ECR, ECS, Lambda, RDS, S3, Route 53, CloudWatch, EventBridge, SNS, App Runner, Secrets Manager) · GCP (Cloud Run, Cloud SQL, Artifact Registry, Secret Manager, VPC) · Azure
- **Infrastructure as Code & Automation:** Terraform · AWS CDK · Bash scripting
- **Containers & CI/CD:** Docker · Docker Compose · GitHub Actions
- **Linux & Version Control:** Linux Administration · Git
- **Databases & Data:** PostgreSQL · SQL (schema design, joins, aggregations, INSERT/UPDATE/MERGE)
- **Networking & DNS:** CCNA fundamentals · Load balancers · DNS · Cloudflare
- **Monitoring & Observability:** CloudWatch · Prometheus/Grafana · Loki
- **Orchestration & Serverless:** Kubernetes basics · AWS Lambda · Cloud Run · App Runner

*(Display idea: category label + row of pill badges, maybe with subtle icons for AWS/GCP/Azure/Docker/Terraform/K8s.)*

---

## 5. Projects Section (card grid)

### DevOps Pipeline Simulation — Final Year Project (Virtual University, 2024)
- Functional DevOps pipeline simulation showcasing CI/CD workflow using GitHub Actions, Docker, and AWS.
- Containerized a static web app with Docker; automated testing/build in CI pipeline.
- Automated infra provisioning with Terraform.
- Used ECS (deployment), ECR (registry), CloudWatch (monitoring/logging/alerting).
- GitHub Actions triggered on git push — ran tests, built containers, deployed updates.
- Integrated monitoring/logging/alerting for visibility and resilience.
- Followed security, scalability, and maintainability best practices.

**Tags:** GitHub Actions · Docker · Terraform · AWS ECS/ECR/CloudWatch

*(Note: this is currently your only listed project — the section is designed as a grid so it's easy to drop in more cards later, e.g. CageCalls or Forge-Tech work if you're able to showcase them without breaching confidentiality.)*

---

## 6. Education Section

- **BS Software Engineering** — Virtual University (2025)

*(Small section — could be merged into a compact "Education & Certifications" strip near Skills or Experience rather than a full standalone section, unless you want room to add certifications later.)*

---

## 7. Contact Section / Footer

- **Heading:** "Let's Work Together" / "Get in Touch"
- **Email:** itsmusayyab@gmail.com
- **Phone:** +92 336 5988565
- **Location:** Islamabad, Pakistan
- **Social links:** LinkedIn / GitHub (placeholders — need URLs from you)
- **Footer:** © 2026 Muhammad Musayyab · built with Claude Code

---

## Decisions (confirmed)

1. **LinkedIn:** https://www.linkedin.com/in/musayyabmuhammad/ (GitHub — not provided yet)
2. **Visual theme:** Super futuristic — dark base, neon/blue accents, glassmorphism, heavy scroll animations, lots of motion, 3D elements where possible.
3. **Confidentiality:** Real employer names OK (Forge-Tech, Antematter, Blutech Consulting); client names anonymized ("US healthcare client", "client SaaS platform").
4. **Resume PDF:** Downloadable copy offered on the site.
5. **Hosting:** Decide later — likely Vercel free tier.
6. **Tech stack:** Vite + vanilla JS · GSAP + ScrollTrigger (scroll animations) · Three.js (3D background).
