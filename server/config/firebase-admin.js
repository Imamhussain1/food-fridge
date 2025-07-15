import admin from 'firebase-admin';

// Firebase Admin service account configuration
const serviceAccount = {
  type: "service_account",
  project_id: "food-fridge-8be96",
  private_key_id: "da334248ea2ce5c7bbc6e1d449792bf8d1538439",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCX+Wokc0kmqSGE\njoXolc3EHjGswaEOS4p7xMED5VpEPf/wNKWtnLsdMOxNTu/7phVcKWvSvAjorbUC\nOSFnI4nVdC8Jqp3QM5xo1FQKiRe3UDM2Yw0N+gyWqOpOwMI5Zlr+PxNSiqkS0smL\nRGk3EFNI9czEHCKaW56Z2AOFdYsOGM49YXLH+nyLIHBvGIYeznRxONoNc5PLP13O\nbO8fSWVDRsaXvv2QiuPq0lHh7RJxYiUIFbUqhLFdPVSrkWcDNBxNb6F2t3IOHHwl\nQmt2RTJ5QFgo51UXVmWB3Qnw7fTZDlNtdLRt1fbo/NGw025ALgiGUhMJglW1Bt13\nQuo/q0vfAgMBAAECggEAFftqKnaQfKqXIgzZerB8cGMrrUDesmoj0E4/2vfoTBmp\ntQ1wb4HNoOXMMEx8MuqtiUSmh3dSVJGXrogj+D6wN7NUAHJw3EYy2AjqVRHKX+YW\nWkYOg9iIzJwHNDf2gAX5oG/wNA7BcOsTYvUUwPW4DkQbh7xIFwqskLUpoTrEz9d2\nnQGtswSYR44cYQBrgMLkqEjidVpOv3rwWskhGHvfXrmXQWxivuQCUn7KJMnbzu8n\nqdAv4fVcJ9B3yy/780zvBBRO09udJBbYi+5PgWCeW9RNCcxY2p2YbdsWDEU0R+9U\nkvPhu+u4dU5MPw38uTLOWOv9DIqFGGiCLBjUbhvzVQKBgQDKXEqp3fh1ZoRIhNrX\nOFtKOkraex60wTU3WqRDlfKnD/WUsuNAYF+u7kVnjloPeDx6hCXwDpo61WzirDIf\nEyhes1OXMx0gIWJNd8qLieM2m8GIvgTs3s2Q73ULv92ZifbcgDUfPHaJSS24ZaKz\nWJwgr6pTXwEjpW0hfqCb2fdmiwKBgQDAQggIwAiAUDM2uXzZampuRwmT+YbC7pxB\nVJDWz1oRkHJ62W5gBlSFFcw2evLMStqMGCk/BagbaKV59cOhWH5KPz2EH2BWxElj\nvHlH3O6i6PfrrR5sTLj670quUBYpWEHPJYQM8PO4L6XK0b1avvdWa6Lm54kawcth\nyHS027vufQKBgFlXIceZLkZ2ulRiA1Qdl4BP+Bg5XzciTeJgbEFChFzpmNzLlbUo\nV1Yd8BpmKLDHvrvAeBdh+wmajHYO3BoIFTyqI2+Pq34x/vqAtrWgbOYBIhLDAd2q\nCEvCzIQhcy6EUK7NE6b0xMibvEm65XgU2Ok9ZQ9l1FTuhh3RkAr+0lE9AoGAItqV\nrEhsAh8H+c7MtHmXS+Cy+tGMvcAWMb3L+DVlBbQjHORYHy5mmi3mdKX7aE/VqPok\nWBmFbVqeTSrhyVlKo9ktJMuvYmt5Rox/jCigVoZXk7Exx75s9oj1B/7a1an7XDtX\n4iS4elag/tDhPBdMra0bvjKRZ3lkjpiRl8wSGN0CgYAQcOnfMcait/rCzqMovTr+\n9B2sMCh/DLH+Q3XoX1JvJqt3vta0j6kWS1//d6JzjOd0s9yvEyIE1bTZit+NBxqj\nG7agyaXRPeCfxWgyJg4Z2kQimt2mLKBSBkl3ePkoWoRUDlZxwkDW3kjKTxu96Qto\nWhomwuUFlz3JFZ37dAV4Mg==\n",
  client_email: "firebase-adminsdk-fbsvc@food-fridge-8be96.iam.gserviceaccount.com",
  client_id: "116069075411712421457",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40food-fridge-8be96.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "food-fridge-8be96"
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.log('Firebase admin initialization error:', error);
}

export default admin;