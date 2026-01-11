const {MongoMemoryServer} = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongo;

beforeAll(async() => { 
mongo = await MongoMemoryServer.create();
const uri = mongo.getUri();
await mongoose.connect(uri);
});

afterEach(async() => { 
if(!mongoose.connection.db) return;
const collections = await mongoose.connection.db.collections();
for(const collection of collections){ 
await collection.deleteMany({});
}
});

afterAll(async() => { 
if(mongoose.connection.readyState !== 0){ 
await mongoose.connection.close(); 
}
if(mongo){ 
await mongo.stop();
}
});
