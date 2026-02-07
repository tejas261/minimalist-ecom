pipeline {
    agent any

    environment {
        // --- Registry Config ---
        AWS_REGION     = "ap-south-1"
        AWS_CREDS      = "aws-creds-id" 
        ECR_REGISTRY   = "174706800587.dkr.ecr.ap-south-1.amazonaws.com/minimalist"
        IMAGE_NAME     = "minimalist"
        BRANCH_NAME    = "master"
        
        // --- Deployment Config ---
        SSH_CREDS      = "ssh-server-key"
        REMOTE_SERVER  = "ubuntu@ec2-13-232-231-20.ap-south-1.compute.amazonaws.com"
        
        // --- Next.js Env Variables ---
        // Build-time (Browser)
        DATABASE_URL="postgres://avnadmin:AVNS_TDyVDwNeBfmKbL28XmI@test-men-o.l.aivencloud.com:13957/defaultdb?sslmode=require"
NEXTAUTH_SECRET=minimalist-secret-key
RZP_KEY_ID=rzp_test_SApr8tgh5i3QWq
RZP_KEY_SECRET=jN5svF61mq7894Y8EXcSAqnl
NEXT_PUBLIC_API_URL="http://localhost:3000"
    }

    stages {
        stage('Checkout') {
            steps {
                sh "git checkout ${BRANCH_NAME}"
            }
        }

        stage('CI: Install & Lint') {
            steps {
                sh "npm install"
                sh "npm run lint"
            }
        }

        stage('Build & Push to ECR') {
            steps {
                script {
                    // Authenticate and Build
                    docker.withRegistry("https://${ECR_REGISTRY}", "ecr:${AWS_REGION}:${AWS_CREDS}") {
                        
                        // Passing NEXT_PUBLIC vars as --build-arg
                        def appImage = docker.build("${IMAGE_NAME}:${BUILD_NUMBER}", 
                            "--build-arg NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} .")
                        
                        appImage.push()
                        
                        // Tag 'latest' only if on main branch
                        if (env.BRANCH_NAME == 'main') {
                            appImage.push("latest")
                        }
                    }
                }
            }
        }

        stage('CD: Deploy to EC2') {
            when { branch 'main' }
            steps {
                sshagent([SSH_CREDS]) {
                    sh """
                        # 1. Login to ECR on remote server
                        ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"

                        # 2. Pull new image
                        ssh ${REMOTE_SERVER} "docker pull ${ECR_REGISTRY}/${IMAGE_NAME}:latest"

                        # 3. Stop old container and Run new one with Runtime Env Vars
                        ssh ${REMOTE_SERVER} "
                            docker stop ${IMAGE_NAME} || true && \
                            docker rm ${IMAGE_NAME} || true && \
                            docker run -d \
                                --name ${IMAGE_NAME} \
                                --restart always \
                                -p 3000:3000 \
                                -e DATABASE_URL='${DB_URL}' \
                                ${ECR_REGISTRY}/${IMAGE_NAME}:latest
                        "
                    """
                }
            }
        }

        stage('CD: Health Check') {
            when { branch 'main' }
            steps {
                script {
                    echo "Waiting for app to start..."
                    sleep 15
                    // Basic check if the port is responding
                    sh "curl -f http://your-ec2-ip:3000 || exit 1"
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check Jenkins logs for details."
        }
    }
}
