const express = require('express');
const router = express.Router();
const { sendInviteEmail } = require('./inviteService');

router.post('/invite', async (req, res) => {
  try {
    const { email, permission, workspace } = req.body;
    const result = await sendInviteEmail({ email, permission, workspace });
    res.status(200).json({ message: 'Invitation sent successfully', ...result });
  } catch (error) {
    console.error('Invite error:', error);
    res.status(500).json({ 
      message: 'Failed to send invitation', 
      error: error.message 
    });
  }
});

module.exports = router;