pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_NAME_BACKEND = 'shgeeth/to-do-application-backend'
        DOCKER_IMAGE_NAME_FRONTEND = 'shgeeth/to-do-application-frontend'
        DOCKER_IMAGE_TAG = "${env.BUILD_NUMBER}"
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

        stage('Build and Push Docker Images') {
            steps {
                sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                
                dir('backend') {
                    sh "docker build -t ${DOCKER_IMAGE_NAME_BACKEND}:${DOCKER_IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_IMAGE_NAME_BACKEND}:${DOCKER_IMAGE_TAG} ${DOCKER_IMAGE_NAME_BACKEND}:latest"
                    sh "docker push ${DOCKER_IMAGE_NAME_BACKEND}:${DOCKER_IMAGE_TAG}"
                    sh "docker push ${DOCKER_IMAGE_NAME_BACKEND}:latest"
                }
                
                dir('frontend') {
                    sh "docker build -t ${DOCKER_IMAGE_NAME_FRONTEND}:${DOCKER_IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_IMAGE_NAME_FRONTEND}:${DOCKER_IMAGE_TAG} ${DOCKER_IMAGE_NAME_FRONTEND}:latest"
                    sh "docker push ${DOCKER_IMAGE_NAME_FRONTEND}:${DOCKER_IMAGE_TAG}"
                    sh "docker push ${DOCKER_IMAGE_NAME_FRONTEND}:latest"
                }
            }
        }

        stage('Deploy to Environment') {
            steps {
                echo 'Deploying to environment using Terraform and Ansible...'
                
                // Clone your infrastructure repository
                // sh 'git clone https://github.com/yourusername/todo-app-infrastructure.git || (cd todo-app-infrastructure && git pull)'
                
                // Run Terraform to provision infrastructure
                dir('infrastructure/terraform') {
                    sh 'terraform init'
                    sh 'terraform apply -auto-approve'
                }
                
                // Run Ansible to configure servers and deploy containers
                dir('infrastructure/ansible') {
                    sh 'ansible-playbook -i inventory.ini deploy.yml -e "backend_image=${DOCKER_IMAGE_NAME_BACKEND}:${DOCKER_IMAGE_TAG}" -e "frontend_image=${DOCKER_IMAGE_NAME_FRONTEND}:${DOCKER_IMAGE_TAG}"'
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}