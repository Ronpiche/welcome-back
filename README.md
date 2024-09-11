# hub-back

## Description

This is the backend of the Welcome application, that allows new collabotator to gather information about the company by step. Those steps are unlocked over time as the arrival of the new collabotator get closer.

## Setup

To install this project, follow the steps below: 

1. Clone the repository

    ```sh
    git clone https://github.com/we-are-daveo/welcome-hub-back.git
    ```

2. Install dependencies

    ```sh
    npm install
    ```

3. Setup environment variables

    A `.env` file is used to set environment variables. You can copy `.env.example` as a base.

    ```sh
    cp .env.example .env
    ```

    Then, edit the `.env` file to your needs.

4. GCP service account

    You need to initialize GCP. For that, you need to read this doc: https://github.com/we-are-daveo/welcome/blob/main/docs/GCP_deployment.md

    You must to go to the stage 'Authenticate application default', and to have the rights for start this app with GCP (see with a devOps).

5. Run the project

    1. Local

        ```sh
        npm run start:dev
        ```

    2. Docker

        You must to add the secret in ./configs/docker/docker-compose.yaml to start docker (see with a devOps for the secrets on GCP).

        > [!CAUTION]
        > docker with docker-compose, start the all environments (front & back). If you want start the back only, comment the services (hub-front & app-front)

        ```sh
        npm run docker:run:env
        ````

## In depth

### Email system

The email system works in this way:
- If the collaborator is created far before his arrival, we only notify him during the last few months before his arrival.
- If the collaborator is created a few months before his arrival, we notify him regulary.
- If the collaborator is created a few weeks/days before his arrival, we notify him one time for all.

```mermaid
gantt
    title Email system
    dateFormat YYYY-MM-DD
    section Case x > 90 days
        Creation :milestone, ma1, 2024-01-01, 0
        No step  :done, a0, after ma1, until a1
        Step 1   :a1, 2024-03-01, 1M
        Step 2   :a2, 2024-04-01, 1M
        Step 3   :a3, 2024-05-01, 1M
        Arrival  :milestone, ma2, 2024-06-01, 0
    section Case 30 days <= x <= 90 days
        Creation :milestone, mb1, 2024-03-18, 0
        Step 1   :b1, after mb1, 25d
        Step 2   :b2, after b1, 25d
        Step 3   :b3, after b2, 25d
        Arrival  :milestone, mb2, 2024-06-01, 0
    section Case x < 30 days
        Creation :milestone, mc1, 2024-05-07, 0
        Step 1   :c1, after mc1, until mc2
        Step 2   :c2, after mc1, until mc2
        Step 3   :c3, after mc1, until mc2
        Arrival  :milestone, mc2, 2024-06-01, 0
```

## <a name="misc-commands">✨ Misc commands</a>

### 🔀 Create git branch with a conventional name
```shell
npm run script:create-git-branch
```

### ⤴️ Create pull request against the `develop` branch from current branch
```shell
npm run script:create-pull-request
```
