# Cara Membuat Zoom API Credentials (Server-to-Server OAuth)

## Step 1: Login ke Zoom Marketplace
1. Buka: https://marketplace.zoom.us/
2. Login dengan akun Zoom Anda
3. Jika belum punya akun Zoom, sign up dulu di https://zoom.us/

## Step 2: Create New App
1. Setelah login, klik **"Develop"** di menu atas (pojok kanan)
2. Klik **"Build App"** (tombol biru)
3. Anda akan lihat 3 pilihan app type:

| App Type | Kegunaan | Untuk LMS? |
|----------|----------|------------|
| **General App** | User login & authorize, OAuth 2.0 | ❌ Tidak cocok |
| **Server-to-Server OAuth** | Backend integration, auto-create meeting | ✅ **PILIH INI** |
| **Webhook Only** | Hanya receive events, tidak bisa create meeting | ❌ Tidak cocok |

4. Klik **"Create"** di card **"Server-to-Server OAuth App"**

**Kenapa pilih Server-to-Server OAuth?**
- ✅ LMS perlu create meeting otomatis (tanpa user login ke Zoom)
- ✅ Admin create meeting dari Laravel, bukan dari Zoom website
- ✅ Lebih simple untuk backend integration
- ✅ Tidak perlu user authorize setiap kali
- ✅ Bisa tambah webhook nanti untuk auto-attendance

## Step 3: App Information
1. **App Name**: Isi nama app (contoh: "LMS Training Platform")
2. **Short Description**: Isi deskripsi singkat (contoh: "LMS for managing courses and live classes")
3. **Company Name**: Isi nama perusahaan (contoh: "KPJ Healthcare")
4. **Developer Name**: Isi nama Anda
5. **Developer Email**: Isi email Anda
6. Klik **"Continue"**

## Step 4: App Credentials (PENTING!)
Setelah create app, Anda akan melihat halaman **"App Credentials"**:

**Contoh tampilan:**
```
Account ID: eP-vez0jQlSuWphyB1nnpQ
Client ID: lKrYCRY3RwiNEoFth1t2pQ
Client Secret: hOzdpwbhIIpCfByrqTE6crv14jIDwRNJ
```

**COPY & SIMPAN credentials ini!** 
- Click icon "Copy" di sebelah kanan setiap field
- Paste ke notepad/text editor
- Anda akan butuh untuk `.env` file Laravel

**JANGAN CLOSE TAB INI** sampai Anda sudah copy semua credentials!

## Step 5: Information (Optional)
1. Scroll ke bawah
2. Isi informasi tambahan (optional):
   - Developer Contact Information
   - App Description
3. Klik **"Continue"**

## Step 6: Scopes (Permissions)
Pilih scopes yang dibutuhkan untuk LMS:

**Meeting Scopes (WAJIB):**
- ✅ `meeting:write:admin` - Create, update, delete meetings
- ✅ `meeting:read:admin` - View meeting details

**User Scopes (OPTIONAL tapi recommended):**
- ✅ `user:read:admin` - View user information

**Cara pilih scopes:**
1. Di halaman "Scopes", click **"+ Add Scopes"** (tombol biru)
2. Akan muncul popup dengan list scopes
3. Di search box, ketik: **"meeting"**
4. Centang:
   - ✅ View and manage all user meetings (`meeting:write:admin`)
   - ✅ View all user meetings (`meeting:read:admin`)
5. Click **"Done"**
6. Scroll ke bawah, click **"Continue"**

**PENTING:** Tanpa scopes ini, API tidak bisa create meeting!

## Step 7: Activation
1. Review informasi app
2. Klik **"Activate your app"**
3. App sekarang sudah aktif!

**CATATAN PENTING:**
- Setelah activate, Anda bisa setup **Event Subscriptions (Webhook)** di tab "Feature"
- Webhook untuk auto-record attendance (check-in & check-out)
- Panduan webhook: **[ZOOM_WEBHOOK_SETUP.md](ZOOM_WEBHOOK_SETUP.md)**
- Setup webhook SETELAH deploy ke VPS (butuh public HTTPS URL)

## Step 8: Copy Credentials ke Laravel

### 1. Buka file `.env` di project Laravel
Lokasi: root project → `.env`

### 2. Cari section Zoom (atau tambahkan di bawah):
```env
ZOOM_ACCOUNT_ID=your_account_id_here
ZOOM_CLIENT_ID=your_client_id_here
ZOOM_CLIENT_SECRET=your_client_secret_here
```

### 3. Replace dengan credentials Anda:
```env
ZOOM_ACCOUNT_ID=eP-vez0jQlSuWphyB1nnpQ
ZOOM_CLIENT_ID=lKrYCRY3RwiNEoFth1t2pQ
ZOOM_CLIENT_SECRET=hOzdpwbhIIpCfByrqTE6crv14jIDwRNJ
```

**PENTING:** 
- Jangan ada spasi sebelum/sesudah `=`
- Jangan ada quotes `"` atau `'`
- Copy paste langsung dari Zoom Marketplace

### 4. Save file `.env`

### 5. Clear cache Laravel:
```bash
php artisan config:clear
php artisan cache:clear
```

## Step 9: Test API Connection
Test apakah credentials benar dengan create meeting pertama:
1. Login sebagai Admin
2. Buka `/admin/meetings`
3. Click "Create Meeting"
4. Isi form & submit
5. Jika berhasil, meeting akan muncul di list

## Troubleshooting

### Error: "Invalid client_id or client_secret"
- Pastikan credentials di `.env` benar (no extra spaces)
- Pastikan sudah run `php artisan config:clear`

### Error: "Insufficient privileges"
- Balik ke Zoom Marketplace → App → Scopes
- Pastikan sudah add `meeting:write:admin` & `meeting:read:admin`

### Error: "Account not found"
- Pastikan Account ID benar
- Pastikan akun Zoom sudah verified (check email)

## Notes
- Credentials ini untuk TESTING/DEVELOPMENT
- Untuk PRODUCTION, minta credentials dari team leader (akun perusahaan)
- Jangan share credentials ke public (add ke `.gitignore`)

---

## Quick Reference

### Zoom Marketplace URLs:
- **Login**: https://marketplace.zoom.us/
- **My Apps**: https://marketplace.zoom.us/user/build
- **Documentation**: https://developers.zoom.us/docs/

### Required Scopes:
```
meeting:write:admin
meeting:read:admin
```

### Laravel Commands:
```bash
# Clear config cache
php artisan config:clear

# Clear all cache
php artisan cache:clear

# Test Zoom connection (create meeting)
# Login as Admin → /admin/meetings → Create Meeting
```

### Troubleshooting Checklist:
- [ ] Credentials copied correctly (no spaces, no quotes)
- [ ] Scopes added: `meeting:write:admin` & `meeting:read:admin`
- [ ] App activated in Zoom Marketplace
- [ ] Config cache cleared: `php artisan config:clear`
- [ ] `.env` file saved

### Need Help?
- Zoom API Docs: https://developers.zoom.us/docs/api/
- Zoom Community: https://devforum.zoom.us/
