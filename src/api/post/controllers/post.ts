// 'use strict';

/**
 * post controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController(
  'api::post.post', 
 ({ strapi }) => ({

  async healthCheck(ctx) {

    await strapi.service("api::post.post").exampleService('example');

    try {
      ctx.body = "ok";
    } catch (err) {
      ctx.body = err;
    }
  },

  // 1:solution but not the best (fetched all posts and filtered them afterwards)
  // async find (ctx) {
  //   // fetch all posts
  //   const { data, meta} = await super.find(ctx);

  //   console.log(ctx.state.user, "ctx.state.user");

  //   if(ctx.state.user){
  //     return { data, meta };
  //   }

  //   const filteredData = data.filter((post) => !post.attributes.premium);
  //     return { data: filteredData, meta };
  // },
  
  // 2:solution DOESNT WORK right
  // async find (ctx) {
  //   // if the request is authenticated
  //   // const isRequestingNonPremium = ctx.query.filters &&   String(ctx.query.filters.premium["$eq"]) == "false";

 
  //   if(ctx.state.user ){
  //     return await super.find(ctx);
  //   } 
  //   // if the request is public
  //   // ... let's call the underlying service with an additional filter param: premium = false
  //   // /posts?filters[premium]=false
  //   const filteredPosts = await strapi.service("api::post.post").find({ 
  //     filters: { 
  //       premium: false 
  //     }
  //   });
  //   const sanitizedPosts = await this.sanitizeOutput(filteredPosts, ctx);
  //   return this.transformResponse(sanitizedPosts);
  // }

  // 3:solution

  // async find(ctx) {

  //   // const isRequestingNonPremium = ctx.query.filters && ctx.query.filters.premium["$eq"] == "false";
  //   // if the request is authenticated or explicitly asking for public content only
  //   const isRequestingNonPremium: boolean =
  //   ctx.query.filters &&
  //   (typeof ctx.query.filters === 'object') &&  // Check if it's an object
  //   (ctx.query.filters as Record<string, any>).premium &&  // Use type assertion
  //   (ctx.query.filters as Record<string, any>).premium["$eq"] === false;

  //   if(ctx.state.user || isRequestingNonPremium){
  //     return await super.find(ctx);
  //   }

  //   const publicPosts = await strapi.service("api::post.post").findPublic(ctx.query);

  //   const sanitizedPosts = await this.sanitizeOutput(publicPosts, ctx);
  //   return this.transformResponse(sanitizedPosts);
  // }

 
  async findOne(ctx){
    if(ctx.state.user){
      return await super.findOne(ctx);
    }
  
    const { id } = ctx.params; // /posts/:id
    const { query } = ctx;
  
    const postIfPublic = await strapi.service('api::post.post').findOnePublic({id, ...query});
    const sanitizedEntity = await this.sanitizeOutput(postIfPublic, ctx);
    
    return this.transformResponse(sanitizedEntity);
    },

  async likePost(ctx){
      // ctx is the context object that contains the request and response objects
      // we done need that because strapi will handle it for us
      // if(!ctx.state.user){
      //   return ctx.forbidden("Only authenticated users can like posts");
      // }
      const user = ctx.state.user; // user trying to like the post
      const postId = ctx.params.id; // the post that the user is trying to like
      const { query } = ctx;
    
      // 1. check if the user has already liked the post
      const updatedPost = await strapi.service('api::post.post').likePost({postId, userId: user.id, query}); 
      const sanitizedEntity = await this.sanitizeOutput(updatedPost, ctx);
      
      return this.transformResponse(sanitizedEntity);
    }
  }
));