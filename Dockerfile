FROM node:8-alpine

RUN apk add --update --no-cache git \
                                libzmq \
                                zeromq-dev \
                                python \
                                make \
                                g++

WORKDIR /insight

# Copy axecore-node
RUN git clone --branch master --single-branch --depth 1 https://github.com/axerunners/axecore-node.git /insight

# Copy config file
COPY axecore-node.json /insight/axecore-node.json

# Install NPM modules
RUN npm ci

ARG VERSION
ARG MAJOR_VERSION

# Install Insight modules
RUN /insight/bin/axecore-node install @axerunners/insight-api@${MAJOR_VERSION}
RUN /insight/bin/axecore-node install @axerunners/insight-ui@${VERSION}

FROM node:8-alpine

LABEL maintainer="AXErunners <info@axerunners.com>"
LABEL description="Dockerized Insight-AXE"

COPY --from=0 /insight /

EXPOSE 3001

CMD ["/insight/bin/axecore-node", "start"]
