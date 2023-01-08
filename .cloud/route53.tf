data "aws_route53_zone" "domain_zone" {
  name         = var.AWS_R53_ZONE
  private_zone = false
  provider     = aws.aws_us_east_1
}

resource "aws_route53_record" "main_certificate_validation_cname" {
  provider        = aws.aws_us_east_1
  allow_overwrite = true
  name            = tolist(aws_acm_certificate.main_certificate.domain_validation_options)[0].resource_record_name
  records         = [tolist(aws_acm_certificate.main_certificate.domain_validation_options)[0].resource_record_value]
  type            = tolist(aws_acm_certificate.main_certificate.domain_validation_options)[0].resource_record_type
  zone_id         = data.aws_route53_zone.domain_zone.id
  ttl             = 60
}

resource "aws_route53_record" "dns_cdn_record" {
  zone_id         = data.aws_route53_zone.domain_zone.zone_id
  name            = "playground"
  type            = "CNAME"
  records         = [aws_cloudfront_distribution.cdn.domain_name]
  ttl             = 300
  allow_overwrite = true
}


