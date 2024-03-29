import likePostModule from './api/post/graphql/post';
import { Strapi } from "@strapi/strapi"

// Now, you can access the individual properties
const likePostMutation = likePostModule.likePostMutation;
const getLikePostResolver = likePostModule.getLikePostResolver;
const likePostMutationConfig = likePostModule.likePostMutationConfig;

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');

    const extension = ({ nexus }) => ({
      // GraphQL SDL
      typeDefs: likePostMutation,
      resolvers: {
        Mutation: {
          likePost: getLikePostResolver(strapi),
      },
    },
      resolversConfig: {
        'Mutation.likePost': likePostMutationConfig,
      },
    });
    extensionService.use(extension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // we listen to lifecycle events
    strapi.db.lifecycles.subscribe({
      models: ['admin::user'], // only listen to events for this model
      afterCreate: async ({result}) => {
        // create an Author instance from the fields of the Admin user
        // that has just been created

        // Extract the fields from the newly created Admin User
        const {id, firstname, lastname, email, username, createdAt, updatedAt } = result;
        await strapi.service("api::author.author").create(
          {
            data: {
              firstname,
              lastname,
              email,
              username,
              createdAt,
              updatedAt,
              admin_user: [id]
            }
          }
        )
      },
      afterUpdate: async ({result}) => {
        // get the Author that corresponds to the Admin user
        // to the Admin User that's just been updated
        const correspondsAuthor = (
          await strapi.entityService.findMany("api::author.author", {
            populate: ["admin_user"],
            filters: {
              admin_user: {
                id: result.id
              },
            },
          })
        )[0];
        // update the Author instance with the fields of the Admin user
        const { firstname, lastname, email, username, createdAt, updatedAt } = result;
        await strapi.service("api::author.author").update(
          correspondsAuthor.id,
          {data: {
            firstname,
            lastname,
            email,
            username,
            createdAt,
            updatedAt
            }
          }
        )
      }
    })
  },
};
