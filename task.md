# LMS VOD & ZOOM LIVE CLASS

## 📋 ATURAN PENTING

1. **Mobile First**: UI/UX WAJIB Mobile dulu, baru Desktop (base → sm: → md: → lg:)
2. **Pagination**: Semua list pakai pagination (10/page), search (debounced 500ms), filter
3. **Sidebar**: Route baru WAJIB update `app-sidebar.tsx`
4. **Context7**: Selalu tanya Context7 sebelum coding
5. **shadcn**: Pakai `npx shadcn@latest add [component]` untuk UI components
6. **No Build**: Pakai `composer run dev` untuk development (4 processes: server, queue, vite, scheduler)

---

## 🛠️ TECH STACK

- Laravel 12 + React 19 + Inertia.js v3
- shadcn/ui + Tailwind CSS
- RazerMS Payment Gateway (Malaysia)
- Zoom API (S2S OAuth)

---

## 💾 DATABASE (9 Tables)

1. **users** - default + capstar_member_id + roles
2. **courses** - title, description, thumbnail, price, is_free, is_published
3. **lessons** - course_id, title, video_type, video_url, duration, order
4. **zoom_meetings** - course_id, zoom_meeting_id, start_time, duration, join_url, start_url
5. **enrollments** - user_id, course_id, progress_percentage, status
6. **attendances** - user_id, zoom_meeting_id, check_in_time, check_out_time
7. **questions** - course_id, question_text, options (a,b,c,d), correct_answer
8. **exam_results** - user_id, course_id, score, is_passed, certificate_path, attempt
9. **transactions** - user_id, course_id, order_id, amount, status, payment_method

---

## 🎯 BUSINESS RULES

**Roles:**
- Admin: Full CRUD
- User: View enrolled courses only

**Payment:**
- Free Course: Langsung enroll
- Paid Course: Bayar via RazerMS dulu → auto-enroll setelah success
- Transaction expired: 30 menit (auto-cancel via scheduler)

**Exam:**
- Min 5 soal, durasi 30 menit, KKM 80%, max 3 attempt
- Unlock setelah 100% lessons completed
- Auto-generate certificate PDF jika passed

---

## �️ ROUTING

**User Routes:**
```
/browse - Browse semua courses (free & paid)
/courses/{id}/detail - Detail course
/courses/{id}/checkout - Checkout (paid course)
/courses - My enrolled courses
/courses/{id}/lessons/{lessonId} - VOD Player
/courses/{id}/exam - Exam
/transactions - Transaction history
```

**Admin Routes:**
```
/admin/courses - CRUD Course
/admin/courses/{id}/lessons - CRUD Lesson
/admin/courses/{id}/questions - CRUD Question
/admin/enrollments - Manage enrollments (user-centric)
/admin/transactions - View all transactions
```

---

## 🚀 PROGRESS

### ✅ SELESAI:
- **FASE 1-5**: Auth, CRUD, VOD, Exam, Certificate
- **FASE 6**: Free vs Paid Course + Filter
- **FASE 7**: RazerMS Payment Integration + Transaction Expiration
- **FASE 7.5**: UI/UX Improvements (Browse, Detail, Checkout - Mobile First)
- **FASE 9**: Zoom Integration ✅

### ⏳ BELUM:
- **FASE 8**: Authorization Policies
- **FASE 10**: Capstar API Sync

---

## 📝 DETAIL FASE YANG SUDAH SELESAI

### FASE 7.6: OTP EMAIL VERIFICATION ✅
**Tujuan:** Email verification dengan OTP untuk register & forgot password

**Yang sudah dibuat:**

1. **Backend:**
   - ✅ Migration: otp_verifications table (email, otp, type, expires_at, is_verified)
   - ✅ Model: OtpVerification dengan validasi
   - ✅ Service: OtpService (generate, verify, cleanup)
   - ✅ Mailable: OtpMail dengan template HTML
   - ✅ Controller: RegisteredUserController (sendOtp, store dengan OTP)
   - ✅ Controller: PasswordResetLinkController (send OTP)
   - ✅ Controller: OtpVerificationController (verify, reset password)
   - ✅ Routes: register/send-otp, verify-otp, reset-password
   - ✅ SMTP Gmail configured

2. **Frontend:**
   - ✅ register.tsx - Form dengan Send OTP button & OTP input
   - ✅ forgot-password.tsx - Send OTP untuk reset password
   - ✅ verify-otp.tsx - Verifikasi OTP 6-digit
   - ✅ reset-password.tsx - Reset password setelah OTP verified
   - ✅ login.tsx - Tambah link ke register & forgot password
   - ✅ Email template dengan styling professional

3. **Features:**
   - ✅ OTP 6-digit random number
   - ✅ OTP expires dalam 10 menit
   - ✅ Rate limiting: 3 attempts per minute
   - ✅ Email dikirim via SMTP Gmail
   - ✅ Toast notifications dengan sonner
   - ✅ Mobile-first responsive design

**Flow Register:**
1. User input email → Click "Send OTP"
2. OTP dikirim ke email → User input OTP
3. Complete registration form → Submit
4. OTP verified → Account created → Auto login

**Flow Forgot Password:**
1. User input email → Click "Send OTP"
2. Redirect ke verify-otp page
3. User input OTP → Verify
4. Redirect ke reset-password page
5. User input new password → Submit → Redirect to login

**Files Created:**
- database/migrations/2026_04_15_113404_create_otp_verifications_table.php
- app/Models/OtpVerification.php
- app/Services/OtpService.php
- app/Mail/OtpMail.php
- resources/views/emails/otp.blade.php
- app/Http/Controllers/Auth/OtpVerificationController.php
- resources/js/pages/auth/verify-otp.tsx
- resources/js/pages/auth/reset-password.tsx

### FASE 6: FREE VS PAID COURSE
- Tambah field `price` & `is_free` ke courses table
- Admin bisa set harga course
- User lihat badge "FREE" atau harga di course card
- Filter: All/Free/Paid courses

### FASE 7: RAZERMS PAYMENT
- Install: `composer require razermerchantservices/payment:dev-main#1.0.1`
- Transaction table: order_id, amount, status (pending/paid/failed/expired)
- Flow: Browse → Detail → Checkout → RazerMS Gateway → Callback → Auto-enroll
- Transaction expiration: 30 menit (auto-cancel via scheduler setiap 5 menit)
- Admin bisa view semua transactions

### FASE 7.5: UI/UX IMPROVEMENTS (Mobile First)

**Browse Page** (`/browse`):
- Hero section dengan search bar besar
- Quick stats: Total courses & enrolled
- Filter badges: All/Free/Paid
- Course cards dengan hover effects
- "View Details" button
- Skeleton loading saat search

**Detail Page** (`/courses/{id}/detail`):
- Hero section dengan back button, badges, stats
- Sticky enrollment card:
  - Thumbnail dengan preview overlay
  - Price display
  - Progress bar (jika enrolled)
  - CTA buttons (Continue/Enroll/Buy Now)
  - "What's Included" checklist
- Tabbed content (Curriculum & About)
- Locked indicator untuk non-enrolled users

**Checkout Page** (`/courses/{id}/checkout`):
- Mobile-first: Order summary tampil duluan di mobile
- Professional header "Secure Checkout"
- Terms & Conditions checkbox (REQUIRED)
- Button disabled sampai checkbox dicentang
- Payment methods badges
- Trust badges (Secure Payment, Money Back, Privacy)
- Responsive typography & spacing

**Technical:**
- Semua component pakai `npx shadcn@latest add [component]`
- Mobile-first Tailwind classes (base → sm: → md: → lg:)
- Fixed SVG stroke-width → strokeWidth
- No diagnostics errors

**User Flow:**
1. Browse courses → `/browse`
2. Click "View Details" → `/courses/{id}/detail`
3. Click "Buy Now" → `/courses/{id}/checkout`
4. Complete payment → Auto-enroll → `/courses`

---

## 📝 FASE YANG BELUM DIKERJAKAN

### FASE 8: AUTHORIZATION POLICIES
**Tujuan:** User A tidak bisa akses data User B

