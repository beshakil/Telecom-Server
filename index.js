const express = require('express');
const app = express()
const cors = require('cors');
const admin = require("firebase-admin");
require('dotenv').config()
const port = process.env.PORT || 7000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const stripe = require('stripe')(process.env.STRIPE_SECRET)
const fileUpload = require('express-fileupload')



//firebase-token-key.json

// DB_USER=doctors-portal
// DB_PASS=JJ3YvpB7S78UOcFC

//const serviceAccount = require("./firebase-token-key.json");
const serviceAccount = {
    "type": "service_account",
    "project_id": "classic-telecom",
    "private_key_id": "fe2e6d0aaa02e543f376f10a1c29380e9cc75c33",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCuPPYsOXHyLr/Y\nL7y85oER03QYshuUpdeZnDJaUk8Jic8eBz+WZtqQd72gOtpqYkjSx69wsZvOHE/Z\nNYO6neGwam2rxRnJh0GwkyRnwdWVcrXRB/wKABPMrL9gTkrVZIC7kAtNdt7ER1pM\nioE1SzlTGHYb4PVGQFuwk1fbZ1aiIpgo3SJdhTehxSUuwdlW+0enk+IoIUvBndHb\nRf1Qkxq1hzPYwRuFRuQWFbrdD9YoOkLkmUL1q2ICfvPlBcZnDppwXNicSoOx5E6N\nSoFERYn63my+p5JCi+Xd0FmOCef7ZPGL78knwGsymE1HBjR5aMwhLJ2yqXeoSMdK\no/yhBkGjAgMBAAECggEASICAdSWQNxTh6mzuzfHimk7RW+ddF60sujQnNbNTRSZN\ng3LDsGtrHjtdMhvbP/JW2DKUW8HkEc9xIHKmtlQ1EeovaY7yLIw2Nun7d5tOK0pY\nwrreUzD2DDCDz+i0NfiEoseNFHZWuvjv57KokksTdvLSTsZ8eXeVT7P4Fol5IKyx\nm15nGh7I46bEGB99sb/eRFg4v2LKHnKte5UtLcvjyXubOubAcCgTwb4y07AHp+Or\nBhQHagNJ4asGt4/cjJ3zvkSo5vl7nYY5fbDQrBnasNXxc9v98mzx1JRhzQuWUSZz\nrNeXLQVvT3vUEnIqwqieUKfSauHQ3Az1XRFI/yyJJQKBgQDbiOQVVUD7E/wkp11r\nUidRd7nIFTYvp4rGsQl6OkaOvDL6QN94S8a4gwJAtY9p70cOsRqLwpaNVr3MnnhR\n+5NlNBVCmSAkpA8Hxj1tyzjH6EYtQLj0TVx9rQ3aCvpDAHi5tOhMDnGRj+afyyMV\nMAfX93gVab9lhNWy+Jw+NsUTrQKBgQDLLfUrYuc9ZjmduPUH4tJH+kX2bJKefINO\n/wKscsm90olT4y2ckd1LW3vvZ4etDrocQGIovEbcsC1GNgep/UvYT9gNYusc/Wp+\niPWwRZ2ns5jqoG5ykKuWFKlC13buVNLa2/9V5CVb+K5/310TveHyXNZXLCwqXmKy\n+PX8o9nUjwKBgQDCIGqP8rNjUmjEgLq7DAp4n8ZIh3lC6oRs7l/TFXUPApyRbowt\nc9RllHOJhQMsScor07AFpiw7D1kGd5st46iS9VtXaNBjli80ULhBPlMXcu2bVoA2\nh7Ih78Uv6kUiumgGz1Ia7yq97OGiq556Pd6xusMVLE1zF+NgPzbqTMQ4gQKBgQC4\nzSdW/BFplkZHgAhW0OcEks350k0VnBjuzCHJamq2nf1McLB23XFTbnVujlMog+Gh\neqoNdRpa9l9nohMceYf3yr+vhU5mQtUPHFGjr94yv7cRiTSMPavjyQ0e/81r/3j9\nmeZHYEjeu3U0V5xYLXiKsgg+p63QJ6NMOAe9b+bcXwKBgCHsN+lXjABX0eFaFobx\nDqD2A8zUDx9IfkHztZ0yym/jDiT2nO30uDma38XGwBowOBdY6ipwBTDNCkkPp63e\nW5zQg9Ej2JmcVnAKCnBTfxqePl/fr/Tto8L5E4wbyakr1NtuCsrP/WJMYqTooFM4\nOcEt5/fnhjxDXB8hHQiu6E1y\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-whgft@classic-telecom.iam.gserviceaccount.com",
    "client_id": "115131351437803012606",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-whgft%40classic-telecom.iam.gserviceaccount.com"
}


