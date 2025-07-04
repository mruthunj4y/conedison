var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { _TypedDataEncoder } from '@ethersproject/hash';
import { getWalletMeta, WalletType } from './meta';
// These are WalletConnect peers which do not implement eth_signTypedData_v4, but *do* implement eth_signTypedData.
// They are special-cased so that signing will still use EIP-712 (which is safer for the user).
var WC_PEERS_LACKING_V4_SUPPORT = ['SafePal Wallet', 'Ledger Wallet Connect'];
// Assumes v4 support by default, except for known wallets.
function supportsV4(provider) {
    var meta = getWalletMeta(provider);
    if (meta) {
        var type = meta.type, name_1 = meta.name;
        if (name_1) {
            if (type === WalletType.WALLET_CONNECT && name_1 && WC_PEERS_LACKING_V4_SUPPORT.includes(name_1)) {
                return false;
            }
        }
    }
    return true;
}
/**
 * Signs TypedData with EIP-712, if available, or else by falling back to eth_sign.
 * Calls eth_signTypedData_v4, or eth_signTypedData for wallets with incomplete EIP-712 support.
 *
 * @see https://github.com/ethers-io/ethers.js/blob/c80fcddf50a9023486e9f9acb1848aba4c19f7b6/packages/providers/src.ts/json-rpc-provider.ts#L334
 */
export function signTypedData(signer, domain, types, 
// Use Record<string, any> for the value to match the JsonRpcSigner._signTypedData signature.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
value) {
    return __awaiter(this, void 0, void 0, function () {
        var populated, method, address, message, error_1, hash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _TypedDataEncoder.resolveNames(domain, types, value, function (name) {
                        return signer.provider.resolveName(name);
                    })];
                case 1:
                    populated = _a.sent();
                    method = supportsV4(signer.provider) ? 'eth_signTypedData_v4' : 'eth_signTypedData';
                    return [4 /*yield*/, signer.getAddress()];
                case 2:
                    address = (_a.sent()).toLowerCase();
                    message = JSON.stringify(_TypedDataEncoder.getPayload(populated.domain, types, populated.value));
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 8]);
                    return [4 /*yield*/, signer.provider.send(method, [address, message])];
                case 4: return [2 /*return*/, _a.sent()];
                case 5:
                    error_1 = _a.sent();
                    if (!(typeof error_1.message === 'string' &&
                        (error_1.message.match(/not (found|implemented)/i) ||
                            error_1.message.match(/TrustWalletConnect.WCError error 1/) ||
                            error_1.message.match(/Missing or invalid/)))) return [3 /*break*/, 7];
                    console.warn('signTypedData: wallet does not implement EIP-712, falling back to eth_sign', error_1.message);
                    hash = _TypedDataEncoder.hash(populated.domain, types, populated.value);
                    return [4 /*yield*/, signer.provider.send('eth_sign', [address, hash])];
                case 6: return [2 /*return*/, _a.sent()];
                case 7: throw error_1;
                case 8: return [2 /*return*/];
            }
        });
    });
}
