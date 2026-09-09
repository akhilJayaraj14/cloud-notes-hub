---
title: "Types of Storage: Object, Block and File — Explained from Scratch"
description: "A beginner-friendly deep dive comparing Object Storage, Block Storage, and File Storage with real-life analogies, side-by-side trade-offs, and cloud architecture examples."
date: "2026-09-09"
author: "Akhil"
category: "AWS"
tags: ["Storage", "S3", "EBS", "EFS", "Architecture", "CloudFundamentals", "Beginner"]
level: "Beginner"
featured: true
---

## Who is this article for?

Anyone who has heard the words *object storage*, *block storage*, and *file storage* but is not sure what they actually mean. No prior cloud experience is assumed. Everything is explained with everyday, real-life comparisons first, and the technical detail is added on top only after the idea is clear.

---

## 1. Introduction: Why Are There Different Types of Storage?

Every application in the world has to keep data somewhere. A mobile app keeps photos, a bank keeps transaction records, a hospital keeps scan reports, a website keeps its own code and logs. At first glance it looks like this should be a solved problem: just save the data on a disk and move on.

In practice, different kinds of data are used in very different ways:
- A **database** writes and rewrites tiny pieces of data thousands of times per second.
- A **video streaming service** writes a file once and then serves the exact same file to millions of people.
- A **design team** needs twenty people to open the same shared folder at the same time.

One single storage design cannot be the best answer for all three of these situations.

So the industry settled on three broad ways of organising stored data. They are called **block storage**, **file storage**, and **object storage**. They are not competing products where one wins and the others lose. They are three different shapes of the same raw material, each shaped for a different job.

> **The One-Line Summary (keep this in mind while reading)**:  
> **Block storage** gives you raw slices of a disk and lets you organise them yourself.  
> **File storage** gives you a familiar folder tree that many machines can share.  
> **Object storage** gives you a giant flat pool where every item is stored whole, with a unique address and a label describing it.

---

## 2. A Simple Analogy Before Any Technical Detail

Imagine you have to store your belongings. There are three different services in town:

### The Self-Storage Unit (Block Storage)
You rent an empty unit. It is just bare space with four walls. The company does not care what you put inside or how you arrange it. You bring your own shelves, your own boxes, and your own labelling system. It is the most flexible option and the fastest to access, because you know exactly where everything is — but all the organising work is yours.

### The Shared Office Filing Room (File Storage)
There is a room full of cabinets, drawers, and folders, and everyone in the office already knows how to use it. You walk in, follow the labels — `Finance -> 2026 -> Q1 -> Invoices` — and pick up what you need. Multiple colleagues can use the same room at the same time. The structure is ready-made and familiar, but as it grows to millions of folders it becomes slow and hard to manage.

### The Airport Baggage System (Object Storage)
You hand over a whole suitcase. You do not get shelf space, and you do not get a folder path. You get a **unique tag number**, and the system attaches a label describing the bag: owner, flight, weight, destination. The bags are not arranged in any tree; they sit in one enormous pool. When you want your bag back, you present the tag and the system finds it instantly. You cannot open the suitcase and change one shirt inside it — you take the whole suitcase and hand back a new one. In exchange, the system can handle a practically unlimited number of bags.

> **The Key Insight**:  
> The real difference between the three is **how small a piece of data you are allowed to address and change**.  
> - **Block storage** addresses tiny fixed-size chunks.  
> - **File storage** addresses a file inside a folder path.  
> - **Object storage** addresses one whole object by its unique key, and replaces it entirely when it changes.

---

## 3. Block Storage

### 3.1 What it is
Block storage takes a disk and divides it into equal, fixed-size pieces called **blocks** — typically 512 bytes or 4 kilobytes each. Each block gets its own address, and that is the entire structure. There is no concept of a file, a folder, or a filename at this level. The storage system simply hands out numbered blocks and answers two requests: *read block number N* and *write this data to block number N*.

When your computer saves a 10 MB file to a block device, the operating system breaks that file into many blocks, scatters them across the disk wherever there is space, and keeps its own map of which blocks belong to which file. That map is the **file system** (NTFS on Windows, ext4 or XFS on Linux, APFS on Mac). The block storage itself knows nothing about your file; it only knows the blocks.

### 3.2 How you use it
A block volume behaves exactly like a physical hard drive plugged into a machine. Before you can store anything on it you have to prepare it, the same three steps you would follow with a brand-new external drive:
1. **Attach** the volume to one server (in the cloud, a virtual machine).
2. **Format** it with a file system, which writes the initial organising structure.
3. **Mount** it to a location such as `/data` or drive `D:`, after which normal programs can read and write to it.

