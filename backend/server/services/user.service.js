import bcrypt from 'bcryptjs';
import Promise from 'bluebird';
import moment from 'moment-timezone';
import User from '../models/user.model';
import Supplier from '../models/supplier.model';
import Customer from '../models/customer.model';
import Role from '../models/role.model';
import appSettings from '../../appSettings';

const hash = Promise.promisify(bcrypt.hash);
const HASH_SALT_ROUNDS = 10;


/**
 * Checks if provided password during change is matched with saved password
 * @param {User} user - The updated user.
 * @param {String} oldPassword - provided by user.
 * @returns {User}
 */
function isSavedPasswordMatch(user, oldPassword, callback) {
  User.findOne({ email: user.email })
    .select('+password')
    .where('status').equals('Active')
    .then((userData) => {
      if (userData) {
        bcrypt.compare(oldPassword, userData.password, (bcryptErr, result) => {
          if (result) {
            callback(null, user);
          } else {
            callback(null, false);
          }
        });
      }
    });
}
/**
 * Check that the email and phone number are not duplicate
 * @param {User} user - The updated user.
 * @returns {User}
 */
function isEmailMobileNumberDuplicate(user, callback) {
  if (user) {
    User.findOne()
      .or([{ email: user.email }, { mobileNumber: user.mobileNumber }])
      .where('_id').ne(user._id)
      .where('status').ne('Deleted')
      .then((duplicateUser) => {
        if (duplicateUser) {
          callback(31, null);
        } else {
          callback(null, user);
        }
      });
  } else {
    callback(null, false);
  }
}

/**
 * Check that the commercial register of supplier is not duplicate
 * @param {User} supplier - The updated user.
 * @param {User} customer - The updated user.
 * @returns {User}
 */
function isCommercialRegisterDuplicate(supplier, customer, callback) {
  if (supplier) {
    Supplier.findOne({ commercialRegister: supplier.commercialRegister })
      .then((supplierObj) => {
        if (supplierObj) {
          callback(32, null);
        } else {
          callback(null, supplier);
        }
      });
  } else if (customer) {
    Customer.findOne({ commercialRegister: customer.commercialRegister })
      .then((customerObj) => {
        if (customerObj) {
          callback(32, null);
        } else {
          callback(null, customer);
        }
      });
  } else {
    callback(null, false);
  }
}
/**
 * Hash the user's password and save the user with the hashed password.
 * @param {User} user - The user with the password to be hashed.
 * @returns {User}
 */
function hashPasswordAndSave(user, callback) {
  if (user) {
    hash(user.password, HASH_SALT_ROUNDS)
      .then((hashedPassword) => {
        user.password = hashedPassword;
        user.createdAt = moment().tz(appSettings.timeZone).format(appSettings.momentFormat);
        user.save()
          .then(savedUser => callback(null, savedUser))
          .catch(e => callback(e, null));
      });
  } else {
    callback(null, false);
  }
}

/**
 * Checks if the default admin is created, and creating one if they're not.
 */
function checkDefaultAdmin() {
  User.findOne()
  .where('email').equals('admin@admin.com')
  .then((user) => {
    if (!user) {
      Role.findOne()
      .where('englishName').equals('Super Admin')
      .then((role) => {

        const adminUser = new User({
          email: 'admin@admin.com',
          // email: 'khaleel@supplieson.com',
          mobileNumber: '966512345678',
          firstName: 'Admin',
          lastName: 'Admin',
          password: '123456789',
          role: role._id,
          type: 'Admin',
          language: 'en'
        });

        hash(adminUser.password, HASH_SALT_ROUNDS)
        .then((hashedPassword) => {
          adminUser.password = hashedPassword;
          adminUser.save();
        });
      });
    }
  });

  User.findOne()
    .where('email').equals('khaleel@indielabs.sa')
    .then((user) => {
      if (!user) {
        Role.findOne()
          .where('englishName').equals('Super Admin')
          .then((role) => {
            const adminUser = new User({
              email: 'khaleel@indielabs.sa',
              mobileNumber: '966512345679',
              firstName: 'KhaleelAdmin',
              lastName: 'KhaleelAdmin',
              password: 'asd12345',
              role: role._id,
              type: 'Admin',
              language: 'en'
            });

            hash(adminUser.password, HASH_SALT_ROUNDS)
              .then((hashedPassword) => {
                adminUser.password = hashedPassword;
                adminUser.save((savedAdmin) => {
                  // Create product admin role.
                  // const productAdmin = new Role({
                  //   userType: 'Admin',
                  //   englishName: 'Product Manager',
                  //   arabicName: 'مدير الإنتاج',
                  //   permissions: [],
                  //   user: savedAdmin,
                  //   isLocked: true });
                  // productAdmin.save();
                  //
                  // // Create product Profile Admin role.
                  // const productProfileAdmin = new Role({
                  //   userType: 'Admin',
                  //   englishName: 'Product Profile Admin',
                  //   arabicName: 'مدير الملف الشخصى',
                  //   permissions: [],
                  //   user: savedAdmin,
                  //   isLocked: true });
                  // productProfileAdmin.save();
                  //
                  // // Create deployment admin role.
                  // const deploymentAdmin = new Role({
                  //   userType: 'Admin',
                  //   englishName: 'Deployment Admin',
                  //   arabicName: 'مدير التوظيف',
                  //   permissions: [],
                  //   user: savedAdmin,
                  //   isLocked: true });
                  // deploymentAdmin.save();
                  //
                  // // Create accountant admin role.
                  // const accountantAdmin = new Role({
                  //   userType: 'Admin',
                  //   englishName: 'System Admin',
                  //   arabicName: 'مدير الحسابات',
                  //   permissions: [],
                  //   user: savedAdmin,
                  //   isLocked: true });
                  // accountantAdmin.save();
                });
              });
          });
      }
    });
}

/**
 * Saves an updated user.
 * @param {User} user - The user to be saved.
 * @returns {User}
 */
function update(user, callback) {
  if (user) {
    user.save()
      .then(savedUser => callback(null, savedUser));
  } else {
    callback(null, false);
  }
}

/**
 * Puts a word in the plural
 * @param {string} word
 * @returns {string}
 */
function toTitleCase(word) {
  return word.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}


export default {
  isEmailMobileNumberDuplicate,
  hashPasswordAndSave,
  update,
  checkDefaultAdmin,
  isSavedPasswordMatch,
  isCommercialRegisterDuplicate,
  toTitleCase
};
