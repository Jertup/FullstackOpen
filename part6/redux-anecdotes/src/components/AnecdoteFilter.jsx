import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const AnecdoteFilter = () => {
  const dispatch = useDispatch()

  const handleChange = (e) => {
    dispatch(filterChange(e.target.value))
  }

  return (
    <>
      <input type="text" placeholder="filter anecdotes" onChange={handleChange} />
    </>
  )
}

export default AnecdoteFilter