### 3.3 The most important characteristic
Because blocks are small and individually addressable, you can change a tiny part of a large file without rewriting the whole thing. If a database needs to update one row inside a 500 GB table, it changes only the few blocks that hold that row. This ability is called **in-place modification**, and it is the reason block storage is the foundation of nearly every database in existence.

The other consequence is speed. There is very little machinery between the request and the disk, so latency is extremely low — often under a millisecond on solid-state drives. Performance is usually measured in **IOPS** (input/output operations per second) and **throughput** (megabytes per second).

### 3.4 The main limitation
A block volume is normally attached to **one server at a time**. Two servers cannot both write to the same raw volume safely, because each one keeps its own private map of the blocks and neither knows what the other has changed — the result is corrupted data. Sharing block storage between machines requires special clustered file systems, which are complex and rarely worth it. Block storage also does not scale endlessly: a volume has a fixed size you must decide in advance and grow manually.

### 3.5 Where you will see it
- **Databases**: MySQL, PostgreSQL, MongoDB, Oracle (the classic use case).
- **Boot volumes**: The disk that holds the operating system of a virtual machine.
- **Transactional applications**: Banking, ticket booking, order processing, anywhere many small writes happen quickly.
- **Products**: AWS Elastic Block Store (EBS), Azure Managed Disks, Google Persistent Disk, and on-premises SAN arrays connected over iSCSI or Fibre Channel.

---

## 4. File Storage

### 4.1 What it is
File storage is the model everyone already knows, because it is how your laptop presents data to you. Data is stored as named files, and files are placed inside folders, and folders can contain other folders. This produces a tree, called a **hierarchy**, and every file has an address that is simply its position in that tree — its path:

```bash
# Example file path:
/company/finance/2026/Q1/invoice-4471.pdf
```
*Reading left to right, this is a set of directions: start at the top, go into `company`, then `finance`, then `2026`, then `Q1`, and pick up the file named `invoice-4471.pdf`.*

### 4.2 What makes it different from block storage
File storage sits one level above block storage. Underneath, the data still ends up on blocks — but here the storage system itself owns the file system and manages the mapping for you. You never think about blocks. You think about files and folders.

The decisive advantage this unlocks is **sharing**. Because the storage system, not the individual server, is in charge of the structure, it can safely let many machines and many users read and write at the same time. It handles the coordination — locking a file while someone edits it, tracking permissions for each user, keeping a consistent view for everyone. This is what a network drive at an office is, and what NAS (Network Attached Storage) devices provide at home.

Access happens over standard network protocols: **NFS** (Network File System), common in the Linux and Unix world, and **SMB or CIFS**, common in the Windows world.

### 4.3 The main limitation
The hierarchy that makes file storage so intuitive is also what limits it. Every lookup means walking down the tree, and the storage system must maintain metadata for every folder and every file. That works beautifully for thousands or millions of files. At hundreds of millions, the tree becomes a bottleneck: listing a directory gets slow, backups take forever, and the structure itself becomes hard to reason about. File storage also tends to be more expensive per gigabyte than object storage, and cannot grow without limit.

### 4.4 Where you will see it
- **Shared team drives**: Documents, spreadsheets, and designs that several people work on.
- **Content management and legacy applications**: Older software often assumes it can read and write ordinary file paths, and cannot be rewritten easily.
- **Media production and engineering workflows**: Video editing, CAD files, scientific datasets shared across a team.
- **Home directories on shared servers**, and lift-and-shift migrations of on-premises systems to the cloud.
- **Products**: AWS Elastic File System (EFS) and FSx, Azure Files, Google Filestore, and NAS devices from vendors such as NetApp and Synology.

---

## 5. Object Storage

### 5.1 What it is
Object storage throws away the folder tree entirely. Instead of a hierarchy, it uses one huge **flat pool**, and every item in that pool is called an **object**. Objects live inside containers, which AWS calls **buckets**.

Every object is made of three parts:

| Part | What it is | Example |
| :--- | :--- | :--- |
| **The data** | The actual content, stored as one complete, indivisible unit. A photo, video, PDF, log file, or database backup. | The bytes of a 4 MB JPEG |
| **The key** | A unique name that identifies the object within its bucket. This is the object's whole address — there is no folder path behind it. | `users/8812/avatar.jpg` |
| **The metadata** | A set of labels describing the object. Some are set by the system; you can add as many of your own as you like. | `content-type: image/jpeg; uploaded-by: user-8812; region: kerala` |

> **Slashes in a key are NOT folders**:  
> A key such as `users/8812/avatar.jpg` looks like a folder path, and cloud consoles helpfully draw it as folders. But there is no tree underneath. The slashes are just characters in a long name, exactly like hyphens would be. This is one of the most common points of confusion for beginners!

