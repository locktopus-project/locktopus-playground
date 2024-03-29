resource "aws_iam_user" "s3_user" {
  name = "api-user-for-deploy-${var.DOMAIN_NAME}"
}

resource "aws_iam_access_key" "s3_user" {
  user = aws_iam_user.s3_user.name
}