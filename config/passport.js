const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

const redirect_uri = process.env.REDIRECT_URI

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: "131101231642-dft1effd5ei9v8qt3sul2hkbpi9h9met",
        clientSecret: "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",
        callbackURL: `${redirect_uri}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        }
        
        try {
          let user = await User.findOne({ googleId: profile.id })
          
          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
      )
      )
      
      passport.serializeUser((user, done) => {
        done(null, user.id)
      })
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
      })
    }
    
