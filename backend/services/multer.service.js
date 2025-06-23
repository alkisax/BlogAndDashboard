const multer = require('multer');
const path = require('path');

// μέθοδος που δημιουργεί έναν τρόπο αποθήκευσης αρχείων στο δίσκο (στον υπολογιστή). Με αυτήν καθορίζουμε πού θα αποθηκευτεί το αρχείο και πώς θα ονομαστεί.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('reached multer service');   
    // null -> το δεχόμαστε, path.join(__dirname, '../uploads') -> ο φάκελος που θα αποθηκευτούν τα αρχεία
    cb(null, path.join(__dirname, '../uploads'));
  },
  // πως θα ονομαστεί το αρχείο όταν αποθηκευτεί
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});

// αυτό είναι ένας middleware που θα πιάσει το αρχείο που θα στείλει ο χρήστης και θα το αποθηκεύσει στον φάκελο uploads
const upload = multer({ 
  // καθοριζει που θα αποθηκεύονται τα αρχεία οριζετε στην παραπάνω const
  storage,
  // Το fileFilter είναι μια συνάρτηση που ελέγχει κάθε αρχείο πριν αποθηκευτεί.
  fileFilter: (req, file, cb) => {
    console.log('reached multer upload');
    // παιρνει τοn τύπο του αρχειου πχ png jpg κλπ
    const ext = path.extname(file.originalname);
    console.log('Uploading file:', file.originalname, file.mimetype);
    // callback συνάρτηση που πρέπει να καλέσεις για να πεις αν αποδεχεσαι το αρχείο ή όχι.
    cb(null, true);
  }
});

module.exports = upload;


/*
Παράδειγμα φίλτρου που δέχεται μόνο εικόνες .jpg ή .png
js
Αντιγραφή κώδικα
fileFilter: (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if(ext === '.jpg' || ext === '.jpeg' || ext === '.png'){
    cb(null, true); // αποδεκτό αρχείο
  } else {
    cb(new Error('Only images are allowed'), false); // απορρίπτω
  }
}
*/