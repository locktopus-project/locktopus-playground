provider "aws" {
  alias      = "aws_us_east_1"
  region     = "us-east-1" // for certificates
  access_key = var.AWS_ACCESS_KEY
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

resource "aws_acm_certificate" "main_certificate" {
  provider          = aws.aws_us_east_1
  domain_name       = var.DOMAIN_NAME
  validation_method = "DNS"
}

resource "aws_acm_certificate_validation" "main_certificate_validation" {
  provider                = aws.aws_us_east_1
  certificate_arn         = aws_acm_certificate.main_certificate.arn
  validation_record_fqdns = [aws_route53_record.main_certificate_validation_cname.fqdn]
}
