import { createDanceAreas } from './modules/createDanceAreas'

export const _scene = new Entity('_scene')
engine.addEntity(_scene)
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(1, 1, 1),
})
_scene.addComponentOrReplace(transform)
 
// Ground
const entity = new Entity('entity')
engine.addEntity(entity)
entity.setParent(_scene)
const gltfShape = new GLTFShape('models/FloorBaseGrass_01/FloorBaseGrass_01.glb')
gltfShape.withCollisions = false
gltfShape.isPointerBlocker = true
gltfShape.visible = true
entity.addComponentOrReplace(gltfShape)
const transform2 = new Transform({   
  position: new Vector3(8, 0, 8), 
  rotation: new Quaternion(0, 0, 0, 1), 
  scale: new Vector3(1, 1, 1),
})
entity.addComponentOrReplace(transform2)

 

// Static Structure
const structure = new Entity('structure')
engine.addEntity(structure)
structure.setParent(_scene)
const gltfShape2 = new GLTFShape('models/staticStructure.glb')
gltfShape2.withCollisions = true
gltfShape2.isPointerBlocker = true
gltfShape2.visible = true
structure.addComponentOrReplace(gltfShape2)
const transform3 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: Quaternion.Euler(0, 0, 0),
  scale: new Vector3(1, 1, 1),
})
structure.addComponentOrReplace(transform3)


createDanceAreas()


