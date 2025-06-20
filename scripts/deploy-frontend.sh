#! /bin/bash
# This script is used to deploy new versions of the frontend

set -e

CLUSTER=$1

if [[ "$CLUSTER" == "stag" ]]; then
    CLUSTER="smith"
elif [[ "$CLUSTER" == "prod" ]]; then
    CLUSTER="kevin"
fi

if [[ "$CLUSTER" != "smith" && "$CLUSTER" != "kevin" ]]; then
    echo "unknown cluster: $CLUSTER"
    echo "usage: ./deploy-frontend.sh [stag|prod]"
    exit 1
fi

DIR="/Users/alextes/code/ultra-sound/frontend"
cd "$DIR"

if [ -n "$(git status --untracked-files=no --porcelain)" ]; then
    echo "frontend repo is dirty, please commit changes before deploying"
    exit 1
fi

CURRENT_COMMIT=$(git rev-parse --short=7 HEAD)

echo "-> deploying frontend - $CURRENT_COMMIT to $CLUSTER"
echo "-> pushing latest code to github"
git push

echo "-> checking for CI success"
sleep 6

# hub ci-status exits our program without set +e
(
    set +e
    while [[ $(hub ci-status $CURRENT_COMMIT) == "pending" ]]; do
        echo "-> CI status: pending, trying again in 16 seconds"
        sleep 16
    done
    
    CI_STATUS=$(hub ci-status $CURRENT_COMMIT)

    if [[ $CI_STATUS == "failure" ]]; then
        echo "-> CI failure detected for commit $CURRENT_COMMIT"
        exit 1
    elif [[ $CI_STATUS == "no status" ]]; then
        read -p "-> no CI status available for commit $CURRENT_COMMIT. continue deployment? (y/n): " CONTINUE
        if [[ $CONTINUE != "y" ]]; then
            echo "-> aborting deployment"
            exit 1
        fi
    fi
)

echo "-> CI success, continuing with deploy"

# Update serve-frontend deployment
echo "-> switching kubectl context to $CLUSTER"
kubectl config use-context $CLUSTER

echo "-> updating serve-frontend deployment with commit $CURRENT_COMMIT"
kubectl set image deployment/serve-frontend serve-frontend=ultrasoundorg/ultrasoundmoney-frontend:$CURRENT_COMMIT

# Update web-infra yaml
if [[ "$CLUSTER" == "smith" || "$CLUSTER" == "kevin" ]]; then
    # Update web-infra yaml
    cd ~/code/ultra-sound/web-infra
    git diff-files --quiet || IS_DIRTY=1

    if [ "$IS_DIRTY" == "1" ]; then
        echo "-> web-infra repo is dirty, please commit changes before deploying"
        exit 1
    fi

    # Ensure we are on the main branch
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [[ "$CURRENT_BRANCH" != "main" ]]; then
        echo "-> web-infra repo is not on main branch, switching to main"
        git checkout main
        if [ $? -ne 0 ]; then
            echo "-> Failed to switch to main branch. Please resolve any issues and try again."
            exit 1
        fi
    fi

    echo "-> pulling latest web-infra changes from github"
    git pull --quiet

    if [[ "$CLUSTER" == "smith" ]]; then
        echo "-> updating base/serve-frontend.yaml image with commit $CURRENT_COMMIT"
        DEPLOY_FILE="/Users/alextes/code/ultra-sound/web-infra/base/serve-frontend.yaml"
        sed -i '' "s|ultrasoundorg/ultrasoundmoney-frontend:[a-f0-9]\{7,40\}[-a-zA-Z0-9_]*|ultrasoundorg/ultrasoundmoney-frontend:$CURRENT_COMMIT|" $DEPLOY_FILE
        git add $DEPLOY_FILE
        git commit -m "chore(frontend): update base image to $CURRENT_COMMIT"
    elif [[ "$CLUSTER" == "kevin" ]]; then
        echo "-> updating overlays/prod/kustomization.yaml image with commit $CURRENT_COMMIT"
        PROD_DEPLOY_FILE="/Users/alextes/code/ultra-sound/web-infra/overlays/prod/kustomize.yaml"
        # Use a sed script to be safe
        sed_script="
/name: ultrasoundorg\/ultrasoundmoney-frontend/ {
  :a
  n
  /newTag:/ {
    s/newTag: .*/newTag: $CURRENT_COMMIT/
  }
  ba
}
"
        sed -i '' -e "$sed_script" "$PROD_DEPLOY_FILE"
        git add "$PROD_DEPLOY_FILE"
        git commit -m "chore(frontend): update prod image to $CURRENT_COMMIT"
    fi

    echo "-> pushing web-infra changes to github"
    git push --quiet
fi

osascript -e "display notification \"deployed frontend to $CLUSTER\"" 
