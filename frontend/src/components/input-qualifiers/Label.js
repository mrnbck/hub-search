import React, { useState, useEffect, createRef } from 'react'
import PropTypes from 'prop-types'
import QualifierChecker from '../../helpers/QualifierChecker'

const UserOrOrganization = ({ 
  qualifiers, 
  setQualifiers,
  labelToggle,
  setMyIssues, }) => {

  const [inputStyle, setInputStyle] = useState('input-ok')
  const [inputField, setInputField] = useState('')
  const [oneLabelSearch, setOneLabelSearch] = useState('')
  const [twoLabelSearch, setTwoLabelSearch] = useState('')
  const [threeLabelSearch, setThreeLabelSearch] = useState('')
  const [inputOnOff, setInputOnOff] = useState('OK')

  useEffect(() => {
    if (labelToggle === false) {
      //remove qualifier when untoggled
      let id = 'no filter'
      let oneLabelRegex = /label:([\w])+/        
        
      //check if any of the qualifiers is used by searching the regex. if true, 
      //the others will result in blank.
      const findUser = qualifiers.filter(value => oneLabelRegex.exec(value))

      if (findUser.length > 0) {
        QualifierChecker(findUser, qualifiers, setQualifiers, id, setMyIssues)
      } 
    }
    // eslint-disable-next-line
      },[labelToggle]) 
  
  //reset input fields when changing the field
  useEffect(() => {
    handleInputFields()
    // eslint-disable-next-line
  },[inputField])


  //use createRef to remember value from input fields
  let oneLabelRef = createRef()
  let twoLabelRef = createRef()
  let threeLabelRef = createRef()

  //check which select option was chosen and save it in a state
  const selectFieldPicker = () => {

    const option = 
      document.getElementById('label').options

    const id = 
      option[option.selectedIndex].value

    console.log('id', id)

    setInputField(id)    
  }

  //track value in input field and save it in the correct state 
  const inputFieldValue = () => {
    if (oneLabelRef.value) {
      setOneLabelSearch(`label:${oneLabelRef.value}`)
    }
    if (twoLabelRef.value) {
      setTwoLabelSearch(`label:${oneLabelRef.value}+label:${twoLabelRef.value}`)
    }
    if (threeLabelRef.value) {
      setThreeLabelSearch(`label:${oneLabelRef.value}+
      label:${twoLabelRef.value}+label:${threeLabelRef.value}`)
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
    if (threeLabelSearch) {

      id = threeLabelSearch
    }
    if (twoLabelSearch && !threeLabelSearch) {
      id = twoLabelSearch
    }  
    if (oneLabelSearch && !twoLabelSearch && !threeLabelSearch) {
      id = oneLabelSearch
    }
    if (inputField === 'no filter') {
      id = 'no filter'
    }

    if (inputOnOff === 'OK' && 
    //only reset when not empty. otherwise it will change every time due to 
    //useEffect()
    (oneLabelSearch !== '' || twoLabelSearch !== '' || threeLabelSearch !== '')
    ) {
      if (inputField !== 'no filter') {
        setInputStyle('input-reset')
      }
      setInputOnOff('RESET') 
    }
    
    if(inputOnOff === 'RESET') {
      if (inputField !== 'no filter') {
        setInputStyle('input-ok')
      }
      setInputOnOff('OK')
      setOneLabelSearch('')
      setTwoLabelSearch('')
      setThreeLabelSearch('')
    }

    //create regex based on value in "id"
    let oneLabelRegex = /label:([\w])+/        

    //search in qualifiers if current qualifier already exists
    //check all 3 regex since the key is different every time
    const findEntry = qualifiers.filter(value => {
      if (oneLabelRegex.exec(value)) {
        console.log('one',oneLabelRegex.exec(value))
        return (oneLabelRegex.exec(value))
      }
      console.log('no regex')
      return null
    })

    QualifierChecker(findEntry, qualifiers, setQualifiers, id, setMyIssues)
      
  }

  //based on value in select show the correct input fields
  const generateInputField = () => {
  
    switch(inputField) {
    case 'one:LABEL': 
      return <span>
        <form className='searchbar' onSubmit={handleSubmit}><input 
          className={`input-field ${inputStyle}`}
          id='oneLabel-input'
          placeholder='Enter Label' 
          ref={(element) => oneLabelRef = element}
          onChange={inputFieldValue}
        /><button className='OK-button'>{inputOnOff}
        </button>
        </form>
      </span>
    case 'two:LABEL': 
      return <span>
        <form className='label-searchbar' onSubmit={handleSubmit}>
          <input 
            className={`input-field ${inputStyle}`}
            id='oneLabel-input'
            placeholder='Enter Label' 
            ref={(element) => oneLabelRef = element}
            onChange={inputFieldValue}
          />
          <input 
            className={`input-field ${inputStyle}`}
            id='twoLabel-input'
            placeholder='Enter Label'
            ref={(element) => twoLabelRef = element}
            onChange={inputFieldValue}
          /><button id='label-button'>{inputOnOff}
          </button>
        </form>
      </span>
    case 'three:LABEL': 
      return <span>
        <form className='label-searchbar' onSubmit={handleSubmit}>
          <input 
            className={`input-field ${inputStyle}`}
            placeholder='Enter Label' 
            ref={(element) => oneLabelRef = element}
            onChange={inputFieldValue}
          />
          <input 
            className={`input-field ${inputStyle}`}
            placeholder='Enter Label'
            ref={(element) => twoLabelRef = element}
            onChange={inputFieldValue}
          />
          <input 
            className={`input-field ${inputStyle}`}
            placeholder='Enter Label' 
            ref={(element) => threeLabelRef = element}
            onChange={inputFieldValue}
          />  
          <button id='label-button'>{inputOnOff}
          </button>
        </form>
      </span>
    default: 
      return <span></span>
    }

  }

  if (labelToggle === false) {
    return (<div></div>)
  } else

    return (
      <div className="form-field">
        <label className="input-label">
          Search With Labels
        </label>
        <span >
          <select 
            id='label'
            className="picklist" 
            defaultValue='Everywhere'
            onChange={selectFieldPicker}>
            <option value='no filter'>All</option>
            <option value='one:LABEL'>One Label</option>
            <option value='two:LABEL'>Two Labels</option>
            <option value='three:LABEL'>Three Labels
            </option>            
          </select>
        </span>
        {generateInputField()}
      </div>
    )

}

UserOrOrganization.propTypes = {
  qualifiers: PropTypes.array,
  setQualifiers: PropTypes.func,
  setMyIssues: PropTypes.func
}

export default UserOrOrganization