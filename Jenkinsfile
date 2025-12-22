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
        sh 'npm run lint'
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
  }
}
