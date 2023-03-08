import * as utils from '@dcl/ecs-scene-utils'
import { ShowEntityModel } from '@dcl/show-management'
//import { NPC } from '@dcl/npc-scene-utils'
//import { Synced } from './syncable'
//import { followLight, FollowLight} from './codeEffects/followLight'
//import { portalNorth, portalSouth } from './animatedEntities'

/**
 * OPEN-SOURCE
 * 
 * 
 * 
 src/modules/showMgmt/showEntities.ts

```
//REGISTER MODELS
const whiterabbit1 = new RunwayAvatar(new GLTFShape('models/whiteRabbit_Anim.glb'), true, RunwayCoord.SOUTH, startPositions[RunwayCoord.SOUTH],"idle")
SHOW_MGR.actionMgr.registerShowEntity("model-whiterabbit-1",whiterabbit1) 

const whiterabbit2 = new RunwayAvatar(new GLTFShape('models/whiteRabbit_Anim.glb'), true, RunwayCoord.SOUTH, startPositions[RunwayCoord.SOUTH],"idle")
SHOW_MGR.actionMgr.registerShowEntity("model-whiterabbit-2",whiterabbit2) 
```

//REGISTER ACTION NAMES
src/modules/showMgmt/showSetup.ts

```
case 'START_MODEL_WHITERABBIT_1':
    logger.debug("SHOW_MGR.actionMgr.extRunAction",action," fired") 
    model = SHOW_MGR.actionMgr.getShowEntityByName("model-whiterabbit-1")
    model.startModel(["Walk","Heart_With_Hands","Walk"])
    break;
  case 'START_MODEL_WHITERABBIT_2':
    logger.debug("SHOW_MGR.actionMgr.extRunAction",action," fired") 
    model = SHOW_MGR.actionMgr.getShowEntityByName("model-whiterabbit-2")
    model.startModel(["Walk","Wave","Walk"])
    break;
```

//CALL IT WHEN THE TIME IS RIGHT
src/modules/showMgmt/subtitle-files/DemoShowSubs.ts
```
00:00:04,300 --> 00:00:04,666
START_MODEL_WHITERABBIT_2
```




//TWEAK POINTS

src/modules/showMgmt/ext/runwayAvatar.ts

```
export let runwayPaths:any = {
 0:{
            duration: 4.8, //DURATION TO TRAVEL PATH
            path: path1
        },
```

```
export class RunwayAvatar
 poseDuration = [3333, 7500, 9000, 7500, 3333] //30 fps // DURATION FOR ANIMATIONS
```

 */

//FIXME EXTERNALIZE
export let startPositions =[
    {position: new Vector3(1,1,1), scale: new Vector3(1,1,1)},
    {position: new Vector3(1,2,10), scale: new Vector3(1,1,1)},
]

//FIXME EXTERNALIZE
export enum RunwayCoord {
    SOUTH,
    NORTH
}


//model animation templates

//models/whiteRabbit_Anim.glb - Walk,Heart_With_Hands,Idle,Run,Wave

const offset = 2
// Coordinates for main Runway Walk
const point1 = new Vector3(2,1,1+offset)
const point2 = new Vector3(2,2,2+offset)
const point3 = new Vector3(2,2,3+offset)
const point4 = new Vector3(2,2,4+offset)
const point5 = new Vector3(2,2,5+offset)
const path1: Vector3[] = [point1, point2, point3, point4, point5]
 
// Coordinates for Return Walk
const point6 = new Vector3(2,2,6+offset)
const point7 = new Vector3(2,2,7+offset)
const point8 = new Vector3(2,2,8+offset)
const point9 = new Vector3(2,2,9+offset)
const point10 = new Vector3(2,2,10+offset)
const path2: Vector3[] = [point6, point7, point8, point9, point10]


//model animation templates

//FIXME EXTERNALIZE
export let runwayPaths:any = {
    //starting south
    0:{
        0:{
            duration: 4.8,
            path: path1
        },
        1: {
            duration: 4.8,
            path: path2
        }
    },

    //starting north
    1:{
        0:{
            duration: 4.8,
            path: path2
        },
        1: {
            duration: 4.8,
            path: path1
        }
    }
}    

//export let portalAnims = ["Flower.Open", "Flower.Close"]

const CLASSNAME = "RunwayAvatar"
export class RunwayAvatar extends ShowEntityModel{
 
    id:string
    start: number
    poseIndex = 0
    //FIXME EXTERNALIZE
    poseDuration = [3333, 7500, 9000, 7500, 3333] //30 fps
    runwayPosition = -1
    walkAnim!:string
    poseAnims:any
    portalPosition = -1

