
export default {
  install: (app, { connection, options }) => {
    console.log(connection)
    var socket = io(connection, options);
    app.config.globalProperties.$socket = socket;
    app.provide("socket", socket);
  },
};