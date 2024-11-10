# Navigate to the frontend directory, install dependencies, and build
cd frontend
npm install
npm run build

# Move the build directory to the backend
cd ..
rm -rf backend/build  
mv frontend/build backend/

# Navigate to the backend directory
cd backend

# Initialize Git if it’s not already initialized
if [ ! -d ".git" ]; then
  git init
fi

# Add Heroku as a Git remote if it’s not already added
heroku_remote=$(git remote | grep heroku)
if [ -z "$heroku_remote" ]; then
  # Use your Heroku app name here
  heroku git:remote -a project-3-01-beastmode
fi

# Add changes, commit, and push to Heroku
git add .
git commit -m "Deploying with new frontend build"
git push heroku master
