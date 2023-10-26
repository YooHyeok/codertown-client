import Animation from "../animation/animation";

export default function SideAnimation() {
  return (
    <div style={{
        position: 'fixed' //고정
       , zIndex: '10'
       , bottom: "-230px"
       , left: "30px"
       , textAlign:'left'
       , width:'300px'
       , height: "475px"
     }}>
        <Animation/>
    </div>
  )
}