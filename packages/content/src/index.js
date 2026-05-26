import balanceJson from '../balance.json';
export const balance = balanceJson;
export function getPowerUpIds() {
    return Object.keys(balance.powerUps);
}
export * from './schemas/arena';
//# sourceMappingURL=index.js.map