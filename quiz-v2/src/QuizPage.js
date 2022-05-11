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
            let answersArray = [
               { answer: question.correct_answer, id: nanoid(), key: nanoid(), isClicked: false, isCorrectAnswer: true, isCheckAnswers: isCheckAnswers },
               { answer: question.incorrect_answers[0], id: nanoid(), key: nanoid(), isClicked: false, isCorrectAnswer: false, isCheckAnswers: isCheckAnswers },
               { answer: question.incorrect_answers[1], id: nanoid(), key: nanoid(), isClicked: false, isCorrectAnswer: false, isCheckAnswers: isCheckAnswers },
               { answer: question.incorrect_answers[2], id: nanoid(), key: nanoid(), isClicked: false, isCorrectAnswer: false, isCheckAnswers: isCheckAnswers },];
            const shuffleArray = array => {
               for (let i = array.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  const temp = array[i];
                  array[i] = array[j];
                  array[j] = temp;
               }
            }
            // shuffleArray(answersArray);
            return {
               ...question,
               id: nanoid(),
               answers: answersArray,
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
      // now you need to make sure that isCheckAnswers is true BOTH in QuizPage
      // and also in each AnswerChoice
      // why for QuizPage? ---> need to conditionally change quiz btn's text/functionality (QuizPage Line 144)
      // why for each AnswerChoice? ---> need to update each AnswerChoice's style to reflect the 
      // correct answer and the incorrect answers. 
      // User chose the correct answer? ---> That answer is styled green highlight
      // User chose the wrong answer? ---> That answer is styled red and correct answer is styled green.
      // All unchosen answers? ---> These are faded out for hierarchical UI effect 
      setIsCheckAnswers(true);
      setTriviaQuestions(prevTriviaQuestions => {
         return prevTriviaQuestions.map(question => {
            return {
               ...question, answers: question.answers.map(answer => {
                  return { ...answer, isCheckAnswers: true };
               })
            }
         })
      })
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
      setNumCorrect(0);
      setIsCheckAnswers(false);
      setTriviaQuestions(prevTriviaQuestions => {
         return prevTriviaQuestions.map(question => {
            return {
               ...question, answers: question.answers.map(answer => {
                  return { ...answer, isClicked: false, isCheckAnswers: isCheckAnswers };
               })
            }
         })
      })
      // ...I found the error ---> was a logical error, so the program didn't break but 
      // unexpected results occurred. 
      // Reason: Plain and simple, I put this line before all of the data resets 
      // As a result, this toggle call on isStartNewMatch was calling React.useEffect BEFORE
      // all of the data resets, resulting in the "isChecked: true" state in all of the 
      // AnswerChoice components. (This dropped all AnswerChoice styling after the 1st quiz round)
      // 
      // The error was literally hiding in plain sight, I was just contemplating at a lower
      // level when the problem manifested at a higher, more general level. 
      //
      // "Is this code not producing the result I want" vs. "These lines of code aren't placed in 
      // the correct order" 
      setIsStartNewMatch(prevIsStartNewMatch => !prevIsStartNewMatch);
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