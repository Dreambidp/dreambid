import multer from 'multer';
import path from 'path';

// Use memory storage for file uploads
const storage = multer.memoryStorage();
console.log('✓ Using memory storage for file uploads');

// File filter with MIME type validation
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedImageMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedPdfTypes = /pdf/;
  const allowedPdfMimes = ['application/pdf'];
  
  if (file.fieldname === 'images' || file.fieldname === 'image' || file.fieldname === 'cover_image' || file.fieldname === 'photo') {
    const extValid = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowedImageMimes.includes(file.mimetype);
    
    if (extValid && mimeValid) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
    }
  } else if (file.fieldname === 'pdf') {
    const extValid = allowedPdfTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeValid = allowedPdfMimes.includes(file.mimetype);
    
    if (extValid && mimeValid) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  } else {
    cb(null, true);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: fileFilter
});

// Middleware for multiple images
const uploadImages = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'cover_image', maxCount: 1 }
]);

// Middleware for single image
const uploadImage = upload.single('image');

// Middleware for PDF
const uploadPdf = upload.single('pdf');

// Middleware for attachments (for user registrations)
const uploadAttachments = upload.array('attachment', 5);

// Helper function to get image URL from multer file
export const getFileUrl = (file) => {
  if (!file) return null;
  return null; // Images stored in memory are not persisted
};

export {
  upload,
  uploadImages,
  uploadImage,
  uploadPdf,
  uploadAttachments
};

