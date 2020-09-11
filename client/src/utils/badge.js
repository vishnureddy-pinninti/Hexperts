const SILVER = 75;
const GOLD = 300;

const badge = (reputation) => {
    if (reputation >= SILVER && reputation < GOLD) {
        return 'silver';
    }

    if (reputation >= GOLD) {
        return 'gold';
    }

    return 'blue';
};

export default badge;
