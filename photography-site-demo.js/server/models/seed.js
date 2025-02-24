'use strict';

require('dotenv').config();

const Category = require('./Category');
const Photo = require('./Photo');
const PhotoEmbedding = require('./PhotoEmbedding');
const connect = require('./connect');
const getPhotoEmbedding = require('../utils/imageEmbeddingGenerator');
const getTextEmbedding = require('../utils/textEmbeddingGenerator');
const mongoose = require('./mongoose');
const { tableDefinitionFromSchema } = require('stargate-mongoose');

const vectorKey = process.env.DATA_API_TABLES ? 'vector' : '$vector';

async function deleteAll() {
  if (process.env.DATA_API_TABLES) {
    await mongoose.connection.dropTable('categories');
    await mongoose.connection.dropTable('photos');
    await mongoose.connection.dropTable('photoembeddings');
  } else {
    try {
      await Category.db.dropCollection('categories');
      await Category.db.dropCollection('photos');
      await Category.db.dropCollection('photoembeddings');
    } catch (error) {
    }
  }
}

async function createCategories() {
  if (process.env.DATA_API_TABLES) {
    await mongoose.connection.createTable('categories', tableDefinitionFromSchema(Category.schema));
  } else {
    await Category.createCollection();
  }
  await Category.create({
    name: 'landscape',
    image: 'montery.png'
  });
  await Category.create({
    name: 'animal',
    image: 'seal.png'
  });
  await Category.create({
    name: 'street',
    image: 'park1.png'
  });
}


