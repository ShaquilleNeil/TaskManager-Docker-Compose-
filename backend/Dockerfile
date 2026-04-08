FROM node:20
# set the working directory inside the container, all commands below run from here

WORKDIR /app
# copy package.json and package-lock.json first
# we do this before copying the rest of the code so Docker can cache the npm install step
# if your code changes but dependencies don't, Docker skips reinstalling them
COPY package*.json ./
RUN npm install
# Copy the rest of the application code to the container
COPY . . 

# Mkdir command for creating the data directory inside the container, and the -p flag ensures that it doesn't throw an error if the directory already exists.
RUN mkdir -p /app/data 

# Expose the port that the backend server will run on
EXPOSE 4000
#Start the backend server
CMD ["node", "index.js"]