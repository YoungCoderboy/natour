const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tourRef: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    },
    userRef: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.']
    }
  },
  {
    // schema option
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
// This will prevent a user from writing multiple reviews for the same tour
reviewSchema.index({ tourRef: 1, userRef: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  //   this.populate({
  //     path: 'tourRef',
  //     select: 'name'
  //   }).populate({
  //     path: 'userRef',
  //     select: 'name photo'
  //   });
  this.populate({
    path: 'userRef',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  // this points to the model
  const stats = await this.aggregate([
    {
      $match: { tourRef: tourId }
    },
    {
      $group: {
        _id: '$tourRef',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

// This is a document middleware used to update the ratingsAverage and ratingsQuantity when a review is created or saved, here this points to the current review
reviewSchema.post('save', function() {
  // this points to the current review
  this.constructor.calcAverageRatings(this.tourRef);
});
// This is a query middleware used to update the ratingsAverage and ratingsQuantity when a review is updated or deleted
// In query middleware this points to the current query
reviewSchema.pre(/^findOneAnd/, async function(next) {
  // we are doing this because we need to pass the tourId to the post middleware
  this.r = await this.findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.tourRef);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

// POST: /tours/5c88fa8cf4afda39709c2951/reviews should like this
// GET: /tours/5c88fa8cf4afda39709c2951/reviews should like this
// GET: /tours/5c88fa8cf4afda39709c2951/reviews/ID should like this
// nested routes is best suited for parent child relationship
