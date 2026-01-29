variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "instance_types" {
  description = "EC2 instance types per environment"
  type        = map(string)
  default = {
    dev     = "t2.micro"
    staging = "t3.small"
    prod    = "t3.medium"
  }
}

variable "amis" {
  description = "AMI IDs per environment"
  type        = map(string)
  default = {
    dev     = "ami-0123456789abcdef0"
    staging = "ami-0123456789abcdef1"
    prod    = "ami-0123456789abcdef2"
  }
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "MyApp"
    ManagedBy   = "Terraform"
  }
}
