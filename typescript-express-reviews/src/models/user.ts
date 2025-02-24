import mongoose from './mongoose';

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
}, { versionKey: false });

schema.virtual('displayName').get(function() {
  return this.firstName + ' ' + this.lastName.slice(0, 1) + '.';
});

const User = mongoose.model('User', schema);

export default User;
