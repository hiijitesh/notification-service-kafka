# Scale

> This file should include your perspective on scaling the project for
> high-volume deployment. Describe the changes you would make to meet scaling
> demands and explain the rationale behind each change.

## Factor to scale

-   Consumer can be generalised for the listing different topics
-   create different groupId for consumer
-   while producing the topic and partition we can shard the partition based on the Name of user
-   Redis can be use for caching the `Hourly notification limit` so we don't need to query MongoDB
-
