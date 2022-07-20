"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env' });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = require("@/graphql/schema");
const apollo_server_express_1 = require("apollo-server-express");
const http_1 = __importDefault(require("http"));
// Check for required environment variables. If not found, throw an error.
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST', 'COGNITO_POOL_REGION', 'COGNITO_POOL_ID', 'COGNITO_CLIENT', 'AWS_KEY', 'AWS_SECRET', 'AWS_S3_BUCKET_NAME'];
const missingVars = [];
requiredEnvVars.forEach((v) => {
    if (!process.env[v]) {
        missingVars.push(v);
    }
});
if (missingVars.length > 0) {
    throw new Error(`Missing required environment variable ${JSON.stringify(missingVars)}`);
}
// Connect to MongoDB
const dbConfig = {
    name: `${process.env.DB_NAME}`,
    user: `${process.env.DB_USER}`,
    pass: `${process.env.DB_PASS}`,
    host: `${process.env.DB_HOST}`
};
mongoose_1.default
    .connect(`mongodb+srv://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}/${dbConfig.name}?retryWrites=true&w=majority&authSource=admin&readPreference=primary&ssl=true`, {
    minPoolSize: 5,
    maxPoolSize: 100
})
    .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
    throw new Error(error);
}));
const port = Number(process.env.PORT || 3000);
// Create Apollo Server
const startApolloGraphQLServer = (_app) => __awaiter(void 0, void 0, void 0, function* () {
    // Setup graphql server
    const schema = (0, schema_1.createGQLSchema)();
    const server = new apollo_server_express_1.ApolloServer({
        schema,
        validationRules: [],
        introspection: process.env.NODE_ENV !== 'production',
        context: ({ req }) => ({
            req
        })
    });
    // Start the server
    yield server.start();
    // Apply app to server
    server.applyMiddleware({ app: _app, path: '/graphql', cors: { credentials: true, origin: true } });
    const httpServer = http_1.default.createServer(_app);
    return httpServer;
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const httpServer = yield startApolloGraphQLServer(app_1.default);
    httpServer.listen(port, () => {
        console.log(`🚀 Graphql Server ready at https://localhost:${port}/graphql`);
    });
}))();
process.on('SIGINT', () => {
    mongoose_1.default.connection.close(() => {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
});
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
//# sourceMappingURL=index.js.map