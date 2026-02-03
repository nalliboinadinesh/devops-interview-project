# 🚀 AWS S3 QUICK REFERENCE

## 📋 What You Need (4 Items)

```
1. AWS_ACCESS_KEY_ID          → AKIA...
2. AWS_SECRET_ACCESS_KEY      → wJalr...
3. AWS_BUCKET_NAME            → my-bucket
4. AWS_REGION                 → us-east-1
```

## 📍 Where to Get Them

| Item | Where | Link |
|------|-------|------|
| Access Key | IAM Console | https://console.aws.amazon.com/iam |
| Secret Key | IAM Console | https://console.aws.amazon.com/iam |
| Bucket | S3 Console | https://console.aws.amazon.com/s3 |
| Region | S3 Bucket Props | https://console.aws.amazon.com/s3 |

## 🔧 Add to Backend

**File**: `backend/.env`

```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_BUCKET_NAME=polytechnic-sis-files
AWS_REGION=us-east-1
```

## 📦 Install & Start

```bash
cd backend
npm install
npm start
```

## ✅ Test Upload

1. Open Admin App: http://localhost:3001
2. Go to Materials
3. Add Material
4. Upload PDF
5. Check User App: http://localhost:3000
6. Material visible = ✅ SUCCESS

## 📁 What Gets Stored

```
S3 Bucket/
├── images/       → Banners, Profiles
└── files/        → PDFs, Docs
```

## 🔗 Public URLs

```
https://your-bucket.s3.amazonaws.com/images/banner.jpg
https://your-bucket.s3.amazonaws.com/files/notes.pdf
```

## ⚠️ Important

- ✅ Keep Secret Key SECRET
- ✅ Add .env to .gitignore
- ✅ Set AWS billing alert
- ✅ Use IAM user (not root)

## 📖 Read These

1. [AWS_CREDENTIALS_NEEDED.md](AWS_CREDENTIALS_NEEDED.md) ← START HERE
2. [AWS_S3_SETUP_GUIDE.md](AWS_S3_SETUP_GUIDE.md)
3. [S3_INTEGRATION_COMPLETE.md](S3_INTEGRATION_COMPLETE.md)

## 🆘 If It Breaks

**Check**:
1. Credentials correct? `cat backend/.env | grep AWS`
2. aws-sdk installed? `npm ls aws-sdk`
3. Backend running? `npm start`
4. Logs show errors? Look at terminal

**Fix**:
1. Verify credentials in AWS Console
2. Create new Access Key if needed
3. Check bucket exists and region matches
4. Check IAM user has S3 permissions

## 💬 Success Signs

✅ Backend starts without S3 errors
✅ Upload button works
✅ File appears in S3 console
✅ User app shows file
✅ Delete removes from S3

---

**Ready? Start with [AWS_CREDENTIALS_NEEDED.md](AWS_CREDENTIALS_NEEDED.md)!**

