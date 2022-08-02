---
title: Why Choose GraphQL?
published: true
description: Reasons for choosing to use GraphQL
slug: /blog/why-graphql
date: '2019-05-04'
---

### Well, what is it?

GraphQL is a way to bring more control to client applications by allowing
them to define their own queries (akin to GETs) and their own mutations
(akin to POSTs). By allowing the client to specify everything upfront,
you reduce network roundtrips.

### Alright, sounds cool, how do I use it?

There are many ways to get started. Honestly, the tutorial that is given on GraphQL's website is surprisingly good. Their documentation is interactive and very descriptive.
Check out their website [here](https://graphql.org/learn/).

### Ok, I suppose that is "how" you use it, but really, how do I get started?

That is mostly going to depend on which language you choose. There are already frameworks made for most of them which are ready to be used. It is not entirely necessary
though as you may just use Postman, CURL, or your languages HTTP client if you wish.

> Fun fact: You do not need to use GraphQL with the HTTP or HTTPS protocol!

My top choice for any of the language frameworks is [TypeGraphQL](https://typegraphql.ml/). Yes, I am a big Typescript fan, so I may be a little biased. I do however think
it is designed **very** well and worth looking into. This combined with [Apollo GraphQL](https://www.apollographql.com/), [TypeDI](https://github.com/typestack/typedi),
and [TypeORM](https://typeorm.io/#/) and you have got yourself a very strong setup for creating, designing, testing, and connecting GraphQL servers and clients.

> 2022-08-01: This is no longer an ideal recommendation if you are using TypeScript. There are better full-fledged solutions such as [nestjs](https://nestjs.com).

### GraphQL seems complex, why shouldn't I just use REST?

REST seems complex. Why aren't you streaming binary?

Use GraphQL when you want:

- Field level security
- Lower payload sizes
- Clients that define the data contract and servers that offer the data as a service
- Fewer network requests

### Ok I'm sold. Where can I see some examples?

This site itself uses GraphQL with [Gatsby.js](https://www.gatsbyjs.org/)!

I have an example that you can find [here](https://github.com/jharrilim/downtime).

I have also seen a trending repository use the exact same stack; you may find it [here](https://github.com/TrillCyborg/fullstack).

> 2022-08-01: The above repository has been taken down.
