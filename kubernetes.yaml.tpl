# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: eq-survey-registry
  labels:
    app: eq-survey-registry
spec:
  replicas: 1
  selector:
    matchLabels:
      app: eq-survey-registry
  template:
    metadata:
      labels:
        app: eq-survey-registry
    spec:
      containers:
      - name: eq-survey-registry
        image: eu.gcr.io/GOOGLE_CLOUD_PROJECT/eq-survey-registry:COMMIT_SHA
        ports:
        - containerPort: 8080
        env:
          - name: REGISTRY_DATABASE_SOURCE
            valueFrom:
              secretKeyRef:
                name: registry-secrets
                key: REGISTRY_DATABASE_SOURCE
          - name: PUBLISHER_URL
            valueFrom:
              secretKeyRef:
                name: registry-secrets
                key: PUBLISHER_URL
---
kind: Service
apiVersion: v1
metadata:
  name: eq-survey-registry
spec:
  selector:
    app: eq-survey-registry
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer