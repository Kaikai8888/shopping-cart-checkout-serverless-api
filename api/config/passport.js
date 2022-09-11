const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const settings = require('./settings')
const { User } = require('../models')
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: settings.jwt_secret,
  passReqToCallback: true
}

passport.use(new JwtStrategy(opts, async (req, payload, done) => {
  try {
    const { id } = payload
    const user = await User.findById(id).lean()
    if (!user) return done(null, false)
    return done(null, user)
  } catch (error) {
    done(error, false)
  }
}))

module.exports = passport