# AWS関連
variable "aws_region" {
  type        = string
  description = "AWSのリージョン"
  default     = "ap-northeast-1"  # 東京リージョン
}

variable "vpc_cidr" {
  type        = string
  description = "VPCのCIDR"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type        = string
  description = "パブリックサブネットのCIDR"
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  type        = string
  description = "プライベートサブネットのCIDR"
  default     = "10.0.2.0/24"
}

variable "private_subnet_2_cidr" {
  type        = string
  description = "プライベートサブネット2のCIDR"
  default     = "10.0.3.0/24"
}

# EC2関連
variable "ec2_instance_type" {
  type        = string
  description = "EC2インスタンスタイプ"
  default     = "t4g.micro"
}

variable "ec2_key_name" {
  type        = string
  description = "EC2に割り当てるキーペア名"
}

# RDS関連
variable "db_engine" {
  type        = string
  description = "RDSエンジン"
  default     = "postgres"
}

variable "db_engine_version" {
  type        = string
  description = "RDSエンジンバージョン"
  default     = "13.7"
}

variable "db_instance_class" {
  type        = string
  description = "RDSインスタンスクラス"
  default     = "db.t4g.micro"
}

variable "db_name" {
  type        = string
  description = "RDSのDB名"
  default     = "namakemono"
}

variable "db_username" {
  type        = string
  description = "RDSのマスターユーザー名"
  default     = "dbadmin"
}

variable "db_password" {
  type        = string
  description = "RDSのマスターパスワード"
  sensitive   = true
}

# Route53関連
variable "route53_zone_id" {
  type        = string
  description = "既存のRoute53 Hosted ZoneのID"
}

variable "domain_name" {
  type        = string
  description = "Route53に登録するレコード名"
}

variable "github_token" {
  type        = string
  description = "Personal access token for GitHub"
  sensitive   = true
}
