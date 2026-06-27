pipeline {

    agent any

    tools {
        jdk 'JDK21'
        maven 'Maven3'
    }

    environment {
        BACKEND_IMAGE = "rohith733844/learning-backend"
        FRONTEND_IMAGE = "rohith733844/learning-frontend"
    }

    stages {

        stage('Build Backend') {
            steps {
                dir('learning') {
                    bat 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('learning') {
                    bat 'mvn test'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Online-learning') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    bat '''
                    echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                    '''
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('learning') {
                    bat 'docker build -t %BACKEND_IMAGE%:latest .'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('Online-learning') {
                    bat 'docker build -t %FRONTEND_IMAGE%:latest .'
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                bat 'docker push %BACKEND_IMAGE%:latest'
            }
        }

        stage('Push Frontend Image') {
            steps {
                bat 'docker push %FRONTEND_IMAGE%:latest'
            }
        }

        stage('Deploy Backend') {
            steps {
                bat '''
                docker stop learning-backend
                if %ERRORLEVEL% NEQ 0 exit /b 0

                docker rm learning-backend
                if %ERRORLEVEL% NEQ 0 exit /b 0

                docker run -d ^
                --name learning-backend ^
                -p 8080:8080 ^
                %BACKEND_IMAGE%:latest
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                bat '''
                docker stop learning-frontend
                if %ERRORLEVEL% NEQ 0 exit /b 0

                docker rm learning-frontend
                if %ERRORLEVEL% NEQ 0 exit /b 0

                docker run -d ^
                --name learning-frontend ^
                -p 3000:80 ^
                %FRONTEND_IMAGE%:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed.'
        }

        always {
            cleanWs()
        }
    }
}