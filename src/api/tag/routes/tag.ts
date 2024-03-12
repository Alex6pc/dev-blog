/**
 * tag router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::tag.tag', {
  prefix: '', // /tags --> /test/tags
  only: ['find', 'findOne'],
  except: ['create'],
  config: {
    find: {
      auth: false, // if false disable authentication the JWT for this route
      policies: [],
      middlewares: [],
    },
    findOne: {},
    create: {},
    update: {},
    delete: {},
  },
});
