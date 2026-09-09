---
title: "Cloud Networking: CIDR Subnetting, NAT Gateways & Transit VPC Peering"
description: "Everything you need to know about IPv4 CIDR calculations, public/private route tables, AWS Transit Gateway, and cross-cloud VPC peering."
date: "2026-09-01"
author: "Akhil"
category: "Networking"
tags: ["Networking", "VPC", "AWS", "GCP", "Routing", "Security"]
level: "Advanced"
featured: false
---

## CIDR Block Calculation Essentials

Cloud VPCs allocate subnets using Classless Inter-Domain Routing (CIDR) blocks.

### The 5 Reserved IPs in an AWS Subnet (e.g. `10.0.0.0/24`)
- `10.0.0.0`: Network address.
- `10.0.0.1`: VPC Router address.
- `10.0.0.2`: Amazon DNS server (`169.254.169.253`).
- `10.0.0.3`: Reserved by AWS for future use.
- `10.0.0.255`: Network broadcast address (AWS does not support broadcast, but reserves it).
- **Usable IPs**: $2^{(32-24)} - 5 = 256 - 5 = 251$ usable IPs.

---

## VPC Peering vs. AWS Transit Gateway

| Feature | Direct VPC Peering | AWS Transit Gateway (TGW) |
| :--- | :--- | :--- |
| **Topology** | Mesh ($N \times (N-1) / 2$) | Hub-and-Spoke (Centralized) |
| **Transitive Routing** | ❌ No (Cannot hop through a middle VPC) | ✅ Yes (Full transitive routing supported) |
| **Cross-Account / Org** | Supported (manual peering accept) | Integrated with AWS RAM |
| **Bandwidth** | Uncapped line-rate peering | Up to 50 Gbps burst per VPC attachment |
| **Cost** | Data transfer charges only | Hourly attachment fee + data processing fee |

---

## Troubleshooting Connectivity Checklist

1. Verify route tables in both source and destination subnets include the target CIDR route.
2. Ensure Security Groups allow ingress on the required protocol and port.
3. Check Network Access Control Lists (NACLs) for matching outbound ephemeral port ranges (`1024-65535`).
4. Ensure target instances have an ENI and IP within the subnet range.
