require('dotenv').config();

const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
  try {
    await sequelize.authenticate();
    const blogs = await sequelize.query("select * from blogs", { type: QueryTypes.SELECT });
    console.log(blogs);
    sequelize.close();
  } catch (error) {
    console.log(error);
  }
};

main();