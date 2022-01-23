import passport from 'passport';
import fbStrategy from 'passport-facebook';
import { authorService } from './chatServices.js';

const FacebookStrategy = fbStrategy.Strategy; //Generar estrategia de FB

const initializePassportConfig = () => {
    passport.use('facebook', new FacebookStrategy({
        clientID: '447587367007124',
        clientSecret: '4d892a0cec63f779a5f7d0afd3874ed2',
        callbackURL: 'https://dc00-200-127-0-176.ngrok.io/auth/facebook/callback',
        profileFields: ['emails']
    }, async(accessToken, refreshToken, profile, done) => {
        try {
            console.log(accessToken);
            console.log(profile);
            let author = await authorService.getBy({email:profile.emails[0].value});
            done(null, author);
        } catch(err) {
            done(err);
        }
    }))
    passport.serializeUser((author, done) => {
        done(null, author._id)
    })
    passport.deserializeUser((id, done) => {
        authorService.findById(id, done);
    })
}

export default initializePassportConfig;