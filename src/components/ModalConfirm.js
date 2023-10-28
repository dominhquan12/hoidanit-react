import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from '../services/UserService'
import { toast } from 'react-toastify';

function ModalConfirm(props) {
    const { show, handleClose, dataUserDelete, handleUpdateTable } = props
    const confirmDelete = async () => {
        let res = await deleteUser(dataUserDelete.id)
        console.log(res);
        if (res && res.statusCode === 204 && dataUserDelete.id) {
            handleClose()
            toast.success("Delete User Successful")
            handleUpdateTable(dataUserDelete)
        }
        else {
            toast.success("Delete User Invalid")
        }
    }
    return (
        <Modal show={show} onHide={handleClose}
            backdrop="static"
            keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Delete user</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>This action can not be restored.</h4>
                Are you sure to delete this user has
                <strong> email </strong> is
                <strong> {dataUserDelete.email}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => confirmDelete()}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalConfirm;