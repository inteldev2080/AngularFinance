export default function colorFilter() {
    return function (val) {
        switch (val) {
            case 'ACTIVE':
                return '##50e3c2';
                break;
            case 'Open':
                return '##50e3c2';
                break;
            case 'PENDING':
                return '#03A9F4';
                break;
            case 'BLOCKED':
                return '#000000';
                break;
            case 'Closed':
                return '#000000';
                break;
            case 'PUBLISHED':
                return '#50e3c2';
                break;
            case 'APPROVED':
                return '#CDDC39';
                break;
            case 'PROVOKED':
                return '#FF9800';
                break;
            case 'ONHOLD':
                return '#00BCD4';
                break;
            case 'SUSPENDED':
                return '#F44336';
                break;
            case false:
                return '#FFFFFF';
                break;
            case true:
                return '#673AB7';
                break;
            default:
                return '#673AB7';
        }
    };
}
