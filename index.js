const express = require('express');
const {OpenAIApi} = require("openai");
const OpenAI = require("openai");
const axios = require('axios');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
// const fs = require('fs');
const fs = require('fs').promises;
const ExcelJS = require('exceljs');
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


const bonusCheck = new mongoose.Schema({
    idChat: String,
    botId: String,
    date: Date
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

const bonus = mongoose.model('bonusCheck', bonusCheck);

const doubleBonusRequest = mongoose.model('bonusCheck', bonusCheck);

mongoose.connect('mongodb://localhost/testmongo', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// GET route to retrieve messages
// dall-e-3

//this section is for our data engineer
app.get('/generateStats', async (req, res) => {
    const user = await userBase.find();
    let chatEnglishTotal = 0;
    let aiEnglishTotal = 0;
    let therapyTotal = 0;
    let cordrawMessageTotal = 0;
    let chatterMessageTotal = 0;
    let outPatientMessageTotal = 0;
    let totalObject = [];
    for (let i = 0; i < user.length; i++) {
        // whisper-2
        //gpt-3.5-turbo
        //gpt-4-vision-preview
        // dall-e-3
        //gpt-4-0613
        const chatEnglishObject = await ChatMessages.find({
            firstUserId: user[i].idChat
        });
        chatEnglishTotal = chatEnglishObject.length;
        const aiEnglishObject = await assistantApEn.find({
            idChat: user[i].idChat
        });
        aiEnglishTotal = aiEnglishObject.length;
        const therapyObject = await assistantAp.find({
            idChat: user[i].idChat
        });
        therapyTotal = therapyObject.length;
        const cordraw = await BasicUserMessage.find({
            idChat: user[i].idChat,
            aiModel: "dall-e-3"
        });
        cordrawMessageTotal = cordraw.length;
        const chatter = await BasicUserMessage.find({
            idChat: user[i].idChat,
            aiModel: "whisper-2" || "gpt-3.5-turbo"
        });
        chatterMessageTotal = chatter.length;
        const outPatient = await BasicUserMessage.find({
            idChat: user[i].idChat,
            aiModel: "gpt-4-vision-preview" || "gpt-4-0613"
        });
        totalObject[i] = {
            idChat: user[i].idChat,
            chatEnglishTotal: chatEnglishTotal,
            aiEnglishTotal: aiEnglishTotal,
            therapyTotal: therapyTotal,
            cordrawMessageTotal: cordrawMessageTotal,
            chatterMessageTotal: chatterMessageTotal
        };
    }
    res.status(200).send(totalObject);
});

app.get('/checkBonusForEnglish', async (req, res) => {
    const idChat = req.query.idChat;
    const chatEnglishObject = await ChatMessages.find({
        firstUserId: idChat
    });
    let chatEnglishTotal = chatEnglishObject.length;
    const aiEnglishObject = await assistantApEn.find({
        idChat: idChat
    });
    let aiEnglishTotal = aiEnglishObject.length;

    const checker = await bonus.find({
        idChat: idChat,
        botId: "talkbetterwithai_bot"
    });
    if ((aiEnglishTotal + chatEnglishTotal >= 2)) {
        if (checker.length === 0) {
            const newBonus = new bonus({
                idChat: idChat,
                botId: "talkbetterwithai_bot",
                date: Date.now()
            });
            await newBonus.save();
            const userget = await userBase.find({
                idChat: idChat
            });
            let userBonus = userget[0];
            userBonus.tokenDallE = userBonus.tokenDallE + 1;
            await userBonus.save();
            res.status(200).send("you get the bonus");
        } else {
            const newBonus = new doubleBonusRequest({
                idChat: idChat,
                botId: "talkbetterwithai_bot",
                date: Date.now()
            });
            res.status(400).send("you already got that bonus");
        }
    } else {
        res.status(400).send("you don't use enough");
    }
})


// Start the server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







