# distribute-notification-service-kafka

> This file should include a description of your implementation, the design
> choices you made, and any known issues present at the time of submission.

# Project setup

-   Clone repo
-   `npm i`
-   setup `.env` for Notification services

## .env setup

```bash
PORT =

ACCESS_TOKEN =
REFRESH_TOKEN=

MONGO_URI=

HOST_IP =
GOOGLE_MAIL_PASS =


TWILIO_SID =
TWILIO_AUTH_TOKEN =


ONE_SIGNAL_API_KEYS=
ONE_SIGNAL_APP_ID =

ELASTIC_USERNAME="your-username"
ELASTIC_PASSWORD="your-password"
ELASTIC_CLOUD_ID="your-cloud-id"

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

# Working Explained

## Notification Service

-   user preference is store in mongoDB
-   user can can set preference like DND, Limit per hour or subscribe the channels(sms, email, push) using api `/v1/notification/prefer`
-   server can send the notification based on the priority(high or low), high one get immediately triggered. low one go through kafka broker
-   topic and partitions is added to kafka via `/v1/notification/topic` .

-   when notification api `/v1/notification/notify `is called, it checks for the `priority`, `type of notification`, based on these two either they trigger it immediately bypassing producer consumer cycle or it proceed to kafka broker
-   if message triggered between DND time period then it schedule it outside the DND hours

## Kafka and Zookeeper

### Create Topic and Partitions

-   api is available for the creating topic and number of partition
-   partition is shared based on the userId (STRING)

### Producer & Consumer

-   by calling the /notify API, it trigger the kafka producer in given topic and partitions
-   consumer is listening the topic always, as soon as topic is produced, consumer received it and then store into MongoDB along with calling Notification channel service like sms, email, push
-   consumer listen to given groupId, we can provide different groupId based on topics
