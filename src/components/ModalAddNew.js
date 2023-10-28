import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { postCreateUser } from '../services/UserService'
import { toast } from 'react-toastify';

function ModalAddNew(props) {
  const { show, handleClose, handleUpdateTable } = props
  const [name, setName] = useState('')
  const [job, setJob] = useState('')
  const handleSaveUser = async () => {
    let res = await postCreateUser({ name, job })
    console.log(res);
    if (res && res.id) {
      handleClose()
      setName('')
      setJob('')
      toast.success("Create User Successful")
      handleUpdateTable({ first_name: name, id: res.id, last_name: job, email: `${name}${job}@gmail.com` })
    }
    else {
      toast.error("Create User Invalid")
    }
  }
  return (
    <Modal show={show} onHide={handleClose}
      backdrop="static"
      keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Add new user</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Job</label>
            <input value={job} onChange={(e) => setJob(e.target.value)} type="text" className="form-control" />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveUser}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalAddNew;