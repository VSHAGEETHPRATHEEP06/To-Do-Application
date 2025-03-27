# Define the required providers
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.4"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

# Configure the AWS provider
provider "aws" {
  region = var.aws_region
}

# Generate a random suffix to avoid naming conflicts
resource "random_id" "suffix" {
  byte_length = 4
}

# Create a VPC
resource "aws_vpc" "todo_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  
  tags = {
    Name = "todo-app-vpc-${random_id.suffix.hex}"
  }
}

# Create a public subnet
resource "aws_subnet" "todo_public_subnet" {
  vpc_id     = aws_vpc.todo_vpc.id
  cidr_block = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone = "${var.aws_region}a"
  
  tags = {
    Name = "todo-app-public-subnet-${random_id.suffix.hex}"
  }
}

# Create an internet gateway
resource "aws_internet_gateway" "todo_igw" {
  vpc_id = aws_vpc.todo_vpc.id
  
  tags = {
    Name = "todo-app-igw-${random_id.suffix.hex}"
  }
}

# Create a route table
resource "aws_route_table" "todo_public_rt" {
  vpc_id = aws_vpc.todo_vpc.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.todo_igw.id
  }
  
  tags = {
    Name = "todo-app-public-rt"
  }
}

# Associate the route table with the subnet
resource "aws_route_table_association" "public_rta" {
  subnet_id      = aws_subnet.todo_public_subnet.id
  route_table_id = aws_route_table.todo_public_rt.id
}

# Create a security group
resource "aws_security_group" "todo_app_sg" {
  name        = "todo-app-sg"
  description = "Allow traffic for Todo App"
  vpc_id      = aws_vpc.todo_vpc.id
  
  # Allow HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Allow HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Allow SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "todo-app-sg-${random_id.suffix.hex}"
  }
}

# Generate a new key pair for SSH access
resource "tls_private_key" "todo_app_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Save private key to file
resource "local_file" "private_key" {
  content         = tls_private_key.todo_app_key.private_key_pem
  filename        = "${path.module}/../ansible/todo_app_key.pem"
  file_permission = "0600"
}

# Create AWS key pair from the generated public key
resource "aws_key_pair" "todo_app_keypair" {
  key_name   = "todo-app-keypair-${random_id.suffix.hex}"
  public_key = tls_private_key.todo_app_key.public_key_openssh
}

# Create EC2 instance
resource "aws_instance" "todo_app_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = aws_key_pair.todo_app_keypair.key_name
  subnet_id     = aws_subnet.todo_public_subnet.id
  vpc_security_group_ids = [aws_security_group.todo_app_sg.id]
  
  tags = {
    Name = "todo-app-server-${random_id.suffix.hex}"
  }
  
  # Add instance IP to Ansible inventory with SSH key information
  provisioner "local-exec" {
    command = "echo '${self.public_ip} ansible_user=ec2-user ansible_ssh_private_key_file=todo_app_key.pem' > ../ansible/inventory.ini"
  }
}

# Output instance public IP
output "server_public_ip" {
  value = aws_instance.todo_app_server.public_ip
}