//const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(express.json());
app.use(fileUpload());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jd8bl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }

    }
    next();
}

async function run() {
    try {
        await client.connect();
        const database = client.db("classic_telecom");
        const productsCollection = database.collection("products");
        const servicesCollection = database.collection("services");
        const usersCollection = database.collection("users");
        const ordersCollection = database.collection("orders");
        const ratingsCollection = database.collection("ratings");


        app.put('/orders/pay/:id', async (req, res) => {
            const id = req.params.id;
            const payment = req.body;
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    payment: payment
                }
            }
            const result = await ordersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });


        //Get Service
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.json(services)
        });

        //Add New Service
        app.post('/services', async (req, res) => {
            const user = req.body;
            const services = await servicesCollection.insertOne(user);
            res.json(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.json(result);
        });

        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result);
        })


        //Get Product
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({})
            const products = await cursor.toArray();
            res.json(products)
        });

        // Add Product With Picture
        app.post('/products', async (req, res) => {
            const title = req.body.title;
            const description = req.body.description;
            const price = req.body.price;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const addproduct = {
                title,
                description,
                price,
                image: imageBuffer
            }
            const result = await productsCollection.insertOne(addproduct);
            res.json(result);
        });

        //Find Single Product for Client Site
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.findOne(query);
            res.json(result);
        });

        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await productsCollection.deleteOne(query)
            res.json(result);
        })










        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;

            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });


        app.get("/users", async (req, res) => {
            const role = req.query.role;
            const query = { role: role };
            const cursor = await usersCollection.find(query)
            const result = await cursor.toArray()
            res.json(result);

        })




        // POST API Add A User
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });


        // POST API Add A User
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });
                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                }
            }
            else {
                res.status(403).json({ message: 'you do not have access to make admin' })
            }

        })



        //Post Orders
        app.post("/orders", async (req, res) => {
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders)
            res.json(result);
        })

        // get All orders
        app.get("/orders/all", async (req, res) => {
            const cursor = await ordersCollection.find({})
            const result = await cursor.toArray()
            res.json(result);
        })

        //get order by email
        app.get("/orders", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = await ordersCollection.find(query)
            const result = await cursor.toArray()
            res.json(result);

        })

        app.put("/orders/:id", async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const doc = {
                $set: {
                    status: 200
                }
            }
            const result = await ordersCollection.updateOne(filter, doc, options)
            res.json(result);
        })

        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.json(result);
        })

        //Order For Payment Specific data
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.findOne(query);
            res.json(result);
        });






        //Add new rating
        app.post('/ratings', async (req, res) => {
            const name = req.body.name;
            const email = req.body.email;
            const description = req.body.description;
            const rating = req.body.rating;
            const pic = req.files.image;
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const addrating = {
                name,
                email,
                description,
                rating,
                image: imageBuffer
            }
            const result = await ratingsCollection.insertOne(addrating);
            res.json(result);
        });


        // get All orders
        app.get("/ratings/all", async (req, res) => {
            const cursor = await ratingsCollection.find({})
            const result = await cursor.toArray()
            res.json(result);

        })

        //get order by email
        app.get("/ratings", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = await ratingsCollection.find(query)
            const result = await cursor.toArray()
            res.json(result);

        })

        app.delete("/ratings/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ratingsCollection.deleteOne(query)
            res.json(result);
        })

        //


        app.post("/create-payment-intent", async (req, res) => {
            const paymentInfo = req.body;
            const amount = paymentInfo.price * 100
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card']
            });
            res.json({
                clientSecret: paymentIntent.client_secret,
            });
        })
    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Classic Telecom')
})

app.listen(port, () => {
    console.log('runtime', port)
})
