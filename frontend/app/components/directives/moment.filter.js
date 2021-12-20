import momentTimezone from 'moment-timezone';

import 'moment/locale/ar';


export default function momentFilter($translate, $rootScope) {
    const translate = (dateString, format) => {
        const timezone = 'Asia/Riyadh';
        const dateMomentTimezone = momentTimezone(dateString).tz(timezone);
        momentTimezone.locale($translate.use());
        if (format === 'fromNow') {
            if ($translate.use() === 'en') {
                return dateMomentTimezone.fromNow();
            } else if ($translate.use() === 'ar') {
                return dateMomentTimezone.locale('ar').fromNow();
            }
        } else if (format === 'calendar') {
            if ($translate.use() === 'en') {
                momentTimezone.locale('en', {
                    calendar: {
                        sameDay: '[Today]',
                        nextDay: '[Tomorrow]',
                        nextWeek: 'dddd',
                        lastDay: '[Yesterday]',
                        lastWeek: '[Last] dddd',
                        sameElse: 'DD/MM/YYYY'
                    }
                });
            } else {
                momentTimezone.locale('ar', {
                    calendar: {
                        sameDay: '[اليوم]',
                        nextDay: '[غداً]',
                        nextWeek: 'dddd',
                        lastDay: '[أمس]',
                        lastWeek: '[آخر] dddd',
                        sameElse: 'DD/MM/YYYY'
                    }
                });
            }
            return dateMomentTimezone.calendar();
        }
        return dateMomentTimezone.format(format);
    };
    $rootScope.$on('$translateChangeSuccess', () => translate);
    return translate;
}
momentFilter.$inject = ['$translate', '$rootScope'];
