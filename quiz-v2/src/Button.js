import React from 'react';

export default function Button(props) {
   // small UX add-on where I just want a short delay between 'start quiz' and 
   // rendering the quiz page.
   function ButtonDelay() {
      setTimeout(props.handleClick, 150)
   }

   return (
      <div className={props.class} onClick={ButtonDelay}>{props.text}</div>
   )
}