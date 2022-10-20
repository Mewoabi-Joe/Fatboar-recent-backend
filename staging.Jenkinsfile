pipeline{

    agent any


         environment {
           EMAIL_TO = 'XXXXX'
           imageName = "nexus.fatboar-burger.fr:8123/stagging-node-app"
           nexusServer = "nexus.fatboar-burger.fr:8123"
           serviceName= "stagging"
           sshOption= " -o StrictHostKeyChecking=no"
           serverIp= "amine@51.159.66.150"
           composeFile= "docker-compose-debug.yml"
           configPath="src/common/config.js"

         }
    tools {nodejs "nodeTool"}


    stages {

            stage("Code Checkout from GOGS") {

                          steps {
                            git branch: 'develop',
                            credentialsId: 'gogs-comp',
                            url: 'https://gogs.fatboar-burger.fr/DSP-O19/api-fatboar.git'
                          }

                    }
                         stage("replace variable") {

                                              steps {
                                              script{
                                                  sh 'cat $configPath'
                                                  sh  "sed -i 's/local/dev/gI' $configPath"
                                                  echo 'Content of config.json file after running sed command...'
                                                   sh 'cat $configPath'


                                                  }
                                              }

                                        }

          stage("Run Unit Test")
                {
                     steps {

                         nodejs(nodeJSInstallationName: 'nodeTool'){
                             script{
                                  echo "run test"

                             }


                             }
                     }
                 }


 
             stage('Code Quality Check via SonarQube')
            {
             steps {
                           script {

                               def scannerHome = tool  'sonarqube';

                                       withSonarQubeEnv("sonarqube-server")
                                       {
                                              sh "${tool("sonarqube")}/bin/sonar-scanner  \
                                              -Dsonar.projectKey=api-fatboar \
                                              -Dsonar.sources=. \
                                              -Dsonar.host.url=https://sonarqube.fatboar-burger.fr \
                                              -Dsonar.login=532fe6c590d068670908bda9de5f5c64c4dd4eb8"

                                           }

                                      }
                            }
            }

             stage("Build Dokcer Image")
             {
                  steps {

                 sh "docker build -t  $imageName:$BUILD_NUMBER  ."
                  }
             }

           stage('Push Docker Images to Nexus Registry')
           {
                steps {

                sh "docker push $imageName:$BUILD_NUMBER"


                }

            }
             stage('Remove Unused docker image') {
                  steps{
                    sh "docker rmi $imageName:$BUILD_NUMBER ||true"
                     sh "docker rmi $imageName:latest ||true"

                  }
                }

             stage("Deploy to docker swarm cluster"){
                  steps {

                    sshagent(['Docker_Swarm_Manager_Dev']) {



                              sh "ssh $sshOption $serverIp  docker rmi -f  $imageName:* ||true"
                              sh 'ssh $sshOption  $serverIp  docker stack rm $serviceName || true'
                              sh 'ssh $sshOption $serverIp docker system prune -f || true'
                              sh 'scp $sshOption  $composeFile $serverIp: '
                              sh "ssh $sshOption  $serverIp  docker pull  $imageName:$BUILD_NUMBER"
                              sh "ssh $sshOption  $serverIp  env VERSION=$BUILD_NUMBER IMAGE=$imageName docker stack deploy --prune --compose-file $composeFile $serviceName "


                    }
                  }
                }
  
             stage ("wait_for_deploy")
             {
              steps {
                     script {
                          sh 'sleep 90'
                          }
                     }
             }
             stage("Using curl to get status code") {
                 steps {
                     script {
                         final String url = "https://staging-api.fatboar.fr/status"

                             final def (String response, int code) =
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

      stage("Run Jmeter Test")
                {
                     steps {
                   build job: 'staging-api-jmeter', parameters: [string(name: 'Thread', value: '1'), string(name: 'RampUp', value: '5')]

                     }
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
