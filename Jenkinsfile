pipeline {
  agent any

  environment {
    IMAGE_NAME = "tsai0120/lsap-cicd-example-app"
    DEV_CONTAINER = "dev-app"
    DEV_PORT = "8081"
  }

  stages {

    stage('Lint') {
      steps {
        script {
          try {
            sh 'npm run lint'
          } catch (err) {
            withCredentials([string(credentialsId: 'discord-webhook', variable: 'DISCORD_WEBHOOK')]) {
              sh '''
                curl -H "Content-Type: application/json" \
                -X POST \
                -d "{
                  \\"username\\": \\"Jenkins CI\\",
                  \\"content\\": \\"❌ Build FAILED (Lint)\\n\
                  📦 Job: ${JOB_NAME}\\n\
                  🌿 Branch: ${BRANCH_NAME}\\n\
                  🔢 Build: #${BUILD_NUMBER}\\n\
                  🔗 URL: ${BUILD_URL}\\"
                }" \
                $DISCORD_WEBHOOK
              '''
            }
            error "Lint failed"
          }
        }
      }
    }


    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build & Deploy (Dev)') {
      when {
        branch 'dev'
      }
      steps {
        sh '''
          echo "Building Docker image..."
          docker build -t $IMAGE_NAME:dev-${BUILD_NUMBER} .

          echo "Stopping old dev container if exists..."
          docker rm -f $DEV_CONTAINER || true

          echo "Running new dev container..."
          docker run -d \
            --name $DEV_CONTAINER \
            -p $DEV_PORT:3000 \
            $IMAGE_NAME:dev-${BUILD_NUMBER}

          echo "Waiting for service to be ready..."
          sleep 5

          echo "Health check..."
          curl -f http://localhost:$DEV_PORT || exit 1
        '''
      }
    }
    stage('Deploy (Production)') {
      when {
        branch 'main'
      }
      environment {
        PROD_CONTAINER = "prod-app"
        PROD_PORT = "8082"
      }
      steps {
        sh '''
          echo "Reading deploy.config..."
          TARGET_TAG=$(cat deploy.config)
          echo "Target image tag: $TARGET_TAG"

          echo "Tagging production image..."
          docker tag $IMAGE_NAME:$TARGET_TAG $IMAGE_NAME:prod-${BUILD_NUMBER}

          echo "Stopping old prod container if exists..."
          docker rm -f $PROD_CONTAINER || true

          echo "Running new prod container..."
          docker run -d \
            --name $PROD_CONTAINER \
            -p $PROD_PORT:3000 \
            $IMAGE_NAME:prod-${BUILD_NUMBER}

          echo "Waiting for production service..."
          sleep 15

          echo "Production health check..."
          curl -f http://localhost:$PROD_PORT || exit 1
        '''
      }
    }

  }

}

