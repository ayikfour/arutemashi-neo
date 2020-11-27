const fs = require('fs');
const util = require('util');
const path = require('path');
const downloader = require('image-downloader');

async function readImage(filepath = '') {
   try {
      const photo_b64 = await fs.readFileSync(filepath, { encoding: 'base64' });
      return photo_b64;
   } catch (error) {
      throw error;
   }
}

async function download(url, filename = '') {
   try {
      const extension = url.match(/\.[0-9a-z]+$/i);
      const filepath = path.join(
         __dirname,
         `../assets/${filename}${extension}`
      );
      const options = {
         url: url,
         dest: filepath,
      };

      const downloaded = await downloader.image(options);
      return filepath;
   } catch (error) {
      throw error;
   }
}

async function remove(filepath = '') {
   try {
      await fs.unlinkSync(filepath);
   } catch (error) {
      throw error;
   }
}

function stringify(documents = []) {
   return documents.join('\r\n');
}

module.exports = { readImage, download, remove };
