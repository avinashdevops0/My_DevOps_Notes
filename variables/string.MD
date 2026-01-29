# Terraform Variables – Complete DevOps Guide (AWS Focus)

This document covers **all Terraform variable types**, real-world usage, AWS examples, best practices, and **interview-ready explanations**.

---

## 1️⃣ String Variable

Used for names, instance types, regions, AMI IDs, etc.

```tf
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}
Usage:

instance_type = var.instance_type


🎤 Interview Tip:
String variables store single text values like region, instance type, or resource names.
3️⃣ Number Variable

Used for counts, sizes, limits.

variable "instance_volume" {
  description = "Root volume size in GB"
  type        = number
  default     = 8
}


Usage:

volume_size = var.instance_volume


🎤 Interview Tip:
Numbers are used for resource scaling and capacity configuration.

4️⃣ No Default? Terraform Will Ask You 👀
variable "ami_id" {
  description = "AMI ID for EC2"
  type        = string
}


At apply time:

Enter a value for ami_id:


🎤 Interview Tip:
If no default is defined, Terraform prompts for input.

5️⃣ List Variables (String / Number / Bool)
List of Numbers (Security Group Ports)
variable "allowed_ports" {
  description = "Inbound ports"
  type        = list(number)
  default     = [22, 80, 443]
}


Usage:

from_port = var.allowed_ports[count.index]

List of Strings
variable "availability_zones" {
  description = "AZs for deployment"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}


🎤 Interview Tip:
Lists are used when multiple values of the same type are required.

6️⃣ Map Variable (MOST IMPORTANT – TAGS)
variable "common_tags" {
  description = "Tags for all resources"
  type        = map(string)
  default = {
    Environment = "dev"
    Project     = "ecommerce"
    Owner       = "DevOps"
  }
}


Usage:

tags = var.common_tags


🎤 Interview Tip:
Maps are heavily used for tagging in AWS.

7️⃣ Object Variable (Production Level)

Used for complex structured configurations.

variable "ec2_config" {
  description = "EC2 configuration object"
  type = object({
    instance_type = string
    volume_size   = number
    monitoring    = bool
  })
}


terraform.tfvars:

ec2_config = {
  instance_type = "t3.micro"
  volume_size   = 20
  monitoring    = true
}


Usage:

instance_type = var.ec2_config.instance_type
monitoring    = var.ec2_config.monitoring


🎤 Interview Tip:
Objects group related configuration into a single variable.

8️⃣ Sensitive Variables (Secrets)
variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}


🔐 Terraform hides sensitive values in output.

🎤 Interview Tip:
Sensitive variables protect secrets from being exposed.

9️⃣ Variable Validation (Production Best Practice)
variable "instance_type" {
  type = string

  validation {
    condition     = contains(["t2.micro", "t3.micro"], var.instance_type)
    error_message = "Only t2.micro or t3.micro allowed"
  }
}


🎤 Interview Tip:
Validation prevents incorrect values before resource creation.

🔟 Variable Precedence (VERY IMPORTANT)

Order from lowest → highest:

Default value

terraform.tfvars

-var-file

-var flag

Environment variables (TF_VAR_*)

Example:

export TF_VAR_instance_type=t3.medium


🎤 Interview Tip:
Environment variables have the highest priority.

1️⃣1️⃣ Environment-wise Variables (dev / prod)

dev.tfvars:

instance_type  = "t2.micro"
instance_count = 1


prod.tfvars:

instance_type  = "t3.large"
instance_count = 4


Apply:

terraform apply -var-file=dev.tfvars
terraform apply -var-file=prod.tfvars

1️⃣2️⃣ Recommended Project Structure
terraform-aws/
│── provider.tf
│── variables.tf
│── terraform.tfvars
│── ec2.tf
│── vpc.tf
│── outputs.tf

🎯 Terraform Variables – One-Page Cheatsheet
Type	Use Case
string	Names, region, AMI
number	Count, size
bool	Enable/disable
list	Multiple values
map	Tags
object	Complex configs
sensitive	Secrets

✅ Your Variable (What’s Happening)
variable "instance_region" {
  description = "Regions"
  type        = set(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1a", "us-east-1b"]
}

⚠️ Key Point About set(string)

Sets do NOT allow duplicates

Terraform will automatically remove duplicates

Order is not guaranteed

So Terraform will treat this as:

["us-east-1a", "us-east-1b"]

✅ Correct & Clean Version (Best Practice)

If you want unique values (recommended for AZs):

variable "availability_zones" {
  description = "Availability Zones for EC2"
  type        = set(string)
  default     = ["us-east-1a", "us-east-1b"]
}

🧠 When to Use set(string) vs list(string)
Use set(string) when:

✔ Order doesn’t matter
✔ Duplicates must be removed
✔ Example: AZs, IAM policies, CIDR blocks

type = set(string)

Use list(string) when:

✔ Order matters
✔ Indexing is required ([0], [1])

type = list(string)

🚫 Common Mistake (Interview Trap)

❌ This will FAIL:

var.instance_region[0]


Why?
👉 Sets cannot be indexed

✅ If You Need Indexing (Convert Set → List)
tolist(var.instance_region)[0]

🎤 Interview One-Liner

set(string) stores unique values with no guaranteed order, while list(string) preserves order and allows indexing.