# API Architecture Flowchart - Job Matching Platform

## 📋 สารบัญ

1. [ภาพรวมระบบ](#ภาพรวมระบบ)
2. [Authentication Flow](#authentication-flow)
3. [Job Seeker APIs](#job-seeker-apis)
4. [Shop Owner APIs](#shop-owner-apis)
5. [Shared APIs](#shared-apis)
6. [Database Schema Overview](#database-schema-overview)

---

## 🏗️ ภาพรวมระบบ

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Application                     │
│                     (Frontend + Backend)                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         API Routes (/app/api)           │
        └─────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│     Auth     │    │  Job Seeker  │    │ Shop Owner   │
│     APIs     │    │     APIs     │    │     APIs     │
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              ▼
                    ┌──────────────────┐
                    │ PostgreSQL + Prisma │
                    └──────────────────┘
```

---

## 🔐 Authentication Flow

### Registration & Login Process

```mermaid
graph TD
    A[User เข้าหน้าเว็บ] --> B{มีบัญชีหรือยัง?}
    B -->|ยังไม่มี| C[POST /api/auth/register]
    B -->|มีแล้ว| D[POST /api/auth/login]
    
    C --> E[ระบบส่ง OTP ทางอีเมล]
    E --> F[POST /api/auth/verify]
    F --> G{OTP ถูกต้อง?}
    G -->|ใช่| H[สร้างบัญชีสำเร็จ]
    G -->|ไม่| I[POST /api/auth/resend-otp]
    I --> E
    
    D --> J{ข้อมูลถูกต้อง?}
    J -->|ใช่| K[สร้าง JWT Token + Session]
    J -->|ไม่| L[แจ้งเตือน Error]
    
    K --> M[GET /api/auth/me]
    M --> N[ได้ข้อมูล User Profile]
    
    H --> D
```

### Password Reset Flow

```mermaid
graph TD
    A[ลืมรหัสผ่าน] --> B[POST /api/auth/reset/forgot-password]
    B --> C[ส่ง OTP ไปอีเมล]
    C --> D[POST /api/auth/reset/verify-otp]
    D --> E{OTP ถูกต้อง?}
    E -->|ใช่| F[POST /api/auth/reset/reset-password]
    E -->|ไม่| C
    F --> G[รีเซ็ตรหัสผ่านสำเร็จ]
    G --> H[กลับไปหน้า Login]
```

### Auth APIs Summary

| Endpoint | Method | Purpose | Required Fields |
|----------|--------|---------|-----------------|
| `/api/auth/register` | POST | ลงทะเบียนผู้ใช้ใหม่ | email, password, role, fullName |
| `/api/auth/verify` | POST | ยืนยัน OTP หลังลงทะเบียน | email, otp |
| `/api/auth/resend-otp` | POST | ส่ง OTP ใหม่ | email |
| `/api/auth/login` | POST | เข้าสู่ระบบ | email, password |
| `/api/auth/me` | GET | ดึงข้อมูลผู้ใช้ปัจจุบัน | JWT Token (Header) |
| `/api/auth/logout` | POST | ออกจากระบบ | - |
| `/api/auth/reset/forgot-password` | POST | ขอรีเซ็ตรหัสผ่าน | email |
| `/api/auth/reset/verify-otp` | POST | ยืนยัน OTP สำหรับรีเซ็ต | email, otp |
| `/api/auth/reset/reset-password` | POST | ตั้งรหัสผ่านใหม่ | email, newPassword |

---

## 👤 Job Seeker APIs

### Job Seeker User Journey

```mermaid
graph TD
    A[Job Seeker Login] --> B[GET /api/auth/me]
    B --> C[Dashboard/Home]
    
    C --> D[GET /api/job-seeker/matching]
    D --> E[แสดงรายการงานที่แนะนำ]
    
    E --> F{สนใจงาน?}
    F -->|ใช่| G[POST /api/job-seeker/interests]
    F -->|ไม่| H[ดูงานอื่น]
    
    G --> I[GET /api/job-seeker/applications]
    I --> J[ติดตามสถานะการสมัคร]
    
    J --> K{Shop Owner ตอบรับ?}
    K -->|ใช่| L[เริ่มงาน - Status: in_progress]
    K -->|ไม่| M[Status: rejected]
    
    L --> N[ทำงานเสร็จ - Status: completed]
    N --> O[POST /api/shop-owner/applications/[id]/review]
    O --> P[Shop Owner รีวิว]
    
    P --> Q[GET /api/job-seeker/work-history]
    Q --> R[ดูประวัติการทำงาน]
    
    R --> S{ต้องการรีวิวกลับ?}
    S -->|ใช่| T[POST /api/job-seeker/work-history/[id]/review]
    T --> U[รีวิว Shop เสร็จสิ้น]
```

### Profile & Settings Flow

```mermaid
graph TD
    A[Profile Page] --> B[GET /api/job-seeker/profile]
    B --> C[แสดงข้อมูลโปรไฟล์]
    C --> D{ต้องการแก้ไข?}
    D -->|ใช่| E[PUT /api/job-seeker/profile]
    E --> F[อัพเดทข้อมูล]
    F --> B
```

### Job Seeker APIs Summary

| Endpoint | Method | Purpose | Response Data |
|----------|--------|---------|---------------|
| `/api/job-seeker/profile` | GET | ดึงข้อมูลโปรไฟล์ | Profile, skills, availability |
| `/api/job-seeker/profile` | PUT | แก้ไขโปรไฟล์ | Updated profile |
| `/api/job-seeker/matching` | GET | ดึงงานที่แนะนำ | Jobs matching user skills |
| `/api/job-seeker/recommendations` | GET | รับคำแนะนำงาน | Recommended jobs |
| `/api/job-seeker/interests` | POST | แสดงความสนใจงาน | Application created |
| `/api/job-seeker/applications` | GET | ดูรายการสมัครงาน | All applications |
| `/api/job-seeker/applications/[id]` | GET | ดูรายละเอียดการสมัคร | Application details |
| `/api/job-seeker/applications/[id]` | PATCH | อัพเดทสถานะ | Updated application |
| `/api/job-seeker/work-history` | GET | ดูประวัติการทำงาน | Completed jobs |
| `/api/job-seeker/work-history/[id]/review` | POST | รีวิว Shop | Review created |
| `/api/job-seeker/match-status` | GET | เช็คสถานะการแมตช์ | Match status |

---

## 🏪 Shop Owner APIs

### Shop Owner User Journey

```mermaid
graph TD
    A[Shop Owner Login] --> B[GET /api/auth/me]
    B --> C[Dashboard]
    
    C --> D{ต้องการทำอะไร?}
    
    D -->|สร้างงาน| E[POST /api/shop-owner/posts]
    E --> F[งานถูกสร้าง]
    
    D -->|ดูรายการงาน| G[GET /api/shop-owner/posts]
    G --> H[แสดงงานทั้งหมด]
    
    D -->|ดูผู้สมัคร| I[GET /api/shop-owner/applicants]
    I --> J[แสดงรายการผู้สมัคร]
    
    J --> K{ตรวจสอบผู้สมัคร}
    K --> L[GET /api/shop-owner/seekers/[id]]
    L --> M[ดูรายละเอียดผู้สมัคร]
    
    M --> N{ตัดสินใจ}
    N -->|รับ| O[PATCH /api/shop-owner/applications/[id]<br/>Status: accepted]
    N -->|ปฏิเสธ| P[PATCH /api/shop-owner/applications/[id]<br/>Status: rejected]
    
    O --> Q[ผู้สมัครเริ่มงาน<br/>Status: in_progress]
    Q --> R[งานเสร็จสิ้น<br/>Status: completed]
    R --> S[POST /api/shop-owner/applications/[id]/review]
    S --> T[รีวิวผู้สมัครเสร็จสิ้น]
```

### Post Management Flow

```mermaid
graph TD
    A[จัดการงาน] --> B[GET /api/shop-owner/posts]
    B --> C{ต้องการทำอะไร?}
    
    C -->|สร้างงานใหม่| D[POST /api/shop-owner/posts]
    D --> E[เลือก Category]
    E --> F[ระบุรายละเอียด]
    F --> G[บันทึกงาน]
    
    C -->|แก้ไขงาน| H[PUT /api/shop-owner/posts]
    C -->|ปิดงาน| I[PATCH /api/shop-owner/posts<br/>isActive: false]
```

### Shop Owner APIs Summary

| Endpoint | Method | Purpose | Response Data |
|----------|--------|---------|---------------|
| `/api/shop-owner/posts` | GET | ดูรายการงานทั้งหมด | All job posts |
| `/api/shop-owner/posts` | POST | สร้างงานใหม่ | Created post |
| `/api/shop-owner/posts` | PUT | แก้ไขงาน | Updated post |
| `/api/shop-owner/applicants` | GET | ดูผู้สมัครทั้งหมด | All applicants |
| `/api/shop-owner/applicants/[id]` | GET | ดูรายละเอียดผู้สมัคร | Applicant details |
| `/api/shop-owner/seekers/[id]` | GET | ดูโปรไฟล์ผู้หางาน | Seeker profile |
| `/api/shop-owner/applications` | GET | ดูรายการสมัครงาน | All applications |
| `/api/shop-owner/applications/[id]` | GET | ดูรายละเอียดการสมัคร | Application details |
| `/api/shop-owner/applications/[id]` | PATCH | อัพเดทสถานะการสมัคร | Updated status |
| `/api/shop-owner/applications/[id]/review` | POST | รีวิวผู้สมัคร | Review created |
| `/api/shop-owner/work-history` | GET | ดูประวัติการจ้างงาน | Work history |

---

## 🔄 Shared APIs

### Categories & Jobs

```mermaid
graph TD
    A[User เข้าระบบ] --> B[GET /api/categories]
    B --> C[แสดง Categories ทั้งหมด]
    
    A --> D[GET /api/jobs/[id]]
    D --> E[ดูรายละเอียดงาน]
    
    A --> F[GET /api/posts]
    F --> G[ดูงานทั้งหมดที่เปิดอยู่]
```

### Shop Profile & Reviews

```mermaid
graph TD
    A[ดูข้อมูล Shop] --> B[GET /api/shops/[id]]
    B --> C[แสดงข้อมูล Shop]
    
    C --> D[GET /api/shops/[id]/reviews]
    D --> E[แสดงรีวิว Shop]
    
    C --> F[GET /api/shops/[id]/dashboard]
    F --> G[แสดงสถิติ Shop]
    
    H[Upload รูปภาพ] --> I[POST /api/shops/upload]
    I --> J[รับ URL รูปภาพ]
```

### Shared APIs Summary

| Endpoint | Method | Purpose | Response Data |
|----------|--------|---------|---------------|
| `/api/categories` | GET | ดูหมวดหมู่งานทั้งหมด | All categories |
| `/api/jobs/[id]` | GET | ดูรายละเอียดงาน | Job details |
| `/api/posts` | GET | ดูโพสต์งานทั้งหมด | All active posts |
| `/api/shops` | GET | ดูรายการร้านค้าทั้งหมด | All shops |
| `/api/shops/[id]` | GET | ดูข้อมูลร้านค้า | Shop details |
| `/api/shops/[id]/reviews` | GET | ดูรีวิวร้านค้า | Shop reviews |
| `/api/shops/[id]/dashboard` | GET | ดูสถิติร้านค้า | Dashboard stats |
| `/api/shops/upload` | POST | อัพโหลดรูปภาพร้าน | Image URL |
| `/api/users/[id]` | GET | ดูข้อมูลผู้ใช้ | User details |

---

## 🔄 Application Status Flow

```mermaid
graph TD
    A[pending<br/>ผู้หางานสนใจงาน] --> B{Shop Owner ตัดสินใจ}
    
    B -->|รับ| C[accepted<br/>ยอมรับการสมัคร]
    B -->|ปฏิเสธ| D[rejected<br/>ปฏิเสธการสมัคร]
    
    C --> E[in_progress<br/>กำลังทำงาน]
    
    E --> F{ผลการทำงาน}
    F -->|เสร็จสมบูรณ์| G[completed<br/>ทำงานเสร็จสิ้น]
    F -->|มีปัญหา| H[terminated<br/>ยกเลิกก่อนเวลา]
    
    G --> I[รีวิวซึ่งกันและกัน]
    H --> J[ระบุเหตุผล]
    
    style A fill:#ffd700
    style C fill:#90EE90
    style D fill:#FFB6C1
    style E fill:#87CEEB
    style G fill:#98FB98
    style H fill:#FFA07A
```

### Status Explanation

| Status | ความหมาย | ใครเป็นคนเปลี่ยน |
|--------|----------|------------------|
| `pending` | รอการพิจารณา | Job Seeker (เมื่อแสดงความสนใจ) |
| `accepted` | ยอมรับการสมัคร | Shop Owner |
| `rejected` | ปฏิเสธการสมัคร | Shop Owner |
| `in_progress` | กำลังทำงาน | Shop Owner (เมื่อเริ่มงาน) |
| `completed` | เสร็จสิ้น | Shop Owner (เมื่อจบงาน) |
| `terminated` | ยกเลิก | Shop Owner หรือ Job Seeker |

---

## 💾 Database Schema Overview

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password        │
│ role            │ ──┐
│ full_name       │   │
│ profile_image   │   │
└─────────────────┘   │
                      │
        ┌─────────────┴──────────────┐
        │                            │
        ▼                            ▼
┌─────────────────┐          ┌──────────────────┐
│   JobSeekers    │          │   ShopOwners     │
├─────────────────┤          ├──────────────────┤
│ id (PK)         │          │ id (PK)          │
│ user_id (FK)    │          │ user_id (FK)     │
│ skills          │          │ shop_name        │
│ experience      │          │ description      │
│ available_days  │          │ location         │
│ gender          │          │ contact_info     │
└─────────────────┘          └──────────────────┘
                                      │
                                      │
                                      ▼
                             ┌──────────────────┐
                             │    JobPosts      │
                             ├──────────────────┤
                             │ id (PK)          │
                             │ shop_owner_id(FK)│
                             │ category_id (FK) │
                             │ title            │
                             │ description      │
                             │ wage             │
                             │ is_active        │
                             └──────────────────┘
                                      │
                                      │
            ┌─────────────────────────┴─────────────────────────┐
            │                                                   │
            ▼                                                   │
   ┌──────────────────┐                                        │
   │  Applications    │◄───────────────────────────────────────┘
   ├──────────────────┤
   │ id (PK)          │
   │ job_post_id (FK) │
   │ job_seeker_id(FK)│
   │ status           │ ──► (pending, accepted, rejected, in_progress, completed, terminated)
   │ rating           │
   │ review           │
   └──────────────────┘
```

---

## 🔑 Key Points สำหรับทีมใหม่

### 1. Authentication
- ใช้ **JWT Token** สำหรับ authentication
- ทุก API ที่ต้องการ auth ต้องส่ง token ใน Header: `Authorization: Bearer <token>`
- Token ได้จาก `/api/auth/login` หลัง login สำเร็จ

### 2. Role-Based Access
- มี 2 roles หลัก: `job_seeker` และ `shop_owner`
- แต่ละ role มี APIs เฉพาะของตัวเอง
- ต้องเช็ค role ก่อนเข้า API ที่เฉพาะเจาะจง

### 3. Email Verification
- ระบบส่ง OTP ทางอีเมลหลังลงทะเบียน
- ต้องยืนยัน OTP ก่อนใช้งานได้
- มีระบบ resend OTP กรณีไม่ได้รับ

### 4. Application Flow
- Job Seeker สนใจงาน → สร้าง Application (status: pending)
- Shop Owner รับ/ปฏิเสธ → เปลี่ยน status เป็น accepted/rejected
- เริ่มงาน → status: in_progress
- จบงาน → status: completed
- รีวิวซึ่งกันและกัน

### 5. Review System
- มี 2 ทิศทาง: Shop Owner รีวิว Job Seeker และ Job Seeker รีวิว Shop
- รีวิวได้เมื่อ status เป็น `completed` เท่านั้น
- มี rating (1-5) และ review text

---

## 📝 Example API Calls

### 1. Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "job_seeker"
  }
}
```

### 2. Get Matching Jobs (Job Seeker)
```javascript
GET /api/job-seeker/matching
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Response:
{
  "jobs": [
    {
      "id": 1,
      "title": "พนักงานร้านกาแฟ",
      "description": "...",
      "wage": 15000,
      "shop": {
        "name": "Amazon Coffee",
        "location": "เชียงใหม่"
      }
    }
  ]
}
```

### 3. Create Job Post (Shop Owner)
```javascript
POST /api/shop-owner/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "พนักงานร้านกาแฟ",
  "description": "ต้องการพนักงานประจำ",
  "categoryId": 1,
  "wage": 15000,
  "workingHours": "08:00-17:00"
}

Response:
{
  "id": 1,
  "title": "พนักงานร้านกาแฟ",
  "isActive": true,
  "createdAt": "2026-01-09T02:09:07.000Z"
}
```

### 4. Review Application
```javascript
POST /api/shop-owner/applications/1/review
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "rating": 5,
  "review": "ทำงานดีมาก ตรงเวลา"
}

Response:
{
  "success": true,
  "application": {
    "id": 1,
    "rating": 5,
    "review": "ทำงานดีมาก ตรงเวลา"
  }
}
```

---

## 🚀 Getting Started สำหรับทีมใหม่

### ขั้นตอนการทำความเข้าใจระบบ

1. **อ่าน Flowchart นี้ทั้งหมด** เพื่อเข้าใจภาพรวม
2. **ทดสอบการ Login** ด้วย Postman/Thunder Client
3. **ศึกษา API endpoints** ที่เกี่ยวข้องกับงานที่จะทำ
4. **ดู Database Schema** ใน `prisma/schema.prisma`
5. **ทดลองเรียก APIs** แต่ละตัวเพื่อเข้าใจ response

### ไฟล์สำคัญที่ควรดู

- `app/api/*/route.ts` - API endpoint handlers
- `prisma/schema.prisma` - Database schema
- `middleware.ts` - Authentication middleware (ถ้ามี)
- `lib/auth.ts` - Authentication utilities
- `lib/prisma.ts` - Prisma client instance

---

## 📞 Support

หากมีคำถามเกี่ยวกับ API ใดๆ สามารถดูรายละเอียดเพิ่มเติมได้ที่:
- Code ใน `/app/api/**/route.ts`
- Database schema ใน `/prisma/schema.prisma`
- ติดต่อทีมเดิมสำหรับคำอธิบายเพิ่มเติม

---

**สร้างเมื่อ:** 9 มกราคม 2026  
**Version:** 1.0  
**Author:** Development Team
