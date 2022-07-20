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
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_compose_1 = require("graphql-compose");
const models_1 = require("@/models");
function Resolver() {
    const customReturnType = `
        type CustomReturnType {
            id: ID
            stuff: SomeCustomObjectStuff
        }

        type SomeCustomObjectStuff {
            property1: String
            property2: Int
        }
        `;
    graphql_compose_1.schemaComposer.addTypeDefs(customReturnType);
    const resolver = {
        name: 'customObjectAction',
        type: 'CustomReturnType',
        args: {
            id: 'ID!',
            property: 'String!'
        },
        description: 'Custom resolver for a SomeObject action',
        resolve: ({ args, context }) => __awaiter(this, void 0, void 0, function* () {
            const obj = yield models_1.SomeObjectModel.findOne({ name: args.name });
            obj.property = args.property;
            yield obj.save();
            return {
                id: obj._id,
                stuff: {
                    property1: obj.property,
                    property2: obj.property.length
                }
            };
        })
    };
    return resolver;
}
exports.default = Resolver;
//# sourceMappingURL=customObjectAction.js.map