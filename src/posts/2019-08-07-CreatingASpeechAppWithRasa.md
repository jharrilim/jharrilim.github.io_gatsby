---
title: Creating a Speech App With Rasa
published: true
slug: /blog/creating-a-speech-app-with-rasa
date: '2019-08-07'
---

![Code of Hammurabi](/assets/code-of-hammurabi.jpg)

## Overview

The demand for creating speech enabled applications is growing constantly. Whether it be voice or text, there are many applications for which our dialogue may be used. Language is the most important technology to ever be created by humans, and it us up to us to take full advantage of it.

In this post, we will look at how we can create an application that can derive meaning from text, and respond back in a natural way. I advise that you have at least a basic understanding of Python as well as how to use `conda` and `pip` before hopping into this tutorial.

## Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Let's Jump In](#lets-jump-in)
  - [Holy smokes, there are a lot of files. What does all of it mean?](#holy-smokes-there-are-a-lot-of-files-what-does-all-of-it-mean)
- [Data](#data)
  - [NLU](#nlu)
  - [Stories](#stories)
  - [Now I know what the data is, what do I do with it?](#now-i-know-what-the-data-is-what-do-i-do-with-it)
  - [What _is_ this domain.yml file?](#what-is-this-domainyml-file)

## Installation

In order to get started, you will need the following installed on your computer:

- [Anaconda](https://www.anaconda.com/distribution/) (Python 3+)
- [Tensorflow](https://www.tensorflow.org/install)
- [Rasa/Rasa-x](https://rasa.com/docs/rasa/user-guide/installation/)
- [PyAudio](https://pypi.org/project/PyAudio/) (and its dependent, [portaudio](http://www.portaudio.com/))
- [SpeechRecognition](https://pypi.org/project/SpeechRecognition/)

> For Windows users, you will need to have Microsoft's C++ Build tools installed, which you can find [**here**](https://visualstudio.microsoft.com/downloads/).

To install these, activate your `conda` environment and run the following:

```shell
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

```shell
mkdir speech-app && cd $_
rasa init --no-prompt .
```

### Holy smokes, there are a lot of files. What does all of it mean?

There are indeed. Let's start with the most important part, the data!

## Data

Our Rasa application (and frankly all analytic applications) will be heavily based on the data that we give it. The quality of your application is dependent on the quality of your data. Let's take a look at the `nlu.md` file that is found within the `data` folder.

### NLU

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

These intents have a very specific purpose. **Intents are the building blocks for your stories.** In a story, you compose intents together to, you've guessed it, form a story.

### Stories

In the case of our application, stories are data structures which represent the flow of our application. If you remember those story books from when you were a child where it would give you options at the end of the page in a fashion such as:

> _You say yes to the wizard. Go to page 63._
>
> _You say no to the wizard. Go to page 74._

In Rasa, a story is actually similar to these books where you select a path. They are kept in the `stories.md` in the data folder. Your stories should look something like this:

```md
## happy path

- greet
  - utter_greet
- mood_great
  - utter_happy

## sad path 1

- greet
  - utter_greet
- mood_unhappy
  - utter_cheer_up
  - utter_did_that_help
- affirm
  - utter_happy
```

Each story begins with a "`## header`". Within these headers, you will see a list of `* intents`. These intents can contain possible `- responses` to those intents. With the above data, you may begin either of the two stories with a `greet` intent. After your bot replies back with `utter_greet`, the user responds again. If the user responds with something that falls into the `mood_great` intent, the bot will follow the _happy path_ and reply with `utter_happy`. If the user responds with something that falls into the `mood_unhappy` intent, then the bot will follow the _sad path 1_ and reply with **both** `utter_cheer_up` and `utter_did_that_help`.

### Now I know what the data is, what do I do with it?

Time to train yourself a model! Simply run the following command:

```shell
rasa train
```

That's it!

Well, not quite. I forgot to mention that there is also a `domain.yml` file that is used when running `rasa train` (this `domain.yml` file was one of the files generated from the `rasa init` at the start of this post).

### What _is_ this domain.yml file?

The `domain.yml` file contains all the information your bot needs to know to behave. Right now, it is comprised of **actions** (these are the responses that are used in the stories), the **intents** that you wish to use from your `nlu.md`, and some templates for each of your actions (this is where you get to specify what your responses actually do, whereas in the `stories.md`, you are simply stating the flow).
