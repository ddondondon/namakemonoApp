# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "namakemonoApp-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet.id]

  tags = {
    Name = "namakemonoApp-db-subnet-group"
  }
}

# RDS インスタンス
resource "aws_db_instance" "main" {
  identifier               = "namakemonoApp-rds"
  allocated_storage        = 20
  storage_type             = "gp2"
  engine                   = var.db_engine
  engine_version           = var.db_engine_version
  instance_class           = var.db_instance_class
  name                     = var.db_name
  username                 = var.db_username
  password                 = var.db_password
  db_subnet_group_name     = aws_db_subnet_group.main.name
  vpc_security_group_ids   = [aws_security_group.rds_sg.id]
  publicly_accessible      = false
  multi_az                 = false  
  skip_final_snapshot      = true   
  deletion_protection      = false

  tags = {
    Name = "namakemonoApp-rds"
  }
}
