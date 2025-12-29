# 📊 การอธิบายโค้ดเว็บแอปพลิเคชันจับคู่งาน
### สำหรับการพรีเซนต์

---

## 📋 สารบัญ
1. [ภาพรวมโปรเจค](#ภาพรวมโปรเจค)
2. [สถาปัตยกรรมระบบ](#สถาปัตยกรรมระบบ)
3. [โครงสร้างฐานข้อมูล](#โครงสร้างฐานข้อมูล)
4. [เทคโนโลยีที่ใช้](#เทคโนโลจที่ใช)
5. [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
6. [ระบบ Authentication](#ระบบ-authentication)
7. [ตัวอย่างโค้ดสำคัญ](#ตวอยางโคดสำคญ)
8. [ฟีเจอร์หลัก](#ฟเจอรหลก)
9. [Flow การทำงาน](#flow-การทำงาน)
10. [การออกแบบ UI/UX](#การออกแบบ-uiux)

---

## 🎯 ภาพรวมโปรเจค

### ชื่อโปรเจค
**ระบบจับคู่งานอัตโนมัติ (Job Matching Platform)**

### วัตถุประสงค์
เป็นแพลตฟอร์มเชื่อมต่อระหว่าง:
- 👔 **เจ้าของร้านค้า (Shop Owner)** - ผู้ต้องการหาพนักงาน
- 💼 **ผู้หางาน (Job Seeker)** - ผู้ที่ต้องการหางานทำ

### คุณสมบัติเด่น
✅ **ระบบจับคู่อัตโนมัติ** - ใช้ Algorithm คำนวณความเหมาะสม  
✅ **ระบบ Location-based** - จับคู่ตามพื้นที่ใกล้เคียง  
✅ **ระบบรีวิวและเรตติ้ง** - ให้คะแนนหลังทำงานเสร็จ  
✅ **ระบบการจัดการงาน** - จัดการประกาศงาน, ผู้สมัคร, ประวัติการทำงาน  
✅ **Responsive Design** - รองรับทั้งมือถือและคอมพิวเตอร์  

---

## 🏗️ สถาปัตยกรรมระบบ

### Architecture Pattern
```
┌─────────────────────────────────────────────────┐
│              CLIENT (Browser)                    │
│  ┌──────────────────────────────────────────┐  │
│  │    Next.js 16 (App Router)               │  │
│  │    - React 19 Components                 │  │
│  │    - TailwindCSS 4 (Styling)            │  │
│  │    - Framer Motion (Animations)         │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │ HTTP/HTTPS
                 ▼
┌─────────────────────────────────────────────────┐
│         SERVER (Next.js API Routes)             │
│  ┌──────────────────────────────────────────┐  │
│  │    API Routes                            │  │
│  │    - /api/shop-owner/posts               │  │
│  │    - /api/job-seeker/matching            │  │
│  │    - /api/auth/login                     │  │
│  └──────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │    Middleware & Authentication           │  │
│  │    - JWT (Jose Library)                  │  │
│  │    - Cookie-based Session                │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │ Prisma ORM
                 ▼
┌─────────────────────────────────────────────────┐
│         DATABASE (PostgreSQL)                   │
│  - Users & Roles                                │
│  - Job Posts, Applications, Matches             │
│  - Work History & Reviews                       │
└─────────────────────────────────────────────────┘
```

### แนวคิดการออกแบบ
- **SSR (Server-Side Rendering)** - เร็ว SEO-friendly
- **API Routes** - Backend และ Frontend ในโปรเจคเดียว
- **Component-Based** - แยกส่วนประกอบเพื่อการใช้ซ้ำ
- **Type Safety** - ใช้ TypeScript ทั้งระบบ

---

## 🗄️ โครงสร้างฐานข้อมูล

### Entity Relationship Diagram (Simplified)

```
┌──────────────┐         ┌──────────────┐
│    Users     │────────▶│    Roles     │
└──────┬───────┘         └──────────────┘
       │
       ├─────────────────┬────────────────┐
       │                 │                │
       ▼                 ▼                ▼
┌─────────────┐   ┌──────────┐   ┌─────────────┐
│JobSeeker    │   │  Shop    │   │Password     │
│Profile      │   │          │   │Reset        │
└─────┬───────┘   └────┬─────┘   └─────────────┘
      │                │
      │                ▼
      │         ┌──────────────┐
      │         │ ShopJobPost  │──────▶ Categories
      │         └───────┬──────┘
      │                 │
      ├─────────────────┼────────────────┐
      │                 │                │
      ▼                 ▼                ▼
┌──────────┐    ┌──────────────┐  ┌─────────────┐
│ Matches  │    │ Applications │  │ WorkHistory │
└──────────┘    └──────────────┘  └─────────────┘
```

### ตารางหลักและความสัมพันธ์

#### 1. **Users & Roles**
```typescript
// ผู้ใช้งานในระบบ
Users {
  id: number
  email: string (unique)
  passwordHash: string
  roleId: number → Roles
  isActive: boolean
}

// บทบาท (job_seeker / shop_owner)
Roles {
  id: number
  name: string (unique)
}
```

#### 2. **JobSeekerProfile**
```typescript
// โปรไฟล์ผู้หางาน
JobSeekerProfile {
  id: number
  userId: number → Users
  fullName: string
  age: number
  gender: string
  phone: string
  address: string
  latitude, longitude: float // พิกัดสำหรับจับคู่
  availableDays: string[] // ["Mon", "Tue", ...]
  skills: string
  experience: string
}
```

#### 3. **Shop**
```typescript
// ข้อมูลร้านค้า
Shop {
  id: number
  userId: number → Users
  shopName: string
  description: string
  phone: string
  address: string
  profileImage: string
  latitude, longitude: float
}
```

#### 4. **ShopJobPost**
```typescript
// ประกาศรับสมัครงาน
ShopJobPost {
  id: number
  shopId: number → Shop
  categoryId: number → Category
  jobName: string
  description: string
  workDate: Date // วันที่ต้องการคน
  requiredPeople: number // จำนวนคนที่ต้องการ
  wage: Decimal // ค่าจ้าง
  status: string // "open" หรือ "closed"
  latitude, longitude: float
}
```

#### 5. **Application**
```typescript
// การสมัครงาน
Application {
  id: number
  seekerId: number → JobSeekerProfile
  postId: number → ShopJobPost
  status: string // pending/in_progress/completed/terminated
  review: string // รีวิวจากเจ้าของร้าน
  rating: number // 1-5 ดาว
}
```

#### 6. **Match**
```typescript
// ผลการจับคู่อัตโนมัติ
Match {
  id: number
  seekerId: number → JobSeekerProfile
  postId: number → ShopJobPost
  overallScore: float // คะแนนความเหมาะสม
  distanceKm: float
  categoryMatch: boolean
  dateMatch: boolean
}
```

---

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
| Technology | Version | หน้าที่ |
|-----------|---------|---------|
| **Next.js** | 16.0.10 | Framework หลักสำหรับสร้างเว็บ |
| **React** | 19.2.3 | Library สำหรับสร้าง UI |
| **TypeScript** | 5.x | เพิ่ม Type Safety |
| **TailwindCSS** | 4.x | Utility-first CSS Framework |
| **Framer Motion** | 12.23.25 | การทำ Animation |
| **Lucide React** | 0.555.0 | Icon Library |
| **Leaflet** | 1.9.4 | แสดงแผนที่ |

### Backend & Database
| Technology | Version | หน้าที่ |
|-----------|---------|---------|
| **Prisma ORM** | 6.19.1 | การจัดการฐานข้อมูล |
| **PostgreSQL** | - | ฐานข้อมูลหลัก |
| **Jose** | 6.1.3 | JWT Authentication |
| **Bcrypt** | 6.0.0 | Hash รหัสผ่าน |
| **Zod** | 4.1.13 | Validation Schema |

### Tools & Libraries
- **ESLint** - ตรวจสอบคุณภาพโค้ด
- **Nodemailer** - ส่งอีเมล OTP
- **next-themes** - จัดการ Dark Mode

---

## 📁 โครงสร้างโปรเจค

```
nextjs/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # กลุ่มหน้า Authentication
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── job-seeker/               # หน้าสำหรับผู้หางาน
│   │   ├── matching/             # หางานที่เหมาะสม
│   │   ├── applications/         # ดูใบสมัคร
│   │   ├── history/              # ประวัติการทำงาน
│   │   ├── profile/              # จัดการโปรไฟล์
│   │   └── layout.tsx            # Layout เฉพาะ job-seeker
│   │
│   ├── shop-owner/               # หน้าสำหรับเจ้าของร้าน
│   │   ├── dashboard/            # แดชบอร์ด
│   │   ├── posts/                # จัดการประกาศงาน
│   │   │   ├── create/           # สร้างประกาศใหม่
│   │   │   ├── [id]/             # ดูรายละเอียดงาน
│   │   │   └── [id]/edit/        # แก้ไขงาน
│   │   ├── applicants/           # ดูผู้สมัคร
│   │   ├── applications/         # จัดการใบสมัคร
│   │   ├── history/              # ประวัติการจ้างงาน
│   │   ├── profile/              # จัดการโปรไฟล์ร้าน
│   │   └── layout.tsx            # Layout เฉพาะ shop-owner
│   │
│   ├── shops/                    # หน้าดูข้อมูลร้าน (Public)
│   │   └── [id]/page.tsx
│   │
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/                 # Authentication APIs
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── logout/route.ts
│   │   ├── job-seeker/
│   │   │   ├── matching/route.ts
│   │   │   ├── applications/route.ts
│   │   │   └── profile/route.ts
│   │   └── shop-owner/
│   │       ├── posts/route.ts
│   │       ├── applicants/route.ts
│   │       └── profile/route.ts
│   │
│   ├── globals.css               # Global Styles
│   ├── layout.tsx                # Root Layout
│   └── page.tsx                  # หน้าแรก (Landing Page)
│
├── components/                   # React Components
│   ├── auth/                     # Components สำหรับ Auth
│   ├── cards/                    # Card Components
│   ├── forms/                    # Form Components
│   ├── home/                     # Landing Page Components
│   ├── job-seeker/               # Components เฉพาะ Job Seeker
│   ├── shop-owner/               # Components เฉพาะ Shop Owner
│   ├── layout/                   # Layout Components (Navbar, Sidebar)
│   └── ui/                       # Reusable UI Components
│
├── lib/                          # Utility Libraries
│   ├── auth.ts                   # Authentication helpers
│   ├── prisma.ts                 # Prisma Client instance
│   └── utils.ts                  # Utility functions
│
├── prisma/                       # Database
│   ├── schema.prisma             # Database Schema
│   ├── migrations/               # Migration files
│   └── seed.ts                   # Seed data
│
├── types/                        # TypeScript Type Definitions
├── utils/                        # Helper functions
├── public/                       # Static assets
├── .env                          # Environment variables
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 🔐 ระบบ Authentication

### วิธีการทำงาน (JWT + Cookie-based)

```typescript
// 📁 lib/auth.ts

// 1. สร้าง Session เมื่อ Login สำเร็จ
export async function createSession(userId: number, role: string) {
  // สร้าง JWT Token
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // อายุ 1 วัน
    .sign(SECRET_KEY);

  // เก็บ Token ใน Cookie (HttpOnly = ปลอดภัย)
  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,      // ไม่สามารถเข้าถึงผ่าน JavaScript
    secure: true,        // ใช้ได้เฉพาะ HTTPS (production)
    sameSite: 'lax',     // ป้องกัน CSRF
    path: '/',
  });
}
```

```typescript
// 2. ตรวจสอบสิทธิ์ในแต่ละหน้า
export async function validateUser(requiredRole: 'job_seeker' | 'shop_owner') {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    redirect('/login'); // ไม่มี Token → ไปหน้า Login
  }

  // ตรวจสอบ Token
  const { payload } = await jwtVerify(token, SECRET_KEY);
  const userId = Number(payload.userId);

  // ดึงข้อมูล User จาก Database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  // ตรวจสอบว่า Role ตรงกับที่ต้องการหรือไม่
  if (user.role.name !== requiredRole) {
    redirect('/'); // Role ไม่ตรง → Redirect
  }

  return user;
}
```

```typescript
// 3. Logout - ลบ Session
export async function deleteSession() {
  (await cookies()).delete('session');
}
```

### Flow การ Login

```
User กรอก Email/Password
         ↓
API: /api/auth/login
         ↓
1. ตรวจสอบ Email ในฐานข้อมูล
2. เปรียบเทียบ Password (bcrypt)
         ↓
     ถูกต้อง?
    ┌────┴────┐
   Yes        No
    │          └──→ Return 401 Error
    ↓
3. สร้าง JWT Token
4. เก็บใน Cookie
         ↓
5. ส่ง Response กลับ { success: true, role: "..." }
         ↓
Frontend: Redirect ตาม Role
  - job_seeker → /job-seeker/matching
  - shop_owner → /shop-owner/dashboard
```

---

## 💻 ตัวอย่างโค้ดสำคัญ

### 1. **API Route: ดึงรายการประกาศงาน**

```typescript
// 📁 app/api/shop-owner/posts/route.ts

export async function GET(request: NextRequest) {
  try {
    // 1. ตรวจสอบว่า User Login และเป็น shop_owner
    const { getCurrentUser } = await import('@/lib/auth');
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'shop_owner') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 2. หาร้านค้าของ User
    const shop = await prisma.shop.findUnique({
      where: { userId: currentUser.id },
    });

    // 3. ดึงรายการงานทั้งหมดของร้าน
    const posts = await prisma.shopJobPost.findMany({
      where: { shopId: shop.id },
      include: {
        shop: {
          select: { shopName: true }
        },
        category: {
          select: { name: true }
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch' },
      { status: 500 }
    );
  }
}
```

**จุดเด่น:**
- ✅ ตรวจสอบสิทธิ์ก่อนดึงข้อมูล
- ✅ ใช้ Prisma ORM ดึงข้อมูลพร้อม Relations
- ✅ Error Handling แบบครอบคลุม

---

### 2. **Page Component: หน้ารายการงาน**

```typescript
// 📁 app/shop-owner/posts/page.tsx

'use client'; // Client Component สำหรับใช้ useState, useEffect

export default function ShopOwnerPostsPage() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // ดึงข้อมูลเมื่อโหลดหน้า
  useEffect(() => {
    fetchJobPosts();
  }, []);

  const fetchJobPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/shop-owner/posts');
      
      if (res.ok) {
        const data = await res.json();
        setJobPosts(data.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // กรองตาม status
  const filteredPosts = jobPosts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  return (
    <div>
      {/* Filter Tabs */}
      <JobFilterTabs
        currentFilter={filter}
        onFilterChange={setFilter}
        tabs={[
          { key: 'all', label: 'ทั้งหมด' },
          { key: 'open', label: 'เปิดรับสมัคร' },
          { key: 'closed', label: 'ปิดรับสมัคร' },
        ]}
      />

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <JobCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
```

**จุดเด่น:**
- ✅ ใช้ React Hooks (useState, useEffect)
- ✅ Client-side Filtering
- ✅ Responsive Grid Layout
- ✅ Loading State

---

### 3. **Validation Schema (Zod)**

```typescript
// 📁 app/api/shop-owner/posts/route.ts

import { z } from 'zod';

// Schema สำหรับ validate ข้อมูลที่รับเข้ามา
const jobPostSchema = z.object({
  shop_id: z.number().int().positive(),
  category_id: z.number().int().positive(),
  job_name: z.string().min(1, 'Job name is required'),
  description: z.string().optional(),
  work_date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    { message: 'Invalid date format' }
  ),
  required_people: z.number().int().positive(),
  wage: z.union([z.number(), z.string()])
    .refine((val) => {
      const num = parseFloat(val.toString());
      return !isNaN(num) && num > 0;
    }, 'Wage must be positive'),
});

// ใช้งาน
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate - จะ throw error ถ้าข้อมูลไม่ถูกต้อง
  const validatedData = jobPostSchema.parse(body);
  
  // สร้างข้อมูล
  const jobPost = await prisma.shopJobPost.create({
    data: validatedData
  });
}
```

**ประโยชน์:**
- ✅ ตรวจสอบ Type และ Format ของข้อมูล
- ✅ ป้องกันข้อมูลผิดพลาดเข้าฐานข้อมูล
- ✅ Error Message ชัดเจน

---

### 4. **Prisma Client Setup**

```typescript
// 📁 lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// ป้องกัน Hot Reload สร้าง Instance ซ้ำ
declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClient =
  global.prisma ||
  new PrismaClient({
    // log: ['query'], // เปิดดู Query ที่ทำงาน
  });

// Development: เก็บ instance ไว้ใน global
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

export default prismaClient;
export { prismaClient as prisma };
```

**เหตุผล:**
- ในโหมด Development Next.js จะ Hot Reload บ่อย
- ถ้าสร้าง `new PrismaClient()` ทุกครั้ง จะเกิด Too Many Connections
- เก็บใน `global.prisma` เพื่อใช้ instance เดิม

---

## 🎨 การออกแบบ UI/UX

### Design System

#### 1. **Color Palette**
```typescript
// 📁 tailwind.config.ts

colors: {
  brand: {
    'primary-from': '#2563eb',      // Blue
    'primary-to': '#9333ea',        // Purple
  },
  surface: {
    DEFAULT: '#ffffff',
    dark: '#1f2937',
  },
  badge: {
    bg: '#dbeafe',                  // Light Blue
    text: '#1d4ed8',                // Dark Blue
  },
}
```

#### 2. **Typography**
- **Font Family:** Prompt (Thai-friendly)
- **Headings:** Font Weight 700 (Bold)
- **Body Text:** Font Weight 400 (Regular)

#### 3. **Spacing & Layout**
- Grid System: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Gap: `gap-4`, `gap-6`, `gap-8`
- Padding: `p-4`, `p-6`, `px-4 py-6`

#### 4. **Components**

**Card Component:**
```tsx
<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
                rounded-2xl p-6 shadow-xl hover:shadow-2xl 
                transition-all duration-500 hover:scale-105">
  {/* Content */}
</div>
```

**Button Component:**
```tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white 
                   px-6 py-3 rounded-xl font-medium 
                   transition-colors">
  ยืนยัน
</button>
```

#### 5. **Animations**
```css
/* Fade In Up Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🚀 ฟีเจอร์หลัก

### สำหรับ Shop Owner (เจ้าของร้าน)

#### 1. **การจัดการประกาศงาน**
- ✅ สร้างประกาศรับสมัครงาน
  - กำหนดชื่องาน, คำอธิบาย
  - เลือกหมวดหมู่งาน
  - ระบุค่าจ้าง, จำนวนคน
  - กำหนดวันที่ต้องการ
  
- ✅ แก้ไข/ลบประกาศ
  - แก้ไขรายละเอียดงาน
  - เปลี่ยนสถานะ (เปิด/ปิดรับสมัคร)
  - ลบประกาศ (พร้อมข้อมูลที่เกี่ยวข้อง)

#### 2. **การจัดการผู้สมัคร**
- ✅ ดูรายชื่อผู้สมัคร
- ✅ ดูโปรไฟล์ผู้สมัครแบบละเอียด
- ✅ อนุมัติ/ปฏิเสธใบสมัคร
- ✅ เปลี่ยนสถานะงาน (กำลังทำ/เสร็จสิ้น)

#### 3. **ระบบรีวิว**
- ✅ ให้คะแนนผู้สมัครหลังทำงานเสร็จ (1-5 ดาว)
- ✅ เขียนรีวิวความคิดเห็น

### สำหรับ Job Seeker (ผู้หางาน)

#### 1. **ระบบจับคู่งาน**
- ✅ ดูงานที่ระบบแนะนำ (Algorithm Matching)
  - จับคู่ตามหมวดหมู่ที่สนใจ
  - คำนวณระยะทาง (Location-based)
  - จับคู่ตามวันที่ว่าง
  
- ✅ สมัครงานที่สนใจ

#### 2. **การจัดการใบสมัคร**
- ✅ ดูสถานะใบสมัคร
  - Pending (รอพิจารณา)
  - In Progress (กำลังทำงาน)
  - Completed (เสร็จสิ้น)
  - Terminated (ถูกยกเลิก)

#### 3. **ประวัติการทำงาน**
- ✅ ดูประวัติงานที่ทำแล้ว
- ✅ ดูรีวิวและคะแนนที่ได้รับ

---

## 📊 Flow การทำงาน

### 1. Flow การสร้างประกาศงาน (Shop Owner)

```
Shop Owner เข้าหน้า "สร้างประกาศงาน"
              ↓
กรอกฟอร์ม (ชื่องาน, หมวดหมู่, ค่าจ้าง, วันที่, ฯลฯ)
              ↓
กด "สร้างประกาศ"
              ↓
Frontend ส่งข้อมูลไป API: POST /api/shop-owner/posts
              ↓
Backend:
  1. Validate ข้อมูลด้วย Zod
  2. ตรวจสอบสิทธิ์ (shop_owner)
  3. บันทึกลงฐานข้อมูล (Prisma)
              ↓
Return { success: true, data: jobPost }
              ↓
Frontend:
  - แสดงข้อความสำเร็จ
  - Redirect ไปหน้ารายการงาน
              ↓
ระบบจับคู่ทำงานอัตโนมัติ (Background)
  - หาผู้หางานที่เหมาะสม
  - คำนวณคะแนน
  - บันทึกใน Matches Table
```

### 2. Flow การสมัครงาน (Job Seeker)

```
Job Seeker เข้าหน้า "หางาน"
              ↓
ระบบแสดงงานที่แนะนำ (จาก Matches Table)
  - เรียงตามคะแนนความเหมาะสม
              ↓
กด "สมัครงาน"
              ↓
Frontend ส่งไป API: POST /api/job-seeker/applications
              ↓
Backend:
  1. ตรวจสอบว่าสมัครซ้ำหรือไม่
  2. สร้าง Application (status: pending)
  3. บันทึกลงฐานข้อมูล
              ↓
Return { success: true }
              ↓
Frontend: แสดงข้อความ "สมัครสำเร็จ"
              ↓
Shop Owner เห็นรายชื่อผู้สมัครใหม่
  - เข้าหน้า "ผู้สมัคร"
  - กด "อนุมัติ" หรือ "ปฏิเสธ"
              ↓
อนุมัติ → status: in_progress
ปฏิเสธ → status: terminated
```

### 3. Flow การรีวิว

```
งานเสร็จสิ้น (status: completed)
              ↓
Shop Owner เข้าหน้า "ประวัติการจ้างงาน"
              ↓
กด "ให้คะแนน"
              ↓
กรอก Rating (1-5 ดาว) และ Review
              ↓
API: PUT /api/shop-owner/applications?id=XXX
  - อัปเดต rating และ review
              ↓
Job Seeker เห็นคะแนนในหน้า "ประวัติการทำงาน"
```

---

## 🔍 Algorithm: ระบบจับคู่งาน

### ปัจจัยการจับคู่

```typescript
// คำนวณคะแนนความเหมาะสม (overallScore)

const calculateMatchScore = (seeker, jobPost) => {
  let score = 0;
  
  // 1. Category Match (40 คะแนน)
  if (seeker.categories.includes(jobPost.categoryId)) {
    score += 40;
  }
  
  // 2. Distance Match (30 คะแนน)
  const distance = calculateDistance(
    seeker.latitude, seeker.longitude,
    jobPost.latitude, jobPost.longitude
  );
  
  if (distance <= 5) score += 30;      // < 5 km
  else if (distance <= 10) score += 20; // 5-10 km
  else if (distance <= 20) score += 10; // 10-20 km
  
  // 3. Date Match (20 คะแนน)
  const jobDay = getDayOfWeek(jobPost.workDate); // "Mon", "Tue", ...
  if (seeker.availableDays.includes(jobDay)) {
    score += 20;
  }
  
  // 4. Experience Match (10 คะแนน)
  if (seeker.experience.length > 100) {
    score += 10; // มีประสบการณ์มาก
  }
  
  return score; // 0-100
};
```

### การคำนวณระยะทาง (Haversine Formula)

```typescript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // รัศมีโลก (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance; // km
};
```

---

## 🛡️ Security Best Practices

### 1. **Password Hashing**
```typescript
import bcrypt from 'bcrypt';

// การเข้ารหัส
const hashedPassword = await bcrypt.hash(plainPassword, 10);

// การตรวจสอบ
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### 2. **JWT Security**
- ✅ Token มีอายุ 1 วัน
- ✅ เก็บใน HttpOnly Cookie (ไม่สามารถเข้าถึงผ่าน JavaScript)
- ✅ ใช้ HTTPS ใน Production
- ✅ SameSite='lax' ป้องกัน CSRF

### 3. **API Authorization**
```typescript
// ทุก API Route ต้องตรวจสอบสิทธิ์
const currentUser = await getCurrentUser();

if (!currentUser) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

if (currentUser.role !== 'shop_owner') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### 4. **Input Validation**
- ✅ ใช้ Zod validate ทุก request body
- ✅ Sanitize input ก่อนบันทึกลง Database
- ✅ Prisma ORM ป้องกัน SQL Injection อัตโนมัติ

---

## 📈 Performance Optimization

### 1. **Database Indexing**
```prisma
// schema.prisma

model ShopJobPost {
  // ... fields

  @@index([workDate])           // เร็วขึ้นเมื่อ Query ตามวันที่
  @@index([categoryId])         // เร็วขึ้นเมื่อ Query ตามหมวดหมู่
  @@index([shopId, workDate])   // Composite index
  @@index([latitude, longitude]) // สำหรับ Location query
}
```

### 2. **Eager Loading (include)**
```typescript
// ❌ ไม่ดี: N+1 Query Problem
const posts = await prisma.shopJobPost.findMany();
for (const post of posts) {
  const shop = await prisma.shop.findUnique({ where: { id: post.shopId } });
}

// ✅ ดี: ใช้ include
const posts = await prisma.shopJobPost.findMany({
  include: {
    shop: true,
    category: true,
  },
});
```

### 3. **Client-Side Optimization**
- ✅ ใช้ `loading` state แสดง Skeleton
- ✅ Debounce สำหรับ Search Input
- ✅ Pagination แทน load ทั้งหมด

---

## 🐛 Error Handling

### 1. **Try-Catch Pattern**
```typescript
export async function GET(request: NextRequest) {
  try {
    // อาจเกิด error ได้
    const data = await prisma.shopJobPost.findMany();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server Error' },
      { status: 500 }
    );
  }
}
```

### 2. **Zod Validation Error**
```typescript
try {
  const validatedData = jobPostSchema.parse(body);
} catch (error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        success: false, 
        message: error.issues[0].message // "Job name is required"
      },
      { status: 400 }
    );
  }
}
```

### 3. **Prisma Error Codes**
```typescript
catch (error: any) {
  if (error.code === 'P2025') {
    // Record not found
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  
  if (error.code === 'P2002') {
    // Unique constraint violation
    return NextResponse.json({ message: 'Duplicate entry' }, { status: 409 });
  }
}
```

---

## 🌐 Environment Variables

```bash
# .env

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/jobmatch"

# JWT
JWT_SECRET="your-super-secret-key-change-in-production"

# Email (for OTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 🚀 Deployment Checklist

### Production Ready
- [ ] เปลี่ยน `JWT_SECRET` เป็นค่าที่ปลอดภัย
- [ ] เปิด `secure: true` สำหรับ Cookies
- [ ] ตั้งค่า `DATABASE_URL` ไปที่ Production Database
- [ ] Build แล้วทดสอบ: `npm run build`
- [ ] ตั้งค่า Environment Variables บน Hosting
- [ ] เปิด HTTPS
- [ ] ทดสอบ Authentication Flow
- [ ] Backup Database

### Recommended Platforms
- **Vercel** - สำหรับ Next.js (แนะนำ)
- **Railway** - สำหรับ Next.js + PostgreSQL
- **Netlify** - อีกทางเลือกหนึ่ง

---

## 📚 สรุปจุดเด่นของระบบ

### Technical Highlights
1. ✅ **Full-Stack TypeScript** - Type Safety ทั้ง Frontend-Backend
2. ✅ **Modern Stack** - Next.js 16 + React 19 + Prisma ORM
3. ✅ **Secure Authentication** - JWT + HttpOnly Cookies
4. ✅ **Validation** - Zod Schema Validation
5. ✅ **ORM** - Prisma with PostgreSQL
6. ✅ **Real-time UX** - Optimistic Updates
7. ✅ **Responsive Design** - TailwindCSS + Mobile-first

### Business Features
1. ✅ **Smart Matching Algorithm** - จับคู่อัตโนมัติตามความเหมาะสม
2. ✅ **Location-based** - คำนึงถึงระยะทาง
3. ✅ **Review System** - ระบบรีวิวและเรตติ้ง
4. ✅ **Status Tracking** - ติดตามสถานะงานได้ทุกขั้นตอน
5. ✅ **Multi-role** - รองรับทั้ง Job Seeker และ Shop Owner

---

## 🎓 แนวทางการพรีเซนต์

### 1. **เริ่มต้น (5 นาที)**
- แนะนำโปรเจค + วัตถุประสงค์
- DEMO หน้าจอหลักๆ
- อธิบาย User Flow แบบคร่าวๆ

### 2. **สถาปัตยกรรม (10 นาที)**
- แสดง Architecture Diagram
- อธิบาย Tech Stack
- โชว์ Database Schema

### 3. **โค้ดสำคัญ (15 นาที)**
- Authentication System
- API Route ตัวอย่าง
- Matching Algorithm
- การใช้ Prisma ORM

### 4. **UI/UX (5 นาที)**
- Design System
- Responsive Design
- Animation & Micro-interactions

### 5. **Q&A (5 นาที)**
- ตอบคำถามผู้ฟัง

---

## 📞 การติดต่อ

หากมีข้อสงสัยเพิ่มเติม สามารถศึกษาเพิ่มจาก:
- 📖 Next.js Docs: https://nextjs.org/docs
- 📖 Prisma Docs: https://www.prisma.io/docs
- 📖 TailwindCSS Docs: https://tailwindcss.com/docs

---

**จัดทำโดย:** System Development Team  
**วันที่:** 26 ธันวาคม 2567  
**เวอร์ชัน:** 1.0.0

---

✨ **ขอให้การพรีเซนต์ประสบความสำเร็จครับ!** ✨
