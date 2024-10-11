"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePrivilegeSchema = exports.extractedUserSchema = exports.registerFormSchema = exports.loginFormSchema = exports.sensitiveUserSchema = exports.userSchema = exports.questionSchema = exports.questionDocSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// [Question]
exports.questionDocSchema = zod_1.default.object({
    title: zod_1.default.string().min(1),
    description: zod_1.default.string().min(1),
    categories: zod_1.default.string().min(1).array().min(1),
    complexity: zod_1.default.enum(["Easy", "Medium", "Hard"]),
});
exports.questionSchema = exports.questionDocSchema.extend({
    id: zod_1.default.string().min(1),
});
// [User]
//TODO #48 retire dupes in services\user\src\model.ts
exports.userSchema = zod_1.default.object({
    username: zod_1.default.string().min(1),
    email: zod_1.default.string().email(),
    isAdmin: zod_1.default.boolean(),
    createdAt: zod_1.default.date(),
});
exports.sensitiveUserSchema = exports.userSchema.extend({
    password: zod_1.default.string().min(1),
});
exports.loginFormSchema = exports.sensitiveUserSchema.pick({
    email: true,
    password: true,
});
exports.registerFormSchema = exports.sensitiveUserSchema.pick({
    username: true,
    email: true,
    password: true,
});
exports.extractedUserSchema = exports.userSchema
    .pick({
    username: true,
    email: true,
    isAdmin: true,
})
    .extend({
    id: zod_1.default.string().min(1),
});
exports.updatePrivilegeSchema = exports.userSchema.pick({
    isAdmin: true,
});
