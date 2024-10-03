import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import db from "./db.js"; 
import { typeDefs } from "./schema.js";

const resolvers = {
  Query: {
    games: () => db.games,
    game: (_, { id }) => db.games.find((game) => game.id === id),
    authors: () => db.authors,
    author: (_, { id }) => db.authors.find((author) => author.id === id),
    reviews: () => db.reviews,
    review: (_, { id }) => db.reviews.find((review) => review.id === id),
  },
  Game: {
    reviews: (parent) => db.reviews.filter((r) => r.game_id === parent.id),
  },
  Review: {
    author: (parent) => db.authors.find((a) => a.id === parent.author_id),
    game: (parent) => db.games.find((g) => g.id === parent.game_id),
  },
  Author: {
    reviews: (parent) => db.reviews.filter((r) => r.author_id === parent.id),
  },
  Mutation: {
    addGame: (_, { game }) => {
      const newGame = { ...game, id: Math.random().toString() };
      db.games.push(newGame);
      return newGame;
    },
    deleteGame: (_, { id }) => {
      db.games = db.games.filter((g) => g.id !== id);
      return db.games;
    },
    updateGame: (_, { id, edits }) => {
      db.games = db.games.map((g) => (g.id === id ? { ...g, ...edits } : g));
      return db.games.find((g) => g.id === id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server ready at: ${url}`);
