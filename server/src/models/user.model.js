import mongoose, { Schema} from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (value) {
                // Regular expression for basic email validation
                return /^\S+@\S+\.\S+$/.test(value);
            },
            message: (props) => `${props.value} is not a valid email!`
        }
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
    },
},
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {

    if(!this.isModified("password")) return null;

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    const isPasswordCorrect = await bcrypt.compare(password, this.password);
    return isPasswordCorrect;
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
    }, 
    process.env.ACCESS_TOKEN_KEY, 
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
 );
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
        _id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
    }, 
    process.env.REFRESH_TOKEN_KEY, 
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
 );
}

export const User = mongoose.model('User', userSchema);

