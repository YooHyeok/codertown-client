import Lottie from "react-lottie-player";

import lottieJson from "./love-you-coffee.json"
import devManJson from "./notebook-man.json"

export default function Animation(props) {
    console.log(props)
  return <Lottie loop animationData={props.delete == 'delete' ? devManJson : lottieJson} play />;
}