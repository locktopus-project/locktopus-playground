resource "github_actions_secret" "AWS_ACCESS_KEY" {
  repository      = var.GH_REPO_NAME
  secret_name     = "AWS_ACCESS_KEY"
  plaintext_value = aws_iam_access_key.s3_user.id
}

resource "github_actions_secret" "AWS_SECRET_ACCESS_KEY" {
  repository      = var.GH_REPO_NAME
  secret_name     = "AWS_SECRET_ACCESS_KEY"
  plaintext_value = aws_iam_access_key.s3_user.secret
  #   encrypted_value = aws_iam_access_key.s3_user.encrypted_secret
}

resource "github_actions_secret" "AWS_REGION" {
  repository      = var.GH_REPO_NAME
  secret_name     = "AWS_REGION"
  plaintext_value = var.AWS_REGION
}

resource "github_actions_secret" "AWS_S3_BUCKET" {
  repository      = var.GH_REPO_NAME
  secret_name     = "AWS_S3_BUCKET"
  plaintext_value = aws_s3_bucket.s3_static_bucket.id
}

resource "github_actions_secret" "AWS_CLOUDFRONT_DISTRIBUTION_ID" {
  repository      = var.GH_REPO_NAME
  secret_name     = "AWS_CLOUDFRONT_DISTRIBUTION_ID"
  plaintext_value = aws_cloudfront_distribution.cdn.id
}
