FROM electronuserland/builder

WORKDIR /home/panwriter

COPY ./ ./
# And prepare
RUN yarn \
 && yarn install

# Remove src and electron
# they should be bound to the host directories
# see docker-compose.yaml
RUN rm -rf src electron
