"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGQLSchema = void 0;
const graphql_compose_mongoose_1 = require("graphql-compose-mongoose");
const graphql_compose_1 = require("graphql-compose");
// Models
const models = __importStar(require("@/models"));
// Custom resolvers
const resolvers = __importStar(require("@/graphql/resolvers"));
const createGQLSchema = () => {
    const UserTC = (0, graphql_compose_mongoose_1.composeMongoose)(models.UserModel, {});
    const CompanyTC = (0, graphql_compose_mongoose_1.composeMongoose)(models.CompanyModel, {});
    const SomeObjectTC = (0, graphql_compose_mongoose_1.composeMongoose)(models.SomeObjectModel, {});
    const addResolvers = () => {
        const query = {};
        const mutation = {};
        // User
        mutation.createUser = UserTC.mongooseResolvers.createOne().wrapResolve((next) => authorizationCheck(next));
        mutation.updateUser = UserTC.mongooseResolvers.updateById().wrapResolve((next) => authorizationCheck(next));
        // Company
        query.getCompany = CompanyTC.mongooseResolvers.findById().wrapResolve((next) => authorizationCheck(next));
        mutation.createCompany = CompanyTC.mongooseResolvers.createOne().wrapResolve((next) => authorizationCheck(next));
        mutation.updateCompany = CompanyTC.mongooseResolvers.updateById().wrapResolve((next) => authorizationCheck(next));
        // SomeObject
        query.getSomeObject = SomeObjectTC.mongooseResolvers.findOne().wrapResolve((next) => authorizationCheck(next));
        query.listSomeObjects = SomeObjectTC.mongooseResolvers.findMany().wrapResolve((next) => authorizationCheck(next));
        mutation.createSomeObject = SomeObjectTC.mongooseResolvers.createOne().wrapResolve((next) => authorizationCheck(next));
        mutation.updateSomeObject = SomeObjectTC.mongooseResolvers.updateById().wrapResolve((next) => authorizationCheck(next));
        // Add a custom resolver not associated with the mongoose resolvers
        mutation.customObjectAction = graphql_compose_1.schemaComposer.createResolver(resolvers.customObjectAction());
        graphql_compose_1.schemaComposer.Mutation.addFields(mutation);
        graphql_compose_1.schemaComposer.Query.addFields(query);
    };
    const addRelations = () => {
        UserTC.addRelation('someObjects', {
            resolver: () => SomeObjectTC.mongooseResolvers.findMany(),
            prepareArgs: {
                filter: (source) => ({
                    user: source._id
                })
            },
            projection: { _id: true }
        });
        UserTC.addRelation('company', {
            resolver: () => CompanyTC.mongooseResolvers.findById(),
            prepareArgs: {
                _id: (source) => source.company || null
            },
            projection: { company: true }
        });
        CompanyTC.addRelation('adminUsers', {
            resolver: () => CompanyTC.mongooseResolvers.dataLoaderMany(),
            prepareArgs: {
                _ids: (source) => source.adminUsers || null
            },
            projection: { adminUsers: true }
        });
        SomeObjectTC.addRelation('company', {
            resolver: () => CompanyTC.mongooseResolvers.findById(),
            prepareArgs: {
                _id: (source) => source.company || []
            },
            projection: { company: true }
        });
        SomeObjectTC.addRelation('user', {
            resolver: () => UserTC.mongooseResolvers.findById(),
            prepareArgs: {
                _id: (source) => source.user || []
            },
            projection: { user: true }
        });
    };
    addResolvers();
    addRelations();
    return graphql_compose_1.schemaComposer.buildSchema();
};
exports.createGQLSchema = createGQLSchema;
const authorizationCheck = (next) => {
    return (rp) => __awaiter(void 0, void 0, void 0, function* () {
        // You could check authorization here
        return next(rp);
    });
};
//# sourceMappingURL=schema.js.map