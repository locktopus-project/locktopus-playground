terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.50.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 4.0"
    }
  }

  backend "remote" {}
}

provider "aws" {
  region     = var.AWS_REGION
  access_key = var.AWS_ACCESS_KEY
  secret_key = var.AWS_SECRET_ACCESS_KEY
}

provider "github" {
  token = var.GH_TOKEN
}
