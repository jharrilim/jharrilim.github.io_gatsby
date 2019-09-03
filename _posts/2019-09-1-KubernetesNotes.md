---
title: Kubernetes Notes
published: true
---

This post does not contain ordered content; just a handful of notes for developing with Kubernetes. This will hopefully remove the confusion around the large amount of lingo and concepts needed for understanding Kubernetes.

----

## Tools

### [Kubernetes](https://github.com/kubernetes/kubernetes)

#### Description

| | |
|--:|---|
| Who | Kubernetes is for companies that want scalability, redundancy, availability, and faster deployment cycles. |
| What | A container orchestration platform that manages resources, networking, failover, and various other features. |
| Where | Kubernetes can be hosted on a cloud service such as [Google's Kubernetes Engine](https://cloud.google.com/kubernetes-engine/), Minikube for local development, or as an on premise deployment. |
| When | Used at the end of the development lifecycle to handle deployments and production infrastructure. |
| Why | Modern deployments __are__ performance-centric. The speed of deployment needs to be fast. There is a need for burst scaling. The need for easier, faster, and safer A/B testing and canary deployments is also there. Everything needs to be quick to put in place, quick to revert, and quick to change. |
| How | Kubernetes does this by using a Masters and Nodes to manage resources. Detailed information on how Kubernetes does this can be found [here](https://kubernetes.io/docs/concepts/architecture/). Pluralsight offers a good introductory course for [Getting Started with Kubernetes](https://app.pluralsight.com/library/courses/getting-started-kubernetes). |

### [Minikube](https://github.com/kubernetes/minikube)

#### Description

| | |
|--:|---|
| Who | Minikube is for developers. |
| What | Allows developers to run a Kubernetes cluster. |
| Where | On the developer's computer. |
| When | During the development phase. |
| Why | Developers can test out deployments locally for quicker testing purposes, or to mitigate costs of cloud deployments. The principles of Minikube can be found [here](https://minikube.sigs.k8s.io/docs/concepts/principles/). |
| How | [Minikube Guide](https://kubernetes.io/docs/setup/learning-environment/minikube/#quickstart) and [Installation Instructions](https://kubernetes.io/docs/tasks/tools/install-minikube/) |

#### Commands

##### Create a Kubernetes cluster with Minikube on Windows/Hyper-V using the Default Network Switch

```sh
minikube start --vm-driver="hyperv" --hyperv-virtual-switch="Default Switch"
```

##### Open a dashboard in your browser to view your cluster

```sh
minikube dashboard
```
