import moongose from "mongoose";

const connectionDB = async () => {
  try {
    const conn = await moongose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connected ${conn.connection.host}`);
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
};

export default connectionDB
