/**
 * tag service
 */

import { factories } from '@strapi/strapi'; 

export default factories.createCoreService('api::post.post', ({ strapi }) =>  ({
  // Method 1: Creating an entirely custom service
  async exampleService(...args) {
    console.log(args);
    
    let response = { okay: true }

    if (response.okay === false) {
      return { response, error: true }
    }

    return response
  },

  // Method 2: Wrapping a core service (leaves core logic in place)
  async find(...args) {  
    // Calling the default core controller
    const { results, pagination } = await super.find(...args);

    // some custom logic
    results.forEach(result => {
      result.counter = 1;
    });

    return { results, pagination };
  },

  // Declare and define the getFetchParams method
  getFetchParams(params: object): object {
    // Implement your logic for creating and returning fetch parameters
    // For example:
    return {
      headers: {
        'Content-Type': 'application/json',
        // Add other headers as needed
      },
      // Add other fetch parameters as needed
      ...params,
    };
  },
  
 // Method 3: Replacing a core service
//  async findOne(entityId, params = {}) {
  
//   return strapi.entityService.findOne('api::post.post', entityId, this.getFetchParams(params));
// },

async findPublic(args) {
  const newQuery = {
    ...args,
    filters: {
      ...args.filters,
      premium: false,
    },
  };
  const publicPosts = await strapi.entityService.findMany('api::post.post', this.getFetchParams(newQuery));
  return publicPosts;
 },

async findOnePublic(args){
    const { id, query } = args;

    const post = await strapi.entityService.findOne('api::post.post', id, this.getFetchParams(query));
    
    return post.premium ? null : post;
 },

 async likePost(args) {
  const { postId, userId, query } = args;

  // use the underlying entity service API to fetch the post and, in particular, the likedBy property
  const postToLike = await strapi.entityService.findOne('api::post.post', postId, {
    populate: ['likedBy']
   });
  
  // use the underlying entity service API to update the current post with the new relation
  const updatedPost = await strapi.entityService.update('api::post.post', postId, {
    data: {
      likedBy: [...postToLike.likedBy, userId]
  },
  ...query
  });
  return updatedPost;
 }
}));