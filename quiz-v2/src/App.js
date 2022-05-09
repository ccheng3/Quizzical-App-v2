import React from 'react';
import QuizPage from './QuizPage';
import StartPage from './StartPage';

export default function App() {
   const [IsStartNewQuiz, setIsStartNewQuiz] = React.useState(false);

   function handleIsStartNewQuiz() {
      setIsStartNewQuiz(previsStartNewQuiz => !previsStartNewQuiz);
   }

   return (
      IsStartNewQuiz ? <QuizPage /> : <StartPage handleClick={handleIsStartNewQuiz} />
   )
}