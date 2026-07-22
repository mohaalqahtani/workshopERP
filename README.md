# 🔧 WorkShopERP — نظام إدارة ورشة السيارات

نظام متكامل لإدارة ورش السيارات مبني بـ **Next.js 16 App Router** و**TypeScript**، يشمل إدارة العملاء والسيارات وكروت العمل والمخزون، مع نظام صلاحيات متعدد الأدوار.

---

## 🗂️ محتويات الملف

- [نظرة عامة](#-نظرة-عامة)
- [المميزات](#-المميزات)
- [التقنيات المستخدمة](#-التقنيات-المستخدمة)
- [هيكلية المشروع](#-هيكلية-المشروع)
- [أدوار المستخدمين](#-أدوار-المستخدمين)
- [طريقة التشغيل](#-طريقة-التشغيل)
- [متغيرات البيئة](#-متغيرات-البيئة)

---

## 🔍 نظرة عامة

WorkShopERP هو نظام ERP مصمم خصيصاً لورش السيارات، يتيح لكل طرف في الورشة — من المدير إلى موظف الاستقبال إلى الفني — العمل عبر لوحة تحكم مخصصة لدوره. يدعم النظام مسح الباركود، تتبع الصيانة، إدارة قطع الغيار، والفواتير، مع إمكانية متابعة العميل لحالة سيارته بدون تسجيل دخول.

---

## ✨ المميزات

- **نظام مصادقة متكامل** عبر Better Auth مع صلاحيات مبنية على الأدوار (RBAC)
- **كروت العمل (Job Cards)** — فتح، تتبع، وإغلاق أوامر الصيانة مع باركود لكل كرت
- **مسح الباركود/QR** — الفني يمسح الكرت مباشرة من كاميرا الجهاز ⌛
- **إدارة العملاء والسيارات** — سجل كامل لكل عميل وجميع سياراته ⌛
- **مستودع قطع الغيار** — إضافة وتعديل وتتبع القطع المستخدمة في كل كرت
- **قائمة الخدمات والأسعار** — يعدّها المدير ويختار منها موظف الاستقبال والفني
- **رفع الصور** — توثيق حالة السيارة عند الاستقبال والتسليم
- **تتبع عام للعميل** — رابط مباشر بدون تسجيل دخول لمتابعة حالة الكرت ⌛
- **سجل العمليات (System Logs)** — مراقبة كاملة لكل نشاط في النظام ⌛
- **لوحة إحصائيات** — رسوم بيانية تفاعلية عبر Recharts⌛

---

## 🛠️ التقنيات المستخدمة

| الفئة              | التقنية                     |
| ------------------ | --------------------------- |
| الإطار الأساسي     | Next.js 16 (App Router)     |
| اللغة              | TypeScript                  |
| قاعدة البيانات     | PostgreSQL                  |
| ORM                | Prisma v7                   |
| المصادقة           | Better Auth v1.6            |
| واجهة المستخدم     | shadcn/ui + Tailwind CSS v4 |
| الجداول            | TanStack React Table        |
| الرسوم البيانية    | Recharts                    |
| السحب والإفلات     | @dnd-kit                    |
| الباركود           | jsbarcode                   |
| الإشعارات          | Sonner                      |
| التحقق من البيانات | Zod                         |
| رفع الصور          | Cloudinary                  |

---

## 📁 هيكلية المشروع

```
workshopERP/
├── app/
│   ├── (auth)/
│   │   └── login/                    # صفحة تسجيل الدخول الموحدة
│   ├── (public)/
│   │   └── track/[jobCardId]/        # تتبع كرت العمل للعميل (بدون تسجيل دخول)
│   └── dashboard/
│       ├── layout.tsx                # الهيكل العام (Sidebar + Navbar)
│       ├── admin/
│       │   ├── users/                # إدارة الموظفين والصلاحيات
│       │   ├── inventory/            # مستودع قطع الغيار
│       │   ├── services/             # قائمة الخدمات والأسعار
│       │   └── logs/                 # سجل العمليات
│       ├── reception/
│       │   ├── customers/            # إدارة العملاء والسيارات
│       │   └── job-cards/
│       │       ├── new/              # فتح كرت عمل جديد
│       │       └── index/            # استعراض وفلترة الكروت
│       └── technician/
│           ├── scan/                 # مسح الباركود/QR Code
│           └── job-cards/[id]/       # صفحة العمل التشغيلي للفني
├── components/                       # المكونات المشتركة
├── hooks/                            # Custom React Hooks
├── lib/                              # مكتبات مساعدة (auth، prisma، utils)
├── prisma/
│   └── schema.prisma                 # مخطط قاعدة البيانات
└── middleware.ts                     # حماية المسارات وفحص الجلسة
```

---

## 👥 أدوار المستخدمين

| الدور               | الصلاحيات                                              |
| ------------------- | ------------------------------------------------------ |
| 👑 **ADMIN**        | إدارة الموظفين، المخزون، الخدمات، سجل العمليات         |
| 🗂️ **RECEPTIONIST** | إدارة العملاء والسيارات، فتح وإغلاق كروت العمل         |
| 🔧 **TECHNICIAN**   | مسح الباركود، تحديث حالة الكرت، رفع الصور، إضافة القطع |

---

## 🚀 طريقة التشغيل

**المتطلبات المسبقة:** Node.js 18+، PostgreSQL

```bash
# 1. استنساخ المشروع
git clone https://github.com/mohaalqahtani/workshopERP.git
cd workshopERP

# 2. تثبيت الحزم
npm install

# 3. إعداد ملف البيئة
cp .env.example .env
# عدّل الملف بمعلومات قاعدة البيانات

# 4. تطبيق مخطط قاعدة البيانات
npx prisma migrate dev

# 5. تشغيل المشروع
npm run dev
```

افتح المتصفح على `http://localhost:3000`

---

## ⚙️ متغيرات البيئة

أنشئ ملف `.env` في جذر المشروع بالمحتوى التالي:

```env
# قاعدة البيانات
DATABASE_URL="postgres://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME"

# Better Auth
BETTER_AUTH_SECRET="..."        # شغّل الأمر أدناه لتوليد القيمة
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary (رفع الصور)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

لتوليد `BETTER_AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

---

---

# 🔧 WorkShopERP — Automotive Workshop Management System

A full-stack ERP system for automotive workshops, built with **Next.js 16 App Router** and **TypeScript**. Covers customer management, vehicle records, job cards, spare parts inventory, and a multi-role permission system.

---

## 🗂️ Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)

---

## 🔍 Overview

WorkShopERP is a purpose-built ERP for automotive workshops. Each stakeholder — manager, receptionist, or technician — gets their own role-specific dashboard. The system supports barcode scanning, maintenance tracking, parts inventory, invoicing, and a public customer-facing tracking page that requires no login.

---

## ✨ Features

- **Full authentication system** via Better Auth with role-based access control (RBAC)
- **Job Cards** — create, track, and close maintenance orders, each with a unique barcode
- **Barcode / QR scanning** — technicians scan job cards directly from a device camera ⌛
- **Customer & Vehicle management** — full records per customer with all associated vehicles ⌛
- **Spare parts inventory** — add, edit, and track parts used on each job card
- **Services & pricing catalog** — configured by the admin, selected by reception and technicians
- **Photo uploads** — document vehicle condition on check-in and delivery
- **Public customer tracking** — shareable link for customers to track job card status without logging in ⌛
- **System logs** — full audit trail of all activity ⌛
- **Analytics dashboard** — interactive charts powered by Recharts ⌛

---

## 🛠️ Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Framework      | Next.js 16 (App Router)     |
| Language       | TypeScript                  |
| Database       | PostgreSQL                  |
| ORM            | Prisma v7                   |
| Authentication | Better Auth v1.6            |
| UI             | shadcn/ui + Tailwind CSS v4 |
| Tables         | TanStack React Table        |
| Charts         | Recharts                    |
| Drag & Drop    | @dnd-kit                    |
| Barcodes       | jsbarcode                   |
| Notifications  | Sonner                      |
| Validation     | Zod                         |
| File Uploads   | Cloudinary                  |

---

## 📁 Project Structure

```
workshopERP/
├── app/
│   ├── (auth)/
│   │   └── login/                    # Unified login page
│   ├── (public)/
│   │   └── track/[jobCardId]/        # Public job card tracking (no login required)
│   └── dashboard/
│       ├── layout.tsx                # Shared layout (Sidebar + Navbar)
│       ├── admin/
│       │   ├── users/                # Staff management & role assignment
│       │   ├── inventory/            # Spare parts inventory
│       │   ├── services/             # Services & pricing catalog
│       │   └── logs/                 # System audit logs
│       ├── reception/
│       │   ├── customers/            # Customer & vehicle records
│       │   └── job-cards/
│       │       ├── new/              # Open a new job card
│       │       └── index/            # Browse & filter job cards
│       └── technician/
│           ├── scan/                 # Barcode / QR Code scanner
│           └── job-cards/[id]/       # Technician work view
├── components/                       # Shared UI components
├── hooks/                            # Custom React Hooks
├── lib/                              # Helpers (auth, prisma, utils)
├── prisma/
│   └── schema.prisma                 # Database schema
└── middleware.ts                     # Route protection & session validation
```

---

## 👥 User Roles

| Role                | Permissions                                                     |
| ------------------- | --------------------------------------------------------------- |
| 👑 **ADMIN**        | Manage staff, inventory, services catalog, and system logs      |
| 🗂️ **RECEPTIONIST** | Manage customers & vehicles, open and close job cards           |
| 🔧 **TECHNICIAN**   | Scan barcodes, update job card status, upload photos, add parts |

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+, PostgreSQL

```bash
# 1. Clone the repository
git clone https://github.com/mohaalqahtani/workshopERP.git
cd workshopERP

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Apply the database schema
npx prisma migrate dev

# 5. Start the development server
npm run dev
```

Open your browser at `http://localhost:3000`

---

## ⚙️ Environment Variables

Create a `.env` file at the project root:

```env
# Database
DATABASE_URL="postgres://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME"

# Better Auth
BETTER_AUTH_SECRET="..."       # Generate with the command below
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary (photo uploads)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

To generate `BETTER_AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---
