const Hapi = require("@hapi/hapi");
const Joi = require("@hapi/joi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const { MongoClient, ObjectId } = require("mongodb");

const port = process.env.PORT || 3000;

const server = Hapi.server({
  port,
  routes: {
    cors: {
      origin: ["*"],
    },
  },
});

const startServer = async () => {
  try {
    // Connect to MongoDB
    const host = process.env.MONGO_URL || "localhost";
    const connectionString = `mongodb://${host}/heroes`;
    const client = await MongoClient.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");

    const db = client.db();
    const heroesCollection = db.collection("heroes");

    // Register plugins
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: "Heroes API",
            version: "1.0.0",
          },
        },
      },
    ]);

    // Define routes
    server.route([
      {
        method: "GET",
        path: "/",
        handler: (request, h) => h.redirect("/documentation"),
      },
      {
        method: "GET",
        path: "/heroes",
        handler: async (request, h) => {
          const heroes = await heroesCollection.find().toArray();
          return heroes;
        },
        options: {
          description: "Get all heroes",
          notes: "Returns a list of heroes",
          tags: ["api"],
        },
      },
      {
        method: "POST",
        path: "/heroes",
        handler: async (request, h) => {
          const { payload } = request;
          const result = await heroesCollection.insertOne(payload);
          return result.ops[0];
        },
        options: {
          description: "Create a hero",
          notes: "Adds a new hero",
          tags: ["api"],
          validate: {
            payload: Joi.object({
              name: Joi.string().required(),
              power: Joi.string().required(),
            }),
          },
        },
      },
      {
        method: "PUT",
        path: "/heroes/{id}",
        handler: async (request, h) => {
          const { id } = request.params;
          const { payload } = request;
          const result = await heroesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: payload }
          );
          return result.modifiedCount > 0
            ? { success: true }
            : { success: false };
        },
        options: {
          description: "Update a hero",
          notes: "Updates an existing hero",
          tags: ["api"],
          validate: {
            params: Joi.object({
              id: Joi.string().required(),
            }),
            payload: Joi.object({
              name: Joi.string(),
              power: Joi.string(),
            }),
          },
        },
      },
      {
        method: "DELETE",
        path: "/heroes/{id}",
        handler: async (request, h) => {
          const { id } = request.params;
          const result = await heroesCollection.deleteOne({
            _id: new ObjectId(id),
          });
          return result.deletedCount > 0
            ? { success: true }
            : { success: false };
        },
        options: {
          description: "Delete a hero",
          notes: "Removes a hero from the list",
          tags: ["api"],
          validate: {
            params: Joi.object({
              id: Joi.string().required(),
            }),
          },
        },
      },
    ]);

    // Start the server
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
