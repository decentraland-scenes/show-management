import * as ui from '@dcl/ui-scene-utils'
import { showData } from "./scheduleSetup"
import * as showMgmt from '@dcl/show-management'
import { videoMat } from "../videoScreens"
import { hideArtistName, hideBoard, setArtistName, startNextShowCounter } from "../showStatusDisplays"
import { isPreviewMode } from '@decentraland/EnvironmentAPI'
import { RunwayAvatar } from './ext/runwayAvatar'

//creating a logger for this file
const logger:showMgmt.Logger = showMgmt.LoggerFactory.getLogger("MyScene.ShowSetup.ts")
//set logger for a specific logger
logger.setLevel(showMgmt.LogLevel.DEBUG)

//will set default logging level for all loggers
showMgmt.LoggingConfiguration.getInstance().defaultLevel = showMgmt.LogLevel.DEBUG

//set logger for a specific action handler logger
const logHandlerAnimation = showMgmt.LoggerFactory.getLogger("ShowActionHandler."+showMgmt.ShowAnimationActionHandler.DEFAULT_NAME)
if(logHandlerAnimation) logHandlerAnimation.setLevel(showMgmt.LogLevel.TRACE)

export const SHOW_MGR = new showMgmt.ShowManager()
SHOW_MGR.showSchedule.setData( showData )

function resetStage(){
  logger.debug("SHOW_MGR.resetStage","ENTRY")
  for(const p of ["model-whiterabbit-1","model-whiterabbit-2"]){
    const model = SHOW_MGR.actionMgr.getShowEntityByName(p) 
    if(model){
      model.reset()
      model.hide()
    }
  }
}

let currentVideoTexture:VideoTexture
SHOW_MGR.addStopShowListeners( (event:showMgmt.StopShowEvent)=>{
  logger.debug("SHOW_MGR.addStopShowListeners"," fired",event)
  if (currentVideoTexture) { 
    let currentVideoTexuture = currentVideoTexture
    currentVideoTexuture.playing = false
  }
  hideArtistName()   

} )


 
SHOW_MGR.addPlayVideoListeners( (event:showMgmt.PlayShowEvent)=>{
  logger.debug("SHOW_MGR.addPlayVideoListeners"," fired",event)
  
  hideBoard() 
 
  resetStage()
   
  if(event.showData.id == -1){ 
    //   debugger 
    const showRange = SHOW_MGR.showSchedule.findShowToPlayByDate( new Date() ) 
    logger.info("SHOW_MGR.addPlayVideoListeners", "START COUNTDOWN TO NEXT SHOW",event)
    const showArr=[]
    if(showRange.nextShow && showRange.nextShow.show){
      showArr.push(showRange.nextShow.show)
    } 
    startNextShowCounter(showArr)
  }
 
  // main video
  if(event.videoTexture){ 
    currentVideoTexture = event.videoTexture

    videoMat.albedoTexture = event.videoTexture
    videoMat.alphaTexture  = event.videoTexture
    videoMat.emissiveTexture = event.videoTexture
  }

  setArtistName(event.showData.artist)
} )

SHOW_MGR.addVideoStatusChangeListener( new showMgmt.VideoChangeStatusListener((oldStatus: VideoStatus, newStatus: VideoStatus)=>{
  logger.debug("SHOW_MGR.addVideoStatusChangeListener"," fired",oldStatus,newStatus)
  
  //videoTime.value = newStatus.toString()

  switch(newStatus){
    case VideoStatus.LOADING:

    break;
  }

} ))

//STARTING REGISTERING HANDLERS

SHOW_MGR.actionMgr.registerHandler(
  new  showMgmt.ShowBasicActionHandler( 
    "SAY_HI",
    {
      process(action: showMgmt.ActionParams<string>, showActionMgr: showMgmt.ShowActionManager): boolean {
        ui.displayAnnouncement('HI',1)
        return true 
      }
    } )
)

//define custom parameter object type
type ActionTypeSay={
  text?:string
  duration?:number
}

