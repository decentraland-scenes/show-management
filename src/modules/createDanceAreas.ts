import * as utils from '@dcl/ecs-scene-utils'
import { triggerEmote, PredefinedEmote } from '@decentraland/RestrictedActions'

export let danceAreas: any = [
  {
    transform: {
      position: new Vector3(8, 0.65, 8),
      rotation: Quaternion.Euler(0, 0, 0),
      scale: new Vector3(1, 1, 1),
    },
    type: 'all',
  }
]

export function createDanceAreas() {
  const triggerSphereShape = new utils.TriggerSphereShape(6.5, new Vector3(0, 3, 0))
      
  for (let i in danceAreas) { 
    let area = new Entity('dance-' + i)
    area.addComponent(new Transform(danceAreas[i].transform))
    //area.addComponent(new BoxShape())

    // executeTask(async () => {
    //   if (await isPreviewMode()) {
    // area.addComponent(new PlaneShape())
    //   }
    // })

    let dsystem = new DanceSystem(danceAreas[i].type)
    
    area.addComponent( 
      new utils.TriggerComponent(
        triggerSphereShape, 
        { 
          enableDebug: false,
          onCameraEnter: () => {
            log("entered dance area ",danceAreas[i].type)
            engine.addSystem(dsystem) 
          },
          onCameraExit: () => {
            engine.removeSystem(dsystem)
          }  
        }
      )
    )

     
    engine.addEntity(area)

  }
}

export class DanceSystem {
  length = 11
  timer = 2
  routine:PredefinedEmote|null|string = null

  routines: PredefinedEmote[] = [
    PredefinedEmote.ROBOT,
    PredefinedEmote.TIK,
    PredefinedEmote.TEKTONIK,
    PredefinedEmote.HAMMER,
    PredefinedEmote.HEAD_EXPLODDE,
    PredefinedEmote.HANDS_AIR,
    PredefinedEmote.DISCO,
    PredefinedEmote.DAB,
  ]
  //routines:string[] = [PredefinedEmote.ROBOT, PredefinedEmote. 'tik','tektonik','hammer', 'headexplode', 'handsair', 'disco', 'dab']

  constructor(routine: PredefinedEmote) {
    this.routine = routine
  }

  update(dt: number) {
    //log(dt)

    if (this.timer > 0) {
      this.timer -= dt
    } else {
      this.timer = this.length
      if (this.routine && this.routine == 'all') {
        let rand = Math.floor(Math.random() * (this.routine.length - 1) )
        if(this.routines[rand]){
          triggerEmote({ predefined: this.routines[rand] })
        }else{
          log("warn array out of range")
        }
      } else {
        if(this.routine ) triggerEmote({ predefined: (this.routine as any) })
      }
    }
  }
}
