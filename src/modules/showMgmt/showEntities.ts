import * as showMgmt from '@dcl/show-management' 
import { RunwayAvatar, RunwayCoord, startPositions } from './ext/runwayAvatar'


import { SHOW_MGR } from './showSetup'

//START ADDING syncable objects
// DJ Table
export const djTable = new showMgmt.ShowEntityModel( 
  "djTable",
  new GLTFShape('models/djTable.glb'),
  //new BoxShape(),
  {idleAnim:"deckTableOff",
  transform:new Transform( 
    {
      position: new Vector3(8, 0.7, 4),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(1, 1, 1),
    }
   )}
)

// Speakers
const gltfSpeaker = new GLTFShape("models/speakers.glb")
gltfSpeaker.withCollisions = true
gltfSpeaker.isPointerBlocker = true
gltfSpeaker.visible = true

const speakerR = new showMgmt.ShowEntityModel("speakerR",
gltfSpeaker, 
  { 
    startInvisible: false,
    idleAnim:"L0",
    transform:new Transform({
      position: new Vector3(8, 0.45, 8.7),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
    })
  }
)
//speakerR.entity.setParent(_scene)

const speakerL = new showMgmt.ShowEntityModel("speakerL",
gltfSpeaker,
  {
    startInvisible: false,
    idleAnim:"L0",
    transform:new Transform({
      position: new Vector3(8, 0.45, 8.7),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(-1, 1, 1),
    })
  }
)
//speakerL.entity.setParent(_scene)

// parLights
const gltfParLight = new GLTFShape("models/parLight.glb")
gltfParLight.withCollisions = true
gltfParLight.isPointerBlocker = true
gltfParLight.visible = true

const parLight = new showMgmt.ShowEntityModel("parLight",
gltfParLight, 
  { 
    startInvisible: false,
    idleAnim:"L0",
    transform:new Transform({
      position: new Vector3(8, 0, 8),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
    })
  }
)





// Dot Lights

const gltfdotLight = new GLTFShape("models/dotLight.glb")
gltfSpeaker.withCollisions = true
gltfSpeaker.isPointerBlocker = true
gltfSpeaker.visible = true

const dotLight01 = new showMgmt.ShowEntityModel("dotLight01", gltfdotLight,{idleAnim:"off", startInvisible: false, transform:
  new Transform({ position: new Vector3(12.265 , 2.523, 5.45),  rotation: Quaternion.Euler(0, 0, -90),})
})
const dotLight02 = new showMgmt.ShowEntityModel("dotLight02", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(12.12, 3.87, 5.45),  rotation: Quaternion.Euler(0, 0, -75),})
})
const dotLight03 = new showMgmt.ShowEntityModel("dotLight03", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(11.694 , 4.899, 5.45),  rotation: Quaternion.Euler(0, 0, -60),})
})
const dotLight04 = new showMgmt.ShowEntityModel("dotLight04", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(11.016, 5.782, 5.45),  rotation: Quaternion.Euler(0, 0, -45),})
})
const dotLight05 = new showMgmt.ShowEntityModel("dotLight05", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(10.133 , 6.46, 5.45),  rotation: Quaternion.Euler(0, 0, -30),})
})
const dotLight06 = new showMgmt.ShowEntityModel("dotLight06", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(9.104, 6.886, 5.45),  rotation: Quaternion.Euler(0, 0, -15),})
})
const dotLight07 = new showMgmt.ShowEntityModel("dotLight07", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(8 , 7.032, 5.45),  rotation: Quaternion.Euler(0, 0, 0),})
})
const dotLight08 = new showMgmt.ShowEntityModel("dotLight08", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(6.896, 6.886, 5.45),  rotation: Quaternion.Euler(0, 0, 15),})
})
const dotLight09 = new showMgmt.ShowEntityModel("dotLight09", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(5.867 , 6.46, 5.45),  rotation: Quaternion.Euler(0, 0, 30),})
})
const dotLight10 = new showMgmt.ShowEntityModel("dotLight10", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(4.984, 5.782, 5.45),  rotation: Quaternion.Euler(0, 0, 45),})
})
const dotLight11 = new showMgmt.ShowEntityModel("dotLight11", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(4.306 , 4.899, 5.45),  rotation: Quaternion.Euler(0, 0, 60),})
})
const dotLight12 = new showMgmt.ShowEntityModel("dotLight12", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(3.88, 3.87, 5.45),  rotation: Quaternion.Euler(0, 0, 75),})
})
const dotLight13 = new showMgmt.ShowEntityModel("dotLight13", gltfdotLight,{idleAnim:"off",  startInvisible: false, transform:
  new Transform({ position: new Vector3(3.735 , 2.523, 5.45),  rotation: Quaternion.Euler(0, 0, 90),})
})




SHOW_MGR.actionMgr.registerShowEntity("djTable",djTable) 

SHOW_MGR.actionMgr.registerShowEntity("speakerR",speakerR) 
SHOW_MGR.actionMgr.registerShowEntity("speakerL",speakerL)
SHOW_MGR.actionMgr.registerShowEntity("parLight",parLight)
SHOW_MGR.actionMgr.registerShowEntity("dotLight01",dotLight01)
SHOW_MGR.actionMgr.registerShowEntity("dotLight02",dotLight02) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight03",dotLight03) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight04",dotLight04) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight05",dotLight05) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight06",dotLight06) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight07",dotLight07) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight08",dotLight08) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight09",dotLight09) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight10",dotLight10) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight11",dotLight11) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight12",dotLight12) 
SHOW_MGR.actionMgr.registerShowEntity("dotLight13",dotLight13) 

const whiterabbit1 = new RunwayAvatar("model-whiterabbit-1",new GLTFShape('models/whiteRabbit_Anim.glb'), true, RunwayCoord.SOUTH, startPositions[RunwayCoord.SOUTH],"Idle")
SHOW_MGR.actionMgr.registerShowEntity(whiterabbit1.id,whiterabbit1) 

const whiterabbit2 = new RunwayAvatar("model-whiterabbit-2",new GLTFShape('models/whiteRabbit_Anim.glb'), true, RunwayCoord.SOUTH, startPositions[RunwayCoord.SOUTH],"Idle")
SHOW_MGR.actionMgr.registerShowEntity(whiterabbit2.id,whiterabbit2) 

SHOW_MGR.actionMgr.registerShowEntity("middle_lights",new showMgmt.DefineTargetGroup({name:"middle_lights",targets:[dotLight04,dotLight05,dotLight06]})) 

 
SHOW_MGR.actionMgr.getRegisteredHandler(showMgmt.ShowPauseAllActionHandler.DEFAULT_NAME).addOnProcessListener(
  (action: showMgmt.ActionParams<string>,showActionMgr:showMgmt.ShowActionManager)=>{
    //do stuff
    //log("triggered addOnProcessListener") 
  }
)
