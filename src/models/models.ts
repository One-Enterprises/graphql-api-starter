import mongoose, {model, Schema} from 'mongoose'

const UserSchema = new Schema(
  {
    cognitoId: String,
    name: String,
    email: String,
    phone: String,
    role: {
      type: String,
      enum: ['admin', 'member']
    }
  },
  {timestamps: true}
)
export const UserModel = mongoose.models.User || model('User', UserSchema, 'users')

const CompanySchema = new Schema(
  {
    name: String,
    adminUsers: [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  {timestamps: true}
)

export const CompanyModel = mongoose.models.Company || model('Company', CompanySchema, 'companies')

const SomeObjectSchema = new Schema(
  {
    company: {type: Schema.Types.ObjectId, ref: 'Company'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    name: String,
    someProperty: String
  },
  {timestamps: true}
)
export const SomeObjectModel = mongoose.models.SomeObject || model('SomeObject', SomeObjectSchema, 'someObjects')
