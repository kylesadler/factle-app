# factle-app

Boilerplate code for starter website

## Testing Environment

1. Install the JS package manager `npm`.
2. From the main directory, run `npm i` to install dependencies.
3. Run `npm run build` to build the frontend (use `npm run build-debug` to build with debugging). You'll need to run this everytime you make changes to the frontend.
4. Run `npm start` to start the server on `localhost:8080`.

# Deployment

Build and push image to docker repo. https://www.docker.com/wp-content/uploads/2022/03/docker-cheat-sheet.pdf.

Deploy on GKE

https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs?cloudshell=false#creating_an_ingress_with_a_google-managed_certificate
https://cloud.google.com/kubernetes-engine/docs/concepts/ingress-xlb#overview
https://stackoverflow.com/questions/71055858/cipher-mismatch-error-while-trying-to-access-an-app-deployed-in-gke-as-https-ing
https://cloud.google.com/kubernetes-engine/docs/troubleshooting#ConnectivityIssues
