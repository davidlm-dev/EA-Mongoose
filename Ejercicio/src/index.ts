const mongoose = require('mongoose');

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/ea-mongoose')
.catch((error: unknown) => console.log(error));
// Importar modelos
import { UserModel } from './models/User';
import { PostModel } from './models/Post';

async function main() {
    // Crear dos usuarios
    const user1 = new UserModel({
        name: "Leanne Graham",
        username: "Bret",
        email: "Sincere@april.biz",
        phone: "1-770-736-8031 x56442",
        company: { name: "Romaguera-Crona" }
    });
    await user1.save();

    const user2 = new UserModel({
        name: "Ervin Howell",
        username: "Antonette",
        email: "Shanna@melissa.tv",
        phone: "010-692-6593 x09125",
        company: { name: "Deckow-Crist" }
    });
    await user2.save();

    // Crear cuatro posts asociados a los usuarios
    const post1 = new PostModel({ title: "Post 1", content: "Contenido 1", user: user1._id });
    const post2 = new PostModel({ title: "Post 2", content: "Contenido 2", user: user1._id });
    const post3 = new PostModel({ title: "Post 3", content: "Contenido 3", user: user2._id });
    const post4 = new PostModel({ title: "Post 4", content: "Contenido 4", user: user2._id });
    
    await post1.save();
    await post2.save();
    await post3.save();
    await post4.save();

    await UserModel.findByIdAndUpdate(user1._id, { $addToSet: { posts: post1._id } });
    await UserModel.findByIdAndUpdate(user1._id, { $addToSet: { posts: post2._id } });
    await UserModel.findByIdAndUpdate(user2._id, { $addToSet: { posts: post3._id } });
    await UserModel.findByIdAndUpdate(user2._id, { $addToSet: { posts: post4._id } });

    // Obtener un post y popular los datos del usuario
    const populatedPost = await PostModel.findOne({ title: "Post 2" }).populate('user');
    console.log("Post con usuario poblado:", populatedPost);

    // Listar todos los posts
    const allPosts = await PostModel.find({});
    console.log("Todos los posts:", allPosts);

    // Eliminar un post
    await PostModel.findByIdAndDelete(post3._id);
    await UserModel.findByIdAndUpdate(user2._id, { $pull: { posts: post3._id } });
    console.log("Post eliminado");

    // Buscar otro post después de la eliminación
    const remainingPost = await PostModel.findOne({ title: "Post 4" }).populate('user');
    console.log("Otro post encontrado:", remainingPost);

    // Mostrar todos los posts después de la eliminación
    const updatedPosts = await PostModel.find({});
    console.log("Posts después de la eliminación:", updatedPosts);

    // Uso de Aggregation Pipeline para contar posts por usuario
    const postCount = await PostModel.aggregate([
        { $group: { _id: "$user", totalPosts: { $sum: 1 } } }
    ]);
    console.log("Conteo de posts por usuario:", postCount);

    // Desconectar de MongoDB
    mongoose.disconnect().then(() => console.log("Desconectado de MongoDB"));
}

main();
