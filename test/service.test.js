const sinon = require('sinon');
const { expect } = require('chai');
const Service = require('../src/service');
const PrimaryRepository = require('../src/repository');
const SecondaryRepository = require('../src/secondaryRepository');

describe('Service Integration Tests', () => {
    let service;
    let primaryRepositoryStub;
    let secondaryRepositoryStub;

    beforeEach(() => {
        primaryRepositoryStub = sinon.createStubInstance(PrimaryRepository);
        secondaryRepositoryStub = sinon.createStubInstance(SecondaryRepository);
        service = new Service();
        service.repository = primaryRepositoryStub;
        service.secondaryRepository = secondaryRepositoryStub;
    });

    it('should return item from primary repository if found', () => {
        const item = { id: 1, name: 'Item 1' };
        primaryRepositoryStub.getItemById.withArgs(1).returns(item);

        const result = service.getItemById(1);
        expect(result).to.equal(item);
        expect(primaryRepositoryStub.getItemById.calledOnceWith(1)).to.be.true;
        expect(secondaryRepositoryStub.getItemById.notCalled).to.be.true;
    });

    it('should return item from secondary repository if not found in primary', () => {
        const itemFromSecondary = { id: 3, name: 'Item 3' };
        primaryRepositoryStub.getItemById.withArgs(1).returns(undefined);
        secondaryRepositoryStub.getItemById.withArgs(1).returns(itemFromSecondary);

        const result = service.getItemById(1);
        expect(result).to.equal(itemFromSecondary);
        expect(primaryRepositoryStub.getItemById.calledOnceWith(1)).to.be.true;
        expect(secondaryRepositoryStub.getItemById.calledOnceWith(1)).to.be.true;
    });

    it('should throw error if item not found in both repositories', () => {
        primaryRepositoryStub.getItemById.withArgs(1).returns(undefined);
        secondaryRepositoryStub.getItemById.withArgs(1).returns(undefined);

        expect(() => service.getItemById(1)).to.throw('Item not found in both repositories');
        expect(primaryRepositoryStub.getItemById.calledOnceWith(1)).to.be.true;
        expect(secondaryRepositoryStub.getItemById.calledOnceWith(1)).to.be.true;
    });

    it('should add a new item', () => {
        const newItem = { id: 3, name: 'Item 3' };
        primaryRepositoryStub.addItem.returns(newItem);

        const result = service.addItem('Item 3');
        expect(result).to.equal(newItem);
        expect(primaryRepositoryStub.addItem.calledOnce).to.be.true;
    });
});
