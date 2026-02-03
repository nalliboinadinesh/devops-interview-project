# AWS S3 File Upload Setup Guide

## Error You Were Getting
```
The authorization header is malformed; a non-empty Access Key (AKID) must be provided in the credentials
```

**Cause**: AWS credentials (Access Key ID and Secret Access Key) are not configured in the environment.

---

## Step-by-Step Setup

### 1. Get AWS Credentials

#### A. Log in to AWS Console
- Go to [AWS Console](https://console.aws.amazon.com)
- Sign in with your AWS account (create one if needed)

#### B. Create IAM User with S3 Access
1. Go to **IAM** → **Users**
2. Click **Create user**
3. Enter username (e.g., `polytechnic-app-user`)
4. Click **Next**
5. Under **Permissions**, click **Attach policies directly**
6. Search for `AmazonS3FullAccess` and select it
7. Click **Create user**

#### C. Generate Access Keys
1. Click on the newly created user
2. Go to **Security credentials** tab
3. Scroll to **Access keys** section
4. Click **Create access key**
5. Select **Application running outside AWS** → **Next**
6. Copy both:
   - **Access Key ID**
   - **Secret Access Key** (save this safely - you won't see it again)

---

### 2. Create S3 Bucket

1. Go to **S3** in AWS Console
2. Click **Create bucket**
3. Enter bucket name (e.g., `polytechnic-crr-files`)
4. Select region (e.g., `ap-south-1` for India)
5. Under **Block Public Access**, uncheck `Block all public access`
6. Check the acknowledgment box
7. Click **Create bucket**

#### Add Bucket Policy for Public Read Access
1. Click on your bucket
2. Go to **Permissions** tab
3. Click **Bucket policy**
4. Add this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

Replace `YOUR-BUCKET-NAME` with your actual bucket name.

---

### 3. Update Environment Configuration

#### Option A: Using .env.docker (Recommended for Docker)

Create/edit `.env.docker`:
```
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_ACCESS_KEY
AWS_BUCKET_NAME=your-bucket-name
AWS_REGION=ap-south-1
```

#### Option B: Using System Environment Variables

**Windows PowerShell:**
```powershell
$env:AWS_ACCESS_KEY_ID = "YOUR_ACCESS_KEY_ID"
$env:AWS_SECRET_ACCESS_KEY = "YOUR_SECRET_ACCESS_KEY"
$env:AWS_BUCKET_NAME = "your-bucket-name"
$env:AWS_REGION = "ap-south-1"
```

**Linux/Mac Bash:**
```bash
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
export AWS_BUCKET_NAME="your-bucket-name"
export AWS_REGION="ap-south-1"
```

#### Option C: Using Docker Compose

Update `docker-compose.yml`:
```yaml
environment:
  AWS_ACCESS_KEY_ID: YOUR_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY: YOUR_SECRET_ACCESS_KEY
  AWS_BUCKET_NAME: your-bucket-name
  AWS_REGION: ap-south-1
```

---

### 4. Restart Your Application

**For Docker:**
```bash
docker-compose down
docker-compose up -d --build
```

**For Local Development:**
```bash
# Terminal 1 - Backend
npm start  # or your backend start command

# Terminal 2 - Admin App
npm start  # from admin-app directory

# Terminal 3 - User App
npm start  # from user-app directory
```

---

## Testing File Upload

### Steps:
1. Log in to Admin Panel
2. Go to **Materials**, **Announcements**, or **Banner** section
3. Try uploading a PDF, image, or document
4. Verify the upload completes and you see the file URL

### What Should Happen:
- File is uploaded to your AWS S3 bucket
- URL is stored in MongoDB
- File appears with public access URL

---

## Troubleshooting

### Error: "The authorization header is malformed"
**Solution**: Check that AWS credentials are correctly set:
```bash
# Check if variables are set
echo $AWS_ACCESS_KEY_ID  # Should print your key
echo $AWS_SECRET_ACCESS_KEY  # Should print your secret
```

### Error: "Access Denied" when accessing file
**Solution**: Check S3 bucket policy has `s3:GetObject` permission for public access.

### Error: "Bucket does not exist"
**Solution**: Verify `AWS_BUCKET_NAME` matches your S3 bucket name exactly (case-sensitive).

### Error: "Region is invalid"
**Solution**: Ensure `AWS_REGION` matches where you created the bucket (e.g., `ap-south-1`, `us-east-1`).

### Large file upload fails
**Solution**: S3 upload is limited to 50MB by default. Check the `multer` config in `backend/config/multer.js` to increase:
```javascript
const limits = {
  fileSize: 100 * 1024 * 1024 // Change to 100MB
};
```

---

## File Upload Flow

```
Admin Panel (Upload)
    ↓
FormData with file
    ↓
Backend API (/api/materials, /api/announcements, etc)
    ↓
Multer (validates file)
    ↓
AWS S3 Upload
    ↓
S3 returns public URL
    ↓
Backend stores URL in MongoDB
    ↓
Response sent to admin panel
    ↓
User App reads URL from MongoDB and displays file
```

---

## AWS Pricing

**Free Tier (First 12 months):**
- S3: 5GB storage free
- 20,000 GET requests
- 2,000 PUT requests

**After Free Tier:**
- Storage: ~$0.023 per GB per month (India region)
- Requests: ~$0.0004 per 1,000 requests

**Cost Estimation for Your System:**
- 1000 students × 10 files each = 10,000 files
- Average file size: 2MB
- Monthly storage: ~20GB ≈ $0.46
- Requests (reasonable usage): < $1/month

---

## Security Best Practices

1. **Rotate Access Keys** regularly
2. **Use IAM User** (not root account credentials)
3. **Restrict Permissions** - Use `AmazonS3FullAccess` only for setup; later use custom policies
4. **Store Secrets Securely** - Never commit `.env` files with real credentials to git
5. **Use HTTPS** - All S3 URLs are HTTPS by default
6. **Enable Versioning** on S3 bucket for backup

---

## Additional Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS IAM Users](https://docs.aws.amazon.com/iam/latest/userguide/id_users.html)
- [AWS CLI Configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

---

## Support

If you continue to have issues:

1. Check logs: `docker logs polytechnic-backend`
2. Verify credentials are set: `printenv | grep AWS`
3. Test S3 connection with AWS CLI:
   ```bash
   aws s3 ls --region ap-south-1
   ```
4. Check backend is restarted after credential changes
