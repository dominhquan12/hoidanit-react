import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import ReactPaginate from 'react-paginate';
import { fetchAllUsers } from '../services/UserService'
import ModalAddNew from './ModalAddNew'
import ModalEditUser from './ModalEditUser';
import _, { debounce } from 'lodash'
import ModalConfirm from './ModalConfirm';
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { toast } from 'react-toastify';
function TableUsers() {
    const [listUsers, setListUsers] = useState([])
    const [totalPages, setTotalPages] = useState(0)

    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false)
    const [isShowModalEdit, setIsShowModalEdit] = useState(false)
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const [dataUserEdit, setDataUserEdit] = useState({})
    const [dataUserDelete, setDataUserDelete] = useState({})

    const [sortBy, setSortBy] = useState('asc')
    const [sortField, setSortField] = useState('id')

    const [keyword, setKeyword] = useState('')
    const [dataExport, setDataExport] = useState([])

    const handleClose = () => {
        setIsShowModalAddNew(false)
        setIsShowModalEdit(false)
        setIsShowModalDelete(false)
    }


    useEffect(() => {
        getUsers(1)
    }, []);

    const getUsers = async (page) => {
        let res = await fetchAllUsers(page)
        if (res && res.data) {
            setTotalPages(res.total_pages);
            setListUsers(res.data)
        }
    }
    const handlePageClick = (e) => {
        getUsers(+e.selected + 1)
    }

    const handleUpdateTableFromAdd = (user) => {
        setListUsers([user, ...listUsers])
    }

    const handleUpdateTableFromEdit = (user) => {
        let index = listUsers.findIndex(item => item.id === user.id)
        let cloneListUsers = _.cloneDeep(listUsers)
        cloneListUsers[index].first_name = user.first_name
        cloneListUsers[index].last_name = user.last_name
        cloneListUsers[index].email = user.email
        setListUsers(cloneListUsers)
    }

    const handleUpdateTableFromDelete = (user) => {
        let cloneListUsers = _.cloneDeep(listUsers)
        console.log(user);
        cloneListUsers = cloneListUsers.filter(item => item.id !== user.id)
        console.log(cloneListUsers);
        setListUsers(cloneListUsers)
    }

    const handleEditUser = (id, user) => {
        setDataUserEdit(user);
        setIsShowModalEdit(true)
    }

    const handleDeleteUser = (user) => {
        setDataUserDelete(user);
        setIsShowModalDelete(true)
    }

    const handleSort = (sortBy, sortField) => {
        setSortBy(sortBy);
        setSortField(sortField)
        let cloneListUsers = _.cloneDeep(listUsers)
        cloneListUsers = _.orderBy(cloneListUsers, sortField, sortBy);
        setListUsers(cloneListUsers);
    }

    const handleSearch =
        debounce(
            (e) => {
                let term = e.target.value
                console.log(term);
                if (term) {
                    let cloneListUsers = _.cloneDeep(listUsers)
                    cloneListUsers = cloneListUsers.filter(item => item.email.includes(term))
                    setListUsers(cloneListUsers);
                }
                else {
                    getUsers(1)
                }
            }
            , 1000)

    const getUsersExport = (event, done) => {
        let result = []
        if (listUsers && listUsers.length > 0) {
            result.push(["Id", "Email", "First Name", "Last Name"])
            listUsers.forEach(item => {
                let arr = []
                arr[0] = item.id
                arr[1] = item.email
                arr[2] = item.first_name
                arr[3] = item.last_name
                result.push(arr)
            })
            setDataExport(result)
            done()
        }
    }

    const handleImportCSV = (e) => {
        if (e.target && e.target.files && e.target.files[0]) {
            let file = e.target.files[0]
            if (file.type !== 'text/csv') {
                toast("Only upload file csv")
                return
            }
            Papa.parse(file, {
                header: false,
                complete: function (results) {
                    let rawCSV = results.data.slice(0, -1)
                    if (rawCSV.length > 0) {
                        if (rawCSV[0][0] !== 'email' || rawCSV[0][1] !== 'first_name' || rawCSV[0][2] !== 'last_name') {

                            toast.error('Wrong format header')
                        }
                        else {
                            let result = []
                            rawCSV.forEach((item, index) => {
                                if(index > 0) {
                                    let obj = {} 
                                    obj.email = item[0]
                                    obj.first_name = item[1]
                                    obj.last_name = item[2]
                                    result.push(obj)
                                }
                            })
                            setListUsers(result)
                            console.log(result);
                        }   
                    }
                    else {
                        toast.error('Wrong format csv')
                    }
                }
            });
        }
    }

    return (
        <>
            <div className='my-3 d-sm-flex justify-content-between'>
                <span><strong><h2>List User:</h2></strong></span>

                <span>
                    <label htmlFor="test" className='btn btn-warning me-2'>
                        <i className="fa-solid fa-file-import me-2"></i>
                        Import
                    </label>
                    <input id='test' hidden type="file"
                        onChange={(e) => handleImportCSV(e)}
                    />

                    <CSVLink
                        filename='users.csv'
                        data={dataExport}
                        asyncOnClick={true}
                        onClick={getUsersExport}
                        className="btn btn-primary me-2"
                    >
                        <i className="fa-solid fa-file-arrow-down me-2"></i>
                        Export
                    </CSVLink>
                    <button className='btn btn-success'
                        onClick={() => setIsShowModalAddNew(true)}
                    >
                        <i className="fa-solid fa-circle-plus me-2"></i>
                        Add new
                    </button>
                </span>
            </div>
            <div className='col-12 col-sm-3 my-3'>
                <input type="text" className='form-control' placeholder='Search by email...'
                    // value={keyword}
                    onChange={e => handleSearch(e)}
                />
            </div>
            <Table responsive striped hover className='table-bordered' >
                <thead>
                    <tr>
                        <th>
                            <div className='d-flex justify-content-between'>
                                <span>Id</span>
                                <span>
                                    <i
                                        className="fa-solid fa-arrow-down-long"
                                        onClick={() => handleSort("desc", "id")}
                                    ></i>
                                    <i
                                        className="fa-solid fa-arrow-up-long"
                                        onClick={() => handleSort("asc", "id")}
                                    ></i>
                                </span>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex justify-content-between'>
                                <span>Email</span>
                                <span>
                                    <i
                                        className="fa-solid fa-arrow-down-long"
                                        onClick={() => handleSort("desc", "email")}
                                    ></i>
                                    <i
                                        className="fa-solid fa-arrow-up-long"
                                        onClick={() => handleSort("asc", "email")}
                                    ></i>
                                </span>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex justify-content-between'>
                                <span>First Name</span>
                                <span>
                                    <i
                                        className="fa-solid fa-arrow-down-long"
                                        onClick={() => handleSort("desc", "first_name")}
                                    ></i>
                                    <i
                                        className="fa-solid fa-arrow-up-long"
                                        onClick={() => handleSort("asc", "first_name")}
                                    ></i>
                                </span>
                            </div>
                        </th>
                        <th>
                            <div className='d-flex justify-content-between'>
                                <span>Last Name</span>
                                <span>
                                    <i
                                        className="fa-solid fa-arrow-down-long"
                                        onClick={() => handleSort("desc", "last_name")}
                                    ></i>
                                    <i
                                        className="fa-solid fa-arrow-up-long"
                                        onClick={() => handleSort("asc", "last_name")}
                                    ></i>
                                </span>
                            </div>
                        </th>
                        <th>
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listUsers && listUsers.length > 0 &&
                        listUsers.map((item, index) => {
                            return (
                                <tr key={`user-${index}`}>
                                    <td>{item.id}</td>
                                    <td>{item.email}</td>
                                    <td>{item.first_name}</td>
                                    <td>{item.last_name}</td>
                                    <td className='d-flex d-lg-block justify-content-around '>
                                        <button onClick={() => handleEditUser(item.id, item)} className='btn btn-primary me-3'>Edit</button>
                                        <button onClick={() => handleDeleteUser(item)} className='btn btn-danger'>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </Table>
            <ReactPaginate
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                marginPagesDisplayed={2}
                pageCount={totalPages}
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                containerClassName="pagination"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />
            <ModalAddNew
                show={isShowModalAddNew}
                handleClose={handleClose}
                handleUpdateTable={handleUpdateTableFromAdd}
            />
            <ModalEditUser
                show={isShowModalEdit}
                handleClose={handleClose}
                dataUserEdit={dataUserEdit}
                handleUpdateTable={handleUpdateTableFromEdit}
            />
            <ModalConfirm
                show={isShowModalDelete}
                handleClose={handleClose}
                dataUserDelete={dataUserDelete}
                handleUpdateTable={handleUpdateTableFromDelete}
            />
        </>
    );
}

export default TableUsers;