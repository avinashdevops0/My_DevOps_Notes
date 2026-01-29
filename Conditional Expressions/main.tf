provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "example" {
  ami           = var.amis[var.environment]
  instance_type = var.instance_types[var.environment]

  tags = merge(
    var.tags,
    {
      Name        = "example-${var.environment}"
      Environment = var.environment
    }
  )
}
