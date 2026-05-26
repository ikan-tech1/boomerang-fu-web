export const EMPTY_INPUT = {
    dash: false,
    melee: false,
    throw: false,
    throwHeld: false,
    recall: false,
};
export function createEmptyInputFrame(frame, playerId) {
    return {
        frame,
        playerId,
        moveX: 0,
        moveY: 0,
        aimX: 1,
        aimY: 0,
        buttons: { ...EMPTY_INPUT },
    };
}
//# sourceMappingURL=index.js.map