const data = [
  {
    name: 'dog-in-car-window',
    description: 'The image depicts a dog inside a car, peering out of the window with curiosity. The dog\'s furry face fills the frame, suggesting that it is the main subject of the image. Surrounding the dog\'s excited gaze, a vibrant blur of red lights creates an interesting backdrop, providing a sense of movement and speed. As the dog looks out, its gaze is drawn towards the rearview mirror, where a mischievous cat can be seen. The cat\'s reflection in the mirror adds a playful element to the scene, as it watches the dog from a distance. The mirror captures a clear view of the cat, with its green eyes fixed on the dog, creating a sense of intrigue and fascination. In the foreground, the dog is wearing a collar, indicating that it is a cherished pet. Its fur is well-groomed and hints at a breed with long, fluffy hair. The natural lighting from the car window highlights the dog\'s expressive eyes, giving it a sense of life and personality. Overall, the image captures a moment of curiosity and anticipation within the confined space of a car, as the dog and the cat exchange glances, creating an air of anticipation and excitement.',
    category: 'animal',
    image: 'dog.png'
  },
  {
    name: 'an-old-park',
    description: 'In a picturesque park, where lush greenery and towering trees create a tranquil atmosphere, a bench takes center stage. The park exudes an air of peacefulness and serves as a gathering spot for people of all ages. Perched on the bench is a woman, enjoying a moment of solitude. Her relaxed posture suggests contentment as she takes in the surrounding scenery. Close by, another person sits on a separate bench, nestled next to a towering tree. Children find joy in the park\'s playground area, where they engage in various activities. One boy enthusiastically plays with a frisbee, his energy radiating as he throws it back and forth. Nearby, a young boy skillfully maneuvers down a railing, clutching a box tightly in his hands. His excitement is palpable, and he showcases his dexterity and fearlessness. The park\'s vibrancy extends beyond the playground, as another child enthusiastically plays with a ball, their energy and enthusiasm on full display. Additionally, a boy speeds through the park on a skateboard, effortlessly gliding along the path. His confidence and thrill are evident as he revels in the freedom the park provides. This idyllic park scene presents a perfect blend of relaxation, recreation, and natural beauty, making it an inviting space for people of all ages to unwind and enjoy the serene surroundings.',
    category: 'street',
    image: 'park.png'

  },
  {
    name: 'hamster-by-the-sea',
    description: 'In a breathtaking coastal landscape, a picturesque grassy area stretches towards the ocean, creating a serene backdrop for the captivating wildlife. Nestled within this tranquil setting, a vibrant squirrel strikes an elegant pose, its fluffy tail held high and its paws delicately touching the verdant grass. The squirrel\'s sleek fur glistens under the warm sunlight, showcasing a rich blend of colors, from shades of brown to hints of red and gray. Its alert eyes reflect both intelligence and curiosity. As the squirrel explores its surroundings, it gracefully moves through a field of flourishing plants, adding a touch of vibrancy to the scene. Tall grasses sway gently in the wind, creating a textured landscape that captures the essence of untamed nature. Impressively tall and majestic, a giraffe stands proudly amidst the lush grass. Its slender neck reaches towards the sky, while its large, expressive eyes observe the surroundings with a sense of calm and tranquility. Its irregular pattern of brown spots, ranging in size and shape, decorates its long body. Completing the visual narrative, the vast expanse of the sparkling ocean stretches out in the distance, its deep blue hues blending harmoniously with the clear sky above. Though slightly blurred, the image suggests a sense of serenity and infinity. In this captivating image, the symbiotic relationship between land and sea becomes apparent, as the squirrel harmoniously coexists with its natural environment, while the giraffe stands tall in its own domain, both bound together by the beauty of nature.',
    category: 'animal',
    image: 'hamster.png'

  },
  {
    name: 'tree-in-shenandoah',
    description: 'Hidden among the vibrant foliage of a dense forest, a majestic lone tree stands tall and proud. Its thick trunk and sprawling branches reach towards the sky, casting a graceful silhouette against the backdrop of verdant surroundings. Bathed in soft, dappled sunlight, the tree epitomizes resilience and serenity. Perched on one of the gnarled branches is a bald eagle, its regal presence commanding attention. With feathers shimmering in shades of brown and white, the bird exudes power and grace. Its sharp gaze, akin to piercing sapphire, surveys the forest below with unwavering focus, encapsulating the essence of freedom and untamed spirit. From its elevated vantage point, the eagle overlooks the lush expanse of the forest, a sprawling tapestry of various shades of green. The canopy stretches out as far as the eye can see, teeming with life and abuzz with the symphony of nature. A sense of tranquility and harmony permeates the air, inviting one to appreciate the beauty of the natural world. In this peaceful, secluded corner of the forest, the solitary tree and the majestic eagle create a captivating tableau, symbolizing the untamed wonder and resolute strength that can be found in the heart of nature.',
    category: 'landscape',
    image: 'tree1.png'
  },
  {
    name: 'DC-street-night',
    description: 'The image depicts a city street scene at night with various cars and traffic. The overall view captures several cars on the street, along with a black car driving down the road. In the foreground, a person can be seen crossing the street. They are illuminated by the street lights, indicating that it is nighttime. The image also shows a blurry image of a city street, adding depth to the overall scene. To the right, there is a truck parked in a parking lot. The truck stands out in contrast to the other cars on the road. The image further reveals a group of cars in a parking lot at night, indicating a crowded parking area. Near the parking lot, a blurry image of a parking meter can be observed. Additionally, a white car is visible on the street, and a woman is sitting inside the car. This suggests that she is either waiting or driving. The texts visible in the image are: "UNION," "VRZ-3059," "VIRGINIA," and "TWG-4060." These texts may refer to car model names, license plates, or other relevant information. Overall, the image portrays a lively city street at night, showcasing moving cars, a parked truck, and a person crossing the street.',
    category: 'street',
    image: 'dmv.png'

  }, {
    name: 'sleeping-seal',
    description: 'The image portrays a serene coastal scene, where a sea lion basks lazily on a rocky outcrop partially submerged in the clear blue water. The sea lion\'s sleek body rests comfortably on the weathered surface of the rock, while the gentle waves lap against it. To the left of the sea lion, a man sits calmly in a small boat, enjoying the peaceful surroundings. The boat floats effortlessly on the calm water, allowing the man to observe the sea lion in its natural habitat. In the distance, a large rock juts out of the water, creating an interesting focal point and adding to the overall beauty of the scene. The combination of the sea lion, the boat, and the rock creates a harmonious tableau of nature\'s tranquility.',
    category: 'animal',
    image: 'seal.png'
  }, {
    name: 'montery',
    description: 'Perched atop rocky cliffs, the viewer of this stunningly evocative image is treated to a breathtaking coastal vista. The cliffs, jutting out into the vast expanse of the ocean, create a dramatic setting. From the aerial perspective, one can fully appreciate the grandeur of nature\'s creation. In the background, the turquoise waters of the ocean stretch out as far as the eye can see, fading into the horizon. The rhythmic crashing of the waves against the rocks adds to the symphony of sights and sounds. At the forefront of this majestic landscape, a solitary rock braves the relentless onslaught of the waves, standing as a testament to the forces of nature. Its weathered surface bears witness to the eons of time that have shaped it. In the distance, other rock formations emerge from the depths of the ocean, their jagged edges adding texture to the scene. The waves, fueled by their unyielding energy, crash over the rocks in a spectacular display of power and beauty. The sheer scale and splendor of the cliffs and the ocean fill the viewer with awe and admiration for the marvels of the natural world. This image encapsulates the raw beauty and unforgiving nature of coastal landscapes, captivating all who gaze upon it.',
    category: 'landscape',
    image: 'montery.png'
  }, {
    name: 'giraffe-on-the-field',
    description: 'The image shows a tall grass field with trees in the background. In the center of the image, a giraffe is standing among the tall grass. Its head is also visible, facing the viewer. The giraffe is depicted in the same grassy environment indicated by the surrounding grass. At the bottom of the image, there is some text that reads "Vugt Du" in a small font size.',
    category: 'animal',
    image: 'giraffe.jpg'

  }, {
    name: 'clouds-of-sunset',
    description: 'The image depicts a mesmerizing landscape where a vibrant sunbeam penetrates through a canopy of fluffy clouds, casting a warm and ethereal glow over the scene. The scene unfolds above a rural meadow, with the soft rays of the sun illuminating the sprawling field below. In the distance, a bustling city skyline emerges, backdropped by the billowing clouds. As the day draws to a close, the sun gracefully sets behind a gentle hill on the horizon, infusing the entire atmosphere with a golden hue. The overall ambiance evokes a sense of tranquility and serenity, with the interplay of light and shadow creating a captivating display of nature\'s beauty.',
    category: 'landscape',
    image: 'sunset.jpg'
  }, {
    name: 'burning-cloud',
    description: 'As the sun rises above a picturesque landscape, a breathtaking scene unfolds before the viewers\' eyes. In the distance, a vast, open field stretches out, bathed in the warm glow of dawn. Dominating the background, a modest yet sturdy barn stands proudly, showcasing its rustic charm against the morning sky. In the foreground, a serene body of water reflects the cloudy sky above, creating a harmonious and peaceful atmosphere. Nestled upon the tranquil surface, a solitary boat gently bobs, reminiscent of tranquil days spent in solitude and reflection. Adding a touch of intrigue and contrast, a silhouette of a grain silo can be seen against the vibrant colors of the setting sun. Its tall and slender form breaks the horizon, creating a striking visual element that adds depth and visual interest to the scene. Together, these elements paint a tranquil and idyllic picture, evoking a sense of peace and serenity as nature awakens to greet the new day.',
    category: 'landscape',
    image: 'burning-cloud.jpg'
  }, {
    name: 'big-rainbow',
    description: 'Underneath a clear blue sky, a vibrant double rainbow arcs gracefully across the image, enveloping a picturesque countryside scene. A vast expanse of lush green grass extends as far as the eye can see, interrupted only by the occasional cluster of tall, slender corn stalks. At the edge of the field, the corn reaches its maximum height, forming a dense barrier against the outside world. In the foreground, a patch of tall grass sways gently in the wind, adding a touch of natural beauty to the idyllic landscape.',
    category: 'landscape',
    image: 'rainbow.jpg'
  }
];

