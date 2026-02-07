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

        stage('Precheck: AWS creds') {
            steps {
                withCredentials([[
                $class: 'AmazonWebServicesCredentialsBinding',
                credentialsId: 'aws-creds-id',
                accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                sh '''
                    set -e
                    aws sts get-caller-identity
                '''
                }
            }
    }

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
      [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-creds-id', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'],
      string(credentialsId: 'DATABASE_URL', variable: 'DB_URL'),
      string(credentialsId: 'NEXTAUTH_SECRET', variable: 'NEXT_SEC'),
      string(credentialsId: 'RZP_KEY_ID', variable: 'RZP_ID'),
      string(credentialsId: 'RZP_KEY_SECRET', variable: 'RZP_SEC')
    ]) {
      sshagent([SSH_CREDS]) {
        sh """
        # 1) Login EC2 to ECR
        aws ecr get-login-password --region ${AWS_REGION} | ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} "docker login --username AWS --password-stdin ${ECR_REGISTRY}"

        # 2) Deploy using double-quoted string to allow Jenkins variable expansion
        ssh -o StrictHostKeyChecking=no ${REMOTE_SERVER} <<REMOTE
            set -e
            # Pull the image using Jenkins variables
            docker pull ${ECR_REGISTRY}/${IMAGE_NAME}:latest

            # Stop and remove old container
            docker stop ${IMAGE_NAME} || true
            docker rm ${IMAGE_NAME} || true

            # Run new container with credentials passed from Jenkins
            docker run -d \
              --name ${IMAGE_NAME} \
              --restart always \
              -p 3000:3000 \
              -e DATABASE_URL="${DB_URL}" \
              -e NEXTAUTH_SECRET="${NEXT_SEC}" \
              -e RZP_KEY_ID="${RZP_ID}" \
              -e RZP_KEY_SECRET="${RZP_SEC}" \
              ${ECR_REGISTRY}/${IMAGE_NAME}:latest
REMOTE
        """
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
