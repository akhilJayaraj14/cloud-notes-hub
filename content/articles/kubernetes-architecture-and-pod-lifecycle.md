---
title: "Kubernetes Architecture & Pod Lifecycle Deep Dive"
description: "Mastering Kubernetes Control Plane components, kubelet, etcd consensus, Pod lifecycle hooks, and zero-downtime rolling deployments."
date: "2026-09-07"
author: "Cloud Study Hub"
category: "Kubernetes"
tags: ["Kubernetes", "DevOps", "Containers", "K8s", "CKA"]
level: "Advanced"
featured: true
---

## Kubernetes Architecture Overview

A production Kubernetes cluster consists of two distinct planes: the **Control Plane** (managing cluster state) and **Worker Nodes** (running actual containerized workloads).

```
   ┌──────────────────────────────────────────────────────────┐
   │                   CONTROL PLANE (Master)                │
   │                                                          │
   │   ┌─────────────┐   ┌──────────────┐   ┌─────────────┐   │
   │   │  API Server │◄──┤  Controller  │   │  Scheduler  │   │
   │   │  (kube-api) │   │   Manager    │   │             │   │
   │   └──────▲──────┘   └──────────────┘   └─────────────┘   │
   │          │                                               │
   │   ┌──────▼──────┐                                        │
   │   │ etcd (Raft) │ (Consistent Key-Value Store)           │
   │   └─────────────┘                                        │
   └──────────┬───────────────────────────────────────────────┘
              │ TLS Communication
   ┌──────────▼───────────────────────────────────────────────┐
   │                   WORKER NODE                           │
   │                                                          │
   │   ┌─────────────┐   ┌──────────────┐   ┌─────────────┐   │
   │   │   kubelet   │   │  kube-proxy  │   │ ContainerD  │   │
   │   └──────▲──────┘   └──────────────┘   └──────▲──────┘   │
   │          │                                    │          │
   │   ┌──────▼────────────────────────────────────▼──────┐   │
   │   │  Pod (Container 1)    Pod (Container 2)          │   │
   │   └──────────────────────────────────────────────────┘   │
   └──────────────────────────────────────────────────────────┘
```

---

## Control Plane Components Explained

1. **kube-apiserver**: The front door for all administrative requests and node synchronization. Only component that talks directly to `etcd`.
2. **etcd**: Highly-available, distributed key-value store using the Raft consensus algorithm. Stores all cluster state and secrets.
3. **kube-scheduler**: Watches for newly created Pods with no assigned node and selects the best node based on resource requests, taints, and affinity rules.
4. **kube-controller-manager**: Runs core control loops (Node Controller, ReplicaSet Controller, EndpointSlice Controller, ServiceAccount Controller).

---

## Pod Lifecycle & Probes

Kubernetes relies on three distinct container probes to ensure application health:

### 1. Startup Probe
Determines if the application inside the container has initialized. All other probes are disabled until the startup probe succeeds.

### 2. Liveness Probe
Checks if the container is still running properly. If it fails, `kubelet` terminates and restarts the container according to its `restartPolicy`.

### 3. Readiness Probe
Checks if the container is ready to accept user network traffic. If it fails, the Pod's IP is removed from all Service endpoints.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloud-api-service
  labels:
    app: cloud-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cloud-api
  template:
    metadata:
      labels:
        app: cloud-api
    spec:
      containers:
      - name: api
        image: ghcr.io/org/cloud-api:v2.4.0
        ports:
        - containerPort: 8080
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "100m"
            memory: "128Mi"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8080
          initialDelaySeconds: 15
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## Essential Kubectl Commands for Day-2 Operations

```bash
# Get resource usage across nodes
kubectl top nodes

# Stream logs with container prefix
kubectl logs -f deployment/cloud-api-service --all-containers=true

# Execute an interactive debugging shell inside a Pod
kubectl exec -it pod-name -c container-name -- /bin/sh

# View events sorted by timestamp
kubectl get events --sort-by='.metadata.creationTimestamp'
```
