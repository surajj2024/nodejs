const {
    campgroundSchema,
    reviewSchema
} = require('./schemas.js');

const ExpressError = require('./utils/ExpressError.js');
const Campground = require('./models/campground');
const Review = require('./models/review.js')

module.exports.isLoggedIn = (req, res, next) => {
    // console.log('REQ.USER...', req.user); //it will five user information thanks to passport.js
    if (!req.isAuthenticated()) {
        // console.log(req.path, req.originalUrl); // /new /campgrounds/new
        // req.session.returnTo = req.originalUrl; //that we want to  redirect our user back to
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const {
        error
    } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {
        id,
        reviewId
    } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {
        error
    } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}