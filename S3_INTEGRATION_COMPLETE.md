# 📚 S3 BUCKET INTEGRATION - COMPLETE SETUP

## ✅ What's Been Done

1. **Created S3 configuration** (`backend/config/s3.js`)
   - Upload files/images to S3
   - Delete files from S3
   - Automatic public URL generation

2. **Created Multer configuration** (`backend/config/multer.js`)
   - Handles file uploads from forms
   - Supports images, PDFs, DOC, PPT
   - Max file size: 50MB

3. **Updated Routes** for file uploads:
   - Material routes → Upload PDFs/Documents
   - Question Paper routes → Upload PDFs
   - Carousel Image routes → Upload Images

4. **Added AWS SDK** to package.json

---

## 🚀 QUICK START - 4 STEPS

### Step 1: Get AWS Credentials
See [AWS_S3_SETUP_GUIDE.md](AWS_S3_SETUP_GUIDE.md) for detailed instructions

You need:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_BUCKET_NAME`
- `AWS_REGION` (optional)

### Step 2: Add Credentials to `.env`

Create/Update `backend/.env`:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_BUCKET_NAME=polytechnic-sis-files
AWS_REGION=us-east-1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/polytechnic-sis
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

### Step 3: Install AWS SDK

```bash
cd backend
npm install aws-sdk
```

### Step 4: Restart Backend

```bash
npm start
```

---

## 📤 How Files Are Now Stored

### Before (Local Storage)
```
Form Input → Stored in MongoDB as URL string → ❌ Not actually stored
```

### After (S3 Storage)
```
Form Input → Multer receives file → Uploaded to S3 → S3 URL stored in MongoDB → ✅ Publicly accessible
```

### File Upload Flow

```
Admin App (Upload Form)
    ↓
Multer Middleware (validates file)
    ↓
uploadFileToS3() function
    ↓
AWS S3 Bucket (file stored permanently)
    ↓
S3 URL generated
    ↓
URL saved in MongoDB
    ↓
Auto-synced to User App
```

---

## 📁 What Gets Stored in S3

### 📸 Images Folder (`images/`)
- Carousel/Banner images
- Student profile pictures
- Announcement images

### 📄 Documents Folder (`files/`)
- Question papers (PDFs)
- Study materials (PDFs, DOC, PPT)
- Course notes
- Assignment files

### URL Structure
```
https://your-bucket.s3.amazonaws.com/images/1234567890-banner.jpg
https://your-bucket.s3.amazonaws.com/files/1234567890-question-paper.pdf
```

---

## 🔄 Data Sync to User App

All uploaded files automatically sync:

1. **Admin uploads file**
   - File → S3 Bucket
   - URL → MongoDB
   - Status: Stored ✅

2. **User App fetches data**
   - Queries MongoDB
   - Gets S3 URLs
   - Displays files
   - Status: Visible ✅

3. **Admin deletes file**
   - Deleted from MongoDB
   - Deleted from S3
   - Auto-updated in User App
   - Status: Removed ✅

---

## 📝 Updated Endpoints

### Materials API
**Create Material with File**
```bash
POST /api/materials
Content-Type: multipart/form-data

{
  "title": "Database Notes",
  "description": "Chapter 1-5 notes",
  "branch": "CSE",
  "semester": 4,
  "subject": "Databases",
  "file": <binary PDF file>
}
```

**Response**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Database Notes",
  "fileUrl": "https://bucket.s3.amazonaws.com/files/1234567890-notes.pdf",
  "fileSize": 2048576,
  "fileType": "PDF"
}
```

### Question Papers API
**Create Question Paper with File**
```bash
POST /api/question-papers
Content-Type: multipart/form-data

{
  "title": "Midterm Exam",
  "branch": "CSE",
  "semester": 4,
  "academicYear": "2023-2024",
  "regulation": "R19",
  "examType": "Midterm",
  "file": <binary PDF file>
}
```

