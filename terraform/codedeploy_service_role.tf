##############################################
# CodeDeploy Service Role - IAMロール定義
##############################################

# 1. CodeDeployがこのロールを引き受け(Assume)できるようにする「トラストポリシー」をdataソースで定義
data "aws_iam_policy_document" "codedeploy_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["codedeploy.amazonaws.com"]
    }
  }
}

# 2. CodeDeploy用のサービスロール (IAM Role) を作成
resource "aws_iam_role" "codedeploy_service_role" {
  name               = "namakemonoApp-CodeDeploy-ServiceRole"
  assume_role_policy = data.aws_iam_policy_document.codedeploy_assume_role_policy.json
}

# 3. ロールにCodeDeploy EC2/オンプレ向けのマネージドポリシーをアタッチ
resource "aws_iam_role_policy_attachment" "codedeploy_service_role_attach" {
  role       = aws_iam_role.codedeploy_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSCodeDeployRole"
}
