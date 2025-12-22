pipeline {
  agent any

  environment {
    IMAGE_NAME = "tsai0120/myapp"
    DEV_CONTAINER = "dev-app"
    DEV_PORT = "8081"
    DOCKER_USER = credentials('dockerhub-creds').username
    DOCKER_PASS = credentials('dockerhub-creds').password
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
        script {
          // 🔹 1. 讀 package.json 的 version
          def version = sh(
            script: "node -p \"require('./package.json').version\"",
            returnStdout: true
          ).trim()

          echo "Semantic version: v${version}"

          // 🔹 2. Docker build（兩個 tag）
          sh """
            docker build \
              -t ${IMAGE_NAME}:dev-${BUILD_NUMBER} \
              -t ${IMAGE_NAME}:v${version} \
              .
          """

          // 🔹 3. Push 到 Docker Hub
          withCredentials([
            usernamePassword(
              credentialsId: 'dockerhub',
              usernameVariable: 'DOCKER_USER',
              passwordVariable: 'DOCKER_PASS'
            )
          ]) {
            sh """
              echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
              docker push ${IMAGE_NAME}:dev-${BUILD_NUMBER}
              docker push ${IMAGE_NAME}:v${version}
            """
          }

          // 🔹 4. 部署 dev container
          sh """
            docker rm -f ${DEV_CONTAINER} || true
            docker run -d \
              --name ${DEV_CONTAINER} \
              -p ${DEV_PORT}:3000 \
              ${IMAGE_NAME}:dev-${BUILD_NUMBER}
          """
        }
      }
    }
  }
}
