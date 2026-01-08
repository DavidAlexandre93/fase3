
import postsRoutes from "./postsRoutes.js";
import validacaoRoutes from "./validacaoRoutes.js";
import comentariosRoutes from "./comentariosRoutes.js";


const indexRoutes = (app) => {
  app.use("/posts", postsRoutes);
  app.use("/comentarios", comentariosRoutes);
  app.use('/usuario', validacaoRoutes);
};

export default indexRoutes;

