import React from 'react';
import { nanoid } from 'nanoid'
import Question from './Question';
import './QuizPage.css';
import Button from './Button';

export default function QuizPage() {
   // default API data + user's selected answers
   const [triviaQuestions, setTriviaQuestions] = React.useState([]);
   const [isCheckAnswers, setIsCheckAnswers] = React.useState(false);
   const [numCorrect, setNumCorrect] = React.useState(0);
   const [isStartNewMatch, setIsStartNewMatch] = React.useState(false);

   // fetch the trivia questions data once during each game
   React.useEffect(() => {
      async function getQuestions() {
         const apiString = 'https://opentdb.com/api.php?amount=5&difficulty=medium&type=multiple';
         const res = await fetch(apiString);
         const data = await res.json();

         setTriviaQuestions(data.results);
         setTriviaQuestions(data.results.map(question => {
            return {
               ...question,
               id: nanoid(),
               answers: [{ answer: question.correct_answer, id: nanoid(), key: nanoid(), isClicked: false },
               { answer: question.incorrect_answers[0], id: nanoid(), key: nanoid(), isClicked: false },
               { answer: question.incorrect_answers[1], id: nanoid(), key: nanoid(), isClicked: false },
               { answer: question.incorrect_answers[2], id: nanoid(), key: nanoid(), isClicked: false },]
            }
         }))
      };
      getQuestions();
   }, [isStartNewMatch]);

   function handleAnswerChoiceClicked(answerID, questionID) {
      // console.log(`Question ID is: ${questionID}\nAnswerChoice ID is: ${answerID}`);
      setTriviaQuestions(prevTriviaQuestions => {
         return prevTriviaQuestions.map(question => {
            if (question.id === questionID) {
               // proceed to find the answer choice that should toggle its isClicked
               return {
                  ...question, answers: question.answers.map(answer => {
                     if (answer.id === answerID) {
                        // proceed to toggle the answer choice's isClicked
                        return { ...answer, isClicked: !answer.isClicked };
                     }
                     else {
                        return { ...answer, isClicked: false };
                     }
                  })
               }
            }
            else {
               return question;
            }
         })
      })
   }

   // React.useEffect(() => console.log(triviaQuestions), [triviaQuestions]);
   function renderQuestions() {
      // render the Questions after the dataset has been loaded
      if (triviaQuestions) {
         return triviaQuestions.map(question => {
            // return <div>{question.question.split(/\&.+?\;/g)}</div>
            // console.log(question.answers)
            return <Question
               question={question.question}
               key={nanoid()}
               questionID={question.id}
               answers={question.answers}
               handleAnswerClick={handleAnswerChoiceClicked} />
         })
      }
   }

   function checkAnswers() {
      let numCorrectAnswers = 0;
      const userAnswers = [];
      const correctAnswers = triviaQuestions.map(question => question.correct_answer);
      triviaQuestions.forEach(question => {
         question.answers.forEach(answer => {
            return answer.isClicked ? userAnswers.push(answer.answer) : null;
         });
      })
      // a more imperative approach, but just comparing user's answer choices to 
      // the correct answers to calculate user's score. 
      for (let i = 0; i < userAnswers.length; ++i) {
         if (userAnswers[i] === correctAnswers[i]) {
            ++numCorrectAnswers;
         }
      }
      setNumCorrect(numCorrectAnswers);
      setIsCheckAnswers(prevIsCheckAnswers => !prevIsCheckAnswers);
      // return `You scored ${numCorrectAnswers} correct answers`;
      // return `You scored ${numCorrectAnswers} correct answers`;
   }

   // reset the game and start a new trivia round.
   function startNewMatch() {
      // you want to toggle isStartNewMatch so that React.useEffect() can
      // notice the change in state (True to False / False to True) and will 
      // trigger another fetch() call for a new trivia questions panel.

      // this was the reason that the 3rd trivia round was not displaying - 
      // you set isStartNewMatch from F to T for the 2nd round, and then
      // set it from T to T for the 3rd round (T to T is not a state change 
      // so useEffect did not fetch a new set of trivia questions)
      //
      // Conclusion: This was one hell of a 'gotcha' that really had me digging
      // in my head for how useEffect's dependency array works. 
      setIsStartNewMatch(prevIsStartNewMatch => !prevIsStartNewMatch);
      setIsCheckAnswers(false);
      setNumCorrect(0);
   }

   return (
      <div className='quiz-page'>
         {renderQuestions()}
         <div className='quiz-report'>
            {isCheckAnswers && <div className='quiz-score'>{`You scored ${numCorrect}/5 correct answers`}</div>}
            <Button class='quiz-btn' text={isCheckAnswers ? 'Play again' : 'Check answers'} handleClick={isCheckAnswers ? startNewMatch : checkAnswers} />
         </div>
      </div>
   )
}