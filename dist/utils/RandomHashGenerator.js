"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHash = createHash;
function createHash(length) {
    let ans = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        ans += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return ans;
}
