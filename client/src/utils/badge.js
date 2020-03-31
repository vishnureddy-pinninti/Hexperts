const SILVER = 500;
const GOLD = 1500;

const badge = (reputation) => {
    if (reputation >= SILVER && reputation < GOLD) {
        return 'silver';
    }

    if (reputation >= GOLD) {
        return 'gold';
    }

    return 'basic';
}

export default badge;