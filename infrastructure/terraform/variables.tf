variable "aws_region" {
  description = "AWS region"
  default     = "us-west-2"
}

variable "ami_id" {
  description = "AMI ID for EC2 instance"
  default     = "ami-0ac64ad8517166fb1" # Amazon Linux 2 AMI for us-west-2
}

variable "instance_type" {
  description = "Instance type for EC2"
  default     = "t2.micro"
}

variable "key_name" {
  description = "SSH key name"
  default     = ""  # Set to empty so we can provide it during terraform apply
}

variable "create_new_vpc" {
  description = "Whether to create a new VPC or use an existing one"
  type        = bool
  default     = false
}

variable "existing_vpc_id" {
  description = "ID of an existing VPC to use if create_new_vpc is false"
  type        = string
  default     = ""
}

variable "existing_subnet_id" {
  description = "ID of an existing subnet to use if create_new_vpc is false"
  type        = string
  default     = ""
}

variable "existing_security_group_id" {
  description = "ID of an existing security group to use if create_new_vpc is false"
  type        = string
  default     = ""
}