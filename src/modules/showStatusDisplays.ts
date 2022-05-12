import * as showMgmt from '@dcl/show-management' 
import { S1 } from './videoScreens'

let messageBoard = new Entity()
messageBoard.setParent(S1)
export let messageText = new TextShape()
messageBoard.addComponent(messageText)
messageBoard.addComponent(
  new Transform({
    position: new Vector3(0, 0, 0.2),
    rotation: Quaternion.Euler(0, 180, 0),
    scale: new Vector3(0.25, (0.25 / 9) * 16, 0.25),
  })
)
messageText.visible = false
messageText.fontSize = 1.6
messageText.font = new Font(Fonts.SansSerif_Bold)
messageText.textWrapping = true
messageText.width = 1.8
messageText.outlineColor = Color3.Black()
messageText.outlineWidth = 0.05

export function setBoardMessage(text: string) {
  messageText.visible = true
  messageText.value = text
}

export function hideBoard() {
  messageText.visible = false
  messageText.value = undefined
  CountDownTimer.terminate()
}

// setBoardMessage(
//   'There is another show playing right now at this same time in the acoustic stage'
// )

export function startNextShowCounter(runOfShow: showMgmt.ShowType[]) {
  log('STARTING NEW COUNTER, ', runOfShow)
  let currentTime = Date.now() / 1000
  let nextShow: showMgmt.ShowType = undefined
  for (let show of runOfShow) {
    log(show.artist, ' STARTS IN ', show.startTime - currentTime)
    if (show.startTime - currentTime > 0) {
      if (nextShow) {
        if (show.startTime - currentTime < nextShow.startTime - currentTime) {
          nextShow = show
        }
      } else {
        nextShow = show
      }
    }
  }

  if (CountDownTimer._instance) {
    CountDownTimer._instance = null
  }

  if (!nextShow) {
    setBoardMessage("That's all for today on this stage. See you tomorrow!")
    return
  }

  log(
    'IDENTIFIED NEXT SHOW, ',
    nextShow,
    ' STARTING IN ',
    nextShow.startTime - currentTime
  )

  // contdown w nextShow

  CountDownTimer.createAndAddToEngine(nextShow)

  // TODO if last show over "return tomorrow"
}

export class CountDownTimer implements ISystem {
  static _instance: CountDownTimer | null = null
  timeToEvent = 60 * 5
  secondsTimer = 1
  artistName: string = ''
  constructor(show: showMgmt.ShowType) {
    log('SHOW STARTS AT ', show.startTime, ' NOW IS ', Date.now() / 1000)
    this.timeToEvent = show.startTime - Date.now() / 1000
    this.artistName = show.artist
  }

  static createAndAddToEngine(show: showMgmt.ShowType): CountDownTimer {
    if (this._instance == null) {
      this._instance = new CountDownTimer(show)
      engine.addSystem(this._instance)
    }
    return this._instance
  }

  static terminate() {
    if (this._instance) {
      engine.removeSystem(this._instance)
      this._instance = null
    }
  }

  update(dt: number) {
    //   log('in scene')

    if (this.timeToEvent > 0) {
      this.secondsTimer -= dt
      this.timeToEvent -= dt

      if (this.secondsTimer < 0) {
        this.secondsTimer = 1
        let timeAsString = secondsToString(this.timeToEvent)
        setBoardMessage(this.artistName + '\nstarts in just\n' + timeAsString)
      }
    } else {
      log('show about to start!')
      hideBoard() 
      //   engine.removeSystem(this)
    }
  }
}

function secondsToString(rawSeconds: number) {
  let seconds = (Math.floor(rawSeconds) % 60).toString()
  let minutes = (Math.floor(rawSeconds / 60) % 60).toString()
  let hours = Math.floor(rawSeconds / 3600).toString()

  if (seconds.length == 1) {
    seconds = '0' + seconds
  }

  if (minutes.length == 1) {
    minutes = '0' + minutes
  }

  return hours + ':' + minutes + ':' + seconds
}

/// current show

let currentShow = new Entity()
//currentShow.setParent(S1)
export let currentShowText = new TextShape('')
currentShow.addComponent(currentShowText)
currentShow.addComponent(
  new Transform({
    position: new Vector3(8, 7.7, 8),
    rotation: Quaternion.Euler(0, 180, 0), 
    scale: new Vector3(2, 2, 2), 
  })
)

currentShowText.value = ''
currentShowText.visible = true
currentShowText.fontSize = 4  
// currentShowText.font = new Font(Fonts.SanFrancisco_Heavy)
currentShowText.textWrapping = true
currentShowText.width = 15
currentShowText.outlineColor = Color3.Black()
currentShowText.outlineWidth = 0.2
engine.addEntity(currentShow)

export function setArtistName(name: string) {
  currentShowText.visible = true
  currentShowText.value = name
}

export function hideArtistName() {
  currentShowText.visible = false
  currentShowText.value = ''
}
