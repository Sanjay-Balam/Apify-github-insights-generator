# Use official Apify SDK image with Node 20
FROM apify/actor-node:20

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for build)
RUN npm install

# Copy source code
COPY . ./

# Build TypeScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Run the Actor
CMD npm start

