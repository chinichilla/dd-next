import {
  idArg,
  makeSchema,
  objectType,
  stringArg,
  booleanArg
} from 'nexus'
import { getUserId } from '../utils'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.photon.users.findOne({
          where: {
            id: userId,
          },
        })
      },
    })
    // added in boilerplate part 1
    t.list.field('users', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        return ctx.photon.users.findMany({});
      }
    });
    t.list.field('feed', {
      type: 'Post',
      resolve: (parent, args, ctx) => {
        return ctx.photon.posts.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
        // added in boilerplate part 1
        published: booleanArg(),

      },
      resolve: (parent, { searchString, published }, ctx) => {
        return ctx.photon.posts.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: searchString,
                },
              },
              {
                content: {
                  contains: searchString,
                },
                
              },
              {
                title: {
                  contains: published,
                },
              },
              {
                content: {
                  contains: published,
                },
              },
            ],
          },
        })
      },
    })

    t.field('post', {
      type: 'Post',
      nullable: true,
      args: { id: idArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.photon.posts.findOne({
          where: {
            id,
          },
        })
      },
    })
  },
})
