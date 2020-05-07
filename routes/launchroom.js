var express = require('express');
var kaltura = require('kaltura-client');
var router = express.Router();

/* GET redirect back to register page if user gets here without registering */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

/* POST launch a room with params. */
router.post('/', function(req, res, next) {
  const config = new kaltura.Configuration();
  config.serviceUrl = req.app.get('kserviceUrl');
  const client = new kaltura.Client(config);
  const apiSecret = req.app.get('kapiSecret');
  const partnerId = req.app.get('kpartnerId'); 
  const expiry = req.app.get('ksessionDuration');
  const type = kaltura.enums.SessionType.USER;

  // Read about rooms management and all the room launch customization options here:
  // https://pitch.kaltura-pitch.com/message/b68f06feaf6245816ec0c14f770ba97589c8f0c2a70d4cd038f2b2b94ed4

  // Map room number to resourceId. Resources (virtual rooms) are created via the scheduleResource.add API:
  // https://developer.kaltura.com/console/service/scheduleResource/action/add
  resourceIds = req.app.get('kresourceIds');
  let resourceId = null;
  let room = parseInt(req.body.room);
  if (resourceIds.hasOwnProperty(room)) {
    resourceId = resourceIds[room];
  } else {
    res.status(400).send("Error: invalid room number: "+room + " ("+req.body.room+")");
  }

  // Set priveleges parameter for Kaltura Session (KS) generation.
  // For userContextual role:
  //   0 = instructor
  //   3 = guest
  // Mandatory fields: role, userContextualRole, resourceId (or eventId)
  let userContextualRole = req.body.role == "instructor" ? "0" : "3";  
  let privileges = "role:viewerRole,userContextualRole:" + userContextualRole + ",resourceId:" + resourceId + 
    ",firstName:" + req.body.firstName + ",lastName:" + req.body.lastName;
  let userId = req.body.email; // using email as userId, but it can be any alphanumeric unique string if you prefer

  // Get a Kaltura Session
  kaltura.services.session.start(apiSecret, userId, type, partnerId, expiry, privileges)
  .execute(client)
  .then(result => {
      let roomUrl = "https://" + partnerId + ".kaf.kaltura.com/virtualEvent/launch?ks=" + result;
      // Render the room -
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.render('launchroom', { roomUrl: roomUrl});
  });
});

module.exports = router;