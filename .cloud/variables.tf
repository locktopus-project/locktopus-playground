variable "AWS_STATIC_BUCKET_NAME" {
  description = "Bucket for deploying static files"
}

variable "AWS_ACCESS_KEY" {
  type = string
}

variable "AWS_SECRET_ACCESS_KEY" {
  type      = string
  sensitive = true
}

variable "AWS_REGION" {
  type = string
}

variable "DOMAIN_NAME" {
  type = string
}

variable "AWS_R53_ZONE" {
  type = string
}

variable "GH_TOKEN" {
  type      = string
  sensitive = true
}

variable "GH_REPO_NAME" {
  type      = string
}
