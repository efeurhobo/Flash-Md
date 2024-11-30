const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTUVXN1dEWjhTZlFqMmxvYmZ3QVZ4N3ZPQkhkY3B5YncyNGRLblRYTDQyVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNzVwRmdmR2RyWWlxVFprQTF4Zk16bko3MXNvVlExQm96Y0IxdTVHSXQzRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJVRE1pMFN0a2RyOGQycG9hdmdoRjA5K3Q2UVBlYnRTQXJtcWVCeGI3YlZzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJKWGE1ZlhGSzFReUtsREJ3YmdJRkJ3VFoyeVd0ZnJhVXFGV2RJTk9jdWtVPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1KZ0lDRGtRazNiR2Q5K0lCZm9uVUdUbVZTVm9lQWoyYm9SUWhyQkVOa289In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNUMllUUDZpM0dvL25BNFFRVHFXS0llSDJLdVFrYWlZdHN5RTd2dVpFaGs9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK09XNEhIUU92cFdJcXc0K0tCQzRIT3RJK1pqVWxEeWZUVVlDTFlDSVYyQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiamVXcHZ4TUZnNVo5TjZLdFE1dkoxTld4RU56VEpubU9BU3NsUGcrWWZnMD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InRYSThlM2ZhV3R4bXVUYVNFZ2JXUXowcC9WMzcvT0NQZXpPYnJkZEdhN2RhZWQyMWtURmdsVnZZd01FMTIyYmhQSGptd2o0Z1JFY3I4STNSYy80MGdBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjM3LCJhZHZTZWNyZXRLZXkiOiJwMURBeTZUSkxhRlluM01OcS80UFlnUGR2SmhFc0l1ZkJuMWprOHNHdzNRPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjIzNDgwNzg1ODI2MjdAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiQkU4MzE0MEMwRTAxREUxMTI1RjlBQ0FGRTc2MTRFRTQifSwibWVzc2FnZVRpbWVzdGFtcCI6MTczMjkzODQ5NH1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MCwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sImRldmljZUlkIjoiVDRUZDBSdTdTU0NzNXpKWXgwU0txdyIsInBob25lSWQiOiJkOWQ3NWQwYi02NjM0LTQzYWEtYmNkNC0wMjBhYjlkMThiYzEiLCJpZGVudGl0eUlkIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY214enVDSCtQQzEzQUp5MDVGSnU5ajFOWFNBPSJ9LCJyZWdpc3RlcmVkIjp0cnVlLCJiYWNrdXBUb2tlbiI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InJhajhHNVR4OU0yblgwUnJ5T0MzcEhKTzE1Zz0ifSwicmVnaXN0cmF0aW9uIjp7fSwicGFpcmluZ0NvZGUiOiJER1gyRTgzVyIsIm1lIjp7ImlkIjoiMjM0ODA3ODU4MjYyNzoxQHMud2hhdHNhcHAubmV0In0sImFjY291bnQiOnsiZGV0YWlscyI6IkNLeU5tZGdFRU8yVnFyb0dHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJTVmR2ZEF1dFlvV3pPMlVjdm9xN2xqKzYrUEY1NFh0Y0NlVGJjaHVOeFdjPSIsImFjY291bnRTaWduYXR1cmUiOiJHbGpGNWRHaS9RTHdQVFJUQzk5TGw4a3BTQ1NJT3RsTzZGaEZ6VUtUTHowWUJ4V2NwbFk1VE9HSmpPMlNBQUY0SkYrZzR4a0tQSk1Nd2FUSW1HVVRBdz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiY1R0ckFjeWlIVFRrTUozWDVJdEdkZ290WjR3TXJSYk9JbVVGSkw4VmNtS2VXa1ZIZU1wSDN4ZklmU2FHSXFpSHNpQXNkS3diUXkydjhrK1dlVWVoaGc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyMzQ4MDc4NTgyNjI3OjFAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCVWxYYjNRTHJXS0ZzenRsSEw2S3U1WS91dmp4ZWVGN1hBbmsyM0liamNWbiJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczMjkzODQ5MH0=',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "Only_one_🥇Empire",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "2348078582627",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "off",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    L_S: process.env.STATUS_LIKE || 'off',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'off',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Lagos',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'off',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
