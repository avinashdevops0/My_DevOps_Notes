apk update
apk add --no-cache curl unzip bash
curl -LO https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
mv terraform /usr/local/bin/
chmod +x /usr/local/bin/terraform
terraform version

To remove

rm terraform_1.6.0_linux_amd64.zip
