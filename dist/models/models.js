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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SomeObjectModel = exports.CompanyModel = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    cognitoId: String,
    name: String,
    email: String,
    phone: String,
    role: {
        type: String,
        enum: ['admin', 'member']
    }
}, { timestamps: true });
exports.UserModel = mongoose_1.default.models.User || (0, mongoose_1.model)('User', UserSchema, 'users');
const CompanySchema = new mongoose_1.Schema({
    name: String,
    adminUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
exports.CompanyModel = mongoose_1.default.models.Company || (0, mongoose_1.model)('Company', CompanySchema, 'companies');
const SomeObjectSchema = new mongoose_1.Schema({
    company: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company' },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    someProperty: String
}, { timestamps: true });
exports.SomeObjectModel = mongoose_1.default.models.SomeObject || (0, mongoose_1.model)('SomeObject', SomeObjectSchema, 'someObjects');
//# sourceMappingURL=models.js.map