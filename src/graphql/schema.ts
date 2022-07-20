import {composeMongoose, GenerateResolverType, ValidationError} from 'graphql-compose-mongoose'
import {ObjectTypeComposer, schemaComposer} from 'graphql-compose'

// Models
import * as models from '@/models'

// Add types to the schema
import * as types from '@/models/types'

// Custom resolvers
import * as resolvers from '@/graphql/resolvers'

const createGQLSchema = () => {
  const UserTC = composeMongoose(models.UserModel, {})
  const CompanyTC = composeMongoose(models.CompanyModel, {})
  const SomeObjectTC = composeMongoose(models.SomeObjectModel, {})

  const addResolvers = () => {
    const query: {[name: string]: any} = {}
    const mutation: {[name: string]: any} = {}

    // User
    mutation.createUser = UserTC.mongooseResolvers.createOne().wrapResolve((next) => authorizationCheck(next))
    mutation.updateUser = UserTC.mongooseResolvers.updateById().wrapResolve((next) => authorizationCheck(next))

    // Company
    query.getCompany = CompanyTC.mongooseResolvers.findById().wrapResolve((next) => authorizationCheck(next))
    mutation.createCompany = CompanyTC.mongooseResolvers.createOne().wrapResolve((next) => authorizationCheck(next))
    mutation.updateCompany = CompanyTC.mongooseResolvers.updateById().wrapResolve((next) => authorizationCheck(next))

    // SomeObject
    query.getSomeObject = SomeObjectTC.mongooseResolvers.findOne().wrapResolve((next) => authorizationCheck(next))
    query.listSomeObjects = SomeObjectTC.mongooseResolvers.findMany().wrapResolve((next) => authorizationCheck(next))
    mutation.createSomeObject = SomeObjectTC.mongooseResolvers.createOne().wrapResolve((next) => authorizationCheck(next))
    mutation.updateSomeObject = SomeObjectTC.mongooseResolvers.updateById().wrapResolve((next) => authorizationCheck(next))

    // Add a custom resolver not associated with the mongoose resolvers
    mutation.customObjectAction = schemaComposer.createResolver(resolvers.customObjectAction())

    schemaComposer.Mutation.addFields(mutation)
    schemaComposer.Query.addFields(query)
  }

  const addRelations = () => {
    UserTC.addRelation('someObjects', {
      resolver: () => SomeObjectTC.mongooseResolvers.findMany(),
      prepareArgs: {
        filter: (source) => ({
          user: source._id
        })
      },
      projection: {_id: true}
    })

    UserTC.addRelation('company', {
      resolver: () => CompanyTC.mongooseResolvers.findById(),
      prepareArgs: {
        _id: (source: any) => source.company || null
      },
      projection: {company: true}
    })

    CompanyTC.addRelation('adminUsers', {
      resolver: () => CompanyTC.mongooseResolvers.dataLoaderMany(),
      prepareArgs: {
        _ids: (source: any) => source.adminUsers || null
      },
      projection: {adminUsers: true}
    })

    SomeObjectTC.addRelation('company', {
      resolver: () => CompanyTC.mongooseResolvers.findById(),
      prepareArgs: {
        _id: (source: any) => source.company || []
      },
      projection: {company: true}
    })

    SomeObjectTC.addRelation('user', {
      resolver: () => UserTC.mongooseResolvers.findById(),
      prepareArgs: {
        _id: (source: any) => source.user || []
      },
      projection: {user: true}
    })
  }

  addResolvers()
  addRelations()

  return schemaComposer.buildSchema()
}

export {createGQLSchema}

const authorizationCheck = (next) => {
  return async (rp) => {
    // You could check authorization here
    return next(rp)
  }
}
