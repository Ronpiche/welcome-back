# hub-back

1. [Setup](#setup)

## Setup

To install this project, follow the steps below: 

1. clone

    git clone https://github.com/we-are-daveo/welcome-hub-back.git

2. install setup

    npm install

3. use the project on your machine

    You need to create a GCP account (see with a devOps).
    You need to initialize GCP. For that, you need to read this doc: https://github.com/we-are-daveo/welcome/blob/main/docs/GCP_deployment.md

    When GCP is initialized, use this command to start the project:
        npm run start:local

4. use the project on docker

    You must to download the service accounts keys to start the project on docker (see with a devOps).
    When you have the file, add it to the folder 'keyFileName' and started the command: 
        npm run docker:run:env