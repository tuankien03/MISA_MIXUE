

class CustomerPage {
    constructor() {
        this.initEvents();
    }

    /**
     * Initialize the events
     * author: NT Kiên (22/06/2024)
     */

    async initEvents() {

        // Click button để hiển thị form thêm mới
        const addbtn = document.querySelector('.addition-btn');
        addbtn.onclick = this.showAddForm;

        // Click button để đóng form thêm mới
        const closebtn = document.querySelector('.form-wrapper .cancel-btn');
        closebtn.onclick = this.closeAddForm;

        await this.loadData();
        this.deleteCustomer();
        this.onClickAddCustomer();
        this.onclickEditEmployee();

    }

    /**
     * Hàm load dữ liệu 
    */
    async loadData() {
        try {
            const employee = await fetch('https://cukcuk.manhnv.net/api/v1/Employees');
            const data = await employee.json();
            console.log(data);
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

        } catch (error) {
            console.log('error::', error);

        }
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

    upperCaseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }




    /**
     * Show form thêm mới
     * author: NT Kiên (22/06/2024)
     */
    showAddForm(data = undefined) {
        const form = document.querySelector('.form-wrapper');
        form.style.display = 'flex';
        console.log(data);
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
        const submitBtn = document.querySelector('.form-wrapper .submit-btn');
        submitBtn.onclick = async () => {
            const error = this.validateForm();
            if (error.isVaild) {
                const formdata = new FormData(document.querySelector('.form-wrapper .add-form'));
                console.log(formdata);
                const formDataJSON = {};
                formdata.forEach((value, key) => {
                    formDataJSON[key] = value;
                });
                console.log(formDataJSON);
                const result = await fetch('https://cukcuk.manhnv.net/api/v1/Employees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataJSON),
                });
                console.log(result);
                const closeBtn = document.querySelector('.dialog-wrapper .m-dialog__close-btn');
                const cancelBtn = document.querySelector('.dialog-wrapper .cancel-btn');
                closeBtn.onclick = this.closeDialog;
                cancelBtn.onclick = this.closeDialog;

                this.showDialog(result.statusText, "Thêm khách hàng thành công!");

            } else {

                error.focus_element.focus();
            }
        }

    }


    onclickEditEmployee() {
        const editBtns = document.querySelectorAll('.crud .edit-btn');
        for (let btn of editBtns) {
            btn.onclick = () => {
                const id = btn.closest('.crud').querySelector('.customer-id').textContent;
                this.updateEmployee(id);
            }
        }
    }

    async updateEmployee(id) {
        if (id) {
            const result = await fetch(`https://cukcuk.manhnv.net/api/v1/Employees/${id}`, {
                method: 'GET',
            });
            const data = await result.json();
            console.log(data);

            this.showAddForm(data);
        }
        const form = document.querySelector('.form-wrapper .add-form');



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

        return error;
    }

    showDialog(title, content) {
        const dialog = document.querySelector('.dialog-wrapper');
        const d_title = document.querySelector('.dialog-wrapper .m-dialog__header');
        const d_content = document.querySelector('.dialog-wrapper .m-dialog__content span');
        d_title.innerText = title;
        d_content.innerText = content;

        dialog.style.display = 'flex';
    }

    closeDialog() {
        const dialog = document.querySelector('.dialog-wrapper');
        dialog.style.display = 'none';
    }


}