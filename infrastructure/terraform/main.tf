# Define the cloud provider (AWS, Azure, DigitalOcean, etc.)
provider "aws" {
  region = var.aws_region
}

# Create a VPC
resource "aws_vpc" "todo_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true
  
  tags = {
    Name = "todo-app-vpc"
  }
}

# Create a public subnet
resource "aws_subnet" "todo_public_subnet" {
  vpc_id     = aws_vpc.todo_vpc.id
  cidr_block = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone = "${var.aws_region}a"
  
  tags = {
    Name = "todo-app-public-subnet"
  }
}

# Create an internet gateway
resource "aws_internet_gateway" "todo_igw" {
  vpc_id = aws_vpc.todo_vpc.id
  
  tags = {
    Name = "todo-app-igw"
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
    Name = "todo-app-sg"
  }
}

# Create EC2 instance
resource "aws_instance" "todo_app_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = length(var.key_name) > 0 ? var.key_name : null
  subnet_id     = aws_subnet.todo_public_subnet.id
  vpc_security_group_ids = [aws_security_group.todo_app_sg.id]
  
  tags = {
    Name = "todo-app-server"
  }
  
  # Add instance IP to Ansible inventory
  provisioner "local-exec" {
    command = "echo ${self.public_ip} ansible_user=ec2-user > ../ansible/inventory.ini"
  }
}

# Output instance public IP
output "server_public_ip" {
  value = aws_instance.todo_app_server.public_ip
}