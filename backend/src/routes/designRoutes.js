// Rutes dissenys

const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');
const authenticate = require('../middleware/auth');

router.get('/', authenticate, designController.getAllDesigns);

router.get('/:id', authenticate, designController.getDesignById);

router.post('/', authenticate, designController.createDesign);

router.delete('/:id', authenticate, designController.deleteDesign);

router.put('/:id', authenticate, designController.updateDesign);

module.exports = router;