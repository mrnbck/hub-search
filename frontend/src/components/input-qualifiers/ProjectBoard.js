import React, { useState, createRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import QualifierChecker from '../../helpers/QualifierChecker'

const ProjectBoard = ({ 
  qualifiers, 
  setQualifiers, 
  projectBoardToggle,
  setMyIssues }) => {

  const [inputField, setInputField] = useState('')
  const [boardSearch, setBoardSearch] = useState('')
  const [repoSearch, setRepoSearch] = useState('')
  const [inputOnOff, setInputOnOff] = useState('OK')
  const [inputStyle, setInputStyle] = useState('input-ok')

  useEffect(() => {
    if (projectBoardToggle === false) {
      //remove qualifier when untoggled
      let id = 'no filter'
      let repoRegex = /project:([\w])+\/[\w]+/
      let boardRegex = /project:([\w])+/  
        
      const findRepo = qualifiers.filter(value => repoRegex.exec(value))
      const findBoard = qualifiers.filter(value => boardRegex.exec(value))
      if (findRepo.length > 0) {
        QualifierChecker(findRepo, qualifiers, setQualifiers, id, setMyIssues)
      } 
      if (findBoard.length > 0) {
        QualifierChecker(findBoard, qualifiers, setQualifiers, id, setMyIssues)
      }
    }
    // eslint-disable-next-line
      },[projectBoardToggle]) 

  //reset input fields when changing the field
  useEffect(() => {
    handleInputFields()
    // eslint-disable-next-line
  },[inputField])

  //use createRef to remember value from input fields
  let repoRef  = createRef()
  let boardRef = createRef()  
  
  //check which select option was chosen and save it in a state
  const selectFieldPicker = () => {

    const option = document.getElementById('projectBoard').options
    const id = option[option.selectedIndex].value
    
    setInputField(id) 
  }

  //track value in input field and save it in the correct state 
  const inputFieldValue = () => {
    if (boardRef.value) {
      setBoardSearch(`project:${boardRef.value}`)
    }
    if (repoRef.value) {
      setBoardSearch(`project:${repoRef.value}/${boardRef.value}`)
    }
  }

  //make the field 'output only' after submit. save value in respective state.
  const handleSubmit = (event) => {
    event.preventDefault()
    handleInputFields()
  }

  const handleInputFields = () => {
    //check if there is an input field or if the option is "everywhere"
    let id = ''
    //check which field was used
    if (boardSearch) {
      id = boardSearch
    }
    if (repoSearch) {
      id = repoSearch
    }
    if (inputField === 'no filter') {
      id = 'no filter'
    }

    //only reset when not empty. otherwise it will change every time due to 
    //useEffect()      
    if (inputOnOff === 'OK' && (boardSearch !== '' || repoSearch !== ''))
    { 
      if (inputField !== 'no filter') 
      {
        setInputStyle('input-reset')
        setInputOnOff('RESET')
      }
    }

    if(inputOnOff === 'RESET') {
      if (inputField !== 'no filter') {
        setInputStyle('input-ok')
      }
      setInputOnOff('OK')
      setBoardSearch('')
      setRepoSearch('')
    }

    //create regex based on value in "id"
    let repoRegex = /project:([\w])+\/[\w]+/
    let boardRegex = /project:([\w])+/        


    //search in qualifiers if current qualifier already exists
    //check both regex since the key is different every time
    const findEntry = qualifiers.filter(value => {
      
      if (repoRegex.exec(value)) {
        return (repoRegex.exec(value))
      }
      if (boardRegex.exec(value)) {
        return (boardRegex.exec(value))
      }
      return null
    })
    //console.log('findEntry',findEntry)

    QualifierChecker(findEntry, qualifiers, setQualifiers, id, setMyIssues)

  }

  //based on value in select show the correct input fields
  const generateInputField = () => {
    switch(inputField) {
    case 'project:REPOSITORY/PROJECT_BOARD': 
      return <span>
        <form className='searchbar' onSubmit={handleSubmit}>
          <input 
            className={`input-field ${inputStyle}`}
            id='repo-input'
            placeholder='Enter repository' 
            ref={(element) => repoRef = element}
            onChange={inputFieldValue}
          />
          <input 
            className={`input-field ${inputStyle}`}
            id='board-input'
            placeholder='Enter project board' 
            ref={(element) => boardRef = element}
            onChange={inputFieldValue}
          />
          <button className='button OK-button'>{inputOnOff}
          </button>
        </form>
      </span>
    case 'project:PROJECT_BOARD': 
      return <span>
        <form className='searchbar' onSubmit={handleSubmit}>
          <input 
            className={`input-field ${inputStyle}`}
            id='board-input'
            placeholder='Enter project board' 
            ref={(element) => boardRef = element}
            onChange={inputFieldValue}
          />
          <button className='button OK-button'>{inputOnOff}
          </button>
        </form>
      </span>
    default:
      return <span></span>
    }
  }

  if (projectBoardToggle === false) {    
    return (
      <div></div>)
  }  else 
  
    return (
      <div className="form-field">        
        <label className="input-label">Project Board</label>
        <span >
          <select 
            id='projectBoard' 
            className="picklist" 
            defaultValue='Both' 
            onChange={selectFieldPicker}>
            <option value='no filter'>All</option>
            <option value='project:PROJECT_BOARD'>ProjectBoard</option>
            <option value='project:REPOSITORY/PROJECT_BOARD'>
            Repository/ProjectBoard</option>
          </select>
        </span>
        {generateInputField()}
      </div>
    )

}

ProjectBoard.propTypes = {
  qualifiers: PropTypes.array,
  setQualifiers: PropTypes.func

}

export default ProjectBoard