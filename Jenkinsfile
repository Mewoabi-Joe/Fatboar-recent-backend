pipeline {

  agent any

  environment {
    EMAIL_TO = ' XXXX';
    imageName = "nexus.fatboar-burger.fr:8123/node-app"
    nexusServer = "nexus.fatboar-burger.fr:8123"
    serviceName = "prod"
    sshOption = " -o StrictHostKeyChecking=no"
    serverIp = "amine@51.159.34.243"
    composeFile = "docker-compose.prod.yml"
    configPath = "src/common/config.js"
    prodExternalUrl = "https://fatboar.fr"
    stagingExternalUrl = "https://staging.fatboar.fr"
    imageNameStaging = "nexus.fatboar-burger.fr:8123/stagging-node-app"
    imageNameForestStaging = "nexus.fatboar-burger.fr:8123/forest-dev"
    imageNameForestProd = "nexus.fatboar-burger.fr:8123/forest"
    forestDockerFileStaging = "./src/microservices/forest/Dockerfile"
    forestDockerFileProd = "./src/microservices/forest/Dockerfile.prod"
    serviceNameStaging = "stagging"
    composeFileStaging = "docker-compose-debug.yml"

  }
  tools {
    nodejs "nodeTool"
  }
  options {
    buildDiscarder logRotator(
      daysToKeepStr: '16',
      numToKeepStr: '10'
    )

  }
  triggers {
    githubPush()
  }

  stages {

    stage("replace variable in production") {
      when {
        expression {
          return env.GIT_BRANCH ==  "master"
        }
      }
      steps {
        script {
          sh 'cat $configPath'
          sh "sed -i 's/dev/prod/gI' $configPath"
          sh "sed -i 's+$stagingExternalUrl+$prodExternalUrl+gI' $configPath"
          echo 'Content of config.json file after running sed command...'
          sh 'cat $configPath'

        }
      }

    }

    stage("Run Unit Test") {
      steps {

        nodejs(nodeJSInstallationName: 'nodeTool') {
          script {
            echo "run test"

          }

        }
      }
    }

   stage('Code Quality Check via SonarQube') {
      steps {
        script {

                               def scannerHome = tool  'sonarqube';

                                       withSonarQubeEnv("sonarqube-server")
                                       {
                                              sh "${tool("sonarqube")}/bin/sonar-scanner  \
                                              -Dsonar.projectKey=api-fatboar \
                                              -Dsonar.sources=. \
                                              -Dsonar.host.url=https://sonarqube.fatboar-burger.fr \
                                              -Dsonar.login=ca4df5f8bf666dc9fe3aa61d5781c569132ba6ea"

                                           }

                                      }
      }
    }
    stage("Build Dokcer Image in production") {
      when {
        expression {
          return env.GIT_BRANCH ==  "master" 
        }
      }
      steps {

        sh "docker build -t  $imageName:$BUILD_NUMBER   ."
        sh "docker build . -t  $imageNameForestProd:$BUILD_NUMBER  -f $forestDockerFileProd"
      }
    }
    stage("Build Dokcer Image in staging") {
      when {
        expression {
          return env.GIT_BRANCH == "develop"
        }
      }
      steps {

        sh "docker build -t  $imageNameStaging:$BUILD_NUMBER   ."
        sh "docker build . -t  $imageNameForestStaging:$BUILD_NUMBER  -f $forestDockerFileStaging"
      }
    }

    stage('Push Docker Images to Nexus Registry in production') {
      when {
        expression {
          return env.GIT_BRANCH ==  "master"
        }
      }
      steps {
        sh "docker push  $imageName:$BUILD_NUMBER"
        sh "docker push  $imageNameForestProd:$BUILD_NUMBER"

      }
    }
    stage('Push Docker Images to Nexus Registry  in staging') {
      when {
        expression {
          return env.GIT_BRANCH == "develop"
        }
      }
      steps {
        sh "docker push  $imageNameStaging:$BUILD_NUMBER"
        sh "docker push  $imageNameForestStaging:$BUILD_NUMBER"

      }
    }

    stage('Remove Unused docker image in production') {
      when {
        expression {
          return env.GIT_BRANCH ==  "master"
        }
      }
      steps {
        sh "docker rmi $imageName:$BUILD_NUMBER ||true"
        sh "docker rmi $imageNameForestProd:$BUILD_NUMBER ||true"
        sh "docker system prune -f || true"

      }
    }
    stage('Remove Unused docker image in staging') {
      when {
        expression {
          return env.GIT_BRANCH == "develop"
        }
      }
      steps {
        sh "docker rmi $imageNameStaging:$BUILD_NUMBER ||true"
        sh "docker rmi $imageNameForestStaging:$BUILD_NUMBER ||true"
        sh "docker system prune -f || true"

      }
    }
    stage("Deploy to docker swarm cluster in production") {
      when {
        expression {
          return env.GIT_BRANCH ==  "master"
        }
      }
      steps {

        sshagent(['Docker_Swarm_Manager_Dev']) {
          sh "ssh $sshOption $serverIp  docker rmi -f  $imageName:* ||true"
          sh 'ssh $sshOption  $serverIp  docker stack rm $serviceName || true'
          sh 'scp $sshOption  $composeFile $serverIp: '
          sh "ssh $sshOption  $serverIp  docker pull  $imageName:$BUILD_NUMBER"
          sh "ssh $sshOption  $serverIp  docker pull  $imageNameForestProd:$BUILD_NUMBER"
          sh "ssh $sshOption  $serverIp  env VERSION=$BUILD_NUMBER IMAGE=$imageName Forest_IMAGE=$imageNameForestProd  docker stack deploy --prune --compose-file $composeFile $serviceName "
          sh 'ssh $sshOption $serverIp docker system prune -f || true'

        }
      }
    }
    stage("Deploy to docker swarm cluster in staging") {
      when {
        expression {
          return env.GIT_BRANCH == "develop"
        }
      }
      steps {

        sshagent(['Docker_Swarm_Manager_Dev']) {
          sh "ssh $sshOption $serverIp  docker rmi -f  $imageNameStaging:* ||true"
          sh 'ssh $sshOption  $serverIp  docker stack rm $serviceNameStaging || true'
          sh 'scp $sshOption  $composeFileStaging $serverIp: '
          sh "ssh $sshOption  $serverIp  docker pull  $imageNameStaging:$BUILD_NUMBER"
          sh "ssh $sshOption  $serverIp  docker pull  $imageNameForestStaging:$BUILD_NUMBER"
          sh "ssh $sshOption  $serverIp  env VERSION=$BUILD_NUMBER IMAGE=$imageNameStaging Forest_IMAGE=$imageNameForestStaging  docker stack deploy --prune --compose-file $composeFileStaging $serviceNameStaging "
          sh 'ssh $sshOption $serverIp docker system prune -f || true'
        }
      }
    }

    stage("wait_for_deploy") {
      steps {
        script {
          sh 'sleep 90'
        }
      }
    }
    stage("Using curl to get status code in production") {
      when {
        expression {
          return env.GIT_BRANCH ==  "master"
        }
      }
      steps {
        script {
          final String url = "https://api.fatboar.fr/status"

          final def(String response, int code) =
            sh(script: "curl -s -w '\\n%{response_code}' $url", returnStdout: true)
            .trim()
            .tokenize("\n")

          echo "HTTP response status code: $code"

          if (code == 200) {
            echo response
          }

        }
      }
    }
    stage("Using curl to get status code in staging") {
      when {
        expression {
          return env.GIT_BRANCH == "develop"
        }
      }
      steps {
        script {
          final String url = "https://staging-api.fatboar.fr/status"

          final def(String response, int code) =
            sh(script: "curl -s -w '\\n%{response_code}' $url", returnStdout: true)
            .trim()
            .tokenize("\n")

          echo "HTTP response status code: $code"

          if (code == 200) {
            echo response
          }

        }
      }
    }
     stage("Run Jmeter Test in production") {
        when {
          expression {
            return env.GIT_BRANCH ==  "master"
          }
        }
        steps {
          build job: 'fatboar-backEnd-jemeter', parameters: [string(name: 'thread', value: '1'), string(name: 'rampup', value: '5'), string(name: 'iterations', value: '1')]


        }
      }
      stage("Run Jmeter Test in staging") {
        when {
          expression {
            return env.GIT_BRANCH == "develop"
          }
        }
        steps {
          build job: 'fatboar-backEnd-stagging-jemeter', parameters: [string(name: 'thread', value: '1'), string(name: 'rampup', value: '5'), string(name: 'iterations', value: '1')]

        }
      }
    /**   post {
            failure {
                mail to: "${EMAIL_TO}",
                     subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                     body: "Something is wrong with ${env.BUILD_URL}"
            }
        }**/

  }

}