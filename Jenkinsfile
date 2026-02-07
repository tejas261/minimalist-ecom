pipeline {
    agent any

    environment {
        // --- Registry Config ---
        AWS_REGION     = "ap-south-1"
        AWS_CREDS      = "aws-creds-id" 
        ECR_REGISTRY   = "174706800587.dkr.ecr.ap-south-1.amazonaws.com"
        IMAGE_NAME     = "minimalist"
        BRANCH_NAME    = "master"
        NEXT_PUBLIC_API_URL = credentials('NEXT_PUBLIC_API_URL') 
        
        // --- Deployment Config ---
        SSH_CREDS      = "ssh-server-key"
        REMOTE_SERVER  = "ubuntu@ec2-13-232-231-20.ap-south-1.compute.amazonaws.com"
    }

    stages {
        // Removed the manual 'Checkout' stage here, Jenkins does it automatically.

        stage('CI: Install & Lint') {
            steps {
                sh "npm install --legacy-peer-deps"
            }
        }

        stage('Build & Push to ECR') {
            steps {
                script {
                    // Authenticate and Build using IAM Role or AWS Credentials defined above
                    docker.withRegistry("https://${ECR_REGISTRY}", "ecr:${AWS_REGION}:${AWS_CREDS}") {
                        
                        // Passing NEXT_PUBLIC vars as --build-arg
                        def appImage = docker.build("${IMAGE_NAME}:${BUILD_NUMBER}", 
                            "--build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} .")
                        
                        appImage.push()
                        
                        // Tag 'latest' only if on master branch
                        if (env.BRANCH_NAME == 'master') {
                            appImage.push("latest")
                        }

                        sh "docker image prune -f"
                    }
                }
            }
        }

stage('CD: Deploy to EC2') {
  when { branch 'master' }
  steps {
    withCredentials([
      string(credentialsId: 'DATABASE_URL', variable: 'DATABASE_URL'),
      string(credentialsId: 'NEXTAUTH_SECRET', variable: 'NEXTAUTH_SECRET'),
      string(credentialsId: 'RZP_KEY_ID', variable: 'RZP_KEY_ID'),
      string(credentialsId: 'RZP_KEY_SECRET', variable: 'RZP_KEY_SECRET')
    ]) {
      sshagent([SSH_CREDS]) {
        sh '''#!/bin/bash -e
          # ECR login: generate password locally, send to remote docker login
          aws ecr get-login-password --region "$AWS_REGION" \
            | ssh -o StrictHostKeyChecking=no "$REMOTE_SERVER" \
              "docker login --username AWS --password-stdin $ECR_REGISTRY"

          # Deploy on remote, pass secrets as env vars (no Groovy interpolation)
          ssh -o StrictHostKeyChecking=no \
            DATABASE_URL="$DATABASE_URL" \
            NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
            RZP_KEY_ID="$RZP_KEY_ID" \
            RZP_KEY_SECRET="$RZP_KEY_SECRET" \
            "$REMOTE_SERVER" 'bash -se' <<'REMOTE'
              set -e

              docker pull '"$ECR_REGISTRY"'/'"$IMAGE_NAME"':latest

              docker stop '"$IMAGE_NAME"' || true
              docker rm '"$IMAGE_NAME"' || true

              docker run -d \
                --name '"$IMAGE_NAME"' \
                --restart always \
                -p 3000:3000 \
                -e DATABASE_URL="$DATABASE_URL" \
                -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
                -e RZP_KEY_ID="$RZP_KEY_ID" \
                -e RZP_KEY_SECRET="$RZP_KEY_SECRET" \
                '"$ECR_REGISTRY"'/'"$IMAGE_NAME"':latest
REMOTE
        '''
      }
    }
  }
}

        stage('CD: Health Check') {
            when { branch 'master' }
            steps {
                script {
                    echo "Waiting for app to start..."
                    sleep 15
                    // Basic check if the port is responding
                    sh "curl -f http://13.232.231.20:3000 || exit 1"
                }
            }
        }
    }

    post {
        always {
            sh 'docker system prune -f'
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check Jenkins logs for details."
        }
    }
}
