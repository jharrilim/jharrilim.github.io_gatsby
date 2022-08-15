---
title: 'devu: Initial Thoughts'
published: true
slug: /blog/devu-initial-thoughts
date: '2022-08-14'
---

I am currently working on a project called devu. Don't ask about the name;
it was entirely random. I just needed a repo name to push code to.

devu was created to showcase the ability to smartly generate APIs from a
GraphQL schema. In the GraphQL world, there is the commonly accepted bit of magic
in the form of the `gql` function:

```javascript
const typeDefs = gql`
  type User {
    id: Int
  }
`;
const server = new ApolloServer({ typeDefs });
```

The `gql` function is a GraphQL parser which emits a syntax tree representation
of your GraphQL string. Apollo uses this schema to map types to their appropriate
resolvers. As a by-product of that, it also validates the schemas of requests to
the server. It also uses it for the GraphQL IDE that it provides so that it
can show type documentation.

devu makes use of this `gql` function but in a different way. With a regular
server, you need to provide resolvers that map to your schema. devu does this for
you by providing mock resolvers. devu makes an attempt to resolve fields in a smart
way. For example, if you have a field that _sounds like_ a date and is a `String` type:

```graphql
type User {
  id: Int
  created_at: String
}
```

It will automatically produce an ISO date string for this field. devu does this
for many common field names, such as first names, last names, phone numbers,
emails, IDs, etc.

devu can also stitch together multiple schemas from different users.
I mainly added this to showcase how to safely merge API schemas into one
federated graph using type prefixing. I also had in mind that it might be fun
for developers who want to share APIs with each other and build on top of them.
This, however, is more of a "build a dream" aspect than a "build something
that businesses will want" aspect.

Here's an example in which you might want to use devu:

> You have an application that consumes an external GraphQL API. For testing,
> you do not wish to hit the actual API, but would prefer to use a mock instead.
> Rather than writing your own custom mocks, you simply provide the schema of
> the GraphQL API that you're consuming to devu, and it creates the API for you.


Thoughts about the path forward:

- Adding custom resolver support requires some hard decisions. There are a
  few things we can accept: 

  - simple values 

  - URLs from which we grab values 

    - need strict timeout handling or it'll bog down the server 

    - timeout should be configurable for people who host their own 

  - A DSL of some form to support conditional resolvers

  - Allowing JavaScript execution. Not acceptable for the current
    server, but could be a decent option for internal usage in a trusted
    environment.

- Adding mutation support is equally tricky, because I think it'd be best
  to support both a persistent and non persistent mode. Persistence would
  be handy for actual tests, with the controlled ability to flush the 
  data upon request. Persistence would also imply though that saved data
  would be queryable as well, and would require custom resolvers. The
  lack of persistence is nice for simplicity, and can be useful for
  rapid prototyping scenarios where you just need to see some data on
  your screen, and see that requests are being made successfully. 

- The API generator should be extracted from the server implementation.
  It's useful on its own as a library. 

- It's probably useful to allow users to make multiple schemas instead
  of just one.
