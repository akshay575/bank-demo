var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

// Connection URL
var url = 'mongodb://localhost:27017';
var bankDb;

// Connect to the db
MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    console.log("Connected successfully to server");
    bankDb = client.db('bank');;
});

router.get('/getUsers', async (req, res) => {
    const users = await bankDb.collection('users').find({}).toArray();
    console.log(users);
    res.send(users);
})

router.get('/getHistory/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);

    const data = await bankDb
        .collection('users')
        .findOne({ userId: userId }, { $projection: { transactions: true }});

    res.send(data.transactions);
    
});

router.post('/makeTransaction', async (req, res) => {
    const senderId = parseInt(req.body.senderId);
    const receiverId = parseInt(req.body.receiverId);
    const amount = parseInt(req.body.amount);

    // get senders bank balance
    const sender = await bankDb
        .collection('users')
        .findOne({ userId: senderId }, { projection: { _id: false, balance: true } });

    // check if amount > 0 and 
    // sender has enough balance to make a transaction
    if (amount > 0 && sender.balance >= amount) {

        const senderTxn = {
            type: 'debit',
            to: receiverId,
            amount: amount,
            date: new Date()
        }

        const receiverTxn = {
            type: 'credit',
            from: senderId,
            amount: amount,
            date: new Date()
        }

        try {
            // debit the sender
            await bankDb.collection('users')
            .updateOne({ userId: senderId }, { $inc: { balance: -amount } });

            // push new transaction entry to sender collection
            await bankDb.collection('users')
            .updateOne({ userId: senderId }, { $push: { transactions: senderTxn } });

            // credit the receiver
            await bankDb.collection('users')
            .updateOne({ userId: receiverId }, { $inc: { balance: amount } });

            // push new transaction entry to receiver collection
            await bankDb.collection('users')
            .updateOne({ userId: receiverId }, { $push: { transactions: receiverTxn } });
        }
        catch(err) {
            res.send({
                err: err.msg
            })
        }
        
        res.send({
            status: 'Transaction successful!'
        });
    }
    else {
        res.send({
            msg: 'You do not have enough funds!'
        })
    }
});

module.exports = router;
