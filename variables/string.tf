variable "aws_instance" {
    description = "Instance name"
    type = string
    default = "t2.micro"
  
}
variable "monitoring" {
    description = "monitoring"
    type = bool
    default = true
  
}
variable "instance_vol" {
  description = "Instance volume size"
  type = number
  default = 8
}
variable "instance_region" {
    description = "Regions"
    type = set(string)
    default = [ "us-east-1a","us-east-1b","us-east-1a","us-east-1b" ]
  
}


resource "aws_instance" "example" {
    availability_zone = tolist(var.instance_region)[0]  // To access set of string you need to convert into list 
                                                        // we cannot access values because it is set

    instance_type = var.aws_instance
    monitoring = var.monitoring
    root_block_device {
        volume_size = var.instance_vol
        }
}

variable "instance_config" {
    description = "messgae"
    type = tuple([ bool,number,string ])
  
}
variable "dev_instance_config" {
  description = "Dev EC2 configuration"
  type = object({
    region        = string
    monitoring    = bool
    instance_vol  = number
    tags          = map(string)
  })
}

resource "aws_instance" "example_1" {
  ami           = "ami-0abcdef12345"   # example
  instance_type = "t2.micro"

  monitoring = var.dev_instance_config.monitoring

  root_block_device {
    volume_size = var.dev_instance_config.instance_vol
  }

  tags = var.dev_instance_config.tags
}
# dev_instance_config = {
#   region       = "us-east-1"
#   monitoring   = true
#   instance_vol = 20
#   tags = {
#     Name        = "dev-ec2"
#     Environment = "dev"
#     Owner       = "DevOps"
#   }
# }

