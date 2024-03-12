export default {
  beforeCreate: async ({params}) => {
    // find the Admin user who is creating the post
    const adminUserId = params.data.createdBy;
  
    // find the corresponding Author
    const author = (await strapi.entityService.findMany("api::author.author", {
      filters: {
        admin_user: [adminUserId]
      }
    } as any ))[0]

    // update the payload of the request for cheating the new post 
    // by adding the author's id to the post's data
    params.data.authors.connect = [...params.data.authors.connect, author.id];
  }
}