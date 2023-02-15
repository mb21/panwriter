FROM debian

WORKDIR /home/panwriter

RUN apt-get update -y \
 && apt-get install -y \
    git \
    curl \
    gnupg2 \
;
# We seem to require the newest nodejs
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
# Also a newer yarn is required
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
 && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
# Install it
RUN apt-get update -y  \
 && apt-get install -y \
    yarn

COPY ./ ./
# And prepare
RUN yarn \
 && yarn install

# Remove src and electron
# they should be bound to the host directories
# see docker-compose.yaml
RUN rm -rf src electron
