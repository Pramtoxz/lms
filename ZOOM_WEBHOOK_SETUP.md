# Zoom Webhook Setup Guide

## Prerequisites
Pastikan Anda sudah punya Zoom API credentials (Account ID, Client ID, Client Secret).
Jika belum, ikuti panduan: **[ZOOM_API_SETUP.md](ZOOM_API_SETUP.md)**

## Overview
Webhook ini digunakan untuk auto-record attendance (check-in & check-out time) saat user join/leave Zoom meeting.

## Webhook URL
```
https://danimukhlis.my.id/api/zoom/webhook
```

## Setup Steps

### 1. Login ke Zoom Marketplace
- Buka: https://marketplace.zoom.us/
- Login dengan akun Zoom yang memiliki credentials:
  - Account ID: `eP-vez0jQlSuWphyB1nnpQ`
  - Client ID: `lKrYCRY3RwiNEoFth1t2pQ`
  - Client Secret: `hOzdpwbhIIpCfByrqTE6crv14jIDwRNJ`

### 2. Pilih/Create App
- Jika sudah ada app dengan Client ID di atas, pilih app tersebut
- Jika belum ada, create new app dengan type: **Server-to-Server OAuth**

### 3. Setup Event Subscriptions
1. Masuk ke menu **Feature** → **Event Subscriptions**
2. Click **Add Event Subscription**
3. Isi form:
   - **Subscription Name**: LMS Attendance Tracker (atau nama bebas)
   - **Event Notification Endpoint URL**: `https://danimukhlis.my.id/api/zoom/webhook`
4. Click **Validate**
   - Zoom akan kirim verification request
   - Laravel akan auto-response dengan encrypted token
   - Jika berhasil, akan muncul "Validation successful"

### 4. Copy Secret Token (PENTING!)
Setelah validation berhasil, Anda akan lihat:
```
Secret Token: abc123xyz...
```

**COPY token ini!** Anda perlu tambahkan ke `.env`:
```env
ZOOM_WEBHOOK_SECRET_TOKEN=abc123xyz...
```

Lalu clear cache:
```bash
php artisan config:clear
```

**Kenapa perlu Secret Token?**
- Untuk verify bahwa webhook benar-benar dari Zoom (bukan dari hacker)
- Zoom kirim token ini di setiap webhook request
- Laravel akan verify token sebelum process event

### 4. Copy Secret Token (PENTING!)
Setelah validation berhasil, Anda akan lihat:
```
Secret Token: abc123xyz...
```

**COPY token ini!** Anda perlu tambahkan ke `.env`:
```env
ZOOM_WEBHOOK_SECRET_TOKEN=abc123xyz...
```

Lalu clear cache:
```bash
php artisan config:clear
```

**Kenapa perlu Secret Token?**
- Untuk verify bahwa webhook benar-benar dari Zoom (bukan dari hacker)
- Zoom kirim token ini di setiap webhook request
- Laravel akan verify token sebelum process event

### 5. Subscribe to Events
Pilih 2 events berikut:
- ✅ **Meeting** → `meeting.participant_joined`
- ✅ **Meeting** → `meeting.participant_left`

### 5. Save Changes
- Click **Save**
- Pastikan status subscription: **Active**

## Testing

### Test Create Meeting
1. Login sebagai Admin
2. Buka `/admin/meetings`
3. Click "Create Meeting"
4. Isi form:
   - Course: Pilih course
   - Start Time: 5 menit dari sekarang
   - Duration: 30 minutes
5. Click "Create Meeting"
6. Meeting akan otomatis dibuat di Zoom

### Test Join Meeting
1. Login sebagai User (yang enrolled di course tersebut)
2. Buka `/timetable`
3. Tunggu sampai meeting status jadi "Ongoing"
4. Click "Join Meeting"
5. System akan record check_in_time
6. User redirect ke Zoom
7. Saat user join Zoom, webhook akan confirm check_in_time
8. Saat user leave Zoom, webhook akan record check_out_time

### Check Attendance
1. Login sebagai Admin
2. Buka database → table `attendances`
3. Cek data:
   - `check_in_time`: Terisi saat user click "Join Meeting"
   - `check_out_time`: Terisi saat user leave Zoom (via webhook)

## Troubleshooting

### Webhook tidak terima event
1. Cek Zoom Marketplace → Event Subscriptions → Status harus "Active"
2. Cek Laravel logs: `storage/logs/laravel.log`
3. Cek apakah URL webhook accessible dari public (test via Postman)

### Validation failed
1. Pastikan URL webhook HTTPS (bukan HTTP)
2. Pastikan Laravel app sudah running di VPS
3. Pastikan CSRF exception sudah ditambahkan untuk `/api/zoom/webhook`

### Attendance tidak tercatat
1. Cek Laravel logs untuk error
2. Pastikan user email di LMS sama dengan email di Zoom
3. Pastikan meeting_id di database sama dengan zoom_meeting_id

## Production Deployment

### Update Webhook URL (jika domain production berbeda)
1. Login ke Zoom Marketplace
2. Edit Event Subscription
3. Update URL ke domain production: `https://lms.kpjhealthcare.com/api/zoom/webhook`
4. Validate & Save

### Update Credentials (jika pakai credentials perusahaan)
1. Update `.env`:
   ```
   ZOOM_ACCOUNT_ID=<new_account_id>
   ZOOM_CLIENT_ID=<new_client_id>
   ZOOM_CLIENT_SECRET=<new_client_secret>
   ```
2. Clear cache: `php artisan config:clear`
3. Restart server

## Notes
- Webhook hanya berfungsi jika user email di LMS sama dengan email di Zoom
- Check-in time akan tercatat 2x: saat click "Join Meeting" di LMS & saat join Zoom (webhook akan update)
- Check-out time hanya tercatat via webhook (otomatis saat user leave Zoom)
