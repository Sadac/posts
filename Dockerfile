# specify the base image
FROM node:alpine

# Set the working directory to /app in the container
# All following commands will be issued relative to this dir
WORKDIR /app

# Copy the package.json to the WORKDIR
COPY package.json ./

# Run the commands that follow
RUN npm install

# Copy over all of our remaining source code to the container
# local -> container
COPY ./ ./

# Set the command to run when the container starts up
CMD ["npm", "start"]






