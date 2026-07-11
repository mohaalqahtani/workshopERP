# مخطط واجهات نظام إدارة الورشة (Frontend Architecture Plan)

هذا المخطط يربط جداول قاعدة البيانات (`Prisma Schema`) بصفحات وواجهات نظام `Next.js App Router` مدمجاً مع `Shadcn/ui` و `Better Auth` بناءً على أدوار المستخدمين.

---

## 📂 1. هيكلية المجلدات والمسارات (App Router Structure)

```text
src/app/
├── (auth)/
│   └── login/                          # صفحة تسجيل الدخول الموحدة
├── (public)/
│   └── track/
│       └── [jobCardId]/                # صفحة تتبع مباشرة للعميل (بدون تسجيل دخول)
└── dashboard/                          # لوحة التحكم الرئيسية (محمية بـ Middleware)
    ├── layout.tsx                      # الهيكل العام (Sidebar + Navbar)
    │
    ├── admin/                          # 👑 مسارات مدير الورشة
    │   ├── users/                      # إدارة الموظفين وتعديل صلاحياتهم (Role)
    │   ├── inventory/                  # إدارة مستودع قطع الغيار (Parts_Inventory)
    │   ├── services/                   # إعداد قائمة الخدمات والأسعار (Services_List)
    │   └── logs/                       # استعراض سجل العمليات (System_Logs)
    │
    ├── reception/                      # 🗂️ مسارات موظف الاستقبال
    │   ├── customers/                  # دليل العملاء (Customers) والسيارات (Vehicles)
    │   └── job-cards/
    │       ├── new/                    # فتح كرت عمل جديد وطباعة الباركود
    │       └── index/                  # استعراض الكروت وفلترتها (فواتير جاهزة، بانتظار الدفع)
    │
    └── technician/                     # 🔧 مسارات الفنيين
        ├── scan/                       # كاميرا مسح الباركود/QR Code لكرت العمل
        └── job-cards/
            └── [id]/                   # صفحة العمل التشغيلية للفني (الفحص، الصور، القطع)