pipeline {
  agent any

  environment {
    IMAGE_NAME = "tsai0120/myapp"
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
        script {
          // 1️⃣ 讀 semantic version
          def version = sh(
            script: "node -p \"require('./package.json').version\"",
            returnStdout: true
          ).trim()

          echo "Semantic version: v${version}"

          // 2️⃣ build image（兩個 tag）
          sh """
            docker build \
              -t ${IMAGE_NAME}:dev-${BUILD_NUMBER} \
              -t ${IMAGE_NAME}:v${version} \
              .
          """

          // 3️⃣ login + push（一定要用 withCredentials）
          withCredentials([
            usernamePassword(
              credentialsId: 'dockerhub-creds',
              usernameVariable: 'DOCKER_USER',
              passwordVariable: 'DOCKER_PASS'
            )
          ]) {
            sh """
              echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
              docker push ${IMAGE_NAME}:dev-${BUILD_NUMBER}
              docker push ${IMAGE_NAME}:v${version}
            """
          }

          // 4️⃣ deploy dev
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
