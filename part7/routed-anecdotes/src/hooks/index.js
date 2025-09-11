import { useState } from 'react'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const onDelete = (event) => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    onDelete
  }
}

export { useField }