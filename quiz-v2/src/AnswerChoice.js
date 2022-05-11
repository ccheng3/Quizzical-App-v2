import React from 'react';
import './AnswerChoice.css'

export default function AnswerChoice(props) {
   // the regex removes the HTML entities, spent for too long trying to
   // figure out dynamic rendering of HTML entities in React with a regex
   // so figured to completely remove all entities for time being while 
   // focusing on implementing core app logic. Will return afterwards...
   // Documented well by Shripadk's 2014 guide
   // https://shripadk.github.io/react/docs/jsx-gotchas.html
   function handleUserClick() {
      props.onUserClick(props.id);
   }

   function renderAnswerChoice() {
      if (props.choice) {
         // The onClick ternary conditional was the last piece to the puzzle!
         //
         // When the user checks the answers, the AnswerChoices will ignore the click events (hence the null)
         // Otherwise, the user does not want to check the answers yet and so the AnswerChoices should
         // respond to the user's choice selection/switch to a different answer. 
         return <span className={props.isCheckAnswers ? !props.isClicked ? `fade-out` : props.isCorrectAnswer ? `correct-answer-chosen` : `wrong-answer-chosen` : props.isClicked ? `answerchoice-btn-clicked` : `answerchoice-btn-unclicked`}
            onClick={props.isCheckAnswers ? null : () => { props.handleAnswerClick(props.answerID, props.questionID) }}>
            {props.choice.split(/\&.+?\;/g)}
         </span>
      }
   }

   return (
      renderAnswerChoice()
   )
}