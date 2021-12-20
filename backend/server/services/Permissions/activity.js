const Permission = require('./permission');


const activities = (activity, route, req, res, next) => {
  if (req.user.email === 'admin@admin.com') {
    return next();
  } else { // eslint-disable-line no-else-return
    switch (activity) {
      /** ***************Admin Activities.**************** */
      case 'Manage Admins':
        new Permission(req, next)
          .isAdmin()
          .canAccess(route)
          .done();
        break;
      /** ***************Supplier Activities.**************** */
      case 'Manage Suppliers':
        new Permission(req, next)
          .canAccess(route)
          .done();
        break;
      /** ***************Customer Activities.**************** */
      case 'Access Customers':
        new Permission(req, next)
          .canAccess(route)
          .done();
        break;
      case 'Manage Customers':
        new Permission(req, next)
          .isSupplier()
          .canAccess(route)
          .done();
        break;
      /** ***************Category Activities.**************** */
      case 'Manage Categories':
        new Permission(req, next)
          .isAdmin()
          .canAccess(route)
          .done();
        break;
      case 'Access Categories':
        new Permission(req, next)
          .canAccess(route)
          .done();
        break;
      /** ***************Order Activities.**************** */
      case 'Manage Orders':
        new Permission(req, next)
          .isSupplier()
          .canAccess(route)
          .done();
        break;
      case 'Access Orders':
        new Permission(req, next)
          .canAccess(route)
          .done();
        break;
      /** ***************Product Activities.**************** */
      case 'Manage Products':
        new Permission(req, next)
          .isSupplier()
          .canAccess(route)
          .done();
        break;
      case 'Access Products':
        new Permission(req, next)
          .canAccess(route)
          .done();
        break;
      /** ***************Cart Activities.**************** */
      case 'Manage Carts':
        new Permission(req, next)
          .isCustomer()
          .canAccess(route)
          .done();
        break;
      case 'Access Carts':
        new Permission(req, next)
          .canAccess(route)
          .done();
        break;
      /** ***************Transactions Activities.**************** */
      case 'Access Transactions':
        new Permission(req, next)
          .canAccess(route)
          .done();
        break;
      /** ***************Payments Activities.**************** */
      case 'Access Payments':
        new Permission(req, next)
          .canAccess(route)
          .done();
        break;
      /** ***************Roles Activities.**************** */
      case 'Access Roles':
        new Permission(req, next)
          .canAccess(route)
          .done();
        break;
      /** ***************Recurring Order Activities.**************** */
      case 'Access RecurringOrder':
        new Permission(req, next)
          .isCustomer()
          .canAccess(route)
          .done();
        break;
      /** ***************Manage Inventory.**************** */
      case 'Manage Inventory':
        new Permission(req, next)
          .canAccess(route)
          .done();
        break;


      default:
        throw (`activity.js: activity '${activity}' not supported!`); // eslint-disable-line no-throw-literal
    }
  }
};
module.exports = activities;
