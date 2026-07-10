const fs = require('fs');
const sharp = require('sharp');

async function getColors() {
  try {
    const { dominant } = await sharp('./public/logo.png').stats();
    console.log('Dominant color (logo.png):', dominant);
  } catch (e) {
    console.log('Error reading logo.png:', e.message);
  }
}
getColors();
