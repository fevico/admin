module.exports = {
  // development: {
  //   username: process.env.DB_USER || 'root',
  //   password: process.env.DB_PASSWORD || 'FileOpen@2022',
  //   database: process.env.DB_DATABASE || 'screwsspanners',
  //   host: process.env.DB_HOST || '127.0.0.1',
  //   port: process.env.DB_PORT || 3306,
  //   dialect: 'mysql',
  // },

// module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || null, // Null for no password
    database: process.env.DB_DATABASE || 'screwsan',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },
  // test: { /* ... */ },
  // production: { /* ... */ },
// };
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'FileOpen@2022',
    database: process.env.DB_DATABASE || 'screwsspanners',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'FileOpen@2022',
    database: process.env.DB_DATABASE || 'screwsspanners', 
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
  },
};