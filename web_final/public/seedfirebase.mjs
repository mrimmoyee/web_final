import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDIpkLDK4aMFVmru80wxzHYkd86X4MK80k",
    authDomain: "authentication-39604.firebaseapp.com",
    projectId: "authentication-39604",
    storageBucket: "authentication-39604.appspot.com", // Corrected storage URL
    messagingSenderId: "1006633032825",
    appId: "1:1006633032825:web:3f8fdf988834a06ed048a8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function addQuizQuestion(subject, level, questionData) {
    const docRef = db.collection('quizzes').doc(subject).collection(level).doc('questions');
    docRef.set(questionData, { merge: true })
        .then(() => console.log('Quiz question added successfully'))
        .catch((error) => console.error('Error adding quiz question:', error));
}

addQuizQuestion('Math', 'Primary', {
    question1: {
        text: 'What is 2 + 2?',
        options: ['3', '4', '5'],
        correct: 1
    },
    question2: {
        text: 'What is 3 + 5?',
        options: ['7', '8', '9'],
        correct: 1
    }
});
