// build-config.js
import fs from 'fs';

const configContent = `
export const FIREBASE_CONFIG = {
  apiKey: '${process.env.FIREBASE_API_KEY || ''}',
  authDomain: '${process.env.FIREBASE_AUTH_DOMAIN || ''}',
  projectId: '${process.env.FIREBASE_PROJECT_ID || ''}',
  storageBucket: '${process.env.FIREBASE_STORAGE_BUCKET || ''}',
  messagingSenderId: '${process.env.FIREBASE_MESSAGING_SENDER_ID || ''}',
  appId: '${process.env.FIREBASE_APP_ID || ''}',
  measurementId: '${process.env.FIREBASE_MEASUREMENT_ID || ''}',
};

export const EMAILJS_SERVICE_ID  = '${process.env.EMAILJS_SERVICE_ID || ''}';
export const EMAILJS_TEMPLATE_ID = '${process.env.EMAILJS_TEMPLATE_ID || ''}';
export const EMAILJS_PUBLIC_KEY  = '${process.env.EMAILJS_PUBLIC_KEY || ''}';

export const WEB3FORMS_ACCESS_KEY = '${process.env.WEB3FORMS_ACCESS_KEY || ''}';

export const GITHUB_USERNAME = '${process.env.GITHUB_USERNAME || ''}';
`;

if (!fs.existsSync('./js')) {
  fs.mkdirSync('./js');
}

fs.writeFileSync('./js/config.js', configContent.trim());
console.log('✅ js/config.js successfully generated for Netlify Build.');