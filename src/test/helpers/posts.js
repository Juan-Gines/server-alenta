import ImageModel from '#Models/image.js'
import PostModel from '#Models/post.js'
import { createOnePost, getAllPosts } from '#Services/postService.js'
import { getToken, userDBInit } from './user.js'

// Post iniciales para la BD

const initialPosts = [
  {
    title: 'El post del user 1',
    body: 'El body del post del user 1',
    extract: 'Extracto del post del user 1'
  },
  {
    title: 'El post del user 2',
    body: 'El body del post del user 2',
    extract: 'Extracto del post del user 2'
  }
]

// Datos para insertar un nuevo post

const newPost = {
  title: 'Nuevo post',
  body: 'Body del nuevo post',
  extract: 'Extracto del nuevo post'
}

// Id de un post inexistente

const fakePostId = '64cf7548a22457137656ee5d'

// Iniciamos la BD con 4 registros de 2 usuarios

const postDBInit = async () => {
  const users = await userDBInit()
  await PostModel.deleteMany({})
  await ImageModel.deleteMany({})
  const token = await getToken(0)
  const post1 = await insertPost(users[0], initialPosts[0])
  const post2 = await insertPost(users[1], initialPosts[1])
  return [token, post1, post2]
}

// Inserta un post dentro de la DB

const insertPost = async (user, post) => {
  const postInserted = await createOnePost(user, post)
  return postInserted
}

// Recuperamos todos los posts de la DB

const getPosts = async () => {
  const res = await getAllPosts()
  return res
}

// Borramos un post de la BD dejando la id en el usuario

const deleteFakePost = async (id) => {
  const post = PostModel.findById(id)
  await post.deleteOne()
}

// Texto de mas de 1000 letras para test

