"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NameSchema = exports.Name = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Name = class Name {
    firstName;
    lastName;
};
exports.Name = Name;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, minlength: 3, maxlength: 20 }),
    __metadata("design:type", String)
], Name.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Name.prototype, "lastName", void 0);
exports.Name = Name = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Name);
exports.NameSchema = mongoose_1.SchemaFactory.createForClass(Name);
//# sourceMappingURL=user-name.schema.js.map