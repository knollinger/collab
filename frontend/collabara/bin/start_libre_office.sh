#!/bin/bash
docker pull collabora/code
#docker-compose up
docker run -t  -p 127.0.0.1:9980:9980 \
-e "extra_params=--o:ssl.enable=false" \
collabora/code