### 5.2 How you use it
You do not attach an object store to a server and you do not mount it as a drive. You talk to it over the internet using an **HTTP API** — the same protocol your browser uses:
- `PUT` — store an object under a given key.
- `GET` — retrieve the whole object by its key.
- `DELETE` — remove the object.
- `LIST` — list the keys in a bucket, optionally filtered by a prefix.

Because access is over plain HTTP, any application in any language can use object storage without special drivers, and a stored file can be served directly to a web browser or CDN.

### 5.3 The most important characteristic
Objects are **immutable**. You cannot open an object and edit five bytes in the middle of it. To change anything, you upload a complete new version that replaces the old one.

This sounds like a restriction, and for databases it genuinely is a disqualifying one. But it is exactly what makes object storage scale so well: with no in-place edits and no tree to maintain, the system has far less bookkeeping to do, so it can hold **trillions of objects and practically unlimited capacity**.

Object storage systems also keep multiple copies of every object across separate physical locations automatically. This is why providers advertise extremely high durability — **AWS S3 is designed for 99.999999999% durability (11 nines)**.

### 5.4 Storage classes: paying less for colder data
Not all data is read equally often. A profile photo may be fetched every day; a compliance archive from 2019 may never be read again but must legally be kept.

Object storage lets you place each object in a storage class that trades retrieval speed for price:
- **Hot classes** cost more per gigabyte and return data instantly.
- **Archival classes** are dramatically cheaper but may take minutes or hours to restore.
- **Lifecycle rules** can move objects between classes automatically as they age.

### 5.5 The main limitation
- **Higher latency** than block storage — measured in tens or hundreds of milliseconds rather than under a millisecond.
- **No partial updates** — changing one byte means re-uploading the entire object.
- **Not a drive** — ordinary programs that expect file paths will not work with it unless they are modified or a translation layer is added.
- **Eventual consistency in some systems** — historically, a change could take a moment to become visible everywhere. Major providers including S3 now offer strong read-after-write consistency.

### 5.6 Where you will see it
- **User-uploaded content**: Photos, videos, profile pictures, attachments.
- **Static website assets**: Images, CSS, and JavaScript, usually served through a CDN.
- **Backups, archives, and disaster recovery**: Database dumps, snapshots, compliance records.
- **Data lakes, logs, and analytics**: The raw storage layer under big data and machine learning pipelines.
- **Products**: Amazon S3, Azure Blob Storage, Google Cloud Storage, and self-hosted MinIO or Ceph.

---

## 6. Side-by-Side Comparison

| Aspect | Block Storage | File Storage | Object Storage |
| :--- | :--- | :--- | :--- |
| **Unit of data** | Fixed-size block | File inside a folder | Whole object |
| **How it is organised** | Flat numbered blocks; you supply the structure | Hierarchical folder tree | Flat pool of objects in buckets |
| **How data is addressed** | Block address | File path | Unique key |
| **Metadata** | Almost none | Basic (name, size, dates, permissions) | Rich and fully customisable |
| **How it is accessed** | Attached to a server as a disk (iSCSI, Fibre Channel, NVMe) | Network protocols (NFS, SMB / CIFS) | HTTP REST API |
| **Can be shared** | Usually one server at a time | Yes — many clients at once | Yes — unlimited clients over the internet |
| **Can you edit part of it** | Yes, in place | Yes, in place | No — replace the whole object |
| **Latency** | Lowest (sub-millisecond) | Low to moderate | Highest (tens of milliseconds) |
| **Scalability** | Limited; volumes are resized manually | Good, but degrades at very large scale | Practically unlimited |
| **Cost per GB** | Highest | Moderate to high | Lowest |
| **Best suited to** | Databases, boot disks, transactional workloads | Shared drives, legacy apps, team collaboration | Media, backups, data lakes, static content |
| **Cloud examples** | AWS EBS, Azure Disks, GCP Persistent Disk | AWS EFS, Azure Files, GCP Filestore | Amazon S3, Azure Blob, Google Cloud Storage |

### 6.1 The Layered View
It also helps to see that these are not three unrelated technologies sitting side by side. Physical drives are at the bottom of everything. Block storage is the thinnest layer over them. File storage adds a hierarchy and sharing on top of blocks. Object storage is a distributed system built across many machines, each of which is itself using block storage internally.

```
┌──────────────────────────────────────────────────────────────┐
│  OBJECT STORAGE: Keys, Metadata, HTTP, Unlimited Scale       │
├──────────────────────────────────────────────────────────────┤
│  FILE STORAGE: Folders, Filenames, Shared Multi-Client Access│
├──────────────────────────────────────────────────────────────┤
│  BLOCK STORAGE: Numbered Blocks, Raw, Low Latency, Fast      │
├──────────────────────────────────────────────────────────────┤
│  PHYSICAL HARDWARE: Disks (HDD / SSD / NVMe)                 │
└──────────────────────────────────────────────────────────────┘
```
*As you move up the stack you gain scale, sharing, and simplicity; as you move down you gain speed and fine-grained control.*

