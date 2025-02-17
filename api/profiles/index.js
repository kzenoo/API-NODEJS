const express = require('express');
const router = express.Router();
const profileController = require('./controller');

router.get('/', profileController.getAllProfiles);
router.get('/:id', profileController.getProfileById);
router.post('/', profileController.createProfile);
router.put('/:id', profileController.updateProfile);
router.delete('/:id', profileController.deleteProfile);

router.post('/:id/experience', profileController.addExperience);
router.delete('/:id/experience/:expId', profileController.removeExperience);

router.post('/:id/skills', profileController.addSkill);
router.delete('/:id/skills/:skill', profileController.removeSkill);

router.put('/:id/information', profileController.updateInformation);

router.post('/:id/friends', profileController.addFriend);
router.delete('/:id/friends/:friendId', profileController.removeFriend);
router.get('/:id/friends', profileController.getFriends);

module.exports = router;
