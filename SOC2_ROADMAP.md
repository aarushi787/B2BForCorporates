SOC 2 ROADMAP (PRACTICAL PHASED PLAN)
====================================

Goal
----
Achieve SOC 2 Type I readiness first, then Type II operating effectiveness.

Phase 1: Foundation (0-30 days)
-------------------------------
- Define system boundary, in-scope services, and data classification.
- Assign policy owners (security, privacy, access, incident response).
- Baseline controls:
  - MFA for admin/staff accounts.
  - least-privilege access model.
  - secure secrets management.
  - centralized audit logging.
- Build evidence checklist and control matrix.

Phase 2: Control Implementation (30-75 days)
--------------------------------------------
- Access controls:
  - periodic access reviews.
  - onboarding/offboarding checklist.
- Change management:
  - ticketed changes, PR approvals, production release logs.
- Vulnerability management:
  - dependency scanning, patch SLAs, monthly review.
- Logging/monitoring:
  - alerting for auth failures, privileged actions, payment anomalies.
- Backups/DR:
  - backup policy, restore tests, RTO/RPO targets.

Phase 3: Readiness and Type I (75-120 days)
-------------------------------------------
- Run internal readiness assessment.
- Close gaps and gather evidence for each control.
- Perform SOC 2 Type I audit (point-in-time design assessment).

Phase 4: Type II Operation (next 3-12 months)
---------------------------------------------
- Operate controls continuously.
- Collect evidence monthly/quarterly.
- Perform SOC 2 Type II audit (operating effectiveness over time).

Recommended tooling
-------------------
- GRC tracker for control/evidence mapping.
- SIEM/centralized logs with retention policy.
- Secrets manager and key rotation.
- Endpoint management + MDM for employee devices.

Current implementation notes in this project
--------------------------------------------
- Audit log APIs and storage are implemented.
- Privacy/GDPR endpoints exist for consent, export, and deletion requests.
- KYC metadata can be encrypted at application layer using DATA_ENCRYPTION_KEY.
- AML checks are integrated with escrow payment operations.

