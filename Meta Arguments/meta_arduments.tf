variable "b_name" {
  description = "List of S3 bucket names"
  type        = list(string)
}

resource "aws_s3_bucket" "example" {
  count  = length(var.b_name)
  bucket = var.b_name[count.index]
}
b_name = [
  "my-dev-bucket-001",
  "my-dev-bucket-002"
]

