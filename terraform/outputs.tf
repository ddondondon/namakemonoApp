output "ec2_public_ip" {
  description = "EC2のElastic IP"
  value       = aws_eip.ec2.public_ip
}

output "ec2_public_dns" {
  description = "EC2のPublic DNS"
  value       = aws_instance.main.public_dns
}

output "rds_endpoint" {
  description = "RDSのエンドポイント"
  value       = aws_db_instance.main.endpoint
}

output "rds_db_name" {
  description = "RDSのDB名"
  value       = aws_db_instance.main.db_name
}
