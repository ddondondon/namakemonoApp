# EC2用セキュリティグループ
resource "aws_security_group" "ec2_sg" {
  name        = "namakemonoApp-ec2-sg"
  description = "Allow HTTPS inbound from the internet"
  vpc_id      = aws_vpc.main.id

  ingress {
    description      = "HTTPS from anywhere"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "namakemonoApp-ec2-sg"
  }
}

# RDS用セキュリティグループ
resource "aws_security_group" "rds_sg" {
  name        = "namakemonoApp-rds-sg"
  description = "Allow PostgreSQL inbound only from EC2 SG"
  vpc_id      = aws_vpc.main.id

  ingress {
    description            = "PostgreSQL from EC2 SG"
    from_port              = 5432
    to_port                = 5432
    protocol               = "tcp"
    security_groups        = [aws_security_group.ec2_sg.id]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "namakemonoApp-rds-sg"
  }
}
