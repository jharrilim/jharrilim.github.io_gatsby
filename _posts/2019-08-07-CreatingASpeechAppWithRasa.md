---
title: Creating a Speech App With Rasa
published: true
---

# This is currently W.I.P.

![Code of Hammurabi](/assets/code-of-hammurabi.jpg)

## Overview

The demand for creating speech enabled applications is growing constantly. Whether it be voice or text, we want there are many applications for which our dialogue may be used. Language is the most important technology to ever be created by humans, and it us up to us to take full advantage of it.

In this post, we will look at how we can create an application that can derive meaning from text, and respond back in a natural way. I advise that you have at least a basic understanding of Python as well as how to use `conda` and `pip` before hopping into this tutorial.

## Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)

## Installation

In order to get started, you will need the following installed on your computer:

- Anaconda (Python 3+)
- Tensorflow
- Rasa/Rasa-x
- PyAudio (and its dependent, portaudio)
- SpeechRecognition

To install these, activate your `conda` environment and run the following:

```sh
pip install --upgrade pip
pip install tensorflow
pip install rasa-x --extra-index-url https://pypi.rasa.com/simple
conda install -y -c conda-forge portaudio
conda install -y PyAudio
conda install -y -c conda-forge speechrecognition
```

> _Note: You can use the docker container for Rasa. I have however tried to use PyAudio in docker as well, and I'm not too sure how to give the container access to the microphone on Windows. If you have any experience in this area and would like to contribute, check out [my repository](https://github.com/jharrilim/RasaDocker) containing the Dockerfile._

## Let's Jump In

Now that we've gotten everything we needed to be installed, let's go ahead and create a new directory and initialize it with rasa:

```sh
mkdir speech-app && cd $_
rasa init --no-prompt .
```

### Holy smokes, there are a lot of files. What does all of it mean?

There is indeed. Let's start with the most important part, the data!

## Data

Our Rasa application (and frankly all analytic applications) will be heavily based on the data that we give it. The quality of your application is dependent on the quality of your data. Let's take a look at the `nlu.md` file that is found within the `data` folder.

We have a couple of intents, which look like this:

```md
## intent:affirm
- yes
- indeed
- of course
- that sounds good
- correct

## intent:deny
- no
- never
- I don't think so
- don't like that
- no way
- not really

## intent:goodbye
- bye
- goodbye
- see you around
- see you later
```

This data depicts two things: Headings which include an intent followed by the name of the intent, and some examples of phrases that pertain to that intent. We can use this data to associate phrases that the end user gives us with one of these labelled intents. In technical terms, this is known as a _multi-class classification problem_, since there are multiple known targets for which we must select from.
