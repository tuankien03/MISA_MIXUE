
// Description: File chứa class Combobox
class Combobox {
    constructor() {
        this.initEvent();
    }
    /**
     * Hàm khởi tạo sự kiện cho combobox
     * author: NT Kiên (1/07/2024)
     */
    initEvent() {
        /**
         * loại bỏ sự kiện focus khi click vào document
         */
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.m-combobox')) {
                const mcombobox = document.querySelectorAll('.m-combobox');
                mcombobox.forEach(combobox => {
                    combobox.classList.remove('open');
                });
            }
        });

        /**
         * Sự kiện click vào input search để hiển thị options
         */
        const searchInput = document.querySelectorAll('.m-combobox .search-input');
        searchInput.forEach(input => {
            input.addEventListener('focus', this.showOptions);
        });



        /**
         * Sự kiện check/uncheck checkbox
         */
        const checkboxes = document.querySelectorAll('.m-combobox input[type="checkbox"]:not(.select-all)');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                if (checkbox.checked) {
                    this.addTag(checkbox);
                } else {
                    const tags = document.querySelectorAll('.tag-container .tag');
                    const tag = Array.from(tags).find(tag => tag.textContent.includes(checkbox.value));
                    this.removeTag(tag);
                }
            });
        });

        /**
         * Sự kiện click vào button select all
         */
        const selectAll = document.querySelectorAll('.m-combobox .select-all');
        selectAll.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    this.selectAll(checkbox);
                } else {
                    this.unselectAll(checkbox);
                }
            });
        });

        const searchInputs = document.querySelectorAll('.m-combobox .search-input');
        searchInputs.forEach(input => {
            input.addEventListener('keyup', this.searchInput);
        });
    }
    

    /**
     * Hàm tìm kiếm trong combobox
     * author: NT Kiên (1/07/2024)
     */
    searchInput(event) {
        const searchValue = event.target.value.toLowerCase();
        const options = event.target.closest('.m-combobox').querySelectorAll('.options-container label');
        options.forEach(option => {
            const optionText = option.textContent.toLowerCase();
            if (optionText.includes(searchValue)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });
    }

    /** 
     * Hàm hiển thị options của combobox
    */
    showOptions(event) {
        const mcombobox = event.target.closest('.m-combobox');
        mcombobox.classList.add('open');
    }

    /**
     * Hàm chọn tất cả các checkbox
     * author: NT Kiên (1/07/2024)
     */

    selectAll(checkbox) {
        const checkboxes = checkbox.closest('.m-combobox').querySelectorAll('input[type="checkbox"]:not(.select-all)');
        checkboxes.forEach(checkbox => {
            if (!checkbox.checked) {
                checkbox.checked = true;
                this.addTag(checkbox);
            }
        });
    }

    /**
     * Kiểm tra xem có nên check vào checkbox select all hay không
     * author: NT Kiên (1/07/2024)
     */

    checkSelectAll(checkbox) {
        const checkboxes = checkbox.closest('.m-combobox').querySelectorAll('input[type="checkbox"]:not(.select-all)');
        for (let checkbox of checkboxes) {
            if (!checkbox.checked) {
                const selectAll = checkbox.closest('.m-combobox').querySelector('.select-all');
                selectAll.checked = false;
                return;
            }
        }
        const selectAll = checkbox.closest('.m-combobox').querySelector('.select-all');
        selectAll.checked = true;
    }

    /**
     * Hàm bỏ chọn tất cả các checkbox
     * author: NT Kiên (1/07/2024)
     */
    unselectAll(checkbox) {
        const checkboxes = checkbox.closest('.m-combobox').querySelectorAll('input[type="checkbox"]:not(.select-all)');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            const tags = checkbox.closest('.m-combobox').querySelectorAll('.tag-container .tag');
            const tag = Array.from(tags).find(tag => tag.textContent.includes(checkbox.value));
            this.removeTag(tag);
        });
    }


    /**
     * Hàm thêm tag vào combobox
     * author: NT Kiên (1/07/2024)
     */

    addTag(checkbox) {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = checkbox.value;
        const checkboxes = checkbox.closest('.m-combobox').querySelectorAll('input[type="checkbox"]:not(.select-all)');
        const searchInput = checkbox.closest('.m-combobox').querySelector('.search-input');
        const removeBtn = document.createElement('span');
        removeBtn.className = 'remove-tag';
        removeBtn.textContent = 'x';
        removeBtn.addEventListener('click', () => {
            this.removeTag(tag);
            checkboxes.forEach(checkbox => {
                if (checkbox.value === tag.textContent) {
                    checkbox.checked = false;
                }
            });
        });
        const tagContainer = checkbox.closest('.m-combobox').querySelector('.tag-container');
        tag.appendChild(removeBtn);
        tagContainer.insertBefore(tag, searchInput);
        searchInput.value = '';
        const options = checkbox.closest('.m-combobox').querySelectorAll('.options-container label');
        console.log(options);
        options.forEach(option => {
            option.style.display = 'flex';
        });
        this.checkSelectAll(checkbox);
    }
    /**
    * Hàm xoá tag khỏi combobox
    * author: NT Kiên (1/07/2024)
    */
    removeTag(tag) {
        const tagContainer = tag.closest('.m-combobox').querySelector('.tag-container');
        const checkboxes = tag.closest('.m-combobox').querySelectorAll('input[type="checkbox"]:not(.select-all)');
        const tags = tagContainer.querySelectorAll('.tag');
        tags.forEach(tagelement => {
            if (tagelement.childNodes[0].textContent === tag.childNodes[0].textContent) {
                tagelement.remove();
            }
        });
        checkboxes.forEach(checkbox => {
            if (checkbox.value === tag.childNodes[0].textContent) {
                checkbox.checked = false;
                this.checkSelectAll(checkbox);
            }
        });
    }

}
