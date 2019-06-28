FROM node:8-alpine

RUN apk add --update --no-cache git \
                                libzmq \
                                zeromq-dev \
                                python \
                                make \
                                g++

WORKDIR /insight

# Copy axecore-node
RUN git clone --branch master --single-branch --depth 1 https://github.com/axerunners/axecore-node.git .

# Copy config file
COPY axecore-node.json .

# Install NPM modules
RUN npm ci

ARG VERSION
ARG MAJOR_VERSION

# Install Insight modules
RUN bin/axecore-node install @axerunners/insight-api@${MAJOR_VERSION}
RUN bin/axecore-node install @axerunners/insight-ui@${VERSION}

FROM node:8-alpine

LABEL maintainer="Axe Developers <dev@axe.org>"
LABEL description="Dockerised Insight-Axe"

WORKDIR /insight

# Copy project files
COPY --from=0 /insight/ .

EXPOSE 3001

CMD ["bin/axecore-node", "start"]
