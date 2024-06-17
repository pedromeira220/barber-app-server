import { app } from "./app";
import "dotenv"
import { env } from "./env";

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`> Server running on port: ${PORT}`);
})