pipeline {
    agent any

    parameters {
        booleanParam(name: 'SKIP_CLEANUP', defaultValue: true, description: 'Skip infrastructure cleanup after deployment')
    }
    
    triggers {
        githubPush()
    }

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_NAME_BACKEND = 'shageeth/to-do-application-backend'
        DOCKER_IMAGE_NAME_FRONTEND = 'shageeth/to-do-application-frontend'
        DOCKER_IMAGE_TAG = "${env.BUILD_NUMBER}"
        
        // AWS credentials
        AWS_CREDENTIALS = credentials('aws-credentials')
        AWS_ACCESS_KEY_ID = "${AWS_CREDENTIALS_USR}"
        AWS_SECRET_ACCESS_KEY = "${AWS_CREDENTIALS_PSW}"
        AWS_REGION = 'ap-southeast-1'  // Changed to Singapore region
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Check') {
            parallel {
                stage('Backend Build Check') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                            sh 'npm rebuild bcrypt --update-binary'
                        }
                    }
                }
                stage('Frontend Build Check') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }

        stage('Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            echo 'Running backend tests...'
                            // Replace with actual test commands when tests are implemented
                            // sh 'npm test'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            echo 'Running frontend tests...'
                            // Replace with actual test commands when tests are implemented
                            // sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    def loginSuccess = false
                    retry(5) {
                        try {
                            timeout(time: 2, unit: 'MINUTES') {
                                sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                            }
                            loginSuccess = true
                        } catch (Exception e) {
                            echo "Docker login attempt failed: ${e.message}"
                            sleep(10) // Wait 10 seconds before retrying
                            error("Retrying Docker login...")
                        }
                    }
                    // If all retries fail, we'll still proceed but warn
                    if (!loginSuccess) {
                        echo "WARNING: Docker Hub login failed after multiple attempts. Will build images but skip pushing."
                    }
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                dir('backend') {
                    sh "docker build -t ${DOCKER_IMAGE_NAME_BACKEND}:${DOCKER_IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_IMAGE_NAME_BACKEND}:${DOCKER_IMAGE_TAG} ${DOCKER_IMAGE_NAME_BACKEND}:latest"
                }
                
                dir('frontend') {
                    sh "docker build -t ${DOCKER_IMAGE_NAME_FRONTEND}:${DOCKER_IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_IMAGE_NAME_FRONTEND}:${DOCKER_IMAGE_TAG} ${DOCKER_IMAGE_NAME_FRONTEND}:latest"
                }
            }
        }
        
        stage('Push Docker Images') {
            steps {
                script {
                    // Only try to push if login succeeded
                    try {
                        timeout(time: 3, unit: 'MINUTES') {
                            dir('backend') {
                                sh "docker push ${DOCKER_IMAGE_NAME_BACKEND}:${DOCKER_IMAGE_TAG}"
                                sh "docker push ${DOCKER_IMAGE_NAME_BACKEND}:latest"
                            }
                        }
                    } catch (Exception e) {
                        echo "WARNING: Failed to push backend image: ${e.message}"
                        echo "Will continue with deployment using local images"
                    }
                    
                    try {
                        timeout(time: 3, unit: 'MINUTES') {
                            dir('frontend') {
                                sh "docker push ${DOCKER_IMAGE_NAME_FRONTEND}:${DOCKER_IMAGE_TAG}"
                                sh "docker push ${DOCKER_IMAGE_NAME_FRONTEND}:latest"
                            }
                        }
                    } catch (Exception e) {
                        echo "WARNING: Failed to push frontend image: ${e.message}"
                        echo "Will continue with deployment using local images"
                    }
                }
            }
        }

        stage('Initialize Terraform Backend') {
            steps {
                script {
                    dir('infrastructure/terraform') {
                        // Create backend.tf for S3 state storage
                        writeFile file: 'backend.tf', text: '''
                        terraform {
                        backend "s3" {
                            bucket         = "todo-app-terraform-state2"
                            key            = "terraform.tfstate"
                            region         = "ap-southeast-1"
                            encrypt        = true
                        }
                        }
                        '''
                    }
                }
            }
        }

        stage('Deploy to Environment') {
            steps {
                echo 'Deploying to environment using Terraform and Ansible...'
                
                // Clone your infrastructure repository
                // sh 'git clone https://github.com/yourusername/todo-app-infrastructure.git || (cd todo-app-infrastructure && git pull)'
                
                // Run Terraform to provision infrastructure
                script {
                    try {
                        dir('infrastructure/terraform') {
                            sh '/opt/homebrew/bin/terraform init'
                            sh '/opt/homebrew/bin/terraform apply -auto-approve'
                        }
                    } catch (Exception e) {
                        echo "ERROR during Terraform deployment: ${e.message}"
                        error("Terraform deployment failed. Cannot continue with deployment.")
                    }
                    
                    // Only proceed with Ansible if Terraform succeeded
                    try {
                        // Wait for EC2 instance to fully initialize (status checks, SSH service ready, Python installation)
                        echo "Waiting for EC2 instance to fully initialize (180 seconds)..."
                        sh 'sleep 180'
                        
                        dir('infrastructure/ansible') {
                            // Ensure inventory.ini exists (it should be created by Terraform's local-exec provisioner)
                            sh 'ls -la'
                            
                            // Debug the inventory.ini file
                            sh 'cat inventory.ini || echo "inventory.ini not found!"'
                            
                            // Create inventory.ini file if it doesn't exist
                            sh '''
                            if [ ! -f inventory.ini ]; then
                                echo "Creating inventory.ini file manually..."
                                echo "[todo_servers]" > inventory.ini
                                echo "13.250.16.170 ansible_user=ubuntu ansible_ssh_private_key_file=todo_app_key.pem ansible_connection=ssh ansible_ssh_common_args='-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ControlMaster=auto -o ControlPersist=60s' ansible_ssh_retries=5 ansible_ssh_timeout=30" >> inventory.ini
                                echo "" >> inventory.ini
                                echo "[todo_servers:vars]" >> inventory.ini
                                echo "ansible_ssh_pipelining=True" >> inventory.ini
                                echo "ansible_python_interpreter=/usr/bin/python3" >> inventory.ini
                            fi
                            '''
                            
                            // Fix any quotes in the key path
                            sh 'sed -i.bak "s/\\"//g" inventory.ini'
                            sh 'cat inventory.ini'
                            
                            // Extract the IP address for manual testing
                            sh 'IP=$(grep -oE "\\b([0-9]{1,3}\\.){3}[0-9]{1,3}\\b" inventory.ini | head -1) && echo "Server IP: $IP"'
                            
                            // Ensure SSH key has correct permissions
                            sh 'chmod 400 todo_app_key.pem'
                            sh 'ls -la todo_app_key.pem'
                            
                            // Create ansible.cfg file to disable host key checking
                            sh 'echo "[defaults]\\nhost_key_checking = False\\nprivate_key_file = todo_app_key.pem\\n[ssh_connection]\\nssh_args = -o ControlMaster=auto -o ControlPersist=60s -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no" > ansible.cfg'
                            
                            // Attempt manual SSH connection for debugging
                            sh 'IP=$(grep -oE "\\b([0-9]{1,3}\\.){3}[0-9]{1,3}\\b" inventory.ini | head -1) && echo "Testing SSH connection to $IP" && ssh -i todo_app_key.pem -o StrictHostKeyChecking=no -o PasswordAuthentication=no -v ec2-user@$IP "echo SSH Connection Successful" || echo "SSH connection failed, but continuing with deployment"'
                            
                            // Run Ansible deployment with improved SSH options
                            sh '/opt/homebrew/bin/ansible-playbook -i inventory.ini deploy.yml -e "backend_image=${DOCKER_IMAGE_NAME_BACKEND}:${DOCKER_IMAGE_TAG}" -e "frontend_image=${DOCKER_IMAGE_NAME_FRONTEND}:${DOCKER_IMAGE_TAG}" --private-key=todo_app_key.pem --ssh-common-args="-o StrictHostKeyChecking=no -o ConnectTimeout=60 -o ConnectionAttempts=10" -vvv'
                        }
                    } catch (Exception e) {
                        echo "ERROR during Ansible deployment: ${e.message}"
                        error("Ansible deployment failed.")
                    }
                }
            }
        }
        
        stage('Display Application URL') {
            steps {
                dir('infrastructure/ansible') {
                    script {
                        sh '''
                        IP=$(grep -oE "\\b([0-9]{1,3}\\.){3}[0-9]{1,3}\\b" inventory.ini | head -1)
                        echo "********************************************"
                        echo "* Application URL: http://$IP              *"
                        echo "* Your Todo application is now accessible! *"
                        echo "********************************************"
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
            cleanWs()
            
            script {
                if (!params.SKIP_CLEANUP) {
                    echo "Cleaning up infrastructure as SKIP_CLEANUP is set to false"
                    try {
                        dir('infrastructure/terraform') {
                            sh '/opt/homebrew/bin/terraform destroy -auto-approve'
                        }
                    } catch (Exception e) {
                        echo "WARNING: Failed to destroy infrastructure: ${e.message}"
                    }
                } else {
                    echo "Skipping infrastructure cleanup as SKIP_CLEANUP is set to true"
                    echo "The application remains deployed and accessible in AWS"
                }
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}