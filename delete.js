const fs = require('fs');
try {
  fs.unlinkSync('c:/Users/jflor/OneDrive/Desktop/TRABAJO/BUNTY/src/pages/modules/SettingsPage_new.tsx');
  console.log('Deleted SettingsPage_new.tsx');
} catch(e) {
  console.log('Error:', e.message);
}
try {
  fs.unlinkSync('c:/Users/jflor/OneDrive/Desktop/TRABAJO/BUNTY/delete.js');
  console.log('Deleted delete.js');
} catch(e) {
  console.log('Error:', e.message);
}
try {
  fs.unlinkSync('c:/Users/jflor/OneDrive/Desktop/TRABAJO/BUNTY/delete_new.ps1');
  console.log('Deleted delete_new.ps1');
} catch(e) {
  console.log('Error:', e.message);
}
