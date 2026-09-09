---
title: "Google Cloud Platform (GCP): IAM Resource Hierarchy & Security Essentials"
description: "Mastering GCP Organization, Folders, Projects, Custom IAM Roles, Service Account Keyless Workload Identity, and VPC Service Controls."
date: "2026-09-03"
author: "Akhil"
category: "GCP"
tags: ["GCP", "Security", "IAM", "GoogleCloud", "CloudEngineering"]
level: "Beginner"
featured: false
---

## GCP Resource Hierarchy

All GCP resources are organized in a strict logical tree. Permissions set higher in the hierarchy are inherited downward by all child nodes:

```
Organization (e.g., example.com)
  ├── Folder: Engineering
  │     ├── Folder: Core-Services
  │     │     └── Project: core-backend-prod
  │     └── Folder: Analytics
  │           └── Project: data-pipeline-prod
  └── Folder: Finance
        └── Project: billing-service
```

---

## IAM Roles Taxonomy

In GCP, IAM policies bind **Identities** (Members) to **Roles** (collections of permissions):

1. **Primitive Roles** (*Owner, Editor, Viewer*): Broad legacy permissions. Strongly discouraged in production environments.
2. **Predefined Roles**: Fine-grained Google-managed roles (e.g., `roles/storage.objectViewer`, `roles/compute.instanceAdmin.v1`).
3. **Custom Roles**: User-defined roles combining specific granular permissions (e.g., `resourcemanager.projects.get`).

---

## Workload Identity Federation (No Long-Lived Service Account Keys!)

Storing static JSON Service Account keys on GitHub Actions or external CI/CD pipelines creates severe security exposure. Use **Workload Identity Federation** instead to exchange short-lived OIDC tokens.

```bash
# Authorizing GitHub Actions OIDC against GCP Workload Identity Pool
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
    --project="my-gcp-project" \
    --location="global" \
    --workload-identity-pool="github-pool" \
    --display-name="GitHub Actions Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
    --issuer-uri="https://token.actions.githubusercontent.com"
```
