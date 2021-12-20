import { join } from 'bluebird';
import Joi from 'joi';

export default {
  // Common

  // GET /api/categories
  // GET /api/orders
  // GET /api/products
  // GET /api/recurringOrders
  // GET /api/roles
  // GET /api/suppliers/staff
  getList: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required()
    }
  },

  // Admin APIs

  // GET /api/admins
  adminsList: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(), status: Joi.array(),
      roleId: Joi.string().hex(),
      adminQuery: Joi.string()
    }
  },
  // PUT /api/admins
  updateCurrentAdmin: {
    body: {
      firstName: Joi.string().min(2).max(20).required(),
      lastName: Joi.string().min(2).max(20).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(20),
      mobileNumber: Joi.string().regex(/^9665[0-9]{8}$/).required()
    }
  },
  // POST /api/admins
  createAdmin: {
    body: {
      firstName: Joi.string().min(2).max(20).required(),
      lastName: Joi.string().min(2).max(20).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(20).required(),
      mobileNumber: Joi.string().regex(/^9665[0-9]{8}$/).required(),
      role: Joi.string().hex().required(),
      language: Joi.string().required()
    }
  },
  // PUT /api/admins/:adminId
  updateAdmin: {
    body: {
      firstName: Joi.string().min(2).max(20).required(),
      lastName: Joi.string().min(2).max(20).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(20),
      mobileNumber: Joi.string().regex(/^9665[0-9]{8}$/).required(),
      status: Joi.string().allow('Active', 'Suspended', 'Blocked').required(),
      role: Joi.string().hex().required()
    },
    params: {
      adminId: Joi.string().hex().required()
    }
  },
  // GET /api/admins/:adminId
  getAdmin: {
    params: {
      adminId: Joi.string().hex().required()
    }
  },
  // GET /api/admins/reports/orders
  // GET /api/admins/reports/transactions
  adminGetOrdersReport: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
      status: Joi.array(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required()
    }
  },
  updateUsers: {
    body: {
      firstName: Joi.string().min(2).max(20).required(),
      lastName: Joi.string().min(2).max(20).required(),
      email: Joi.string().email().required(),
      // password: Joi.string().min(6).max(20),
      mobileNumber: Joi.string().regex(/^9665[0-9]{8}$/).required(),
      status: Joi.string().allow('Active', 'Suspended', 'Blocked').required(),
      role: Joi.string().hex().required(),
      language: Joi.string().required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // Auth APIs

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().min(6).max(20).required()
    }
  },
  // POST /api/auth/login
  APIlogin: {
    query: {
      username: Joi.string().required(),
      password: Joi.string().min(6).max(20).required()
    }
  },
  // PUT /api/auth/changePassword
  userChangePassword: {
    body: {
      oldPassword: Joi.string().min(6).max(20).required(),
      newPassword: Joi.string().min(6).max(20).required()
    }
  },
  // PUT /api/auth/resetPassword
  userResetPassword: {
    body: {
      userId: Joi.string().hex().required(),
      newPassword: Joi.string().min(6).max(20).required()
    }
  },

  // Role APIs

  // GET /api/roles
  roleList: {
    query: {
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1)
    }
  },

  createRole: {
    body: {
      permissions: Joi.array().required(),
      arabicName: Joi.string().required(),
      englishName: Joi.string().required()
    }
  },
  // PUT /api/roles

  updateRole: {
    params: {
      roleId: Joi.string().hex().required()
    },
    body: {
      permissions: Joi.array().required(),
      arabicName: Joi.string().required(),
      englishName: Joi.string().required()
    }
  },
  removeRole: {
    params: {
      roleId: Joi.string().hex().required()
    },
    body: {
      alternativeRoleId: Joi.string().hex().required()
    }
  },

  // Cart APIs

  // POST /api/carts
  addToCart: {
    body: {
      product: Joi.string().hex().required(),
      quantity: Joi.number().integer().min(1).required()
    }
  },
  // PUT /api/carts/product/:productId
  updateCartProductQuantity: {
    params: {
      product: Joi.string().hex().required()
    },
    query: {
      quantity: Joi.number().integer().min(1).required()
    }
  },
  // DELETE /api/carts/product/:product
  removeCartProduct: {
    params: {
      product: Joi.string().hex().required()
    }
  },
  // POST /api/carts/:cartId/checkout
  checkoutCart: {
    params: {
      cartId: Joi.string().hex().required()
    },
    body: {
      orderIntervalType: Joi.string(),
      orderFrequency: Joi.number().integer().min(1),
      startDate: Joi.date()
    }
  },
  // GET /api/cart/:cartId
  getByCartId: {
    params: {
      cartId: Joi.string().hex()
    }
  },
  getBySupplierId: {
    params: {
      supplierId: Joi.string().hex()
    }
  },
  // DELETE /api/cart/:cartId
  resetCart: {
    params: {
      cartId: Joi.string().hex().required()
    }
  },

  // Category APIs

  // GET api/categories
  categoryList: {
    query: {
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1),
    }
  },

  // POST api/categories
  createCategory: {
    body: {
      arabicName: Joi.string().required(),
      englishName: Joi.string().required(),
      status: Joi.string().allow('Active', 'Hidden'),
      parentCategory: Joi.string().hex()
    }
  },
  getBranches : {
    params: {
      // categoryId: Joi.string().hex().required()
    },
    query: {
      // skip: Joi.number().integer().min(0),
      // limit: Joi.number().integer().min(1),
      customerId: Joi.string().hex()
    }
  },
  // GET api/categories/otherProducts/:categoryId
  otherProducts: {
    params: {
      categoryId: Joi.string().hex().required()
    },
    query: {
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1),
      supplierId: Joi.string().hex()
    }
  },

  // GET /api/categories/:categoryId
  getCategory: {
    params: {
      categoryId: Joi.string().hex().required()
    }
  },
  // PUT /api/categories/:categoryId
  updateCategory: {
    params: {
      categoryId: Joi.string().hex().required()
    },
    body: {
      arabicName: Joi.string().required(),
      englishName: Joi.string().required(),
      status: Joi.string().allow('Active', 'Hidden').required(),
      parentCategory: Joi.string().hex()
    }
  },
  // DELETE /api/categories/:categoryId
  deleteCategory: {
    params: {
      categoryId: Joi.string().hex().required()
    }
  },
  // GET /api/categories/products/:categoryId
  getCategoryProducts: {
    params: {
      categoryId: Joi.string().hex().required()
    }
  },

  // Customer APIs

  // GET /api/customers
  customerList: {
    query: {
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1),
      status: Joi.array(),
      payingSoon: Joi.boolean()
    }
  },

  specialPricesList: {
    params: {
      customerId: Joi.string().hex().required()
    },
    query: {
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1),
      supplierId: Joi.string().hex(),
      customerId: Joi.string().hex()
    }
  },
  // PUT /api/customers
  updateCustomer: {
    body: {
      coordinates: Joi.array().min(1).max(2),
      representativeName: Joi.string().required(),
      representativePhone: Joi.string().regex(/^9665[0-9]{8}$/),
      representativeEmail: Joi.string().email(),
      firstName: Joi.string().min(2).max(20),
      lastName: Joi.string().min(2).max(20),
      password: Joi.string().min(6).max(20)
    }
  },
  // POST /api/customers
  createCustomer: {
    body: {
      // longitude: Joi.number().min(-180).max(180).required(),
      // latitude: Joi.number().min(-90).max(90).required(),
      coordinates: Joi.array().min(1).max(2).required(),
      representativeName: Joi.string().required(),
      representativePhone: Joi.string().regex(/^9665[0-9]{8}$/),
      representativeEmail: Joi.string().email(),
      commercialRegister: Joi.string().regex(/^[0-9]{10}$/).required(),
      commercialRegisterPhoto: Joi.string().required(),
      userEmail: Joi.string().email().required(),
      userMobilePhone: Joi.string().regex(/^9665[0-9]{8}$/).required(),
      userFirstName: Joi.string().min(2).max(20).required(),
      // userLastName: Joi.string().min(2).max(20).required(),
      userPassword: Joi.string().min(6).max(20).required(),
      language: Joi.string().required()
    }
  },
  APIcreateCustomer: {
    query: {
      // longitude: Joi.number().min(-180).max(180).required(),
      // latitude: Joi.number().min(-90).max(90).required(),
      coordinates: Joi.array().min(1).max(2).required(),
      representativeName: Joi.string().required(),
      representativePhone: Joi.string().regex(/^9665[0-9]{8}$/),
      representativeEmail: Joi.string().email(),
      commercialRegister: Joi.string().regex(/^[0-9]{10}$/).required(),
      commercialRegisterPhoto: Joi.string().required(),
      userEmail: Joi.string().email().required(),
      userMobilePhone: Joi.string().regex(/^9665[0-9]{8}$/).required(),
      userFirstName: Joi.string().min(2).max(20).required(),
      // userLastName: Joi.string().min(2).max(20).required(),
      userPassword: Joi.string().min(6).max(20).required(),
      language: Joi.string().required()
    }
  },
  // POST /api/customers/invite
  inviteCustomer: {
    body: {
      customerEmail: Joi.string().email().required()
    }
  },
  // PUT api/customers/:customerId/supplier
  updateSupplierRelation: {
    params: {
      customerId: Joi.string().hex().required()
    },
    body: {
      creditLimit: Joi.number().min(0),
      paymentInterval: Joi.string().required(),
      status: Joi.string().allow('Active', 'Blocked').required(),
      productPrices: Joi.array()
    }
  },
  // GET /api/customers/:customerId
  // PUT /api/customers/block/:customerId
  // PUT /api/customers/unblock/:customerId
  getCustomer: {
    params: {
      customerId: Joi.string().hex().required()
    }
  },
  // POST /api/customer/excel
  inviteCustomerExcel: {
    body: {
      // customerId: Joi.string().hex().required()
    }
  },
  // POST/api/customers/specialPrices
  createProductPrice: {
    body: {
      customerId: Joi.string().hex().required(),
      productId: Joi.string().hex().required(),
      price: Joi.number().min(0).required()
    }
  },
  // PUT/api/customers/specialPrices/:productId
  updateProductPrice: {
    body: {
      customerId: Joi.string().hex().required(),
      price: Joi.number().min(0).required()
    }
  },

  getProductPriceList: {
    query: {
      supplierId: Joi.string().hex(),
      customerId: Joi.string().hex(),
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1)
    }
  },


  updateStaff: {
    params: {
      staffId: Joi.string().hex().required()
    },
    body: {
      email: Joi.string().email().required(),
      mobileNumber: Joi.string().regex(/^9665[0-9]{8}$/).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().min(6).max(20),
      role: Joi.string().hex().required(),
      status: Joi.string().required(),
      language: Joi.string().required()
    }
  },
  // Order APIs
  // PUT /api/orders/:orderId/accept
  acceptOrder: {
    params: {
      orderId: Joi.string().hex().required()
    },
    body: {
      acceptedProducts: Joi.array().min(1).required()
    }
  },
  rejectOrder: {
    params: {
      orderId: Joi.string().hex().required()
    },
    body: {
      rejectionReason: Joi.string(),
      message: Joi.string()
    }
  },
  prepareOrder: {
    params: {
      orderId: Joi.string().hex().required()
    }
  },
  // PUT /api/orders/:orderId/reject
  // PUT /api/orders/:orderId/cancel
  // PUT /api/orders/:orderId/prepare
  // PUT /api/orders/:orderId/readyForDelivery
  // PUT /api/orders/:orderId/outForDelivery
  // PUT /api/orders/:orderId/delivered
  // GET /api/orders/:orderId
  getOrderOrUpdateOrderStatus: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required()
    },
    params: {
      orderId: Joi.string().hex().required()
    }
  },
  // POST /api/orders/:orderId/review
  createReview: {
    params: {
      orderId: Joi.string().hex().required()
    },
    body: {
      overall: Joi.number().integer().min(1).max(5).required(),
      itemCondition: Joi.number().integer().min(1).max(5).required()
    }
  },
  // GET /api/orders
  ordersList: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
      supplierId: Joi.string().hex(),
      driverId: Joi.string().hex(),
      status: Joi.array()
    }
  },
  // GET /api/orders/history
  getOrderHistory: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
      supplierId: Joi.string().hex(),
      orderId: Joi.string()
    }
  },
  // PUT /api/orders/outForDelivery
  orderOutForDelivery: {
    params: {
      orderId: Joi.string().hex().required()
    },
    body: {
      driverId: Joi.string().hex().required()
    }
  },
  // PUT /api/orders/rejectProducts
  rejectProducts: {
    body: {
      products: Joi.array().min(1).required()
    }
  },
  // GET /api/orders/log
  cancelOrReject: {
    params: {
      orderId: Joi.string().hex().required()
    }
  },

  delivered: {
    params: {
      orderId: Joi.string().hex().required()
    }
  },

  deliveryNote: {
    body: {
      message: Joi.string()
    }
  },

  orderPurchase: {
    params: {
      orderId: Joi.string().hex().required()
    }
  },

  orderReview: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required()
    }
  },

  addProductToOrder: {
    params: {
      orderId: Joi.string().hex().required()
    },
    body: {
      productId: Joi.string().hex().required(),
      quantity: Joi.number().required()
    }
  },
  updateProductOrder: {
    params: {
      orderProductId: Joi.string().hex().required()
    }
  },

  deleteProductOrder: {
    params: {
      orderProductId: Joi.string().hex().required()
    }
  },
  // Product APIs

  // POST /api/products
  productList: {
    query: {
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1)
    }
  },
  createProduct: {
    body: {
      categories: Joi.array().min(1).required(),
      arabicName: Joi.string().required(),
      englishName: Joi.string().required(),
      arabicDescription: Joi.string().required(),
      englishDescription: Joi.string().required(),
      sku: Joi.string(),
      store: Joi.string(),
      shelf: Joi.string(),
      price: Joi.number().min(0).required(),
      unit: Joi.string().required(),
      status: Joi.string().allow('Active', 'Hidden').required(),
      coverPhoto: Joi.string().hex().required(),
      images: Joi.array().min(1)
    }
  },
  // GET /api/products/supplier/:supplierId
  getSupplierProducts: {
    params: {
      supplier: Joi.string().hex().required()
    },
    query: {
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1)
    }
  },
  // GET /api/products/:productId
  // DELETE /api/products/:productId
  getOrDeleteProduct: {
    params: {
      productId: Joi.string().hex().required()
    }
  },
  // PUT /api/products/:productId
  updateProduct: {
    params: {
      productId: Joi.string().hex().required()
    },
    body: {
      categories: Joi.array().min(1).required(),
      arabicName: Joi.string().required(),
      englishName: Joi.string().required(),
      arabicDescription: Joi.string().required(),
      englishDescription: Joi.string().required(),
      sku: Joi.string(),
      store: Joi.string(),
      shelf: Joi.string(),
      price: Joi.number().min(0).required(),
      unit: Joi.string().required(),
      status: Joi.string().allow('Active', 'Hidden').required()
    }
  },

  // Recurring Order APIs

  // PUT /api/recurringOrders/:recurringOrderId/cancel
  // GET /api/recurringOrders/:recurringOrderId
  getOrCancelRecurringOrder: {
    params: {
      recurringOrderId: Joi.string().hex().required()
    }
  },

  getRecurringOrder: {
    query: {
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1),
      supplierId: Joi.string().hex()
    }
  },

  getProductOrder: {
    params: {
      recurringOrderId: Joi.string().hex().required()
    }
  },

  updateRecurringOrder: {
    params: {
      recurringOrderId: Joi.string().hex().required()
    },
    body: {
      orderFrequency: Joi.number().required(),
      orderIntervalType: Joi.string().required(),
      startDate: Joi.string().required()
    }
  },

  addProductToRecurringOrder: {
    params: {
      recurringOrderId: Joi.string().hex().required()
    },
    body: {
      productId: Joi.string().hex().required(),
      quantity: Joi.number().required()
    }
  },

  removeProductFromRecurringOrder: {
    params: {
      recurringOrderId: Joi.string().hex().required()
    },
    body: {
      productId: Joi.string().hex().required()
    }
  },
  // Supplier APIs

  // GET /api/suppliers
  supplierList: {
    query: {
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1),
      // supplierName: Joi.string(),
      status: Joi.array()
    }
  },

  //PUT /api/suppliers/admin/:supplierId
  updateSupplierRelationValidation: {
    params: {
      supplierId: Joi.string().hex().required()
    },
    body: {
      creditLimit: Joi.number().min(0),
      paymentInterval: Joi.string().required(),
      status: Joi.string().allow('Active', 'Blocked').required(),
      paymentFrequency: Joi.number(),
      exceedCreditLimit: Joi.boolean(),
      exceedPaymentDate: Joi.boolean()
    }
  },
  // GET /api/suppliers/staff
  supplierStaffList: {
    query: {
      skip: Joi.number().integer().min(0),
      limit: Joi.number().integer().min(1),
      // supplierName: Joi.string(),
    }
  },
  // POST /api/suppliers
  createSupplier: {
    body: {
      coordinates: Joi.array().min(1).max(2),
      address: Joi.string(),
      representativeName: Joi.string().required(),
      commercialRegister: Joi.string().regex(/^[0-9]{10}$/).required(),
      commercialRegisterPhoto: Joi.string().required(),
      userEmail: Joi.string().email().required(),
      userMobilePhone: Joi.string().regex(/^9665[0-9]{8}$/).required(),
      userFirstName: Joi.string().required(),
      userLastName: Joi.string().required(),
      userPassword: Joi.string().min(6).max(20).required(),
      language: Joi.string().required()
    }
  },
  // POST /api/v1/suppliers
  APIcreateSupplier: {
    query: {
      coordinates: Joi.array().min(1).max(2),
      address: Joi.string(),
      representativeName: Joi.string().required(),
      commercialRegister: Joi.string().regex(/^[0-9]{10}$/).required(),
      commercialRegisterPhoto: Joi.string().required(),
      userEmail: Joi.string().email().required(),
      userMobilePhone: Joi.string().regex(/^9665[0-9]{8}$/).required(),
      userFirstName: Joi.string().required(),
      userLastName: Joi.string().required(),
      userPassword: Joi.string().min(6).max(20).required(),
      language: Joi.string().required()
    }
  },
  // POST /api/suppliers/staff
  createSupplierStaff: {
    body: {
      email: Joi.string().email(),
      mobileNumber: Joi.string().regex(/^9665[0-9]{8}$/).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().min(6).max(20).required(),
      role: Joi.string().hex().required(),
      status: Joi.string().required(),
      language: Joi.string().required()
    }
  },
  // PUT /api/suppliers/staff/:staffId
  updateSupplierStaff: {
    userEmail: Joi.string().email().required(),
    userMobilePhone: Joi.string().regex(/^9665[0-9]{8}$/).required(),
    userFirstName: Joi.string().required(),
    userLastName: Joi.string().required(),
    userPassword: Joi.string().min(6).max(20),
    userRole: Joi.string().hex().required()
  },
  // DELETE /api/suppliers/staff/:staffId
  deleteSupplierStaff: {
    params: {
      staffId: Joi.string().hex().required()
    }
  },
  // PUT /api/suppliers/:supplierId/block
  // PUT /api/suppliers/:supplierId/unblock
  // GET /api/suppliers/:supplierId
  // DELETE /api/suppliers/:supplierId
  getDeleteOrBlockSupplier: {
    params: {
      supplierId: Joi.string().hex().required()
    }
  },
  // PUT /api/suppliers/:supplierId
  updateSupplier: {
    params: {
      supplierId: Joi.string().hex().required()
    },
    body: {
      representativeName: Joi.string().required(),
      commercialRegister: Joi.string().regex(/^[0-9]{10}$/).required(),
      commercialRegisterPhoto: Joi.string().required(),
      commercialRegisterExpireDate: Joi.date(),
      commercialRegisterExpireDateIslamic: Joi.date(),
      VATRegisterNumber: Joi.number(),
      VATRegisterPhoto: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      // userPassword: Joi.string().min(6).max(20).required(),
      mobileNumber: Joi.string().regex(/^9665[0-9]{8}$/),
      language: Joi.string()
    }
  },


  updateName: {
    params: {
      supplierId: Joi.string().hex().required()
    },
    body: {
      firstName: Joi.string(),
      lastName: Joi.string(),
      // userPassword: Joi.string().min(6).max(20).required(),
      mobileNumber: Joi.string().regex(/^9665[0-9]{8}$/),
      email: Joi.string()
    }
  },
  // GET /api/suppliers/reports/orders
  // GET /api/suppliers/reports/transactions
  getReport: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      status: Joi.array()
    }
  },
  getInvoiceReport: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      // customerId: Joi.string().hex(),
    }
  },
  getInvoiceDetail: {
    query: {
      id: Joi.string().required(),
      export:Joi.string()
    }
  },
  getTransactionReport: {
    query: {
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
      supplierId: Joi.string().hex(),
      customerId: Joi.string().hex(),
      type: Joi.string()
    }
  },

  getSupplierBillingHistory: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required()
    }
  },

  getListSupplier: {
    params: {
      supplierId: Joi.string().hex().required()
    }
  },

  // Transaction APIs
  // POST /api/transactions/declare
  declarePayment: {
    body: {
      amount: Joi.number().min(0).required()
    }
  },
  // POST /api/transactions/add
  addPayment: {
    body: {
      amount: Joi.number().min(0).required(),
      supplierId: Joi.string().hex()
    }
  },

  getTransaction: {
    params: {
      transactionId: Joi.string().hex().required()
    }
  },

  transactionList: {
    query: {
      startDate: Joi.string(),
      endDate: Joi.string(),
      status: Joi.array(),
      isAdminFees: Joi.boolean(),
      supplierId: Joi.string().hex(),
      customerId: Joi.string().hex(),
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required()
    }
  },
  // Payments APIs
  // PUT /api/payments/:paymentId/accept
  // PUT /api/payments/:paymentId/reject
  acceptOrRejectPayment: {
    params: {
      paymentId: Joi.string().hex().required()
    }
  },
  // GET /api/payments/pending
  getPayments: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
      supplierId: Joi.string().hex(),
      customerId: Joi.string().hex(),
      isAdminFees: Joi.string(),
      status: Joi.array()
    }
  },

  // Forget Password APIs
  // POST /api/forgetPassword/forget
  forgetPassword: {
    body: {
      email: Joi.string().required()
    }
  },

  // POST /api/forgetPassword/forget
  APIforgetPassword: {
    query: {
      email: Joi.string().required()
    }
  },
  // PUT /api/forgetPassword/Reset
  resetPassword: {
    body: {
      password: Joi.string().min(6).max(20).required(),
      confirmPassword: Joi.string().min(6).max(20).required(),
      code: Joi.string().required()
    }
  },
  // GET /api/invoices
  getInvoice: {
    params: {
      invoiceId: Joi.string().hex().required()
    }
  },
  createInvoice: {
    query: {
      customerId: Joi.string().hex(),
      supplierId: Joi.string().hex()
    }
  },

  // Post inventory recipes items
  createInventoryRecipesItems: {
    body: {
      englishName: Joi.string().required(),
      recipeSku: Joi.string().required(),
      barCode: Joi.string().required(),
    }
  },
  recipesList: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
    }
  },
  deleteRecipe: {
    params: {
      Id: Joi.string().hex().required()
    }
  },
  deleteInventory: {
    params: {
      InventoryId: Joi.string().hex().required()
    }
  },
  deleteIngredient: {
    params: {
      IngredientId: Joi.string().hex().required()
    }
  },
  getSingle: {
    params: {
      recipeId: Joi.string().hex().required()
    }
  },
  createIngredientsItems: {
    body: {
      englishName: Joi.string().required(),
      arabicName: Joi.string(),
      barCode: Joi.string().required(),
      threshold: Joi.number().required(),
      quantity: Joi.number().required()
    }
  },
  getIngredientsWithoutSome: {
    body: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
      id: Joi.string().hex().required()
    }
  },

  updateIngredientsItems: {
    body: {
      quantity: Joi.number().required(),
      _id: Joi.string().hex().required()
    }
  },
  updateIngredientsInBulk: {
    body: {
      ingredients: Joi.array().required()
    }
  },
  updateIngredientsListingItems: {
    body: {
      threshold: Joi.number().required(),
      quantity: Joi.number().required(),
      unit: Joi.string().required(),
      _id: Joi.string().hex().required()
    }
  },
  getOrderReport: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
      startDate: Joi.string().required()
    }
  },
  createCityValidator: {
    body: {
      englishName: Joi.string().required(),
      coordinates: Joi.array().min(1).max(2)
    }
  },
  updateCityValidator: {
    params: {
      cityId: Joi.string().hex().required()
    },
    body: {
      englishName: Joi.string().required(),
      coordinates: Joi.array().min(1).max(2),
      status: Joi.string().required(),
      address: Joi.string().required()
    }
  },
  getCityValidator: {
    params: {
      cityId: Joi.string().required()
    }
  },
  // PUT /api/customers/city/update/:customerId
  updateCustomerCity: {
    body: {
      cityId: Joi.string().hex().required()
    }
  },
  // PUT /api/customers/address/update/:customerId
  updateCustomerAddress: {
    body: {
      address: Joi.string().required(),
      coordinates: Joi.array().min(1).max(2)
    }
  },

  // Branch APIs

  // POST /api/branches
  createBranch: {
    body: {
      branchName: Joi.string().required(),
      coordinates: Joi.array().min(1).max(2)
    }
  },

  listBranches: {
    params: {
      offset: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required()
    },
    query: {
      searchText: Joi.string(),
      status: Joi.string()
    }
  },

  listCustomerBranches: {
    params: {
      offset: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required(),
      customerId: Joi.string().hex().required()
    }
  },

  updateBranch: {
    body: {
      branchName: Joi.string().required(),
      _id: Joi.string().hex()
    }
  },

  getBranch: {
    params: {
      branchId: Joi.string().required()
    }
  },

  // Contact APIs
  // POST /api/contacts
  createContact: {
    body: {
      user: {
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string(),
        mobileNumber: Joi.string(),
      },
      message: {
        title: Joi.string().required(),
        body: Joi.string().required()
      }
    }
  },
  updateContactValidator: {
    params: {
      contactId: Joi.string().hex().required()
    },
    body: {
      message: {
        title: Joi.string().required(),
        body: Joi.string().required(),
      },
      is_seen: Joi.boolean().required(),
      category: Joi.string().required()
    }
  },
  getContactValidator: {
    params: {
      contactId: Joi.string().required()
    }
  },

  replyValidator: {
    params: {
      contactId: Joi.string().required()
    },
    body: {
      user: Joi.string().required(),
      reply: Joi.string().required(),
    }
  },

  // Content APIs
  // POST /api/contents
  createContent: {
    body: {
      title: {
        arabic: Joi.string().required(),
        english: Joi.string().required(),
      },
      body: {
        arabic: Joi.string().required(),
        english: Joi.string().required(),
      },
      status: Joi.string().required(),
      key: Joi.string().required(),
      user: Joi.string().required()
    }
  },

  updateContent: {
    params: {
      contentId: Joi.string().hex().required()
    },
    body: {
      title: {
        arabic: Joi.string().required(),
        english: Joi.string().required(),
      },
      body: {
        arabic: Joi.string().required(),
        english: Joi.string().required(),
      },
      status: Joi.string().required(),
      key: Joi.string().required(),
      user: Joi.string().required()

    }
  },
  getContentValidator: {
    params: {
      contentId: Joi.string().hex().required()
    }
  },

  // Email APIs
  // POST /api/emails
  createEmail: {
    body: {
      arabicTitle: Joi.string().required(),
      arabicBody: Joi.string().required(),
      englishTitle: Joi.string().required(),
      englishBody: Joi.string().required(),
      type: Joi.string().required(),
      key: Joi.string().required()
    }
  },

  updateEmail: {
    body: {
      type: Joi.string().required(),
      arabicTitle: Joi.string().required(),
      arabicBody: Joi.string().required(),
      englishTitle: Joi.string().required(),
      englishBody: Joi.string().required(),
      key: Joi.string().required()
    }
  },

  getEmailById: {
    params: {
      emailId: Joi.string().hex().required(),
    }
  },

  resetEmail: {
    body: {
      title: Joi.string().required()
    }
  },

  // System Variable APIs
  // POST /api/systemVariables
  createVariable: {
    body: {
      key: Joi.string().required(),
      title: Joi.string().required(),
      value: Joi.string().required(),
      order: Joi.number().required(),
      group: Joi.string().required(),
      isSerializable: Joi.boolean().required(),
      isHidden: Joi.boolean().required(),
      type: Joi.string().allow('STRING', 'BOOLEAN', 'NUMBER', 'HTML').required()
    }
  },
  updateVariable: {
    params: {
      variableId: Joi.string().hex().required()
    },
    body: {
      key: Joi.string().required(),
      title: Joi.string().required(),
      value: Joi.string().required(),
      order: Joi.number().required(),
      group: Joi.string().required(),
      isSerializable: Joi.boolean().required(),
      isHidden: Joi.boolean().required(),
      type: Joi.string().allow('STRING', 'BOOLEAN', 'NUMBER', 'HTML').required()
    }
  },
  getVariable: {
    params: {
      variableId: Joi.string().hex().required()
    }
  },

  // System Unit APIs
  // POST /api/systemUnits
  createUnit: {
    body: {
      arabicName: Joi.string().required(),
      englishName: Joi.string().required()
    }
  },

  updateUnit: {
    params: {
      unitId: Joi.string().hex().required()
    },
    body: {
      arabicName: Joi.string().required(),
      englishName: Joi.string().required()
    }
  },

  getUnit: {
    params: {
      unitId: Joi.string().hex().required()
    }
  },

  // Notification APIs
  // POST /api/notifications
  getNotificationList: {
    query: {
      skip: Joi.number().integer().min(0).required(),
      limit: Joi.number().integer().min(1).required()
    }
  },

  getNotification: {
    params: {
      notificationId: Joi.string().hex().required()
    }
  },
};
