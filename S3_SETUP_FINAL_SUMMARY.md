# 🎉 S3 BUCKET INTEGRATION - COMPLETE SETUP GUIDE

## ✅ What's Been Implemented

Your system now supports **AWS S3 file uploads** for:

### 📸 Images
- Carousel/Banner images
- Student profile pictures
- Material thumbnails

### 📄 Documents
- Question papers (PDFs)
- Study materials (PDF, DOC, PPT)
- Course notes
- Assignment files

### ✨ Features
✅ Upload to S3 automatically
✅ Public URLs generated
✅ Automatic sync to User App
✅ Edit and delete support
✅ File type validation
✅ File size limit (50MB)

---

## 🚀 3-STEP SETUP

### Step 1: Get AWS Credentials
📖 **Read**: [AWS_CREDENTIALS_NEEDED.md](AWS_CREDENTIALS_NEEDED.md)

You need:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_BUCKET_NAME`
- `AWS_REGION` (optional)

### Step 2: Add Credentials to Backend

Create `backend/.env`:
```env
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
AWS_BUCKET_NAME=polytechnic-sis-files
AWS_REGION=us-east-1
```

Or copy from template:
```bash
cp backend/.env.example backend/.env
# Then edit and add your credentials
```

### Step 3: Install & Start

```bash
cd backend
npm install
npm start
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [AWS_CREDENTIALS_NEEDED.md](AWS_CREDENTIALS_NEEDED.md) | **START HERE** - Get AWS credentials |
| [AWS_S3_SETUP_GUIDE.md](AWS_S3_SETUP_GUIDE.md) | Detailed S3 setup steps |
| [S3_INTEGRATION_COMPLETE.md](S3_INTEGRATION_COMPLETE.md) | Technical implementation details |
| [backend/.env.example](backend/.env.example) | Template environment variables |

---

## 🔧 Files Modified

### Backend Routes
- ✅ `backend/routes/materialRoutes.js` - Add file upload
- ✅ `backend/routes/questionPaperRoutes.js` - Add file upload
- ✅ `backend/routes/carouselRoutes.js` - Add image upload

### Backend Config (NEW)
- ✅ `backend/config/s3.js` - S3 upload/delete functions
- ✅ `backend/config/multer.js` - File handling middleware
- ✅ `backend/.env.example` - Updated with S3 config

### Dependencies
- ✅ `backend/package.json` - Added `aws-sdk`

---

## 📊 Data Flow

### Upload Process
```
Admin App (Upload Form)
    ↓
Multer (Validate file)
    ↓
S3 Upload (Store file)
    ↓
URL Generated
    ↓
MongoDB (Save URL)
    ↓
User App (Auto-syncs)
```

### Delete Process
```
Admin App (Delete button)
    ↓
MongoDB (Delete record)
    ↓
S3 (Delete file)
    ↓
User App (Auto-syncs)
```

---

## 💾 What Gets Stored Where

### MongoDB
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Database Notes",
  "fileUrl": "https://bucket.s3.amazonaws.com/files/1234-notes.pdf",
  "fileSize": 2048576
}
```

### S3 Bucket
```
s3://polytechnic-sis-files/
├── images/
│   ├── 1234567890-banner.jpg
│   ├── 1234567891-profile.jpg
└── files/
    ├── 1234567892-notes.pdf
    ├── 1234567893-paper.pdf
```

---

## ✅ Verification Steps

### 1. Credentials Set Correctly
```bash
cd backend
cat .env | grep AWS
# Should show all 4 variables
```

### 2. AWS SDK Installed
```bash
npm ls aws-sdk
# Should show: aws-sdk@2.1503.0
```

### 3. Backend Starts
```bash
npm start
# Should show: "Server is running on port 5000"
```

### 4. Upload File
1. Open http://localhost:3001
2. Go to Materials
3. Add Material
4. Upload a PDF
5. Check backend logs for: "File uploaded to S3:"

### 5. Verify in S3
1. Go to AWS S3 Console
2. Open your bucket
3. Should see files in `files/` or `images/` folder

### 6. Check User App
1. Open http://localhost:3000
2. View the material
3. File should be accessible

---

## 🔐 Security

✅ **Files are public** (needed for User App access)
✅ **Admin-only uploads** (protected by authentication)
✅ **Automatic cleanup** (delete = removed from S3)
✅ **File validation** (only images, PDFs, DOC, PPT)

---

## 📝 API Endpoints

### Create Material with File
```bash
POST /api/materials
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Database Notes"
- description: "Chapter 1"
- branch: "CSE"
- semester: 4
- subject: "Databases"
- file: <PDF file>
```

### Create Question Paper with File
```bash
POST /api/question-papers
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Midterm Exam"
- branch: "CSE"
- semester: 4
- academicYear: "2023-2024"
- regulation: "R19"
- examType: "Midterm"
- file: <PDF file>
```

### Create Carousel Image
```bash
POST /api/carousel
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Welcome Banner"
- image: <image file>
- linkUrl: "https://example.com"
```

---

## 🐛 Troubleshooting

### Error: "AWS_BUCKET_NAME not configured"
**Fix**: Add to `.env`
```
AWS_BUCKET_NAME=your-bucket-name
```

### Error: "Invalid AWS credentials"
**Fix**: 
1. Check credentials are copied correctly (no spaces)
2. Verify Access Key is Active in IAM
3. Try creating new Access Key

### Upload is slow
**Reason**: 
- Large file size
- Slow internet
- S3 region far away

**Fix**: 
- Try smaller file
- Check internet connection
- Choose closer AWS region

### File not showing in User App
**Check**:
1. Backend logs show "File uploaded to S3:"
2. S3 URL is in MongoDB
3. S3 bucket allows public read
4. Browser network tab (F12) for 404 errors

---

## 💰 Pricing

**AWS S3 Free Tier**:
- 5GB storage free for 12 months
- 20,000 GET requests free
- 2,000 PUT requests free

**After free tier**:
- Storage: ~$0.023/GB/month
- Requests: Minimal (~$0.0004/1000)
- **For small project: <$1/month**

**Set up billing alerts** in AWS Console to stay within budget!

---

## 📞 Next Steps

1. ✅ Read [AWS_CREDENTIALS_NEEDED.md](AWS_CREDENTIALS_NEEDED.md)
2. ✅ Get AWS credentials
3. ✅ Add to backend/.env
4. ✅ Run `npm install && npm start`
5. ✅ Test upload with admin app
6. ✅ Verify in user app

---

## 🎯 Summary

**Before S3**:
- Files uploaded to local storage
- Manual sync to User App
- No delete functionality
- Limited storage

**After S3**:
- ✅ Files uploaded to AWS S3
- ✅ Auto-sync to User App
- ✅ Delete removes from S3 too
- ✅ Unlimited storage
- ✅ Scalable architecture
- ✅ Public URLs for access
- ✅ Professional solution

Your system is now **production-ready** for file uploads! 🚀