    originalStart:number
    originalPosition:TranformConstructorArgs

    constructor(id:string,model:GLTFShape, invisible:boolean, start:number, position: TranformConstructorArgs, idelAnim?:string){
        super(id+"."+model.src,model,{
            idleAnim:idelAnim
            ,startInvisible:invisible,
            transform:new Transform(position)
        } )
        this.id = id
        this.start = start
        this.originalStart = start
        this.originalPosition = {position:position.position?.clone()}
    } 

    reset(){ 
        const METHOD_NAME = "reset"
        log(CLASSNAME,METHOD_NAME,this.id,'ENTRY')
        //TODO move to parent class to reset all stuff
        this.stopAllAnimations() 
        this.start = this.originalStart
        this.poseIndex = 0
        this.runwayPosition = -1
        this.portalPosition = -1
     
        const transform = this.entity.getComponent(Transform)
        
        if(this.originalPosition.position){
            transform.position.copyFrom(this.originalPosition.position)
        }
            
        if(this.entity.hasComponent(utils.FollowCurvedPathComponent)) this.entity.removeComponent(utils.FollowCurvedPathComponent)
    }

    startModel(sequence:string[]){
        const METHOD_NAME = "startModel"
        log(CLASSNAME,METHOD_NAME,this.id,'ENTRY')

        //FIXME move into library the engine alive test
        if(!this.entity.alive) engine.addEntity(this.entity)

        this.appear()

        this.walkAnim = sequence.splice(0, 1).toString()
        this.poseAnims = sequence

        //followLight.setTarget(this)

        if(this.start == 0){
            //this.animatePortal(portalSouth, 5000)
        }
        else{
            //this.animatePortal(portalNorth, 5000)
        } 
        this.runSequence()
    }

    animatePortal(portal:ShowEntityModel, delay:number){
        /*this.portalPosition++
        if(this.portalPosition < 2){
            log('need to animate portal')
            portal.playAnimation(portalAnims[this.portalPosition], true,undefined,undefined,undefined,true)
            let ent = new Entity()
            ent.addComponent(new utils.Delay(delay,()=>{
                this.animatePortal(portal, 1500)
            }))
            engine.addEntity(ent)
        }
        else{
            this.portalPosition = -1
            portal.playAnimation("Flower.Idle", false)
        }*/

    }

    runSequence(){
        const METHOD_NAME = "runSequence"
        log(CLASSNAME,METHOD_NAME,this.id,'ENTRY')
        this.runwayPosition++
        if(this.runwayPosition < this.poseAnims.length){
            this.playAnimation(this.walkAnim, false,undefined,undefined,undefined,true)
 
            log(CLASSNAME,METHOD_NAME,this.id,'RUNWAY POSITION IS', this.runwayPosition,this.poseIndex)

            if(this.runwayPosition == 4){
                let fdelay = new Entity()
                fdelay.addComponent(new utils.Delay(2500,()=>{
                    /*if(this.start == 0){
                        this.animatePortal(portalNorth, 5500)
                    }
                    else{
                        this.animatePortal(portalSouth, 5500)
                    }*/
                    engine.removeEntity(fdelay)
                }))
                engine.addEntity(fdelay)
            }
            this.entity.addComponentOrReplace(new utils.FollowCurvedPathComponent(runwayPaths[this.start][this.runwayPosition].path, runwayPaths[this.start][this.runwayPosition].duration, 30, true, false, ()=>{
                if(this.runwayPosition == this.poseAnims.length - 1){ 
                    log(CLASSNAME,METHOD_NAME,this.id,'remove model from engine')
                    this.hide()
                    this.stopAllAnimations()
                    engine.removeEntity(this.entity)
                }
                else{
                    this.playAnimation(this.poseAnims[this.poseIndex], true,undefined,undefined,undefined,true)
                    //athis.runSequence()

                    log(CLASSNAME,METHOD_NAME,this.id,'pausing for pose',this.poseIndex, this.poseAnims[this.poseIndex], this.poseDuration[this.poseIndex])

                    let ent = new Entity()
                    ent.addComponent(new utils.Delay(this.poseDuration[this.poseIndex],()=>{
                        log(CLASSNAME,METHOD_NAME,this.id,'pose over',this.poseIndex, this.poseAnims[this.poseIndex], this.poseDuration[this.poseIndex])
                        this.poseIndex++
                        //engine.removeEntity(ent)
                        this.runSequence()
                    }))
                    engine.addEntity(ent)

                }
            }))
        }
    }
}