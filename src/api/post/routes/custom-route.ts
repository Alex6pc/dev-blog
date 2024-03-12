// module.exports = {
//   routes: [
//     {
//       method: 'GET',
//       path: '/posts/example',
//       handler: 'api::post.post.healthCheck', // controller method
//       config: {
//         // some configuration
//       },
//     },
//   ],
// };


export default { 
  routes: [
    {
      method: 'GET',
      path: '/posts/example',
      handler: 'api::post.post.healthCheck', // controller method
      config: {
        // some configuration
      },
    },
  ],
};