async function createPhotos() {
  if (process.env.DATA_API_TABLES) {
    await mongoose.connection.createTable('photos', tableDefinitionFromSchema(Photo.schema));
    await mongoose.connection.collection('photos').createVectorIndex('photosvector', 'vector');
  } else {
    await Photo.createCollection();
  }
  for (let i = 0; i < data.length; i++) {
    await Photo.create({
      name: data[i].name,
      description: data[i].description,
      category: data[i].category,
      image: data[i].image,
      [vectorKey]: await getTextEmbedding(data[i].description)
    });
  }
}


async function createPhotoEmbeddings() {
  if (process.env.DATA_API_TABLES) {
    await mongoose.connection.createTable('photoembeddings', tableDefinitionFromSchema(PhotoEmbedding.schema));
    await mongoose.connection.collection('photoembeddings').createVectorIndex('photoembeddingsvector', 'vector');
  } else {
    await PhotoEmbedding.createCollection({
      indexing: { deny: ['description'] }
    });
  }
  for (let i = 0; i < data.length; i++) {
    await PhotoEmbedding.create({
      name: data[i].name,
      description: data[i].description,
      category: data[i].category,
      image: data[i].image,
      [vectorKey]: await getPhotoEmbedding(data[i].image)
    });
  }
}


async function populate() {
  await connect();
  if (!process.env.IS_ASTRA) {
    await mongoose.connection.createNamespace(mongoose.connection.namespace);
  }

  await deleteAll();
  await createCategories();
  await createPhotos();
  await createPhotoEmbeddings();

  await mongoose.disconnect();
  console.log('Done');
}

populate().catch(error => {
  console.error(error);
  process.exit(-1);
});
