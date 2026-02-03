# AWS S3 CONFIGURATION GUIDE

## What You Need:

To use S3 bucket for storing images and PDFs, you need **4 credentials** from AWS:

### 1. **AWS_ACCESS_KEY_ID**
   - Your AWS access key ID
   - Example: `AKIAIOSFODNN7EXAMPLE`
   - Where to find: AWS Console → Security Credentials → Access Keys

### 2. **AWS_SECRET_ACCESS_KEY**
   - Your AWS secret access key
   - Example: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
   - Where to find: AWS Console → Security Credentials → Access Keys
   - ⚠️ Keep this SECRET - never share it!

### 3. **AWS_BUCKET_NAME**
   - Your S3 bucket name
   - Example: `polytechnic-sis-files`
   - Where to find: AWS Console → S3 → Buckets

### 4. **AWS_REGION** (Optional)
   - AWS region where bucket is located
   - Example: `us-east-1`, `ap-south-1`, `eu-west-1`
   - Default: `us-east-1`
   - Where to find: AWS Console → S3 → Bucket properties

---

## How to Get AWS Credentials:

### Step 1: Create AWS Account
- Go to https://aws.amazon.com
- Sign up with your email and credit card

### Step 2: Create IAM User (Recommended for Security)
1. Go to IAM Console: https://console.aws.amazon.com/iam
2. Click "Users" → "Create User"
3. Enter username: `polytechnic-sis-app`
4. Create access key: Download `.csv` file with credentials

### Step 3: Create S3 Bucket
1. Go to S3 Console: https://console.aws.amazon.com/s3
2. Click "Create Bucket"
3. Bucket name: `polytechnic-sis-files`
4. Region: Choose closest to you
5. Click "Create"

### Step 4: Set Bucket Permissions
1. Open your bucket
2. Go to "Permissions" tab
3. Add Bucket Policy for public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::polytechnic-sis-files/*"
    }
  ]
}
```

---

## Add Credentials to Backend:

Create/Update `.env` file in backend folder:

```env
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_BUCKET_NAME=polytechnic-sis-files
AWS_REGION=us-east-1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/polytechnic-sis

# Port
PORT=5000

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

---

## What Gets Stored in S3:

### 📸 Images
- Carousel/Banner images
- Student profile pictures
- File previews

### 📄 PDFs/Documents
- Question papers
- Study materials
- Assignment files

---

## Pricing:

AWS S3 is **pay-as-you-go**:
- **Storage**: ~$0.023/GB per month
- **Requests**: ~$0.0004/1000 PUT requests
- **Data transfer**: ~$0.09/GB

For small usage (educational project): **Less than $5/month**

---

## Testing:

After configuration:
1. Start backend: `npm start`
2. Upload a file through admin app
3. Check AWS S3 console to see file uploaded
4. File should be accessible from user app immediately

---

## Support:

- AWS S3 Docs: https://docs.aws.amazon.com/s3/
- Pricing Calculator: https://calculator.aws/
- Free tier: https://aws.amazon.com/free/

