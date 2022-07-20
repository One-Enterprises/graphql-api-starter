# GraphQL API Starter

## To add or modify a model

Make changes in the `/src/models/models.ts` file. Then run `npm run gentypes` to regenerate the typescript types for the new or updated mongoose models. These types will be available in `/src/models/types.ts`

## To add or modify a resolver

All custom resolvers live in `/src/graphql/resolvers`. Create a new file for a new resolver in a subfolder relating to the object the resolver is for. (ex: SomeObject resolvers will live in `/src/graphql/resolver/someObject`). Follow the resolver template to create the resolver. Run `npm run generate-barrels` to regenerate barrels so all resolvers are exported from `/src/grahpql/resolvers/index.ts` and they can be imported into the schema file with `import * as resolvers from '@/graphql/resolvers'`
