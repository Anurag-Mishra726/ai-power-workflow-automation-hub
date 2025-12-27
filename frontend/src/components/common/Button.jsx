import React from 'react'

import { Link } from 'react-router-dom'

const Button = ({text, to}) => {
  return (
    <Link to={to} className='custom-btn'>{text}</Link>
  )
}

export default Button
