import React,{useState, useEffect} from 'react';
import './AnswerForm.css';


const AnswerForm = (props) => {

  const[enteredAnswer, setEnteredAnswer] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const answerChangeHandler = (event) => {
    setEnteredAnswer(event.target.value);
  }
  const checkBoxChangeHandler = (event) => {
    setIsChecked(true);
    // setIsChecked(event.target.checked);
  }


  const answerSubmitHandler = async(event) => {
    event.preventDefault();
    const answerData = {
      content: enteredAnswer,
      isAnonymous: isChecked,
    }
    // console.log(answerData);
    props.onSaveAnswerData(answerData);
   
    setEnteredAnswer('');
    const token = localStorage.getItem('token');
    try{
      const response = await fetch(`${process.env.REACT_APP_API}/qna/postAnswer/${props.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json'
        },
        body: JSON.stringify(answerData),  
      });
      if (response.ok) {
        const data = await response.json();
        console.log('answer data received');
        props.onSubmitSuccesful();

      } else {
        const errorText = await response.text();
        console.error('Error:', errorText);
      }

    }catch(error) {
      console.log('Error : ',error);
    }

  }

  useEffect(() => {
  }, [enteredAnswer]);


  


  return (
    <div className='answer_form_recent_qn'>
      <form onSubmit={answerSubmitHandler} className='new_answer_form'>
        <textarea type='text' placeholder='Answer Here' className='answer_area' onChange={answerChangeHandler} value={enteredAnswer} style={{ textAlign: 'center' }}></textarea>
        {/* <div className='b2'>
          <label className='checkbox_description'>Answer Anonymously<input type='checkbox' className='ans_checkbox' checked={isChecked} onChange={checkBoxChangeHandler} style={{ textAlign: 'center' }}/></label>           
        </div> */}
        <div className='answer_buttons'><button type='button' onClick={props.onCancel}>Cancel</button> <button type='submit'>Submit</button></div>
        </form>
    </div>
  )
}

export default AnswerForm