**Yang perlu dibuat:**
- EnrollmentPolicy: user hanya bisa view/update enrollment sendiri
- ExamResultPolicy: user hanya bisa view exam result sendiri
- TransactionPolicy: user hanya bisa view transaction sendiri

**Steps:**
1. Create policies: `php artisan make:policy EnrollmentPolicy --model=Enrollment`
2. Register policies di AuthServiceProvider
3. Apply di controller: `$this->authorize('view', $enrollment)`
4. Test: User A akses data User B → return 403

### FASE 9: ZOOM INTEGRATION - SELESAI ✅
**Tujuan:** Admin buat meeting dari LMS, User join meeting, Auto-record attendance via webhook

**Yang sudah dibuat:**

1. **Backend:**
   - ✅ ZoomService.php - getAccessToken(), createMeeting(), deleteMeeting()
   - ✅ Admin/MeetingController.php - CRUD meetings
   - ✅ User/TimetableController.php - View & join meetings
   - ✅ Api/ZoomWebhookController.php - Handle webhook events
   - ✅ Routes: /admin/meetings, /timetable, /api/zoom/webhook
   - ✅ CSRF exception untuk webhook

2. **Frontend:**
   - ✅ admin/meetings/index.tsx - List meetings (table + cards mobile)
   - ✅ admin/meetings/create.tsx - Form create meeting
   - ✅ user/timetable.tsx - List meetings dengan tabs (Upcoming/Ongoing/Past)
   - ✅ Sidebar: Menu "Meetings" (admin) & "Timetable" (user)

3. **Features:**
   - ✅ Admin create meeting via Zoom API (auto-create di Zoom)
   - ✅ Admin delete meeting (delete dari database & Zoom)
   - ✅ User view meetings (filter by enrolled courses)
   - ✅ User join meeting (record check_in_time → redirect ke Zoom)
   - ✅ Webhook auto-record check_in & check_out time
   - ✅ Attendance tracking dengan timestamp
   - ✅ Meeting status: Upcoming/Ongoing/Past
   - ✅ Mobile-first responsive design

4. **Webhook Setup:**
   - ✅ URL: `https://danimukhlis.my.id/api/zoom/webhook`
   - ✅ Events: `meeting.participant_joined`, `meeting.participant_left`
   - ✅ Dokumentasi: ZOOM_WEBHOOK_SETUP.md

**Testing:**
- Deploy ke VPS: https://danimukhlis.my.id/
- Setup webhook di Zoom Marketplace (manual)
- Test create meeting → join meeting → check attendance

**Files Created:**
- app/Services/ZoomService.php
- app/Http/Controllers/Admin/MeetingController.php
- app/Http/Controllers/User/TimetableController.php
- app/Http/Controllers/Api/ZoomWebhookController.php
- resources/js/pages/admin/meetings/index.tsx
- resources/js/pages/admin/meetings/create.tsx
- resources/js/pages/user/timetable.tsx
- ZOOM_WEBHOOK_SETUP.md

### FASE 10: CAPSTAR API SYNC
**Tujuan:** Sync exam_results & attendances ke Capstar API setiap 1 jam

**Yang perlu dibuat:**
1. Install: `composer require laravel/sanctum` (untuk API authentication)
2. Job: `SyncCapstarJob.php`
   - Ambil exam_results & attendances yang belum di-sync
   - POST ke Capstar API
   - Mark as synced jika success
3. Scheduler: `routes/console.php`
   - Schedule job setiap 1 jam: `$schedule->job(new SyncCapstarJob)->hourly()`
4. API Routes (untuk Capstar callback):
   - `POST /api/enroll` - Capstar trigger enrollment
   - `GET /api/timetable` - Capstar ambil timetable

**Capstar API:**
- Endpoint: `POST https://api.capstar.id/sync`
- Auth: Bearer token (CAPSTAR_API_KEY)
- Payload: user_id, course_id, score, attendance_data

---

---

## 🛠️ DEVELOPMENT COMMANDS

```bash
# Start development (4 processes: server, queue, vite, scheduler)
composer run dev

# Manual commands
php artisan transactions:cancel-expired  # Cancel expired transactions
php artisan migrate                      # Run migrations
php artisan db:seed                      # Seed database
```
