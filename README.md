# wookie-sightings

This is an example app which demonstrates how to add custom field editors to Kottster.

## Getting started

Install dependencies

```
pnpm install
```

Create an .env file

```
cp .env.example .env
```

Update each of the S3\_ env vars in .env. See info below for configuring your bucket and IAM user.

Setup database (note DB_FILE_NAME in .env)

```
npx drizzle-kit push
```

Run Kottster

```
pnpm dev
```

Login with username : admin
password : foobar

These are stored in app/\_server/app.ts (Not sure that is a good idea..., but anywhooo)

## To use FileUploader or LocationEditor in your Kottster instance

1. If using FileUploader, create a /lib folder and copy S3Client.ts and fileUploadProcedures.ts. Update the code in the getFileUploadUrl method in fileUploadProcedures.ts to match your application.

2. Create /components and copy FileUploader.tsx and/or LocationEditor.tsx. Update the code (updateFieldValue calls and record references) to match your column names.

3. Use the Kottster UI to create a table view page for your table(s)

4. For file uploads, copy pages/sightings/api.server.ts into your table's page folder. Copy pages/users/api.server.ts into your parent table's page folder (for nested editor support to work). Edit these fil

5. Copy the index.tsx file from pages/users (nested example) and pages/sightings to setup UI editor components. You'll need to update the keys in columnOverrides and nested to match your table and column names.

6. Install npm dependencies:

```
pnpm add @mantine/hooks @mantine/core
pnpm add lucide-react

pnpm add leaflet react-leaflet@next
pnpm add -D @types/leaflet

pnpm add @aws-sdk/client-s3 @aws-sdk/lib-storage @aws-sdk/s3-request-presigner
```

## S3 Bucket Configuration

**Important** : These steps configure a public bucket where everything it contains is accessible to all of the internet. Never put any secret files in a bucket configured this way.

1. Create an S3 bucket. Use all defaults except:
   Block Public Access settings for this bucket : Uncheck and acknowledge

2. Create an IAM policy with this JSON (replacing YOURBUCKETNAME)

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::YOURBUCKETNAME*"
        }
    ]
}
```

3. Create a user and "attach the policy directly". Then go to user's "Security credentials" tab.
   Click access key, choose "Local code", and then confirm.

4. Setup CORS on the bucket so files can be uploaded directly from the Kottster admin UI. Go to the permissions -> CORS tab for the bucket and add the following JSON:

```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "GET",
            "PUT",
            "POST"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

5. Finally, you can also setup a CloudFront CDN for the bucket. To do so, choose the bucket as origin domain. Under "Web Application Firewall (WAF)", choose "Do not enable security protections" leave all other items default.

For the CDN to work, all objects in the bucket must be public. Go to the S3 Bucket and paste the following for the bucket policy (from https://awspolicygen.s3.amazonaws.com/policygen.html) :

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Statement1",
      "Effect": "Allow",
      "Principal": "*",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::YOURBUCKETNAME/*"
    }
  ]
}
```

## Blog post

This repo is for a blog post I wrote : TODO - url
