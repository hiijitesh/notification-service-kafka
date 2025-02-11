# distribute-notification-service-kafka

> This file should include a description of your implementation, the design
> choices you made, and any known issues present at the time of submission.

-   ### [DOCUMENTATION](https://github.com/hiijitesh/notification-service-kafka/blob/main/DOC.md)
-   ### [SCALE](https://github.com/hiijitesh/notification-service-kafka/blob/main/Scale.md)
-   ### [FUTURE-SCOPE](https://github.com/hiijitesh/notification-service-kafka/blob/main/FUTURE%20SCOPE.md)

# Project setup

-   Clone repo
-   `npm i`
-   setup `.env` for Notification services

## .env setup

```bash
PORT =

ACCESS_TOKEN =
REFRESH_TOKEN=

MONGO_URI="mongodb://root:example@localhost:27017"

HOST_IP =
GOOGLE_MAIL_PASS =


TWILIO_SID =
TWILIO_AUTH_TOKEN =


ONE_SIGNAL_API_KEYS=
ONE_SIGNAL_APP_ID =

```

## Docker Setup

start docker compose

```
docker-compose up -d
```

Use KAFKA and Zookeeper

_Zookeeper_

```bash
docker run -p 2181:2181 zookeeper
```

_KAFAKA_

```bash
 docker run -p 9092:9092 \
 -e KAFKA_ZOOKEEPER_CONNECT=192.168.254.238:2181 \
 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.254.238:9092 \
 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
 confluentinc/cp-kafka

```

---

_Elastic Search_

```
docker run -d --name elasticsearch --net somenetwork -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node"
```

---

## Create Topic and Partitions via API

```
localhost:6100/v1/notification/topic
```

## Add Notifications via API

```
localhost:6100/v1/notification/notify
```

## Query data in elastic search via API

```

```

### JWT AUTH_TOKEN

```js
node;
require("crypto").randomBytes(48, function (err, buffer) {
    const token = buffer.toString("hex");
    console.log(token);
});
```
