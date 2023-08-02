import React, {useState} from 'react';
import AnswerForm from './AnswerForm';

const NewAnswer = (props) => {

    const[isSolving, setIsSolving] = useState(false);

    
    const ansUplaodedHandler = () => {
        props.onAddAns();
        props.onSubmitAnswer();
    }


    const saveAnswerDataHandler = (enteredAnswerData) => {
        const answerData = {
            ...enteredAnswerData,
            id: props.id,
        }
        console.log(answerData);
        props.onSolveQuestion(answerData);
        // props.onAddAnswer(answerData);
        setIsSolving(false);
    }



    const startAnsweringHandler = () => {
        setIsSolving(true);
    }

    const stopAnsweringHandler = () => {
        setIsSolving(false);
    }

  return (
    <div className='new_answer'>
        {!isSolving && <button onClick={startAnsweringHandler} className='new_answer_btn'>Add Answer</button>}
        {isSolving && (
            <div className="new_article_form_modal"><div className="new_article_form_content">
         <AnswerForm id={props.id} onSaveAnswerData ={saveAnswerDataHandler} onSubmitSuccesful={ansUplaodedHandler} onCancel={stopAnsweringHandler} />
         </div>
         </div>
        )}
    </div>
  )
}

export default NewAnswer
