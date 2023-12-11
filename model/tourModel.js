const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tour must have a name'],
    // above is called validator
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: Number
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
