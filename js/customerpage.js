class CustomerPage {
    constructor() {
        this.currentPage = 1;
        this.data = 'data';
        this.initEvents();
    }

    /**
     * Initialize the events
     * author: NT Kiên (22/06/2024)
     */

    async initEvents() {

        // Click button để đóng form thêm mới
        const closebtn = document.querySelector('.form-wrapper .cancel-btn');
        closebtn.onclick = this.closeAddForm;

        this.data = await this.loadData();
        this.deleteCustomer();
        this.onclickEditEmployee();
        this.searchEmployee();
        this.addEmployee();
        this.onclickReload();

    }

    /**
     * Thêm khách hàng
     * author: NT Kiên (22/06/2024)
     */
    addEmployee() {
        const addBtn = document.querySelector('.addition-btn');
        addBtn.onclick = this.showAddForm;

        this.onClickAddCustomer();
    }

    /**
     * Hàm load dữ liệu 
    */
    async loadData() {
        try {
            this.loadingStatusOn();
            const employee = await fetch('https://cukcuk.manhnv.net/api/v1/Employees');
            const data = await employee.json();
            const table = document.querySelector('.data-table tbody');
            for (let i = 0; i < data.length; i++) {
                const tr = document.createElement('tr');
                let gender = '';
                if (data[i].Gender === 0) {
                    gender = 'Nam';
                } else if (data[i].Gender === 1) {
                    gender = 'Nữ';
                } else {
                    gender = 'Khác';
                }
                const date = new Date(data[i].DateOfBirth);

            // Lấy ngày, tháng, năm từ đối tượng Date
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() trả về giá trị từ 0-11, nên cần +1
            const year = date.getFullYear();

            // Tạo chuỗi thời gian theo định dạng "DD/MM/YYYY"
            const formattedDate = `${day}/${month}/${year}`;
            tr.innerHTML = `
                    <td>${i + 1}</td>
                    <td>${data[i].EmployeeCode}</td>
                    <td>${data[i].FullName}</td>
                    <td>${gender}</td>
                    <td>${formattedDate}</td>
                    <td>${data[i].Email}</td>
                    <td>${data[i].Address}
                        <div class="crud">
                            <div class="customer-id" style="display: none;">${data[i].EmployeeId}</div>
                            <div class="crud-btn edit-btn"><img src="../assets/icon/document-online.png" alt=""></div>
                            <div class="crud-btn delete-btn"><img src="../assets/icon/close-48.png" alt=""></div>
                        </div>
                    </td>
                `;
                table.appendChild(tr);
            }
            this.loadingStatusOff();

        } catch (error) {
            console.log('error::', error);

        }
    }

    reloadData() {
        const table = document.querySelector('.data-table tbody');
        table.innerHTML = '';
        this.loadData();
    }

    onclickReload() {
        const reloadBtn = document.querySelector('.content .toolbar .reload-btn');
        reloadBtn.onclick = this.reloadData.bind(this);
    }

    loadingStatusOn() {
        const loading = document.querySelector('#loading-bar-spinner.spinner');
        loading.style.display = 'block';
    }

    loadingStatusOff() {
        const loading = document.querySelector('#loading-bar-spinner.spinner');
        loading.style.display = 'none';
    }

    /**
     * Xóa khách hàng
     * author: NT Kiên (22/06/2024)
     *  
     */
    async deleteCustomer() {
        const deleteBtns = document.querySelectorAll('.delete-btn');
        for (let btn of deleteBtns) {
            btn.onclick = async () => {
                const tr = btn.closest('tr');
                const id = btn.closest('.crud').querySelector('.customer-id').textContent;
                this.showDialog("Xoá Khách Hàng", "Bạn có chắc chắn muốn xóa khách hàng này không?");
                const confirmBtn = document.querySelector('.dialog-wrapper .submit-btn');
                const cancelBtn = document.querySelector('.dialog-wrapper .cancel-btn');
                const closeBtn = document.querySelector('.dialog-wrapper .m-dialog__close-btn');
                confirmBtn.onclick = async () => {
                    const result = await fetch(`https://cukcuk.manhnv.net/api/v1/Customers/${id}`, {
                        method: 'DELETE',
                    });
                    tr.remove();
                    const stt = document.querySelectorAll('td:first-child');
                    for (let i = 0; i < stt.length; i++) {
                        stt[i].innerText = i + 1;
                    }
                    this.closeDialog();
                }

                cancelBtn.onclick = this.closeDialog;
                closeBtn.onclick = this.closeDialog;

            }
        }

    }


    /**
     * Viết hoa chữ cái đầu tiên
     */
    upperCaseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }




    /**
     * Show form thêm mới
     * author: NT Kiên (22/06/2024)
     */
    showAddForm(data = undefined) {
        console.log(this.data);
        console.log(this.currentPage);
        const form = document.querySelector('.form-wrapper');
        form.style.display = 'flex';
        if (data['EmployeeId']) {
            const inputs = document.querySelectorAll('.form-wrapper input');
            for (let input of inputs) {
                const name = input.getAttribute('name');
                if (input.getAttribute('type') === 'radio') {
                    if (input.value == data[this.upperCaseFirstLetter(name)]) {
                        input.checked = true;
                    }
                } else if (input.getAttribute('type') === 'date') {
                    const date = new Date(data[this.upperCaseFirstLetter(name)]);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    input.value = `${year}-${month}-${day}`;
                } else if (name && name !== 'gender') {
                    input.value = data[this.upperCaseFirstLetter(name)];
                }

            }
            const first_input = document.querySelector('.form-wrapper input');
            first_input.focus();
        }
    }

    /**
     * Thêm khách hàng
     * author: NT Kiên (22/06/2024)
     */
    onClickAddCustomer() {
        try {
            const closeBtn = document.querySelector('.dialog-wrapper .m-dialog__close-btn');
            const cancelBtn = document.querySelector('.dialog-wrapper .cancel-btn');
            const confirmBtn = document.querySelector('.dialog-wrapper .submit-btn');
            confirmBtn.onclick = this.closeDialog;
            closeBtn.onclick = this.closeDialog;
            cancelBtn.onclick = this.closeDialog;
            const submitBtn = document.querySelector('.form-wrapper .submit-btn');
            submitBtn.onclick = async () => {
                const error = this.validateForm();
                if (error.isVaild) {
                    const formdata = new FormData(document.querySelector('.form-wrapper .add-form'));
                    const formDataJSON = {};
                    formdata.forEach((value, key) => {
                        formDataJSON[key] = value;
                    });
                    try {
                        let result = await fetch('https://cukcuk.manhnv.net/api/v1/Employees', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formDataJSON),
                        });

                        result = await result.json();

                        if (result.errors) {
                            throw new Error(result.errors.EmployeeCode[0]);
                        }
                    } catch (error) {
                        this.showDialog('Lỗi', error.message);
                        return
                    }


                    this.showDialog('Thông báo', "Thêm khách hàng thành công!");
                    confirmBtn.onclick = () => {
                        window.location.reload();
                    }

                } else {

                    error.focus_element.focus();
                }
            }
        } catch (error) {
            this.showDialog("Lỗi", "Có lỗi xảy ra khi thêm khách hàng!");
        }

    }

    /**
     * Sửa khách hàng khi click vào nút sửa
     */
    onclickEditEmployee() {
        const editBtns = document.querySelectorAll('.crud .edit-btn');
        for (let btn of editBtns) {
            btn.onclick = () => {
                const id = btn.closest('.crud').querySelector('.customer-id').textContent;
                this.updateEmployee(id);
            }
        }
        console.log('test');
    }

    /**
     * Sửa khách hàng
     */
    async updateEmployee(id) {
        if (id) {
            const result = await fetch(`https://cukcuk.manhnv.net/api/v1/Employees/${id}`, {
                method: 'GET',
            });
            const data = await result.json();
            this.showAddForm(data);
            const submitBtn = document.querySelector('.form-wrapper .submit-btn');
            const closeBtn = document.querySelector('.dialog-wrapper .m-dialog__close-btn');
            const cancelBtn = document.querySelector('.dialog-wrapper .cancel-btn');
            const confirmBtn = document.querySelector('.dialog-wrapper .submit-btn');
            confirmBtn.onclick = this.closeDialog;
            closeBtn.onclick = this.closeDialog;
            cancelBtn.onclick = this.closeDialog;

            submitBtn.onclick = async () => {
                const error = this.validateForm();
                if (error.isVaild) {
                    const formdata = new FormData(document.querySelector('.form-wrapper .add-form'));

                    const formDataJSON = {};
                    formdata.forEach((value, key) => {
                        formDataJSON[key] = value;
                    });
                    try {
                        let result = await fetch(`https://cukcuk.manhnv.net/api/v1/Employees/${id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(formDataJSON),
                        });
                        result = await result.json();
                        if (result.errors) {
                            throw new Error(result.errors.EmployeeCode[0]);
                        }
                    } catch (error) {
                        this.showDialog('Lỗi', error.message);
                        return
                    }

                    this.showDialog(result.statusText, "Sửa khách hàng thành công!");
                    confirmBtn.onclick = () => {
                        window.location.reload();
                    }


                } else {

                    error.focus_element.focus();
                }
            }
        }
        const form = document.querySelector('.form-wrapper .add-form');



    }

    /**
     * Tìm kiếm khách hàng
     */
    searchEmployee() {
        const search = document.querySelector('#search');
        const employeeName = document.querySelectorAll('.data-table tbody tr td:nth-child(3)');
        const employeeCode = document.querySelectorAll('.data-table tbody tr td:nth-child(2)');
        search.oninput = () => {
            const value = search.value;
            for (let i = 0; i < employeeName.length; i++) {
                if (employeeName[i].textContent.toLowerCase().includes(value.toLowerCase()) || employeeCode[i].textContent.toLowerCase().includes(value.toLowerCase())) {
                    employeeName[i].closest('tr').style.display = '';
                } else {
                    employeeName[i].closest('tr').style.display = 'none';
                }
            }
        }
    }



    /**
     * Đóng form thêm mới
     * author: NT Kiên (22/06/2024)
     */
    closeAddForm() {
        const form = document.querySelector('.form-wrapper');
        const inputs = document.querySelectorAll('.form-wrapper input:not([type="radio"])');
        for (let input of inputs) {
            input.value = '';
        }
        const labels = document.querySelectorAll('.form-wrapper label');
        for (let label of labels) {
            const span = label.querySelector('.error-msg');
            if (span) {
                span.remove();
            }
        }
        form.style.display = 'none';
    }

    /**
     * Xác thực dữ liệu form
     */

    validateForm() {
        let error = {
            isVaild: true,
            Msg: [],
            focus_element: null,
        }
        const inputs = document.querySelectorAll('.form-wrapper input[required]');
        const inputEmail = document.querySelector('.form-wrapper input[type="email"]');
        for (let input of inputs) {
            let text = input.previousElementSibling.innerText;
            text = text.slice(0, -1);
            if (input.value === '' || input.value === null || input.value === undefined) {
                error.isVaild = false;
                if (error.focus_element === null) {
                    error.focus_element = input;
                }
                const label = input.previousElementSibling;
                if (label.querySelector('.error-msg')) {
                    continue;
                } else {
                    const span = document.createElement('span');
                    span.className = 'error-msg';
                    span.innerText = `${text} không được để trống`;
                    label.appendChild(span);
                }
            } else {
                const label = input.previousElementSibling;
                const span = label.querySelector('.error-msg');
                if (span) {
                    span.remove();
                }
            }
        }

        const email = inputEmail.value;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        console.log(email);
        console.log(email.match(emailPattern));
        if (!email.match(emailPattern)) {
            error.isVaild = false;
            console.log('email không hợp lệ');
            if (error.focus_element === null) {
                error.focus_element = inputEmail;
            }
            const label = inputEmail.previousElementSibling;
            if (label.querySelector('.error-msg')) {
                return;
            } else {
                const span = document.createElement('span');
                span.className = 'error-msg';
                span.innerText = 'Email không hợp lệ';
                label.appendChild(span);
            }
        } else {
            const label = inputEmail.previousElementSibling;
            const span = label.querySelector('.error-msg');
            if (span) {
                span.remove();
            }
        }

        console.log(error);

        return error;
    }

    /**
     * Hiển thị dialog
     * author: NT Kiên (22/06/2024)
     */
    showDialog(title, content) {
        const dialog = document.querySelector('.dialog-wrapper');
        const d_title = document.querySelector('.dialog-wrapper .m-dialog__header');
        const d_content = document.querySelector('.dialog-wrapper .m-dialog__content span');
        d_title.innerText = title;
        d_content.innerText = content;

        dialog.style.display = 'flex';
    }

    /**
     * Đóng dialog
     */
    closeDialog() {
        const dialog = document.querySelector('.dialog-wrapper');
        dialog.style.display = 'none';
    }


}