############################
# S3 バケット (アーティファクト保管用)
############################
resource "aws_s3_bucket" "codepipeline_artifact" {
  bucket = "namakemonoapp-pipeline-artifact"  # 一意名
  acl    = "private"

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "codepipeline_artifact_block" {
  bucket = aws_s3_bucket.codepipeline_artifact.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

############################
# CodePipeline IAMロール
############################
data "aws_iam_policy_document" "codepipeline_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["codepipeline.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "codepipeline_role" {
  name               = "namakemonoApp-CodePipeline-Role"
  assume_role_policy = data.aws_iam_policy_document.codepipeline_assume_role_policy.json
}

data "aws_iam_policy_document" "codepipeline_policy_doc" {
  statement {
    sid       = "S3Access"
    actions   = [
      "s3:GetObject",
      "s3:GetObjectVersion",
      "s3:PutObject"
    ]
    resources = [
      aws_s3_bucket.codepipeline_artifact.arn,
      "${aws_s3_bucket.codepipeline_artifact.arn}/*"
    ]
  }

  #ビルドはSkipするため、CodeBuild権限は不要
  #statement {
  #  sid       = "CodeBuildActions"
  #  actions   = [
  #    "codebuild:BatchGetBuilds",
  #    "codebuild:StartBuild",
  #    "codebuild:StopBuild"
  #  ]
  #  resources = ["*"]
  #}

  statement {
    sid       = "CodeDeployActions"
    actions   = [
      "codedeploy:CreateDeployment",
      "codedeploy:GetDeployment",
      "codedeploy:GetDeploymentConfig",
      "codedeploy:RegisterApplicationRevision"
    ]
    resources = ["*"]
  }

  statement {
    sid       = "CloudWatchLogsActions"
    actions   = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "codepipeline_policy" {
  name        = "namakemonoApp-CodePipeline-Policy"
  description = "Policy for CodePipeline to access S3, CodeDeploy, etc."
  policy      = data.aws_iam_policy_document.codepipeline_policy_doc.json
}

resource "aws_iam_role_policy_attachment" "codepipeline_policy_attachment" {
  role       = aws_iam_role.codepipeline_role.name
  policy_arn = aws_iam_policy.codepipeline_policy.arn
}

############################
# CodePipeline リソース
############################
resource "aws_codepipeline" "namakemono_pipeline" {
  name     = "namakemonoApp-Pipeline"
  role_arn = aws_iam_role.codepipeline_role.arn

  artifact_store {
    type     = "S3"
    location = aws_s3_bucket.codepipeline_artifact.bucket
  }

  # ========== Stage 1: Source (GitHub) ==========
  stage {
    name = "Source"

    action {
      name             = "GitHub_Source"
      category         = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
      output_artifacts = ["SourceArtifact"]

      configuration = {
        Owner      = "ddondondon"    # GitHubユーザー名
        Repo       = "namakemonoApp" # リポジトリ名
        Branch     = "main"          # ブランチ
        OAuthToken = var.github_token
      }
    }
  }

  # ========== Stage 2: Deploy (CodeDeploy) ==========
  stage {
    name = "Deploy"

    action {
      name            = "CodeDeploy"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "CodeDeploy"
      input_artifacts = ["SourceArtifact"]
      version         = "1"

      configuration = {
        ApplicationName     = "namakemonoApp-CodeDeploy-Application"
        DeploymentGroupName = "namakemonoApp-DeploymentGroup"
      }
    }
  }
}

############################
# CodeDeploy リソース定義
############################
# Terraformで一貫管理する場合に必要（すでに外部で作成済みの場合は以下、不要）

resource "aws_codedeploy_app" "namakemono_app" {
  name             = "namakemonoApp-CodeDeploy-Application"
  compute_platform = "Server"
}

resource "aws_codedeploy_deployment_group" "namakemono_deployment_group" {
  app_name              = aws_codedeploy_app.namakemono_app.name
  deployment_group_name = "namakemonoApp-DeploymentGroup"
  service_role_arn      = aws_iam_role.codedeploy_service_role.arn # 別途作成しておく

  deployment_config_name = "CodeDeployDefault.OneAtATime"

  ec2_tag_set {
    ec2_tag_filter {
      key   = "Name"
      type  = "KEY_AND_VALUE"
      value = "namakemonoApp-ec2"  # デプロイ対象のEC2に付与しているTag
    }
  }
}
