import AddNote from "./AddNote";
import Noteitem from "./Noteitem";
import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const context = useContext(noteContext);
  let navigate = useNavigate();
  // eslint-disable-next-line
  const { notes, getNotes, editNote } = context;
  useEffect(() => {    
    if(localStorage.getItem('token')){
      getNotes();
    }   
    else {
      navigate("/login");

    } 
    // eslint-disable-next-line
  }, []);
  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id: currentNote._id, etitle:currentNote.title, edescription:currentNote.description, etag:currentNote.tag});
    
  };
  const ref = useRef(null)
  const refClose = useRef(null)
  const [note, setNote] = useState({id:"", etitle:"", edescription:"", etag:""})

  const handleClick=(e)=>{
    console.log("updating note", note);
    editNote(note.id, note.etitle, note.edescription, note.etag)
    refClose.current.click();
    props.showAlert("Updated Successfully","success");
}
const onChange=(e)=>{
 setNote({...note, [e.target.name]: e.target.value })
}
  return (
    <div>
      <AddNote showAlert={props.showAlert}/>
      <button
        ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal"
        data-bs-target="#exampleModal">Launch demo modal</button>

      <div className="modal fade" id="exampleModal" tabIndex="-1"
        aria-labelledby="exampleModalLabel"  aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-3">
                  <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id="etitle" name="etitle"  
                     value={note.etitle} onChange={onChange} minLength={5} required/>
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control" id="edescription" name="edescription" 
                     value={note.edescription} onChange={onChange} minLength={5} required/>
                  </div>
                </div>
                <div className="row mb-3">
                  <label htmlFor="tag" className="col-sm-2 col-form-label">Tag</label>
                  <div className="col-sm-10">
                    <input type="etag" className="form-control" id="etag" name="etag"  value={note.etag} onChange={onChange}/>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose}  type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close
              </button>
              <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleClick}>Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
       <h2>Your Notes</h2>
       <div className="container mx-2">
        {notes.length===0 && 'No notes to display'}
            </div>
        {notes.map((note) => {
          return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />          
        })}
      </div>
    </div>
  );
};

export default Notes;
