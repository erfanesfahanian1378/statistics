const express = require('express');
const {OpenAIApi} = require("openai");
const OpenAI = require("openai");
const axios = require('axios');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const {contentDisposition} = require("express/lib/utils");
app.use(express.json({limit: '150mb'}));
// const upload = multer({ dest: 'uploads/' });
const apiKey = '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';
const openai = new OpenAI({apiKey: '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'});
const userMessageSchema = new mongoose.Schema({
    userName: String,
    userMessage: String,
    response: String
});


const userSchema = new mongoose.Schema({
    userName: String,
    name: String,
    surName: String,
    sexuality: String,
    age: String,
    phone: String,
    universalWallet: Number,
    tokenDallE: Number,
    tokenFilmYab: Number,
    tokenMath: Number,
    tokenTextGenerator: Number,
    tokenBloodTest: Number,
    filmYabChannel: Boolean,
    logoChannel: Boolean,
    mathChannel: Boolean,
    textGeneratorChannel: Boolean,
    bloodTestChannel: Boolean,
    idChat: String
});

const basicUserMessageSchema = new mongoose.Schema({
    userName: String,
    userMessage: String,
    response: String,
    aiModel: String,
    descriptionAiForResponse: String,
    idChat: String
});

const inviteSchema = new mongoose.Schema({
    idChatInviter: String,
    numberOfGuests: Number,
    IdChatGuest: String
});

const assistantApi = new mongoose.Schema({
    idChat: String,
    assistantId: String,
    textUser: String,
    textResponse: String,
    threadsNumber: String,
    isItActive: Boolean,
    threadId: String
});
const assistantApiEn = new mongoose.Schema({
    idChat: String,
    assistantId: String,
    textUser: String,
    textResponse: String,
    threadsNumber: String,
    isItActive: Boolean,
    threadId: String
});

const levelOfEnglishSchema = new mongoose.Schema({
    userId: String,
    level: String,
    numberOfTest: Number,
    data: Date
});
const chatPartnerSchema = new mongoose.Schema({
    firstUserId: String,
    secondUserId: String,
    whenTheyEnd: Date
});

const chatMessagesSchema = new mongoose.Schema({
    firstUserId: String,
    secondUserId: String,
    content: String,
    data: Date
});


const ChatPartner = mongoose.model('ChatPartner', chatPartnerSchema);
const ChatMessages = mongoose.model('ChatMessage', chatMessagesSchema);
const levelOfEnglish = mongoose.model('LevelOfEnglish', levelOfEnglishSchema);

const userBase = mongoose.model('UserBase', userSchema);

const UserMessage = mongoose.model('UserMessage', userMessageSchema);

const BasicUserMessage = mongoose.model('basicUserMessage', basicUserMessageSchema);

const inviteGuest = mongoose.model('inviteSchema', inviteSchema);

const assistantAp = mongoose.model('assistantAp', assistantApi);

const assistantApEn = mongoose.model('assistantApEn', assistantApiEn);

mongoose.connect('mongodb://localhost/testmongo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// GET route to retrieve messages
// dall-e-3

//this section is for our data engineer
app.get('/generateStats', async (req, res) => {

    res.status(200).send(messages);
});



// Start the server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







