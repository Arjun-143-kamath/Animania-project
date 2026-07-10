const fs = require('fs');
const sharp = require('sharp');

async function getColors() {
  try {
    const { dominant } = await sharp('./client/public/logo.png').stats();
    console.log('Dominant color (logo.png):', dominant);
  } catch (e) {
    console.log('Error reading logo.png:', e.message);
  }
  
  try {
    const { dominant } = await sharp('./client/src/app/favicon.ico').stats();
    console.log('Dominant color (favicon.ico):', dominant);
  } catch (e) {
    console.log('Error reading favicon.ico:', e.message);
  }
}
getColors();
