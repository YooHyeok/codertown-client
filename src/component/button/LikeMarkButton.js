const LikeMarkButton = (props) => {
  
  return (
      <svg cursor={'pointer'} stroke="currentColor" fill="currentColor" strokeWidth="0" height="24" width="24" /* onClick={submit} */>
        <path
          d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
          stroke={props.isLikeMarked ? "#ef4444" : "currentColor"}
          fill={props.isLikeMarked ? "#ef4444" : "none"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
  );
}

export default LikeMarkButton;