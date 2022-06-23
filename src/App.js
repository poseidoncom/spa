
import Note from "./components/Note"
import { useState, useEffect } from "react"
import noteService from './services/notes'
import Notification from "./components/Notification"
import Footer from "./components/Footer"

const App = () => {
  
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)



  useEffect(()=>{
    noteService
      .getAll()
      .then(initialNotes =>{
        setNotes(initialNotes)
      })

  }, [])

  console.log('render', notes.length, 'notes')


  const notesToShow = showAll
  ? notes
  :notes.filter(note=>note.important)

  
  const handleNoteChange = (event) =>{
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const addNote = (event) =>{
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5,
      id: notes.length + 1,
    }
    noteService 
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const toggleImportance = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error=>{
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n=>n.id !== id))
      })
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={()=> setShowAll(!showAll)}>
          show {showAll ? 'important':'all'}
        </button>
      </div>
      <ul>
        {console.log('Notes before map ',notes)}
        {notesToShow.map(note=>
          <Note toggleImportance={() => toggleImportance(note.id)} key={note.id} note={note}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">Save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App