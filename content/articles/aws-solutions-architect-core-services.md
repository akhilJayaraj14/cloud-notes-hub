---
title: "AWS Solutions Architect: Core Compute, Storage & Database Architecture"
description: "A comprehensive cheat sheet and reference guide covering EC2 instances, S3 storage tiers, RDS vs DynamoDB, and High Availability VPC design."
date: "2026-09-08"
author: "Cloud Study Hub"
category: "AWS"
tags: ["AWS", "Architecture", "EC2", "S3", "DynamoDB", "VPC"]
level: "Intermediate"
featured: true
---

## Overview

Designing resilient, cost-optimized, and highly available architectures on Amazon Web Services (AWS) requires an understanding of how foundational services interact across multiple Availability Zones (AZs).

This study guide summarizes the high-priority architectural patterns, storage classes, and database trade-offs needed for the AWS Solutions Architect exam and real-world team implementations.

---

## High Availability VPC Architecture

A production-grade VPC is split across at least **two Availability Zones** with dedicated public and private subnets.

```
       Internet
          │
    ┌─────▼─────────────────────────┐
    │     Internet Gateway (IGW)    │
    └─────┬───────────────────┬─────┘
          │                   │
  ┌───────▼────────┐  ┌───────▼────────┐
  │ Public Subnet  │  │ Public Subnet  │
  │ AZ-1a (NAT GW) │  │ AZ-1b (NAT GW) │
  └───────┬────────┘  └───────┬────────┘
          │ (Egress Traffic)  │
  ┌───────▼────────┐  ┌───────▼────────┐
  │ Private Subnet │  │ Private Subnet │
  │ AZ-1a (App/DB) │  │ AZ-1b (App/DB) │
  └────────────────┘  └────────────────┘
```

### Key VPC Design Rules:
1. **Public Subnet**: Has a direct route table entry to an Internet Gateway (`0.0.0.0/0 -> igw-xxxx`).
2. **Private Subnet**: Reaches the internet outbound only via a **NAT Gateway** located in a public subnet.
3. **Security Groups vs. NACLs**:
   - **Security Groups**: Stateful, apply at instance/ENI level, allow rules only.
   - **NACLs**: Stateless, apply at subnet level, support allow and deny rules evaluated in numbered order.

---

## EC2 Purchasing & Scaling Strategies

Selecting the right purchasing option can reduce compute costs by up to 90%:

| Option | Best Use Case | Discount |
| :--- | :--- | :--- |
| **On-Demand** | Short-term, spiky, unpredictable workloads | Baseline (0%) |
| **Reserved Instances (1 or 3 yr)** | Steady-state database / baseline compute | Up to 72% |
| **Savings Plans** | Flexible compute usage across EC2, Fargate, Lambda | Up to 72% |
| **Spot Instances** | Fault-tolerant batch processing, big data, CI/CD | Up to 90% |

> **Pro Tip**: Never run mission-critical relational database masters on Spot Instances since AWS can reclaim spot capacity with a 2-minute termination notice.

---

## Amazon S3 Storage Tier Decision Matrix

Choosing the correct S3 storage class directly impacts both retrieval latency and cost:

- **S3 Standard**: 99.99% availability, 11 9s durability. Millisecond retrieval. For active data.
- **S3 Standard-IA (Infrequent Access)**: Lower storage cost, but incurs per-GB retrieval fees. 30-day minimum storage charge.
- **S3 Intelligent-Tiering**: Automatically moves objects between frequent, infrequent, and archive access tiers based on access patterns without operational overhead.
- **S3 Glacier Flexible**: Retrieval in minutes to hours. Ideal for quarterly backups.
- **S3 Glacier Deep Archive**: Lowest cost cloud storage ($0.00099/GB/mo). Retrieval within 12 to 48 hours.

---

## Database Architecture: RDS vs DynamoDB

### Relational Database Service (RDS / Aurora)
- **Use Cases**: Complex joins, ACID transactions, relational models (Postgres, MySQL).
- **Multi-AZ**: Synchronous standby replica in another AZ for instant automatic failover.
- **Read Replicas**: Asynchronous replication for horizontal read scaling (up to 15 Aurora replicas).

### Amazon DynamoDB
- **Use Cases**: Key-value or document model with predictable single-digit millisecond latency at any scale.
- **Partition Key & Sort Key**: Careful partition key selection ensures uniform partition distribution and prevents hot partition throttling.
- **DAX (DynamoDB Accelerator)**: In-memory cache delivering microsecond latency for read-heavy workloads.

```bash
# Example: Querying a DynamoDB table via AWS CLI
aws dynamodb query \
    --table-name CloudStudyNotes \
    --key-condition-expression "Category = :cat AND Date >= :dt" \
    --expression-attribute-values '{
        ":cat": {"S": "AWS"},
        ":dt": {"S": "2026-01-01"}
    }'
```

---

## Key Exam & Interview Checklist

- [x] Multi-AZ deployments protect against infrastructure failure (High Availability).
- [x] Read Replicas improve read performance (Scalability).
- [x] S3 Cross-Region Replication (CRR) requires Versioning enabled on both source and destination buckets.
- [x] Use AWS Secrets Manager for automatic credential rotation with RDS.
