pipeline {
    agent any

    // 這裡的名稱 'NodeJS-24-LTS' 必須與您在 Jenkins -> Global Tool Configuration 中配置的一致
    tools {
        nodejs 'NodeJS-24-LTS' 
    }

    stages {
        stage('Build & Test Prep') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install' 
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test' 
            }
        }
    }
}
