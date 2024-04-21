import { app } from "./app";
import "dotenv"

const PORT = 3333

app.listen(PORT, () => {
  console.log(`> Server running on port: ${PORT}`);
})