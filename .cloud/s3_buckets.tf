# S# BUCKET FOR STATIC FILES

resource "aws_s3_bucket" "s3_static_bucket" {
  bucket        = var.AWS_STATIC_BUCKET_NAME
  force_destroy = true
}

data "aws_iam_policy_document" "bucket_access" {
  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListBucket"
    ]
    resources = [
      "${aws_s3_bucket.s3_static_bucket.arn}/*",
      "${aws_s3_bucket.s3_static_bucket.arn}",
    ]

    principals {
      type        = "AWS"
      identifiers = [aws_iam_user.s3_user.arn]
    }
  }

  statement {
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.s3_static_bucket.arn}/*"]
    # sid       = "1"

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.cdn_identity.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "allow_deploy_access" {
  bucket = aws_s3_bucket.s3_static_bucket.id
  policy = data.aws_iam_policy_document.bucket_access.json
}

output "s3_bucket" {
  value = aws_s3_bucket.s3_static_bucket.id
}

output "s3_user_access_key_id" {
  value = aws_iam_access_key.s3_user.id
}

output "s3_user_secret_access_key" {
  value     = aws_iam_access_key.s3_user.secret
  sensitive = true
}


