#!/usr/bin/env node
// Quick S3 connectivity test using credentials from environment
require('dotenv').config({ path: '../.env' });

const { S3Client, HeadBucketCommand, PutObjectCommand } = require('@aws-sdk/client-s3');

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION || 'ap-south-1';

console.log('=== S3 Connectivity Test ===');
console.log(`Region: ${AWS_REGION}`);
console.log(`Bucket: ${BUCKET_NAME}`);
console.log(`Access Key ID: ${AWS_ACCESS_KEY_ID ? AWS_ACCESS_KEY_ID.substring(0, 10) + '***' : 'NOT SET'}`);
console.log('');

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !BUCKET_NAME) {
  console.error('ERROR: AWS credentials or bucket name not configured.');
  process.exit(1);
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
});

(async () => {
  try {
    // Test 1: Check if bucket exists (HeadBucket)
    console.log('Test 1: Checking bucket access...');
    const headResult = await s3.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log('✓ Bucket exists and is accessible.');
    console.log('');

    // Test 2: Try a small upload
    console.log('Test 2: Testing file upload...');
    const testKey = `test-upload-${Date.now()}.txt`;
    const putResult = await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: testKey,
      Body: Buffer.from('Test file from Node.js'),
      ContentType: 'text/plain'
    }));
    console.log(`✓ Test file uploaded successfully to: ${testKey}`);
    console.log(`  URL: https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${testKey}`);
    console.log('');
    console.log('=== All tests passed! ===');
  } catch (error) {
    console.error('❌ ERROR:');
    console.error(`  Code: ${error.Code || error.name}`);
    console.error(`  Message: ${error.message}`);
    if (error.$metadata) {
      console.error(`  HTTP Status: ${error.$metadata.httpStatusCode}`);
    }
    if (error.__proto__.constructor.name) {
      console.error(`  Error Type: ${error.__proto__.constructor.name}`);
    }
    console.error('');
    console.error('Full error details:');
    console.error(JSON.stringify(error, null, 2).slice(0, 500));
    console.error('');
    console.error('Troubleshooting:');
    if (error.Code === 'InvalidAccessKeyId' || error.Code === 'SignatureDoesNotMatch') {
      console.error('  → Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env');
    } else if (error.Code === 'NoSuchBucket') {
      console.error('  → Bucket name is incorrect or does not exist. Check AWS_BUCKET_NAME');
    } else if (error.Code === 'AccessDenied' || error.Code === 'Forbidden') {
      console.error('  → IAM user lacks permissions. Check S3 bucket policy and ACL settings');
      console.error('  → Ensure bucket allows public-read ACL or adjust S3 config');
    } else if (error.Code === 'AuthorizationHeaderMalformed') {
      console.error('  → Check region. AWS_REGION should match bucket region');
    } else {
      console.error(`  → UnknownError: Could be network, DNS, credentials, or region mismatch`);
      console.error(`  → Check: credentials are valid, bucket region is ap-south-1, and S3 is accessible`);
    }
    process.exit(1);
  }
})();
