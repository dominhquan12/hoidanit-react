import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { putUpdateUser } from '../services/UserService'
import { toast } from 'react-toastify';

function ModalEditUser(props) {
  const { show, handleClose, dataUserEdit, handleUpdateTable } = props
  const [name, setName] = useState('')
  const [job, setJob] = useState('')

  useEffect(() => {
    if (show) {
      setName(dataUserEdit.first_name)
      setJob(dataUserEdit.last_name)
    }
  }, [dataUserEdit]);
  const handleEditUser = async () => {
    let res = await putUpdateUser(dataUserEdit.id, { name, job })
    console.log(res);
    if (res && dataUserEdit.id) {
      handleUpdateTable({ id: dataUserEdit.id, first_name: name, last_name: job, email: `${name}${job}@gmail.com` })
      handleClose()
      toast.success("Update User Successful")
    }
    else {
      toast.success("Update User Invalid")
    }

  }
  return (
    <Modal show={show} onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit user</Modal.Title>
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
        <Button variant="primary" onClick={handleEditUser}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalEditUser;