FROM ubuntu:22.04

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json", "./"]

RUN apt-get update && \
	apt-get install -y gnupg curl && \
	curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
	gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
	--dearmor && \
	echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
	apt-get update && \
	apt-get install -y mongodb-org

RUN npm install && mv node_modules ../

COPY . .

EXPOSE 3000

RUN chown -R node /usr/src/app

USER node

CMD ["node", "server.js"]
