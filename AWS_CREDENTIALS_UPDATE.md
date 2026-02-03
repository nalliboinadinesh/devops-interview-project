# AWS Credentials - Update These Files

## File 1: `backend/config/s3.js` (Lines 5-8)

Open: `backend/config/s3.js`

Find these lines:
```javascript
const AWS_ACCESS_KEY_ID = 'AKIA_YOUR_ACCESS_KEY_ID';  // Replace with your Access Key
const AWS_SECRET_ACCESS_KEY = 'YOUR_SECRET_ACCESS_KEY_HERE';  // Replace with your Secret Key
const BUCKET_NAME = 'abhi-crr';  // Replace with your bucket name
const AWS_REGION = 'ap-south-1';
```

Replace with your actual credentials:
```javascript
const AWS_ACCESS_KEY_ID = 'AKIAIOSFODNN7EXAMPLE';  // Your actual Access Key
const AWS_SECRET_ACCESS_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';  // Your actual Secret Key
const BUCKET_NAME = 'polytechnic-crr-files';  // Your actual bucket name
const AWS_REGION = 'ap-south-1';  // Keep this or change if using different region
```

---

## File 2: `docker-compose.yml` (Lines 20-23)

Open: `docker-compose.yml`

Find these lines:
```yaml
AWS_ACCESS_KEY_ID: AKIA_YOUR_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY: YOUR_SECRET_ACCESS_KEY_HERE
AWS_BUCKET_NAME: abhi-crr
AWS_REGION: ap-south-1
```

Replace with your actual credentials (must match s3.js):
```yaml
AWS_ACCESS_KEY_ID: AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_BUCKET_NAME: polytechnic-crr-files
AWS_REGION: ap-south-1
```

---

## How to Get Your Credentials

1. Go to AWS Console: https://console.aws.amazon.com
2. Go to **IAM** → **Users**
3. Click your user or create new user
4. Go to **Security credentials**
5. Under **Access keys**, create new access key
6. Copy:
   - **Access Key ID** (starts with AKIA...)
   - **Secret Access Key** (long string)

---

## After Updating Files

1. **Restart Docker:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

2. **Test Upload:**
   - Log in to Admin Panel
   - Go to Materials, Announcements, or Banner
   - Try uploading a file
   - Should work now!

---

## Troubleshooting

**Still getting 500 error?**

1. Check backend logs: 
   ```bash
   docker logs polytechnic-backend
   ```

2. Look for AWS error messages

3. Verify credentials are correct in BOTH files

4. Make sure S3 bucket exists and is configured for public access

5. Check IAM user has S3 permissions
