import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    emailVerified: {
      type: Boolean,
      default: false,
      alias: 'isEmailVerified',
    },
    googleId: {
      type: String,
      sparse: true,
    },
    avatarUrl: String,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    otp: String,
    otpExpires: Date,
    lastOtpSentAt: Date,
    browsingHistory: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    interests: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('hasPassword').get(function () {
  return !!this.password;
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.setOtp = async function (otp) {
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(otp, salt);
};

userSchema.methods.verifyOtp = async function (otp) {
  if (!this.otp) return false;
  return bcrypt.compare(otp, this.otp);
};

userSchema.pre('validate', function (next) {
  if (!this.password && !this.googleId) {
    this.invalidate('password', 'Password is required unless signing in with Google');
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;

