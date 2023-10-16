const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();
const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" },
];
const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "Harry Potter The last one", authorId: 1 },
  { id: 5, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 6, name: "The Two Towers", authorId: 2 },
  { id: 7, name: "The Return of the King", authorId: 2 },
  { id: 8, name: "The Way of Shadows", authorId: 3 },
  { id: 9, name: "Beyond the Shadows", authorId: 3 },
];
const BookType = new GraphQLObjectType({
  name: "Book",
  description: "this represents a book written by an author",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => authors.find((author) => author.id == book.authorId),
    },
  }),
});
const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "this represents an author of a book",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId == author.id);
      },
    },
  }),
});
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    book: {
      type: BookType,
      description: "A single book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id == args.id),
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of books",
      resolve: () => books,
    },
    author: {
      type: AuthorType,
      description: "A single Author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => authors.find((author) => author.id == args.id),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of authors",
      resolve: () => authors,
    },
  }),
});
const schema = new GraphQLSchema({
  query: RootQueryType,
});
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(5001, () => console.log("server running"));
