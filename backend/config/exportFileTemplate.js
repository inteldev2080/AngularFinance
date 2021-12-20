module.exports = {
  defaultTemplate: [

    {
      type: 'ORDERS',
      template: {
        english: {
          body: 'orderReport.html',
          title: 'Orders Reports'
        },
        arabic: {
          body: 'orderReport.html',
          title: 'تقارير الطلبات'
        }
      }
    },
    {
      type: 'TRANSACTIONS',
      template: {
        english: {
          body: 'transactionReport.html',
          title: 'Transactions Reports'
        },
        arabic: {
          body: 'transactionReport.html',
          title: 'تقارير العمليات والمدفوعات'
        }
      }
    }
  ]
};