const badPost = {

  errMinText: 'sd2',
  errLongText: 'Lorem ipsum dolor sit amet consectetur adipiscing elit senectus nulla non sociosqu, augue faucibus diam dictum erat eu ad dui lacinia maecenas, porttitor interdum placerat scelerisque metus purus lectus sed ante libero. Rutrum fusce iaculis egestas a tempus semper cum ac pulvinar, dictumst magnis eget vel volutpat platea magna tempor gravida, aliquam urna mattis feugiat hendrerit suscipit posuere pharetra. Varius aliquet himenaeos cubilia suspendisse nisl mus ultricies vehicula, luctus dis arcu curabitur in nunc curae, eleifend risus elementum justo vulputate euismod tristique. Tortor felis ut tincidunt habitasse accumsan praesent facilisi, eros neque nascetur porta duis pellentesque, dignissim fringilla vestibulum class taciti sagittis. Etiam enim massa nec sapien parturient et nostra, viverra venenatis fames nibh donec mollis, habitant penatibus blandit facilisis lacus hac. Netus sodales ridiculus ullamcorper laoreet phasellus mauris morbi molestie potenti inceptos condimentum, cras aptent leo proin quis primis quam ligula integer rhoncus nullam odio, montes id auctor est mi orci dapibus sem ultrices tellus. Turpis torquent imperdiet malesuada conubia litora, fermentum consequat velit. Lobortis sociis nam quisque natoque commodo ornare at cursus per, vivamus congue pretium aenean nisi convallis sollicitudin vitae bibendum, inceptos phasellus consequat risus potenti eleifend non imperdiet. Ultricies erat posuere nullam tempus fusce vulputate ac scelerisque vivamus nisl aptent, libero rutrum venenatis dui est hendrerit cum massa at lacus, sem vestibulum nibh in magna sollicitudin nascetur fringilla facilisi quisque. Magnis turpis senectus habitant lacinia id himenaeos odio ornare, blandit tempor duis penatibus vitae volutpat mattis, pretium dignissim morbi montes laoreet dictumst ridiculus. Interdum orci cursus malesuada neque commodo ad integer accumsan, suspendisse curae mus taciti tortor euismod placerat aenean felis, habitasse sed curabitur sociosqu arcu parturient sagittis. Platea metus class mi gravida conubia et pulvinar a nulla urna dapibus, torquent eros molestie aliquam donec luctus suscipit nisi egestas elementum iaculis, quis ullamcorper auctor bibendum varius rhoncus natoque cras convallis vehicula. Pellentesque congue lectus leo nam pharetra primis etiam ultrices, diam hac porttitor nunc litora nec quam ligula, dis per enim ut netus velit praesent. Ante mauris vel purus porta fermentum maecenas dictum lobortis tincidunt eu, sociis aliquet semper nostra mollis viverra feugiat eget sodales. Justo sapien facilisis augue cubilia tellus condimentum faucibus, proin tristique fames quisque justo accumsan, nostra facilisis magnis aenean suspendisse nam. Condimentum rutrum malesuada a iaculis purus vulputate turpis vivamus, neque eget enim natoque viverra velit egestas, pellentesque sapien vestibulum ullamcorper himenaeos primis aliquam. Montes venenatis porta ac euismod commodo est porttitor, semper ad ultricies quam non tempus felis taciti, magna erat proin aliquet habitasse lobortis. Hac orci dis sodales tellus mi inceptos rhoncus sem dictum, mattis curabitur lacinia urna tincidunt varius phasellus. Nisl id integer in facilisi feugiat at volutpat netus metus hendrerit dictumst tristique, tortor curae mauris suscipit lectus lacus eros nibh vehicula potenti. Interdum nec sociis libero eu luctus pulvinar tempor per, massa ultrices ut risus posuere penatibus mus, ridiculus habitant vel fusce quis vitae sollicitudin. Mollis aptent sed sagittis scelerisque cursus nascetur nisi cubilia fames faucibus, elementum nulla praesent nullam auctor congue etiam imperdiet odio augue, ornare et ligula placerat gravida molestie cras ante pretium. Bibendum leo nunc blandit diam platea maecenas litora, dapibus parturient dignissim pharetra morbi duis fermentum sociosqu, cum consequat dui torquent laoreet donec. Convallis conubia class senectus fringilla eleifend arcu dapibus lacus quis, elementum libero felis facilisi sapien iaculis id vulputate urna, massa pretium potenti aptent faucibus torquent congue himenaeos. Diam ante cras tristique fermentum cursus suscipit, morbi nisi nibh a aliquam, mus parturient netus quisque blandit. Nascetur vel aenean taciti vivamus vehicula magna per orci, fringilla laoreet fusce metus viverra litora sociosqu proin dignissim, mi nisl imperdiet placerat interdum scelerisque dictum. Aliquet integer eget dictumst ultrices varius enim risus, euismod lacinia mauris tincidunt etiam vitae. Molestie nostra curae hac vestibulum nullam inceptos non, mattis dis leo natoque phasellus ornare nam pulvinar, fames conubia senectus at sed nec. Convallis arcu cubilia eros eleifend malesuada ad class neque, porttitor consequat sociis pharetra justo posuere pellentesque facilisis, ut rutrum accumsan in gravida purus nunc. Duis primis sem montes egestas rhoncus venenatis platea augue ligula lobortis quam praesent penatibus ullamcorper habitasse, luctus turpis semper mollis donec auctor sollicitudin erat ultricies sagittis curabitur sodales est nulla. Porta maecenas tempor lectus tellus magnis cum bibendum ac, eu ridiculus tempus odio habitant feugiat. Volutpat velit dui commodo suspendisse hendrerit condimentum tortor et faucibus, aptent himenaeos molestie sodales tellus vulputate lacus orci habitant, sem maecenas varius rutrum phasellus malesuada dictum neque. Ac tempus in metus dictumst leo etiam feugiat aliquam ad, vel nibh a sollicitudin cursus primis integer fames mi est, proin ridiculus donec lectus nisl praesent bibendum non. Ligula ultrices euismod torquent netus posuere pretium felis et, montes suspendisse mattis mus taciti hendrerit accumsan, turpis dapibus convallis vehicula vestibulum rhoncus vitae. Hac elementum egestas arcu porttitor nulla mauris curae tincidunt id ornare, viverra fusce odio interdum nullam ut vivamus per inceptos eu, ante diam class porta laoreet curabitur potenti nostra quisque. Tortor nisi commodo sagittis fermentum urna risus nunc eros eleifend, condimentum aliquet magnis morbi cubilia penatibus semper at, luctus aenean fringilla facilisi scelerisque pharetra sed magna. Justo lacinia placerat natoque lobortis consequat pellentesque enim, quis platea cras gravida dui congue ullamcorper parturient, sociis litora iaculis suscipit blandit eget. Cum augue ultricies purus duis nam senectus nascetur venenatis, tristique libero dis auctor mollis facilisis. Nec massa dignissim pulvinar sociosqu tempor habitasse erat velit quam volutpat imperdiet conubia sapien etiam, bibendum potenti aliquet sociis habitasse rhoncus nulla dictumst pulvinar donec nisi nam pellentesque. Aenean dis class eu nascetur lobortis morbi, senectus conubia fringilla volutpat per habitant sociosqu, dictum suspendisse primis hendrerit mus. Arcu cras cubilia tristique vivamus platea lectus vitae, venenatis inceptos ut enim metus nibh ultricies quisque, urna sapien convallis fermentum velit cum. Aptent quam elementum scelerisque netus ornare dignissim duis eget sem mi, posuere mauris non ridiculus eros parturient vulputate litora. Tempus accumsan lacus a sollicitudin augue viverra torquent laoreet sodales congue est, himenaeos condimentum varius magna eleifend risus euismod ad felis lacinia montes, odio integer porttitor et turpis maecenas mollis libero purus natoque. Interdum orci ultrices pretium porta vel luctus pharetra vestibulum, aliquam sagittis faucibus neque hac auctor.'
}

export {
  postDBInit,
  insertPost,
  newPost,
  getPosts,
  fakePostId,
  deleteFakePost,
  badPost
}
