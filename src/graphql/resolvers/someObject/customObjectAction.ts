import {ValidationError} from 'graphql-compose-mongoose'
import {schemaComposer} from 'graphql-compose'
import {CompanyModel, SomeObjectModel} from '@/models'

function Resolver() {
  const customReturnType = `
        type CustomReturnType {
            id: ID
            stuff: SomeCustomObjectStuff
        }

        type SomeCustomObjectStuff {
            property1: String
            property2: Int
        }
        `
  schemaComposer.addTypeDefs(customReturnType)

  const resolver = {
    name: 'customObjectAction',
    type: 'CustomReturnType',
    args: {
      id: 'ID!',
      property: 'String!'
    },
    description: 'Custom resolver for a SomeObject action',
    resolve: async ({args, context}: any) => {
      const obj = await SomeObjectModel.findOne({name: args.name})
      obj.property = args.property
      await obj.save()

      return {
        id: obj._id,
        stuff: {
          property1: obj.property,
          property2: obj.property.length
        }
      }
    }
  }

  return resolver
}

export default Resolver