//action will be used as follows
//SAY words {"duration":"1"}
SHOW_MGR.actionMgr.registerHandler(
  new  showMgmt.ShowActionHandlerSupport<ActionTypeSay>( 
    "SAY",
    {
      matches(action: string,showActionMgr:showMgmt.ShowActionManager):boolean{ 
        //log("sayxxx....",(this as showMgmt.ShowActionHandlerSupport<any>).getName())
        return this.name !== undefined && showMgmt.actionStartsWith(action,this.name,0," ")
      },
      decodeAction(action: string, showActionMgr: showMgmt.ShowActionManager):showMgmt.ActionParams<ActionTypeSay>{
        
        logger.debug("ACTION.SAY.decodeAction","called",action)
        const decoded = showMgmt.parseActionWithOpts<ActionTypeSay>(action)
        
        let text = ""
        //join the params back together, all except the json one
        //it woudl be easier to just pass the text as part of the json 
        //this is to demonstrate how you can transform the parsed params if need be
        for(let x=1;x<decoded.array!.length;x++){
          const txt = decoded.array![x]
          //check for beginning of json
          if(txt.charAt(0)=='{'){ 
            break;            
          }
          text += txt + " "
        }

        if(!decoded.params){
          decoded.params = {}
        }
        if(!decoded.params.text) decoded.params.text = text

        return  decoded;
      },
      process(action: showMgmt.ActionParams<ActionTypeSay>, showActionMgr: showMgmt.ShowActionManager): boolean {
        const duration = action.params!.duration ? action.params!.duration : 1
        if(action.params && action.params.text) ui.displayAnnouncement(action.params.text,duration)

        return true
      }
    } )
)

//example of how to extend the action by setting processExt callback
const pauseHandler:showMgmt.ShowPauseAllActionHandler 
  = SHOW_MGR.actionMgr.getRegisteredHandler<showMgmt.ShowPauseAllActionHandler>(showMgmt.ShowPauseAllActionHandler.DEFAULT_NAME)

pauseHandler.addOnProcessListener( (action: showMgmt.ActionParams<string>, showActionMgr: showMgmt.ShowActionManager): boolean => {
  const METHOD_NAME = "addOnProcessListener"
  pauseHandler.logger.debug(METHOD_NAME,"called",action)

  //pause actions goes here
  //some actions "stop" is a play or hide or show or stop

  return true
})
 
//example of how to extend the action by setting processExt callback
const stopHandler:showMgmt.ShowStopAllActionHandler 
  = SHOW_MGR.actionMgr.getRegisteredHandler<showMgmt.ShowStopAllActionHandler>(showMgmt.ShowStopAllActionHandler.DEFAULT_NAME)

  stopHandler.addOnProcessListener( (action: showMgmt.ActionParams<string>, showActionMgr: showMgmt.ShowActionManager): boolean => {
  const METHOD_NAME = "addOnProcessListener" 
  stopHandler.logger.debug(METHOD_NAME,"called",action)

  //stop actions goes here
  //some actions "stop" is a play or hide or show or stop

  return true
})


//STARTING EXTEND RUN ACTION

SHOW_MGR.actionMgr.extRunAction = (action:string)=>{

  let model:RunwayAvatar
  
  let applied = false
  switch(action){
    case 'OLD_WAY':
      logger.debug("SHOW_MGR.actionMgr.extRunAction","OLD_WAY fired") 
      applied = true
    break;
  case 'START_MODEL_WHITERABBIT_1':
    logger.debug("SHOW_MGR.actionMgr.extRunAction",action," fired") 
    model = SHOW_MGR.actionMgr.getShowEntityByName("model-whiterabbit-1")
    model.reset()
    model.startModel(["Walk","Heart_With_Hands","Walk"])
    break;
  case 'START_MODEL_WHITERABBIT_2':
    logger.debug("SHOW_MGR.actionMgr.extRunAction",action," fired") 
    model = SHOW_MGR.actionMgr.getShowEntityByName("model-whiterabbit-2")
    model.reset() 
    model.startModel(["Walk","Wave","Walk"])
    break;
  }
  return applied
}

//STARTING RUN OF SHOW
  
export const runOfShow = new showMgmt.RunOfShowSystem(SHOW_MGR)
engine.addSystem(runOfShow)
  

//STARTING DEBUGGER

isPreviewMode().then(preview=>{
  if(preview) {
    SHOW_MGR.enableDebugUI(preview)
    showMgmt.registerWithDebugUI( SHOW_MGR.manageShowDebugUI,SHOW_MGR, runOfShow  ) 
  }
})   