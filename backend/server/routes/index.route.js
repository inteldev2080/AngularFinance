import express from 'express';
import adminRoutes from './admin.route';
import authRoutes from './auth.route';
import customerRoutes from './customer.route';
import productRoutes from './product.route';
import cartRoutes from './cart.route';
import categoryRoutes from './category.route';
import supplierRoutes from './supplier.route';
import recurringOrderRoutes from './recurringOrder.route';
import orderRoutes from './order.route';
import transactionRoutes from './transaction.route';
import paymentRoutes from './payment.route';
import roleRoutes from './role.route';
import uploadRoutes from './upload.route';
import forgetPasswordRoutes from './forgetPassword.route';
import emailRoutes from './email.route';
import systemUnitsRoutes from './unit.route';
import contactRoutes from './contact.route';
import contentRoutes from './content.route';
import systemVariablesRoutes from './systemVariables.route';
import invoiceRoutes from './invoice.route';
import notificationRoutes from './notification.route';
import branchRoutes from './branch.route';
import inventoryRoutes from './inventory.route';
import systemCitiesRoutes from './city.route';
import apiRoutes from './api.route'
const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount auth routes at /auth
router.use('/auth', authRoutes);

router.use('/v1', apiRoutes);
// mount product router at /products
router.use('/products', productRoutes);

// mount cart router at /carts
router.use('/carts', cartRoutes);

// mount category router at /categories
router.use('/categories', categoryRoutes);

// mount supplier router at /suppliers
router.use('/suppliers?', supplierRoutes);

// mount reccuring order router at /recurringOrders
router.use('/recurringOrders', recurringOrderRoutes);

// mount order router at /orders
router.use('/orders', orderRoutes);

// mount transaction router at /transactions
router.use('/transactions', transactionRoutes);

// mount payment router at /payments
router.use('/payments', paymentRoutes);

// mount admin router at /admins
router.use('/admins', adminRoutes);

// mount role router at /roles
router.use('/roles', roleRoutes);

// mount role router at /roles
router.use('/upload', uploadRoutes);

// mount forget password router at /forgetPassword
router.use('/forgetPassword', forgetPasswordRoutes);

// mount exportFile router at /email
router.use('/email', emailRoutes);

// mount systemUnits router as/systemUnits
router.use('/systemUnits', systemUnitsRoutes);

// mount contact router as/contact
router.use('/contacts', contactRoutes);

// mount content router as/content
router.use('/contents', contentRoutes);

// mount systemVariables router as/systemVariables
router.use('/systemVariables', systemVariablesRoutes);

// mount invoices router as/invoices
router.use('/invoices', invoiceRoutes);

// mount notifications router as/notifications
router.use('/notifications', notificationRoutes);
// mount branches router as/branches
router.use('/branches', branchRoutes);

router.use('/inventory', inventoryRoutes);

// mount customer routes at /customers

router.use('/customers', customerRoutes);

// mount systemCities router as/systemCities
router.use('/systemCities', systemCitiesRoutes);


export default router;
