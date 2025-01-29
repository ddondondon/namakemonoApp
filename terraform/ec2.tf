# EC2用のElastic IP（固定IP）を作成
resource "aws_eip" "ec2" {
  vpc = true
  depends_on = [
    aws_internet_gateway.igw
  ]

  tags = {
    Name = "namakemonoApp-ec2-eip"
  }
}

resource "aws_instance" "main" {
  ami                    = data.aws_ami.amazon_linux2.id
  instance_type          = var.ec2_instance_type
  subnet_id              = aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name               = var.ec2_key_name
  associate_public_ip_address = false  # EIPを使うため、ここは false に

  # 必要に応じてUser dataなどでアプリやHTTPSサーバをインストール
  # user_data = file("user_data.sh")

  tags = {
    Name = "namakemonoApp-ec2"
  }
}

# EIPをEC2インスタンスにアタッチ
resource "aws_eip_association" "ec2_assoc" {
  instance_id   = aws_instance.main.id
  allocation_id = aws_eip.ec2.id
}

data "aws_ami" "amazon_linux2" {
  most_recent = true
  owners      = ["amazon"] 

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-gp2"]
  }

  filter {
    name   = "architecture"
    values = ["arm64"]  # t4g系で使用する場合
  }
}
