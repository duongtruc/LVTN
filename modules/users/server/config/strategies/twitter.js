'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy,
  users = require('../../controllers/users.server.controller');

module.exports = function (config) {
  // Use twitter strategy
  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.clientID,
      consumerSecret: config.twitter.clientSecret,
      callbackURL: config.twitter.callbackURL,
      passReqToCallback: true
    },
    function (req, token, tokenSecret, profile, done) {
      // Set the provider data and include tokens
      var providerData = profile._json;
      providerData.token = token;
      providerData.tokenSecret = tokenSecret;

      // Create the user OAuth profile
      var displayName = profile.displayName.trim();
      var iSpace = displayName.indexOf(' '); // index of the whitespace following the firstName
      var firstName = iSpace !== -1 ? displayName.substring(0, iSpace) : displayName;

      var providerUserProfile = {
        firstName: firstName,
        displayName: displayName,
        username: profile.username,
        profileImageURL: profile.photos[0].value.replace('normal', 'bigger'),
        provider: 'twitter',
        providerIdentifierField: 'id_str',
        providerData: providerData
      };

      // Save the user OAuth profile
      users.saveOAuthUserProfile(req, providerUserProfile, done);
    }
  ));
};
