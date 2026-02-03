# 🔑 AWS CREDENTIALS - EXACTLY WHAT YOU NEED

## Summary

To use S3 bucket for storing files, you need **4 items** from AWS:

| Item | Where to Get | Example |
|------|--------------|---------|
| **Access Key ID** | AWS IAM Console | `AKIAIOSFODNN7EXAMPLE` |
| **Secret Access Key** | AWS IAM Console | `wJalrXUtnFEMI/K7MDENG...` |
| **Bucket Name** | AWS S3 Console | `polytechnic-sis-files` |
| **Region** (optional) | AWS S3 Console | `us-east-1` |

---

## 📋 Step-by-Step to Get Each Credential

### 1️⃣ ACCESS KEY ID

**Where**: https://console.aws.amazon.com/iam → Users → Select User → Security Credentials

**What it looks like**:
```
AKIAIOSFODNN7EXAMPLE
```

**How to get**:
1. Go to AWS Console
2. Search for "IAM"
3. Click "Users" in left menu
4. Click on your username
5. Go to "Security Credentials" tab
6. Click "Create access key"
7. Download and save the CSV file
8. Copy the "Access key ID"

---

### 2️⃣ SECRET ACCESS KEY

**Where**: Same place as Access Key ID (IAM Console)

**What it looks like**:
```
wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**⚠️ IMPORTANT**: 
- Secret key shows ONLY ONCE during creation
- Save it immediately
- Can't recover if lost (must create new one)
- Never share this key!

**How to get**:
1. Same as Access Key ID steps
2. When you click "Create access key"
3. Two keys appear: Access Key ID and Secret Access Key
4. Copy BOTH immediately and save securely

---

### 3️⃣ BUCKET NAME

**Where**: https://console.aws.amazon.com/s3

**What it looks like**:
```
polytechnic-sis-files
```

**How to get**:
1. Go to AWS S3 Console
2. Click "Create bucket"
3. Enter bucket name (must be globally unique)
4. Choose region
5. Click "Create"
6. Your bucket name appears in the list

**Naming Rules**:
- 3-63 characters long
- Must be globally unique (no one else can have same name)
- Use lowercase and hyphens
- Example: `polytechnic-sis-2024`, `myapp-uploads`

---

### 4️⃣ REGION (Optional, but Recommended)

**Where**: https://console.aws.amazon.com/s3 → Bucket → Properties

**What it looks like**:
```
us-east-1
ap-south-1
eu-west-1
```

**How to choose**:
- **us-east-1**: Default, cheapest, good for worldwide users
- **ap-south-1**: India (fastest if in India)
- **eu-west-1**: Europe
- **ap-southeast-1**: Singapore

**How to get**:
1. Go to S3 bucket
2. Click bucket name
3. Go to "Properties" tab
4. Look for "AWS Region"

---

## 🔧 Add to Backend `.env`

After getting credentials, create `backend/.env`:

```env
# AWS S3 Configuration (REQUIRED)
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_BUCKET_NAME=polytechnic-sis-files
AWS_REGION=us-east-1

# Other configurations
MONGODB_URI=mongodb://localhost:27017/polytechnic-sis
PORT=5000
JWT_SECRET=your-jwt-secret-here
```

---

## ✅ Verification Checklist

After adding credentials, verify:

```bash
# 1. Check .env file exists
ls -la backend/.env

# 2. Check .env has all 4 variables
cat backend/.env | grep AWS

# Expected output:
# AWS_ACCESS_KEY_ID=AKIA...
# AWS_SECRET_ACCESS_KEY=wJalr...
# AWS_BUCKET_NAME=polytechnic-sis-files
# AWS_REGION=us-east-1

# 3. Install aws-sdk
cd backend
npm install aws-sdk

# 4. Start backend
npm start

# 5. Check logs for success
# You should see: "Server is running on port 5000"
# And: "MongoDB connected"
```

---

## 🔐 Security Reminders

⚠️ **NEVER**:
- Share secret access key publicly
- Commit `.env` file to GitHub
- Post credentials in messages/emails
- Use same credentials for multiple projects

✅ **DO**:
- Keep credentials in `.env` file (never in code)
- Use `.gitignore` to exclude `.env`
- Use IAM roles instead of root credentials
- Rotate keys periodically (every 3-6 months)

---

## 📝 Example `.env` File

```env
# ============================================
# AWS S3 Configuration
# ============================================
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_BUCKET_NAME=polytechnic-sis-files
AWS_REGION=us-east-1

# ============================================
# Database Configuration
# ============================================
MONGODB_URI=mongodb://localhost:27017/polytechnic-sis

# ============================================
# Application Configuration
# ============================================
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# ============================================
# Admin User (Initial Setup)
# ============================================
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

---

## 🆘 If Credentials Don't Work

**Check**:
1. Access Key ID copied correctly (no spaces)
2. Secret Access Key copied correctly (no spaces)
3. Bucket name spelled correctly
4. Region name is valid
5. IAM user has S3 permissions

**Fix**:
1. Go back to IAM Console
2. Delete the old access key
3. Create a new access key
4. Copy both values carefully
5. Update `.env`
6. Restart backend

---

## 💰 Check AWS Billing

Before uploads, set spending limits:

1. Go to AWS Billing Dashboard
2. Click "Billing Preferences"
3. Set "Billing alerts"
4. Enter email for notifications
5. Get alert when spending exceeds amount

**Typical Cost**:
- 1GB of files = ~$0.023/month
- 100 uploads = ~$0.00004/month
- Total for small project = **Less than $1/month**

---

## 📞 Support

If credentials not working:

1. Check AWS Console → IAM → Users → Your User
2. Verify Access Key is Active (not Inactive)
3. Check policy has S3 permissions
4. Try creating a new access key

Need help? Check:
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS IAM Documentation](https://docs.aws.amazon.com/iam/)
- Backend logs: `npm start` and look for error messages

