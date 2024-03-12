module.exports = {
  routers: [
    {
      method: 'GET',
      path: '/posts/example',
      handler: 'myCustomController.example',
      config: {
        // some configuration
      }
    }

  ]
}