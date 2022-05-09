import React from 'react';
import AnswerChoice from './AnswerChoice';
import './Question.css';
import { nanoid } from 'nanoid';

export default function Question(props) {
   function renderAnswerChoices() {
      // render the component after the data is loaded
      if (props.answers) {
         return props.answers.map(answer => {
            return <AnswerChoice
               key={nanoid()}
               choice={answer.answer}
               isClicked={answer.isClicked}
               handleAnswerClick={props.handleAnswerClick}
               questionID={props.questionID}
               answerID={answer.id} />
         })
      }
   }

   return (
      <div className='questions-panel' >
         <div className='question-h2'>{props.question.split(/\&.+?\;/g)}</div>
         {renderAnswerChoices()}
         <hr className='question-hr '></hr>
      </div >
   )
}