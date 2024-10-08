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
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("../app"));
const user_model_1 = __importDefault(require("../models/user.model"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI;
console.log(uri, typeof uri);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(uri, {});
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('User API', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.deleteMany({});
    }));
    it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post('/api/users')
            .send({
            name: 'John Doe',
            email: 'john@example.com',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body).toHaveProperty('name', 'John Doe');
        expect(res.body).toHaveProperty('email', 'john@example.com');
    }));
    it('should fetch all users', () => __awaiter(void 0, void 0, void 0, function* () {
        yield user_model_1.default.create({ name: 'John Doe', email: 'john@example.com' });
        const res = yield (0, supertest_1.default)(app_1.default).get('/api/users');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('name', 'John Doe');
        expect(res.body[0]).toHaveProperty('email', 'john@example.com');
    }));
});
