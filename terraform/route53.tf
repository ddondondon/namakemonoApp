resource "aws_route53_record" "ec2" {
  zone_id = var.route53_zone_id
  name    = var.domain_name   # 例: "example.com"
  type    = "A"
  ttl     = 300
  records = [aws_eip.ec2.public_ip]
}
