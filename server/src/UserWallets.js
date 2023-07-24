class UserWallets {
    users = [];
    userWallets = {}; // Users to multiple wallets

    constructor() {
        this.setupDummyData();
    }

    setupDummyData() {
        this.users.push('tom');
        this.users.push('dan');

        this.users.forEach(u => {
            const wallets = ['0x1' + u, '0x2' + u];
            this.userWallets[u] = wallets;
        })
    }

    getUsers() {
        return this.users;
    }

    getUserWallets(user) {
        return this.userWallets[user];
    }

    /**
     * @param user
     * @returns {boolean} - if user added (didn't already exist)
     */
    addUser(user) {
        if (this.users.filter(u => u === user).length === 0) {
            this.users.push(user);
            this.userWallets[user] = [];
            return true;
        }
        return false;
    }

    getUser(user) {
        if (this.users.filter(u => u === user).length === 0) {
            return null;
        }
        return this.userWallets[user];
    }
}

module.exports = UserWallets;
