AWS S3 Bucket Browser 
=====================

S3 Bucket Browser, **fully based on AWS JavaScript API**, see http://aws.amazon.com/sdkfornodejs/

Base on the idea of : https://raw2.github.com/rgrp/s3-bucket-listing and inspired on the current S3 Browser from Amazon.

Intent for public or private usage, you can deploy this files on any web site.

Not intent for deploy on your own bucket (for me no make sense).

Using the new IAM Users from AWS you can provide more specific and secure access to your buckets.

## Usage

**Notes** I recommend create specific user or roles to access bucket to browse, then generate their access key, for now this code is intent only for browse, then no need to create a user with other privileges just use ListObjects. Check this link http://docs.aws.amazon.com/IAM/latest/UserGuide/PoliciesOverview.html

1.Copy the files on your web site. Could be based on Apache or IIS.
2.Modify the setting in file js/config.js

    var AWS_AccessKeyId = ''; //Your credentials for specific user and privileges
    var AWS_SecretAccessKey = ''; //Your credentials for specific user and privileges
    var AWS_Region = 'us-east-1';
    var AWS_BucketName = '';
    var AWS_MaxKeys = 500; //How many objects will retrive (include folders and items)
    var AWS_Prefix = ''; //Stating folder, by default start on root of bucket
    var TITLE = 'S3 Bucket browser';
	
3.Navigate to index.html and start browsing...

## Copyright and License

Copyright 2013-2014 Juvenal Guzmán.

Licensed under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