### Carousel Images API
**Create Carousel Image**
```bash
POST /api/carousel
Content-Type: multipart/form-data

{
  "title": "Welcome Banner",
  "description": "Main banner",
  "image": <binary image file>,
  "linkUrl": "https://example.com"
}
```

---

## ❌ Error Handling

### File Upload Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid file type" | File not JPG, PNG, PDF, DOC, PPT | Upload allowed file type |
| "File too large" | File > 50MB | Upload smaller file |
| "AWS_BUCKET_NAME not configured" | Missing env variable | Add to `.env` |
| "Error uploading to S3" | AWS credentials wrong | Check credentials |
| "Error uploading file to S3" | Network issue | Check internet connection |

### Check Backend Logs

```bash
# Terminal where backend is running
npm start

# Look for errors like:
# "Error uploading to S3: ..." or
# "File uploaded to S3: https://..."
```

---

## 🔐 Security Features

✅ **Public Read, Private Write**
- Anyone can READ files (needed for User App)
- Only admin can WRITE files (authenticated endpoint)

✅ **File Type Validation**
- Only allowed MIME types accepted
- Prevents malware uploads

✅ **File Size Limit**
- 50MB max per file
- Prevents storage overflow

✅ **Automatic Cleanup**
- Deleted from MongoDB → Auto deleted from S3
- No orphaned files

---

## 📊 Testing Upload

### Test 1: Upload Material

**Using Admin App UI**:
1. Go to Materials section
2. Click "Add Material"
3. Fill form
4. Select PDF file
5. Click "Upload"
6. Check S3 console to verify file

**Using Curl**:
```bash
curl -X POST http://localhost:5000/api/materials \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=Test Notes" \
  -F "file=@/path/to/file.pdf"
```

### Test 2: Verify in User App

1. Open User App (http://localhost:3000)
2. Go to Materials section
3. View material
4. File should be accessible

### Test 3: Delete and Verify

1. Delete material in Admin App
2. File automatically deleted from S3
3. Verify in S3 console (file gone)
4. Verify User App (material gone)

---

## 🐛 Troubleshooting

### Q: "AWS_BUCKET_NAME not configured"
**A**: Add to `.env`:
```
AWS_BUCKET_NAME=your-bucket-name
```

### Q: "Error uploading to S3"
**A**: Check credentials:
1. Verify AWS_ACCESS_KEY_ID is correct
2. Verify AWS_SECRET_ACCESS_KEY is correct
3. Verify bucket exists and region is correct
4. Check IAM permissions

### Q: Files not showing in User App
**A**: Check:
1. File uploaded successfully (check backend logs)
2. S3 URL is publicly accessible
3. User App fetching from correct API
4. Browser network tab (F12) for 404 errors

### Q: S3 Upload Slow
**A**: 
- Large files take time (check file size)
- Network connection slow (try smaller file)
- S3 region far away (choose closer region)

---

## 📝 Environment Variables Reference

```env
# Required for S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET_NAME=bucket_name
AWS_REGION=us-east-1

# Optional
# If not set, defaults to us-east-1
```

---

## 🎯 Next Steps

1. **Get AWS credentials** (see AWS_S3_SETUP_GUIDE.md)
2. **Add to `.env`** in backend folder
3. **Run `npm install`** to install aws-sdk
4. **Restart backend** with `npm start`
5. **Test upload** using Admin App
6. **Verify sync** in User App

---

## 💡 Tips

- **Test with small files first** (~100KB) before uploading large files
- **Keep S3 region same as backend** for faster uploads
- **Monitor AWS billing** - set budget alerts in AWS console
- **Backup important files** - S3 is reliable but always have backups
- **Check S3 console regularly** to see stored files and monitor usage

---

✅ **S3 Integration Complete!** Your system now has:
- Scalable file storage (unlimited)
- Automatic sync across apps
- Public file access
- Secure admin-only uploads
- Automatic cleanup on delete

