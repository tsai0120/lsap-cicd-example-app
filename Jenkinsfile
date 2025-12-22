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
JOB_NAME_ESC="$JOB_NAME"
BUILD_NUM_ESC="$BUILD_NUMBER"
BRANCH_ESC="$BRANCH_NAME"
GIT_URL_ESC="$GIT_URL"
BUILD_URL_ESC="$BUILD_URL"

cat <<EOF > payload.json
{
  "username": "Jenkins CI",
  "content": "❌ **Build FAILED**\\n\\n\
👤 Name: 林采穎\\n\
🆔 Student ID: B13705007\\n\
📦 Job Name: ${JOB_NAME_ESC}\\n\
🔢 Build Number: #${BUILD_NUM_ESC}\\n\
🌿 Branch: ${BRANCH_ESC}\\n\
📂 GitHub Repo: ${GIT_URL_ESC}\\n\
📊 Status: FAILURE\\n\
🔗 Build URL: ${BUILD_URL_ESC}"
}
EOF

curl -H "Content-Type: application/json" \
     -X POST \
     -d @payload.json \
     "$DISCORD_WEBHOOK"
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

