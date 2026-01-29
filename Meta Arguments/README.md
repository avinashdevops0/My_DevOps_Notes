depends_on
count   // counts all types of variables
for_each      // Iterration
provider        // plugin
lifecycle       // create before destroy
                // prevent distruction
                // ignore chnages
                // replace triggred by



✅ Correct Way #1: Using count (Simple & Common)
Variable
variable "b_name" {
  description = "List of S3 bucket names"
  type        = list(string)
}

Resource
resource "aws_s3_bucket" "example" {
  count  = length(var.b_name)
  bucket = var.b_name[count.index]
}

terraform.tfvars
b_name = [
  "my-dev-bucket-001",
  "my-dev-bucket-002"
]

✅ Correct Way #2: Using for_each (PRODUCTION BEST PRACTICE)

👉 Recommended for real projects

Variable
variable "b_name" {
  description = "S3 bucket names"
  type        = set(string)
}

Resource
resource "aws_s3_bucket" "example" {
  for_each = var.b_name
  bucket   = each.value
}

terraform.tfvars
b_name = [
  "my-prod-bucket-001",
  "my-prod-bucket-002"
]

🧠 Why for_each Is Better Than count
count	for_each
Index-based	Key-based
Risky on list reorder	Safe
Less readable	Cleaner
Causes resource recreation	Stable
🎤 Interview One-Liners

count requires count.index

for_each is preferred for resource lists

S3 bucket names must be globally unique

Sets prevent duplicates automatically

🔥 Bonus: Add Environment Suffix Automatically
bucket = "${each.value}-dev"