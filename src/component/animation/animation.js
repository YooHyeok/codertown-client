import Lottie from "react-lottie-player"; //npm install --save react-lottie-player --force

import lottieJson from "./love-you-coffee.json"
import devManJson from "./notebook-man.json"
import deleteRobotJson from "./delete-robot.json"
import trashCanJson from "./trash-can.json"
import trashCan2Json from "./trash-can2.json"

export default function Animation(props) {
    console.log(props)
  return <Lottie loop animationData={props.delete == 'delete' ? trashCan2Json : lottieJson} play />;
}