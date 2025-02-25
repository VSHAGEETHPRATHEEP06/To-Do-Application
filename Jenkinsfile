pipeline {
    agent {
        docker {
            image 'node:lts'
    }

    environment {
        DOCKER_IMAGE = "shgeeth/to-do-app"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'f00f38b3-05ce-4c9a-8dde-3b99b824584a', url: 'https://github.com/VSHAGEETHPRATHEEP06/To-Do-Application.git'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withDockerRegistry([credentialsId: 'da1c5e9c-f3e3-464e-8173-2881078018a9', url: '']) {
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }
    }
}
}