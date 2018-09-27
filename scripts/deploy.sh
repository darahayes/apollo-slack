deployment="apollo-slack"
containerName="apollo-slack"
image="darahayes/apollo-slack"

kubectl set image deployment/$deployment $containerName=$image:$TAG
watch -n 1 kubectl get pods