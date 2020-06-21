# Kaltura Meeting Embed Sample

This shows how to embed Kaltura Meetings rooms into a Node.js application (it skips the room creation part).
This is a very basic node express based app (generated using [Express Generator](https://expressjs.com/en/starter/generator.html)).

[![Watch the Kaltura Meetings Developer Guide](https://cfvod.kaltura.com/p/2357341/sp/235734100/thumbnail/entry_id/1_un6d28q7/width/500/vid_sec/30/quality/100 "Watch the Kaltura Meetings Developer Guide")](https://pitch.kaltura-pitch.com/message/b68f06feaf6245816ec0c14f770ba97589c8f0c2a70d4cd038f2b2b94ed4)

For the API and options please review the Kaltura Meeting Embed dDocumentation at https://github.com/kaltura-vpaas/virtual-meeting-rooms .

## To run
1. Checkout/Download the files
1. `npm install`
1. Copy `config.template.json` to `config.json`
1. Open `config.json`, configure according to the instructions and remove all comments
1. Run:
   * On Mac/Linux - `DEBUG=kalturameeting:* npm start`
   * Windows - `set DEBUG=myapp:* & npm start`
1. Load http://localhost:3000/ in your browser to access the app.

## How does this code work?
* express is configured with two routes: index and launchroom
* index (/) - the homepage shows a form mimicing user registration for an event, and allows chosing between rooms and roles
* launchroom renders the room or redirects back to homepage if no valid post data was provided
   * It gets all the Kaltura params from the express app (who reads it from config.json)
   * It then creates the Kaltura session with respective privileges according to the choices made in the homepage
   * And finally renders the room as an iframe (see launchroom.jade)

## Key steps in Kaltura Meetings integration
1. Create a resource / virtual room (or reuse an existing one). This step needs to be done outside of the app using the [scheduleResource.add API](https://developer.kaltura.com/console/service/scheduleResource/action/add). The created resourceIds should be populated in `config.json`. Key parameters in API:
   * `objectType`: KalturaLocationScheduleResource
   * `tags`: vcprovider:newrow
1. Generate a Kaltura Session (KS) which will authenticate a user into a room (done on backend)
   * The `privileges` parameter should look similar to this: `userContextualRole:0,role:viewerRole,resourceId:1092641`
      * `userContextualRole`: 0/1 is a host. 3 is a guest.
      * `role` should always be set to `viewerRole`
      * `resourceId` was acquired in step 1
   * `type` should be USER
   * `userId` should be some unique identifier (i.e. email or any alphanumeric string which uniquely itendifies a user)
   * `secret` should be your account’s User Secret (not Admin Secret)
1. Join the room by launching it into an iframe. The iframe’s src will look similar to this: `https://1234567.kaf.kaltura.com/virtualEvent/launch?ks=XXXXXX`, where XXXXXX is the KS generated in step 2.

## Where to get help
* Join the [Kaltura Community Forums](https://forum.kaltura.org/) to ask questions or start discussions
* Read the [Code of conduct](https://forum.kaltura.org/faq) and be patient and respectful

## Get in touch
You can learn more about Kaltura and start a free trial at: http://corp.kaltura.com    
Contact us via Twitter [@Kaltura](https://twitter.com/Kaltura) or email: community@kaltura.com  
We'd love to hear from you!

## License and Copyright Information
All code in this project is released under the [AGPLv3 license](http://www.gnu.org/licenses/agpl-3.0.html) unless a different license for a particular library is specified in the applicable library path.   

Copyright © Kaltura Inc. All rights reserved.

### Open Source Libraries
Review the [list of Open Source 3rd party libraries](open-source-libraries.md) used in this project.
