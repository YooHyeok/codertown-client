import { Messenger } from 'react-bootstrap-icons';


export default function DirectMessengerButton() {
    const divStyle = {
        position: 'fixed' //캘린더 width 조절을 위해 부모태그에 설정한다.
        , zIndex: '10'
        , display: 'flex'
        , flexWrap: 'nowrap'
        , width: 'auto'
        , bottom: '150px'
        , right: '100px'
      };

    return (
    <div style={divStyle}>
        <div style={{width:"80px", height:"80px", backgroundColor:"#8B00FF", borderRadius:"40%", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Messenger className="inline" size={30}  style={{width:"50px", height:"50px", backgroundColor:"#8B00FF", color:"white", border:"none"}}/>
        </div>
    </div>)

}