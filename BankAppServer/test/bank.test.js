const assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
let bankDb;

describe('Bank Transactions', async () => {
    it('get list of registered users', () => {
        MongoClient.connect(url, async (err, client) => {
            if (err) throw err;
            bankDb = client.db('bank');

            const users = await bankDb.collection('users').find({}).toArray();
            assert(users);
        });
    })

    it('debits the user', async () => {
        MongoClient.connect(url, async (err, client) => {
            if (err) throw err;
            bankDb = client.db('bank');

            const res = await bankDb.collection('users')
                .updateOne({ userId: 1001 }, { $inc: { balance: -10 } });
            assert(res);
        });
    })

    it('credits the user', async () => {
        MongoClient.connect(url, async (err, client) => {
            if (err) throw err;
            bankDb = client.db('bank');

            const res = await bankDb.collection('users')
                .updateOne({ userId: 1003 }, { $inc: { balance: 10 } });
            assert(res);
        });
    })

    it('gets the transaction history', async () => {
        MongoClient.connect(url, async (err, client) => {
            if (err) throw err;
            bankDb = client.db('bank');

            const res = await bankDb
                .collection('users')
                .findOne({ userId: 1001 }, { $projection: { transactions: true } });
            assert(res);
        });
    })
})