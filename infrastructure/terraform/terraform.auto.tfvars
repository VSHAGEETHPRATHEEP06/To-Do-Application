# Use this file to provide your existing infrastructure details
# Leave create_new_vpc as false to use existing infrastructure
# Or set to true if you want to create new resources (but be aware of AWS VPC limits)

create_new_vpc = false

# Replace these with your actual AWS resource IDs
# You can find these in the AWS Console or by using AWS CLI
existing_vpc_id = "vpc-YOUR_VPC_ID"
existing_subnet_id = "subnet-YOUR_SUBNET_ID"
existing_security_group_id = "sg-YOUR_SECURITY_GROUP_ID"
