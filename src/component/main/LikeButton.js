import React, { useState } from "react";
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.
import axios from 'axios';



const LikeButton = (props) => {
  const [isLiked, setIsLiked] = useState(props.isLiked);
  const userId = useSelector((state) => { return state.UserId });
  const recruitNo = props.recruitNo;

  const submit = (e) => {
    if (userId == '') {
      alert('북마크 기능을 이용하시려면 로그인이 필요합니다.');
      return;}
    const formData = new FormData();
    formData.append('recruitNo', recruitNo);
    formData.append('userId', userId);

    axios.post('/recruit-like', formData)
      .then((response) => {
        console.log(response.data);
          alert(response.data.success ? "북마크에 추가되었습니다." : "북마크 해제 되었습니다.");
      })
      .catch((error) => {
        console.log(error);
      })
    setIsLiked(!isLiked);

  }

  return (
    // <button 
    //   // className={'w-8 h-9'}
    //   onClick={submit}
    // >
      <svg cursor={'pointer'} stroke="currentColor" fill="currentColor" strokeWidth="0" height="24" width="24" onClick={submit}>
        <path
          d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
          stroke={isLiked ? "#ef4444" : "currentColor"}
          fill={isLiked ? "#ef4444" : "none"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    // </button>
  );
}

export default LikeButton;