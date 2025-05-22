// Rutes dissenys

const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');
const authenticate = require('../middleware/auth');
const upload = require('../middleware/upload');


router.get('/', authenticate, designController.getAllDesigns);

router.get('/:id', authenticate, designController.getDesignById);

router.post('/', authenticate, designController.createDesign);

router.delete('/:id', authenticate, designController.deleteDesign);

router.put('/:id', authenticate, designController.updateDesign);

router.post('/:id/upload-image', authenticate, upload.single('image'), designController.uploadImage);

router.delete('/:id/image', authenticate, designController.deleteImage);


module.exports = router;