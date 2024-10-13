const Repository = require('./repository');
const SecondaryRepository = require('./secondaryRepository');

class Service {
    constructor() {
        this.repository = new Repository();
        this.secondaryRepository = new SecondaryRepository();
    }

    getAllItems() {
        return this.repository.getAllItems();
    }

    getItemById(id) {
        let item = this.repository.getItemById(id);
        if (!item) {
            item = this.secondaryRepository.getItemById(id);
        }
        if (!item) {
            throw new Error('Item not found in both repositories');
        }
        return item;
    }

    addItem(name) {
        const newItem = { id: 1, name }; // Menggunakan id statis untuk pengujian
        return this.repository.addItem(newItem);
    }
}

module.exports = Service;