---

## 7. How to Choose: A Practical Decision Guide

In real projects the decision is rarely agonising. Three questions almost always settle it:

| Ask yourself | If the answer is yes | Choose |
| :--- | :--- | :--- |
| Does the application need to modify small parts of large data very frequently, with the lowest possible delay? Is it a database? | You need in-place edits and sub-millisecond latency. | **Block storage** |
| Do several servers or several people need to read and write the same data at the same time, through ordinary file paths? | You need a shared, hierarchical, POSIX-style file system. | **File storage** |
| Is the data written once and read many times, growing without a clear limit, and accessed by whole items rather than pieces? | You need scale and low cost more than you need low latency. | **Object storage** |

> **A Useful Rule of Thumb**:  
> If it is a **database**, it wants **block**.  
> If it is a **shared folder**, it wants **file**.  
> If it is a **file a user uploaded, a backup, or a log**, it wants **object**.  
> *When you are genuinely unsure and the data is not a database, object storage is usually the safe default — it is the cheapest and the hardest to outgrow.*

### 7.1 A Worked Example: A Photo-Sharing Application
Most real systems use all three types together. Consider a simple app where users sign up and upload photos:
1. **The PostgreSQL database** holding user accounts, captions, and follower relationships runs on **block storage** (thousands of small reads/writes per second, in-place updates).
2. **The photos themselves** go to **object storage** (hundreds of millions of photos, each written once and read many times, served straight to browsers/CDNs by key, and moved automatically to cheaper storage classes after a year).
3. **The content moderation team's shared workspace**, where reviewers open the same flagged-image folders and internal tools read files by path, sits on **file storage**.
4. **The operating system disk** of every application server is, of course, **block storage** as well.

*Notice that no type is 'better'. Each one is placed where its strengths match the workload.*

---

## 8. Glossary of Terms Used

| Term | Meaning |
| :--- | :--- |
| **Block** | A fixed-size chunk of data, usually 512 bytes or 4 KB, that a disk reads and writes as one unit. |
| **File system** | The software layer that keeps track of which blocks make up which file. Examples: `ext4`, `XFS`, `NTFS`, `APFS`. |
| **Mount** | To attach a storage volume to a location in a machine's directory tree so programs can use it. |
| **Bucket** | A named container that holds objects in an object storage system. |
| **Key** | The unique name that identifies an object inside a bucket. The object's complete address. |
| **Metadata** | Data about data — labels describing the content, such as its type, owner, or creation time. |
| **IOPS** | Input/output operations per second. A measure of how many separate read or write requests storage can handle. |
| **Throughput** | How much data can move per second, usually in MB/s. Different from IOPS: many small requests versus large volume. |
| **Latency** | The delay between asking for data and receiving it. Lower is better. |
| **Durability** | The probability that stored data will not be lost. Often quoted as '11 nines' (99.999999999%). |
| **Availability** | The probability that stored data can be reached at any given moment. Always lower than durability. |
| **Immutable** | Cannot be changed in place. To modify it, you replace it entirely. |
| **NFS / SMB** | Network protocols that let a machine use file storage located on another machine over the network. |
| **REST API** | A way for programs to talk to a service over HTTP using simple requests such as GET and PUT. |
| **CDN** | Content Delivery Network. A global set of caches that serve content from a location near the user. |
| **Storage class** | A pricing and performance tier within object storage, trading retrieval speed for lower cost. |

---

## 9. Conclusion

Block, file, and object storage are three answers to the same question: *how should data be organised so it can be found and used again?*

- **Block storage** answers with numbered chunks and leaves the organising to you, delivering unmatched speed and precision for databases.
- **File storage** answers with a folder tree that people and legacy applications already understand, making shared access effortless.
- **Object storage** answers with a flat pool of self-describing items addressed by unique keys, trading fine-grained editing and low latency for scale, durability, and cost that neither of the others can match.

None of the three is being replaced by another. Serious systems combine them, matching each workload to the storage model that suits it. Once the three shapes are clear in your mind, the product names offered by AWS, Azure, and Google stop being a confusing list and become simple variations on these three ideas.

> **Three Sentences to Carry Away**:  
> 1. **Block is a raw disk**: fastest, smallest unit, one server, for databases.  
> 2. **File is a shared folder tree**: familiar, collaborative, for teams and legacy applications.  
> 3. **Object is a labelled pool of whole items**: cheapest, endlessly scalable, for media, backups, and data lakes.
