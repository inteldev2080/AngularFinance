function ListPaginationCtrl($translate) {
    const ctrl = this;
    this._$translate = $translate;
    $.Pages.init();
    ctrl.pageRange = () => {
        const pages = [];
        for (let i = 1; i <= ctrl.totalPages; i += 1) {
            pages.push(i);
        }
        return pages;
        // ctrl.pagination(ctrl.currentPage, 1);
    };
    ctrl.currentPage = 1;
    ctrl.changePage = (pageNumber) => {
        ctrl.currentPage = pageNumber;
        ctrl.onPageClick({ pageNumber });
    };
    ctrl.previous = () => {
        if (ctrl.currentPage !== 1) {
            ctrl.currentPage -= 1;
            ctrl.onPageClick({ pageNumber: ctrl.currentPage });
        }
    };
    ctrl.next = () => {
        if (ctrl.currentPage < ctrl.totalPages) {
            ctrl.currentPage += 1;
            ctrl.onPageClick({ pageNumber: ctrl.currentPage });
        }
    };

    ctrl.pagination = (c, m) => {
        const current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [];
        let l;

        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }

        for (const i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };
}
ListPaginationCtrl.$inject = ['$translate'];

const ListPagination = {
    bindings: {
        onPageClick: '&',
        totalPages: '<',
        currentPage: '=',
        message: '='
    },
    controller: ListPaginationCtrl,
    templateUrl: 'app/components/list-pagination/list-pagination.component.html'
};
export default ListPagination;

