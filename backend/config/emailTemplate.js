module.exports = {
  defaultTemplate: [
    /* 1 */
    {
      type: 'NEWORDER',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>\n\nYour Order orderId has been submitted successfully. we will inform you with recent updates concerning your order within few days.</p><p>we are glad that you enjoyed our offered products.\n\nwe hope that we will always be at your best to satisfy your needs.\n\nTo follow up your orders: orderPageUrl</p>',
          title: 'New Order'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph0"><span id="noHighlight_0.1895808826032197">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><div paragraphname="paragraph2"><span id="noHighlight_0.1311374920922841">تم إرسال طلبك&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">orderId</span>&nbsp;بنجاح. سنقوم بابلاغك بالتحديثات الاخيره المتعلقة بطلبك في غضون أيام قليله.</div><div paragraphname="paragraph2"><span id="noHighlight_0.1311374920922841"> نحن سعداء لأنك استمتعت بالمنتجات المعروضة لدينا. ونامل ان نقدم دائما افضل ما لدينا لتلبيه احتياجاتكم. لمتابعه طلباتك:&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">orderPageUrl</span></div></div>',
          title: 'طلب جديد'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>\n\nYour Order orderId has been submitted successfully. we will inform you with recent updates concerning your order within few days.</p><p>we are glad that you enjoyed our offered products.\n\nwe hope that we will always be at your best to satisfy your needs.\n\nTo follow up your orders: orderPageUrl</p>',
          title: 'New Order'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph0"><span id="noHighlight_0.1895808826032197">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><div paragraphname="paragraph2"><span id="noHighlight_0.1311374920922841">تم إرسال طلبك&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">orderId</span>&nbsp;بنجاح. سنقوم بابلاغك بالتحديثات الاخيره المتعلقة بطلبك في غضون أيام قليله.</div><div paragraphname="paragraph2"><span id="noHighlight_0.1311374920922841"> نحن سعداء لأنك استمتعت بالمنتجات المعروضة لدينا. ونامل ان نقدم دائما افضل ما لدينا لتلبيه احتياجاتكم. لمتابعه طلباتك:&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">orderPageUrl</span></div></div>',
          title: 'طلب جديد'
        }
      },
      key: [
        '{{recipientName}}',
        '{{orderId}}',
        '{{orderPageUrl}}'
      ]
    },

    /* 2 */
    {
      type: 'UPDATEUSER',
      original_template: {
        en: {
          body: "<p>Hello, recipientName</p>\n<p><br></p>\n<p>Your account's information has been updated.</p>\n<p>Login Link: loginPageUrl</p>",
          title: "Update User account's information"
        },
        ar: {
          body: '<p>مرحبا، recipientName</p>\n<p><br></p>\n<p> لقد تم تحديث بيانات حسابك الحالى.</p>\n<p>رابط الدخول: loginPageUrl</p>',
          title: 'تحديث بيانات المستخدم'
        }
      },
      template: {
        en: {
          body: "<p>Hello, recipientName</p>\n<p><br></p>\n<p>Your account's information has been updated.</p>\n<p>Login Link: loginPageUrl</p>",
          title: "Update User account's information"
        },
        ar: {
          body: '<p>مرحبا، recipientName</p>\n<p><br></p>\n<p> لقد تم تحديث بيانات حسابك الحالى.</p>\n<p>رابط الدخول: loginPageUrl</p>',
          title: 'تحديث بيانات المستخدم'
        }
      },
      key: [
        '{{recipientName}}',
        '{{loginPageUrl}}'
      ]
    },

    /* 3 */
    {
      type: 'DECLAREPAYMENT',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>A payment has been declared with paymentId by userName.</p>',
          title: 'Declare Payment'
        },
        ar: {
          body: '<p>مرحبا recipientName</p>\n<p> لقد تم دفع مبلغ paymentId بواسطة userName.</p>',
          title: 'دفع مبلغ'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>A payment has been declared with paymentId by userName.</p>',
          title: 'Declare Payment'
        },
        ar: {
          body: '<p>مرحبا recipientName</p>\n<p> لقد تم دفع مبلغ paymentId بواسطة userName.</p>',
          title: 'دفع مبلغ'
        }
      },
      key: [
        '{{recipientName}}',
        '{{paymentId}}',
        '{{userName}}'
      ]
    },

    /* 4 */
    {
      type: 'NEWUSER',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>Welcome to SuppliesOn.com your way to find the most valuable products and enjoy special prices. we are keen to offer you best services that will satisfy your needs.</p><p>Feel free to take a tour in SuppliesOn</p><p>Sign In to your Account loginPageUrl</p><p>Email: userName</p><p>Password: password</p>',
          title: 'Welcome to SupplierOn.com'
        },
        ar: {
          body: '<p><span id="\\&quot;noHighlight_0.4871362304448914\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">مرحبا <span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;="" font-size:="" 14px;="" letter-spacing:="" 0.14px;\\"="">recipientName</span></span></p><p><span id="\\&quot;noHighlight_0.4871362304448914\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"=""> اهلا بك في SuppliesOn.com طريقك للحصول علي المنتجات الأكثر قيمه والتمتع بأسعار خاصه. نحن حريصون علي تقديم أفضل الخدمات التي تلبي احتياجاتك. لا&nbsp;</span><span srcinfo="\\&quot;189:192\\&quot;" dstinfo="\\&quot;163:167\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__189_192TO163_167\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">تتردد</span><span id="\\&quot;noHighlight_0.9415749094358357\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">في&nbsp;</span><span srcinfo="\\&quot;199:200\\&quot;" dstinfo="\\&quot;172:177\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__199_200TO172_177\\&quot;" class="\\&quot;\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">القيام</span><span id="\\&quot;noHighlight_0.8569591568325368\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">&nbsp;</span><span srcinfo="\\&quot;209:212\\&quot;" dstinfo="\\&quot;179:182\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__209_212TO179_182\\&quot;" class="\\&quot;\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">بجولة</span><span id="\\&quot;noHighlight_0.5125643559384416\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">&nbsp;</span><span srcinfo="\\&quot;214:215\\&quot;" dstinfo="\\&quot;185:186\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__214_215TO185_186\\&quot;" class="\\&quot;\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">في موقعنا</span></p><p><span style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">الخاص بك&nbsp;</span><span id="\\&quot;noHighlight_0.3713076799916235\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">&nbsp;</span>loginPageUrl</p><p><span srcinfo="\\&quot;174:174\\&quot;" dstinfo="\\&quot;133:133\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__174_174TO133_133\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">البريد الالكترونى:&nbsp;</span>userName</p><p>كلمة المرور: password</p>',
          title: 'مرحبا بك في SuppliesOn.com'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>Welcome to SuppliesOn.com your way to find the most valuable products and enjoy special prices. we are keen to offer you best services that will satisfy your needs.</p><p>Feel free to take a tour in SuppliesOn</p><p>Sign In to your Account loginPageUrl</p><p>Email: userName</p><p>Password: password</p>',
          title: 'Welcome to SupplierOn.com'
        },
        ar: {
          body: '<p><span id="\\&quot;noHighlight_0.4871362304448914\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">مرحبا <span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;="" font-size:="" 14px;="" letter-spacing:="" 0.14px;\\"="">recipientName</span></span></p><p><span id="\\&quot;noHighlight_0.4871362304448914\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"=""> اهلا بك في SuppliesOn.com طريقك للحصول علي المنتجات الأكثر قيمه والتمتع بأسعار خاصه. نحن حريصون علي تقديم أفضل الخدمات التي تلبي احتياجاتك. لا&nbsp;</span><span srcinfo="\\&quot;189:192\\&quot;" dstinfo="\\&quot;163:167\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__189_192TO163_167\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">تتردد</span><span id="\\&quot;noHighlight_0.9415749094358357\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">في&nbsp;</span><span srcinfo="\\&quot;199:200\\&quot;" dstinfo="\\&quot;172:177\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__199_200TO172_177\\&quot;" class="\\&quot;\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">القيام</span><span id="\\&quot;noHighlight_0.8569591568325368\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">&nbsp;</span><span srcinfo="\\&quot;209:212\\&quot;" dstinfo="\\&quot;179:182\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__209_212TO179_182\\&quot;" class="\\&quot;\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">بجولة</span><span id="\\&quot;noHighlight_0.5125643559384416\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">&nbsp;</span><span srcinfo="\\&quot;214:215\\&quot;" dstinfo="\\&quot;185:186\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__214_215TO185_186\\&quot;" class="\\&quot;\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">في موقعنا</span></p><p><span style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">الخاص بك&nbsp;</span><span id="\\&quot;noHighlight_0.3713076799916235\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">&nbsp;</span>loginPageUrl</p><p><span srcinfo="\\&quot;174:174\\&quot;" dstinfo="\\&quot;133:133\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__174_174TO133_133\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">البريد الالكترونى:&nbsp;</span>userName</p><p>كلمة المرور: password</p>',
          title: 'مرحبا بك في SuppliesOn.com'
        }
      },
      key: [
        '{{recipientName}}',
        '{{loginPageUrl}}'
      ]
    },

    /* 5 */
    {
      type: 'INVITESTAFF',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>\nWelcome aboard, you have been invited to join representativeName. your account is waiting for you to login.</p><p>\n\nSign In to your Account loginPageUrl</p><p>Email: userName</p><p>Password: password</p>',
          title: 'Invite Staff Member'
        },
        ar: {
          body: '<p><span id="noHighlight_0.5838233627517839" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">مرحبا </span>recipientName</p><p><span id="noHighlight_0.5838233627517839" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">اهلا بك معنا ، لقد تمت دعوتك للانضمام الى </span>representativeName<span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">. قم بتسجيل الدخول الى الحساب الخاص بك </span><span id="noHighlight_0.3713076799916235" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">&nbsp;</span>loginPageUrl</p><p><span srcinfo="174:174" dstinfo="133:133" paragraphname="paragraph0" issource="false" id="ouHighlight__174_174TO133_133" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">البريد الالكترونى:&nbsp;</span>userName</p><p>كلمة المرور: password</p>',
          title: 'دعوه موظف'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>\nWelcome aboard, you have been invited to join representativeName. your account is waiting for you to login.</p><p>\n\nSign In to your Account loginPageUrl</p><p>Email: userName</p><p>Password: password</p>',
          title: 'Invite Staff Member'
        },
        ar: {
          body: '<p><span id="noHighlight_0.5838233627517839" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">مرحبا </span>recipientName</p><p><span id="noHighlight_0.5838233627517839" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">اهلا بك معنا ، لقد تمت دعوتك للانضمام الى </span>representativeName<span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">. قم بتسجيل الدخول الى الحساب الخاص بك </span><span id="noHighlight_0.3713076799916235" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">&nbsp;</span>loginPageUrl</p><p><span srcinfo="174:174" dstinfo="133:133" paragraphname="paragraph0" issource="false" id="ouHighlight__174_174TO133_133" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">البريد الالكترونى:&nbsp;</span>userName</p><p>كلمة المرور: password</p>',
          title: 'دعوه موظف'
        }
      },
      key: [
        '{{recipientName}}',
        '{{representativeName}}',
        '{{loginPageUrl}}',
        '{{userName}}',
        '{{password}}'
      ]
    },

    /* 6 */
    {
      type: 'INVITESUPPLIER',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>Welcome aboard, you have been invited to join SuppliesOn.com. your account is waiting for you to login.</p><p>Sign In to your Account: loginPageUrl</p><p>Email: userName</p><p>Password: password</p><input class="btn btn-primary" type="button" onclick="location.href="https://www.supplieson.com/auth/login";" value="Accept terms & conditions and login">',
          title: 'Invite Supplier'
        },
        ar: {
          body: '<p><span id="\\&quot;noHighlight_0.5838233627517839\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">مرحبا </span>recipientName</p><p><span id="\\&quot;noHighlight_0.5838233627517839\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">اهلا بك معنا ، لقد تمت دعوتك للانضمام الى&nbsp; </span>SuppliesOn.com<span style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">. قم بتسجيل الدخول الى الحساب الخاص بك </span><span id="\\&quot;noHighlight_0.3713076799916235\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">&nbsp;</span>loginPageUrl</p><p><span srcinfo="\\&quot;174:174\\&quot;" dstinfo="\\&quot;133:133\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__174_174TO133_133\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">البريد الالكترونى:&nbsp;</span>userName</p><p>كلمة السر: password</p><input class="btn btn-primary" type="button" onclick="location.href="https://www.supplieson.com/auth/login";" value="قبول الشروط والأحكام وتسجيل الدخول">',
          title: 'دعوه مورد'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>Welcome aboard, you have been invited to join SuppliesOn.com. your account is waiting for you to login.</p><p>Sign In to your Account: loginPageUrl</p><p>Email: userName</p><p>Password: password</p><input class="btn btn-primary" type="button" onclick="location.href="https://www.supplieson.com/auth/login";" value="Accept terms & conditions and login">',
          title: 'Invite Supplier'
        },
        ar: {
          body: '<p><span id="\\&quot;noHighlight_0.5838233627517839\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">مرحبا </span>recipientName</p><p><span id="\\&quot;noHighlight_0.5838233627517839\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">اهلا بك معنا ، لقد تمت دعوتك للانضمام الى&nbsp; </span>SuppliesOn.com<span style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">. قم بتسجيل الدخول الى الحساب الخاص بك </span><span id="\\&quot;noHighlight_0.3713076799916235\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">&nbsp;</span>loginPageUrl</p><p><span srcinfo="\\&quot;174:174\\&quot;" dstinfo="\\&quot;133:133\\&quot;" paragraphname="\\&quot;paragraph0\\&quot;" issource="\\&quot;false\\&quot;" id="\\&quot;ouHighlight__174_174TO133_133\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;\\"="">البريد الالكترونى:&nbsp;</span>userName</p><p>كلمة السر: password</p><input class="btn btn-primary" type="button" onclick="location.href="https://www.supplieson.com/auth/login";" value="قبول الشروط والأحكام وتسجيل الدخول">',
          title: 'دعوه مورد'
        }
      },
      key: [
        '{{recipientName}}',
        '{{loginPageUrl}}',
        '{{userName}}',
        '{{password}}'
      ]
    },

    /* 7 */
    {
      type: 'INVITECUSTOMER',
      original_template: {
        en: {
          body: "<p>Hello recipientName</p><p>You have been invited to join supplier 's store. We are glad to invite you to enjoy our services and our valuable products. offers and special prices are waiting for you to take advantage.\n</p><p>\nGetting Started with a tour landingPageUrl</p><p style=\"margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;\">You can sign up&nbsp;and manage your account information.<span style=\"font-size: 13px; color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;\">&nbsp;signUpPage</span><br></p><p style=\"margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;\">complete your profile and you will be able to enjoy increased and enhanced services from us.</p><p style=\"margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;\">Thanks for joining.</p>",
          title: 'Invite Customer'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.21929622438454643">مرحبا </span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.338924874799422"><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">لقد تم دعوتك للانضمام الى supplier .</span>يسعدنا ان ندعوكم إلى التمتع بخدماتنا ومنتجاتنا القيمة. العروض والأسعار الخاصة تنتظرك للاستفادة منها.</span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph4" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.6730533377053005"><span id="noHighlight_0.8569591568325368">ابدا بالقيام&nbsp;</span><span srcinfo="209:212" dstinfo="179:182" paragraphname="paragraph0" issource="false" id="ouHighlight__209_212TO179_182" class="">بجولة</span><span id="noHighlight_0.5125643559384416">&nbsp;</span><span srcinfo="214:215" dstinfo="185:186" paragraphname="paragraph0" issource="false" id="ouHighlight__214_215TO185_186" class="">في موقعنا</span>&nbsp;</span><span srcinfo="44:44" dstinfo="35:35" paragraphname="paragraph4" issource="false" id="ouHighlight__44_44TO35_35" class=""><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">landingPageUrl</span></span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph6" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.3394007207721419">يمكنك التسجيل وأداره معلومات الحساب.&nbsp;</span><span id="noHighlight_0.7083020428515099"><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">signUpPage</span></span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph8" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.8167512292134158">أكمل ملفك الشخصي و ستكون قادرا علي التمتع بالخدمات المتزايدة&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">و المميزة</span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph10" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.5358788868327347">شكرا لانضمامك</span></div>',
          title: 'دعوة عميل'
        }
      },
      template: {
        en: {
          body: "<p>Hello recipientName</p><p>You have been invited to join supplier 's store. We are glad to invite you to enjoy our services and our valuable products. offers and special prices are waiting for you to take advantage.\n</p><p>\nGetting Started with a tour landingPageUrl</p><p style=\"margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;\">You can sign up&nbsp;and manage your account information.<span style=\"font-size: 13px; color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;\">&nbsp;signUpPage</span><br></p><p style=\"margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;\">complete your profile and you will be able to enjoy increased and enhanced services from us.</p><p style=\"margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;\">Thanks for joining.</p>",
          title: 'Invite Customer'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.21929622438454643">مرحبا </span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.338924874799422"><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">لقد تم دعوتك للانضمام الى supplier .</span>يسعدنا ان ندعوكم إلى التمتع بخدماتنا ومنتجاتنا القيمة. العروض والأسعار الخاصة تنتظرك للاستفادة منها.</span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph4" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.6730533377053005"><span id="noHighlight_0.8569591568325368">ابدا بالقيام&nbsp;</span><span srcinfo="209:212" dstinfo="179:182" paragraphname="paragraph0" issource="false" id="ouHighlight__209_212TO179_182" class="">بجولة</span><span id="noHighlight_0.5125643559384416">&nbsp;</span><span srcinfo="214:215" dstinfo="185:186" paragraphname="paragraph0" issource="false" id="ouHighlight__214_215TO185_186" class="">في موقعنا</span>&nbsp;</span><span srcinfo="44:44" dstinfo="35:35" paragraphname="paragraph4" issource="false" id="ouHighlight__44_44TO35_35" class=""><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">landingPageUrl</span></span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph6" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.3394007207721419">يمكنك التسجيل وأداره معلومات الحساب.&nbsp;</span><span id="noHighlight_0.7083020428515099"><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">signUpPage</span></span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph8" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.8167512292134158">أكمل ملفك الشخصي و ستكون قادرا علي التمتع بالخدمات المتزايدة&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">و المميزة</span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph10" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.5358788868327347">شكرا لانضمامك</span></div>',
          title: 'دعوة عميل'
        }
      },
      key: [
        '{{recipientName}}',
        '{{landingPageUrl}}',
        '{{signUpPage}}'
      ]
    },

    /* 8 */
    {
      type: 'SPECIALPRICES',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>\n\nit is with our pleasure to offer you a special price on productName, keep up with the latest promotions. this is an effort by SuppliesOn to say thanks for all valued customers. we hope that you will take advantage of this once-in-a-lifetime offer and go directly on your store to buy them.\n\nwe are looking forward to hear from you.</p>',
          title: 'Special Offer'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.1282001420428076">مرحبا <span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.9368155736337904">من دواعي سرورنا ان نقدم لكم سعرا خاصا علي productName ، لمواكبه أحدث العروض. هذا جهد مقدم من قبل&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">SuppliesOn</span>&nbsp;لتقول شكرا لجميع العملاء الكرام. ونامل ان تستفيد من هذا العرض مره واحده في العمر والذهاب مباشره الى المتجر لشراءها. </span></div><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.9368155736337904">نحن نتطلع إلى ان نسمع منكم.</span></div>',
          title: 'عروض خاصة'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>\n\nit is with our pleasure to offer you a special price on productName, keep up with the latest promotions. this is an effort by SuppliesOn to say thanks for all valued customers. we hope that you will take advantage of this once-in-a-lifetime offer and go directly on your store to buy them.\n\nwe are looking forward to hear from you.</p>',
          title: 'Special Offer'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.1282001420428076">مرحبا <span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.9368155736337904">من دواعي سرورنا ان نقدم لكم سعرا خاصا علي productName ، لمواكبه أحدث العروض. هذا جهد مقدم من قبل&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">SuppliesOn</span>&nbsp;لتقول شكرا لجميع العملاء الكرام. ونامل ان تستفيد من هذا العرض مره واحده في العمر والذهاب مباشره الى المتجر لشراءها. </span></div><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.9368155736337904">نحن نتطلع إلى ان نسمع منكم.</span></div>',
          title: 'عروض خاصة'
        }
      },
      key: [
        '{{recipientName}}',
        '{{productName}}'
      ]
    },

    /* 9 */
    {
      type: 'RESETPASSWORD',
      original_template: {
        en: {
          body: '<p><span style="font-weight: bold;">\nHello</span>&nbsp;recipientName,</p><p><span style="letter-spacing: 0.01em;">You recently requested to reset password for your SuppliesON account. Click resetLink to reset it. If you didn’t request a password reset, please ignore this email or contact us.</span></p><p><span style="letter-spacing: 0.01em;"> This link is only valid for the next </span><span style="letter-spacing: 0.01em; font-weight: bold;">30 minutes.</span></p><p><span style="letter-spacing: 0.01em; font-weight: bold;"><br></span><span style="font-size: 14px; letter-spacing: 0.14px;">If you are having trouble clicking the password reset link. copy and paste the URL below into your browser. resetFullLink</span></p><p><br></p><p><br></p>',
          title: 'Reset Password'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">مرحبا <span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">لقد قمت مؤخرا بطلب أعاده تعيين كلمه المرور الخاصة بحسابك على موقع&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; letter-spacing: 0.13px;">SuppliesON</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">. انقر&nbsp;</span><span style="letter-spacing: 0.13px; color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">resetLink</span><span style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right; color: rgb(0, 0, 255);">&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">لأعاده التعيين.</span></div><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">إذا لم تطلب أعاده تعيين كلمه المرور ، الرجاء تجاهل هذا البريد الكتروني أو تواصل معنا.</p><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">&nbsp;هذا الرابط صالح فقط لمده 30 دقيقه.</p><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">إذا كنت تواجه مشكله في النقر على الرابط لأعاده تعيين كلمه المرور. انسخ عنوان الموقع أدناه في المتصفح الخاص بك.&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; letter-spacing: 0.14px;">resetFullLink</span></p></div>',
          title: 'استعادة كلمة المرور'
        }
      },
      template: {
        en: {
          body: '<p><span style="font-weight: bold;">\nHello</span>&nbsp;recipientName,</p><p><span style="letter-spacing: 0.01em;">You recently requested to reset password for your SuppliesON account. Click resetLink to reset it. If you didn’t request a password reset, please ignore this email or contact us.</span></p><p><span style="letter-spacing: 0.01em;"> This link is only valid for the next </span><span style="letter-spacing: 0.01em; font-weight: bold;">30 minutes.</span></p><p><span style="letter-spacing: 0.01em; font-weight: bold;"><br></span><span style="font-size: 14px; letter-spacing: 0.14px;">If you are having trouble clicking the password reset link. copy and paste the URL below into your browser. resetFullLink</span></p><p><br></p><p><br></p>',
          title: 'Reset Password'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">مرحبا <span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">لقد قمت مؤخرا بطلب أعاده تعيين كلمه المرور الخاصة بحسابك على موقع&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; letter-spacing: 0.13px;">SuppliesON</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">. انقر&nbsp;</span><span style="letter-spacing: 0.13px; color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">resetLink</span><span style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right; color: rgb(0, 0, 255);">&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">لأعاده التعيين.</span></div><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">إذا لم تطلب أعاده تعيين كلمه المرور ، الرجاء تجاهل هذا البريد الكتروني أو تواصل معنا.</p><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">&nbsp;هذا الرابط صالح فقط لمده 30 دقيقه.</p><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">إذا كنت تواجه مشكله في النقر على الرابط لأعاده تعيين كلمه المرور. انسخ عنوان الموقع أدناه في المتصفح الخاص بك.&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; letter-spacing: 0.14px;">resetFullLink</span></p></div>',
          title: 'استعادة كلمة المرور'
        }
      },
      key: [
        '{{recipientName}}',
        '{{resetLink}}',
        '{{resetFullLink}}'
      ]
    },

    /* 10 */
    {
      type: 'FORGETPASSWORD',
      original_template: {
        en: {
          body: '<p><span style="font-weight: bold;">\nHello</span>&nbsp;recipientName,</p><p><span style="letter-spacing: 0.01em;">You recently requested to reset password for your SuppliesON account. Click resetLink to reset it. If you didn’t request a password reset, please ignore this email or contact us.</span></p><p><span style="letter-spacing: 0.01em;"> This link is only valid for the next </span><span style="letter-spacing: 0.01em; font-weight: bold;">30 minutes.</span></p><p><span style="letter-spacing: 0.01em; font-weight: bold;"><br></span><span style="font-size: 14px; letter-spacing: 0.14px;">If you are having trouble clicking the password reset link. copy and paste the URL below into your browser. resetFullLink</span></p><p><br></p><p><br></p>',
          title: 'Reset Password'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">مرحبا <span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">لقد قمت مؤخرا بطلب أعاده تعيين كلمه المرور الخاصة بحسابك على موقع&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; letter-spacing: 0.13px;">SuppliesON</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">. انقر&nbsp;</span><span style="letter-spacing: 0.13px; color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">resetLink</span><span style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right; color: rgb(0, 0, 255);">&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">لأعاده التعيين.</span></div><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">إذا لم تطلب أعاده تعيين كلمه المرور ، الرجاء تجاهل هذا البريد الكتروني أو تواصل معنا.</p><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">&nbsp;هذا الرابط صالح فقط لمده 30 دقيقه.</p><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">إذا كنت تواجه مشكله في النقر على الرابط لأعاده تعيين كلمه المرور. انسخ عنوان الموقع أدناه في المتصفح الخاص بك.&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; letter-spacing: 0.14px;">resetFullLink</span></p></div>',
          title: 'استعادة كلمة المرور'
        }
      },
      template: {
        en: {
          body: '<p><span style="font-weight: bold;">\nHello</span>&nbsp;recipientName,</p><p><span style="letter-spacing: 0.01em;">You recently requested to reset password for your SuppliesON account. Click resetLink to reset it. If you didn’t request a password reset, please ignore this email or contact us.</span></p><p><span style="letter-spacing: 0.01em;"> This link is only valid for the next </span><span style="letter-spacing: 0.01em; font-weight: bold;">30 minutes.</span></p><p><span style="letter-spacing: 0.01em; font-weight: bold;"><br></span><span style="font-size: 14px; letter-spacing: 0.14px;">If you are having trouble clicking the password reset link. copy and paste the URL below into your browser. resetFullLink</span></p><p><br></p><p><br></p>',
          title: 'Reset Password'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">مرحبا <span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">لقد قمت مؤخرا بطلب أعاده تعيين كلمه المرور الخاصة بحسابك على موقع&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; letter-spacing: 0.13px;">SuppliesON</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">. انقر&nbsp;</span><span style="letter-spacing: 0.13px; color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">resetLink</span><span style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right; color: rgb(0, 0, 255);">&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">لأعاده التعيين.</span></div><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">إذا لم تطلب أعاده تعيين كلمه المرور ، الرجاء تجاهل هذا البريد الكتروني أو تواصل معنا.</p><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">&nbsp;هذا الرابط صالح فقط لمده 30 دقيقه.</p><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-align: right;">إذا كنت تواجه مشكله في النقر على الرابط لأعاده تعيين كلمه المرور. انسخ عنوان الموقع أدناه في المتصفح الخاص بك.&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; letter-spacing: 0.14px;">resetFullLink</span></p></div>',
          title: 'استعادة كلمة المرور'
        }
      },
      key: [
        '{{recipientName}}',
        '{{resetLink}}',
        '{{resetFullLink}}'
      ]
    },

    /* 11 */
    {
      type: 'NEWINVOICE',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>\nWe kindly inform you that your monthly invoice invoiceId for month month has been issued. Please pay the invoice before due date dueDate.</p>',
          title: 'Invoice'
        },
        ar: {
          body: '<p><span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">مرحبا&nbsp;</span><span style="font-size: 13px; letter-spacing: normal;">recipientName</span></p><p><span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">نود ان نبلغكم أنه قد تم إصدار فاتورتكم الشهرية&nbsp;</span>invoiceId<span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">&nbsp;لشهر month. الرجاء دفع الفاتورة قبل تاريخ الاستحقاق&nbsp;</span>dueDate.</p>',
          title: 'فاتورة'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>\nWe kindly inform you that your monthly invoice invoiceId for month month has been issued. Please pay the invoice before due date dueDate.</p>',
          title: 'Invoice'
        },
        ar: {
          body: '<p><span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">مرحبا&nbsp;</span><span style="font-size: 13px; letter-spacing: normal;">recipientName</span></p><p><span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">نود ان نبلغكم أنه قد تم إصدار فاتورتكم الشهرية&nbsp;</span>invoiceId<span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">&nbsp;لشهر month. الرجاء دفع الفاتورة قبل تاريخ الاستحقاق&nbsp;</span>dueDate.</p>',
          title: 'فاتورة'
        }
      },
      key: [
        '{{recipientName}}',
        '{{invoiceId}}',
        '{{month}}',
        '{{dueDate}}'
      ]
    },

    /* 12 */
    {
      type: 'BLOCK',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p style="margin-top: 10px; margin-bottom: 0px; font-size: 14px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">Unfortunately, your account has been deactivated by SuppliesON,&nbsp;</p><p style="margin-top: 10px; margin-bottom: 0px; font-size: 14px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">If there is an issue regarding this action. So kindly contact <span style="text-decoration-line: underline;"><a href=\\"https://www.supplieson.com\\">SuppliesON.com</a></span> to solve it.</p>',
          title: 'Block Account'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.1435803940554654">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;"><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px;"></p><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.1989447345752937"><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">للاسف ، تم تعطيل حسابك فى&nbsp;</span></span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">SuppliesON</span>&nbsp;،&nbsp;</div><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;"><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px;"></p><div paragraphname="paragraph4" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.8804627193496966">إذا كانت هناك مساله تتعلق بهذا الاجراء. لذا يرجى التواصل مع&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; text-decoration-line: underline; font-size: 14px;"><a href=\\"https://www.supplieson.com\\">SuppliesON.com</a></span>&nbsp;لحلها.</div>',
          title: 'تعطيل الحساب الشخصي'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p style="margin-top: 10px; margin-bottom: 0px; font-size: 14px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">Unfortunately, your account has been deactivated by SuppliesON,&nbsp;</p><p style="margin-top: 10px; margin-bottom: 0px; font-size: 14px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">If there is an issue regarding this action. So kindly contact <span style="text-decoration-line: underline;"><a href=\\"https://www.supplieson.com\\">SuppliesON.com</a></span> to solve it.</p>',
          title: 'Block Account'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.1435803940554654">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;"><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px;"></p><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.1989447345752937"><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">للاسف ، تم تعطيل حسابك فى&nbsp;</span></span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">SuppliesON</span>&nbsp;،&nbsp;</div><p style="margin-top: 10px; margin-bottom: 0px; padding: 0px; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;"><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px;"></p><div paragraphname="paragraph4" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.8804627193496966">إذا كانت هناك مساله تتعلق بهذا الاجراء. لذا يرجى التواصل مع&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; text-decoration-line: underline; font-size: 14px;"><a href=\\"https://www.supplieson.com\\">SuppliesON.com</a></span>&nbsp;لحلها.</div>',
          title: 'تعطيل الحساب الشخصي'
        }
      },
      key: [
        '{{recipientName}}'
      ]
    },

    /* 13 */
    {
      type: 'GENERALMESSAGE',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>\nThank you for using SuppliesOn.com . as we plan for adding new features , we always like to reach out customers to gather some thoughts. we like to understand more about what is important to you.\n\nplease dont hesitate to contact us and give your feedback. feedbackPageLink</p>',
          title: 'Contact Us'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style=""><span id="noHighlight_0.18910399143297307" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">مرحبا&nbsp;</span><span style="font-size: 13px; letter-spacing: normal;">recipientName</span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.3457835290227931">نشكركم علي استخدام SuppliesOn.com. نحن نخطط لادخال ميزات جديده ، و دائما نرغب في التواصل مع العملاء لجمع بعض الأفكار. نود ان نفهم أكثر حول ما هو مهم بالنسبة لك. الرجاء عدم التردد في الاتصال بنا وإعطاء ملاحظاتك.&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">feedbackPageLink</span></div>',
          title: 'تواصل معنا'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>\nThank you for using SuppliesOn.com . as we plan for adding new features , we always like to reach out customers to gather some thoughts. we like to understand more about what is important to you.\n\nplease dont hesitate to contact us and give your feedback. feedbackPageLink</p>',
          title: 'Contact Us'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style=""><span id="noHighlight_0.18910399143297307" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">مرحبا&nbsp;</span><span style="font-size: 13px; letter-spacing: normal;">recipientName</span></div><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.3457835290227931">نشكركم علي استخدام SuppliesOn.com. نحن نخطط لادخال ميزات جديده ، و دائما نرغب في التواصل مع العملاء لجمع بعض الأفكار. نود ان نفهم أكثر حول ما هو مهم بالنسبة لك. الرجاء عدم التردد في الاتصال بنا وإعطاء ملاحظاتك.&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">feedbackPageLink</span></div>',
          title: 'تواصل معنا'
        }
      },
      key: [
        '{{recipientName}}',
        '{{feedbackPageLink}}'
      ]
    },

    /* 14 */
    {
      type: 'FEEDBACK',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>\nThank you for using SuppliesOn.com. as we plan for adding new featuresو we always like to reach out customers to gather some thoughts. we like to understand more about what is important to you to improve our services please dont hesitate to contact us and give your feedback. feedbackPageLink</p>',
          title: 'Give Your Feedback'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.18910399143297307">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span><br></div><span id="noHighlight_0.3457835290227931" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">نشكركم علي استخدام SuppliesOn.com. نحن نخطط لادخال ميزات جديده ، و دائما نرغب في التواصل مع العملاء لجمع بعض الأفكار لتحسين خدماتنا. نود ان نفهم أكثر حول ما هو مهم بالنسبة لك. الرجاء عدم التردد في الاتصال بنا وإعطاء&nbsp;<span id="noHighlight_0.6715854622660504">الا</span><span style="white-space: nowrap;">قتراحات</span>.&nbsp;</span><span style="font-size: 13px; letter-spacing: normal;">feedbackPageLink</span><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><br></div>',
          title: 'اعطاء ملاحظاتك'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>\nThank you for using SuppliesOn.com. as we plan for adding new featuresو we always like to reach out customers to gather some thoughts. we like to understand more about what is important to you to improve our services please dont hesitate to contact us and give your feedback. feedbackPageLink</p>',
          title: 'Give Your Feedback'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.18910399143297307">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span><br></div><span id="noHighlight_0.3457835290227931" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">نشكركم علي استخدام SuppliesOn.com. نحن نخطط لادخال ميزات جديده ، و دائما نرغب في التواصل مع العملاء لجمع بعض الأفكار لتحسين خدماتنا. نود ان نفهم أكثر حول ما هو مهم بالنسبة لك. الرجاء عدم التردد في الاتصال بنا وإعطاء&nbsp;<span id="noHighlight_0.6715854622660504">الا</span><span style="white-space: nowrap;">قتراحات</span>.&nbsp;</span><span style="font-size: 13px; letter-spacing: normal;">feedbackPageLink</span><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><br></div>',
          title: 'اعطاء ملاحظاتك'
        }
      },
      key: [
        '{{recipientName}}',
        '{{feedbackPageLink}}'
      ]
    },

    /* 15 */
    {
      type: 'CONTACTUS',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>Thank you for using SuppliesOn.com. as we plan for adding new features , we always like to reach out customers to gather some thoughts. we like to understand more about what is important to you to improve our services please dont hesitate to contact us and give your feedback. feedbackPageLink</p>',
          title: 'Contact Us'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="letter-spacing: 0.14px;"><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.18910399143297307">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span><br></div>\n<span id="noHighlight_0.3457835290227931" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">نشكركم علي استخدام SuppliesOn.com. نحن نخطط لادخال ميزات جديده ، و دائما نرغب في التواصل مع العملاء لجمع بعض الأفكار لتحسين خدماتنا. نود ان نفهم أكثر حول ما هو مهم بالنسبة لك. الرجاء عدم التردد في الاتصال بنا وإعطاء&nbsp;<span id="noHighlight_0.6715854622660504">الا</span><span style="white-space: nowrap;">قتراحات</span>.&nbsp;</span><span style="font-size: 13px; letter-spacing: normal;">feedbackPageLink</span><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"></div>\n<div><span style="font-size: 13px; letter-spacing: normal;"><br></span></div>',
          title: 'تواصل معنا'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>Thank you for using SuppliesOn.com. as we plan for adding new features , we always like to reach out customers to gather some thoughts. we like to understand more about what is important to you to improve our services please dont hesitate to contact us and give your feedback. feedbackPageLink</p>',
          title: 'Contact Us'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="letter-spacing: 0.14px;"><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.18910399143297307">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span><br></div>\n<span id="noHighlight_0.3457835290227931" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">نشكركم علي استخدام SuppliesOn.com. نحن نخطط لادخال ميزات جديده ، و دائما نرغب في التواصل مع العملاء لجمع بعض الأفكار لتحسين خدماتنا. نود ان نفهم أكثر حول ما هو مهم بالنسبة لك. الرجاء عدم التردد في الاتصال بنا وإعطاء&nbsp;<span id="noHighlight_0.6715854622660504">الا</span><span style="white-space: nowrap;">قتراحات</span>.&nbsp;</span><span style="font-size: 13px; letter-spacing: normal;">feedbackPageLink</span><br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"></div>\n<div><span style="font-size: 13px; letter-spacing: normal;"><br></span></div>',
          title: 'تواصل معنا'
        }
      },
      key: [
        '{{recipientName}}',
        '{{feedbackPageLink}}'
      ]
    },

    /* 16 */
    {
      type: 'CREDITLIMITSTATUS',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>\n\nAs part of our ongoing effort to provide better services and support , we kindly inform you that your credit now is amount</p>\n<p>\nEnjoy our valuable products and take advantage of the special prices we offer you.</p>',
          title: 'Remaining Credit'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.007574589892623607">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div>\n<br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.5759969614391367">كجزء من جهودنا المستمرة لتقديم خدمات ودعم أفضل ، نود ان نبلغكم بان الرصيد الخاص بك الآن هو&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">amount.</span></span></div>\n<div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.5759969614391367"><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;"><br></span>&nbsp;استمتع بمنتجاتنا القيمة واستفد من الأسعار الخاصة التي نقدمها لك.</span></div>',
          title: 'الرصيد المتبقي'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>\n\nAs part of our ongoing effort to provide better services and support , we kindly inform you that your credit now is amount</p>\n<p>\nEnjoy our valuable products and take advantage of the special prices we offer you.</p>',
          title: 'Remaining Credit'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.007574589892623607">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div>\n<br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.5759969614391367">كجزء من جهودنا المستمرة لتقديم خدمات ودعم أفضل ، نود ان نبلغكم بان الرصيد الخاص بك الآن هو&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">amount.</span></span></div>\n<div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.5759969614391367"><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;"><br></span>&nbsp;استمتع بمنتجاتنا القيمة واستفد من الأسعار الخاصة التي نقدمها لك.</span></div>',
          title: 'الرصيد المتبقي'
        }
      },
      key: [
        '{{recipientName}}',
        '{{amount}}'
      ]
    },

    /* 17 */
    {
      type: 'PAYMENTPASTDUE',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>\n</p>\n<p>\nwe kindly inform you that your issued invoice invoiceId is past due and you should pay as soon as possible. </p>\n<p>enjoy our newly added products and latest offers.</p>',
          title: 'Payment Status'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.5679384104468195">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div>\n<br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.918470245274065">نود ان نبلغكم بان الفاتورة التي تم اصدارها&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">invoiceId</span>&nbsp;غير مستحقه الدفع ويجب ان تدفع في أقرب وقت ممكن.</span></div>\n<br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph4" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.02013067289297399">تمتع بمنتجاتنا المضافة حديثا وأحدث العروض.</span></div>',
          title: 'حالة الدفع'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>\n</p>\n<p>\nwe kindly inform you that your issued invoice invoiceId is past due and you should pay as soon as possible. </p>\n<p>enjoy our newly added products and latest offers.</p>',
          title: 'Payment Status'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.5679384104468195">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div>\n<br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.918470245274065">نود ان نبلغكم بان الفاتورة التي تم اصدارها&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">invoiceId</span>&nbsp;غير مستحقه الدفع ويجب ان تدفع في أقرب وقت ممكن.</span></div>\n<br style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph4" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.02013067289297399">تمتع بمنتجاتنا المضافة حديثا وأحدث العروض.</span></div>',
          title: 'حالة الدفع'
        }
      },
      key: [
        '{{recipientName}}',
        '{{invoiceId}}'
      ]
    },

    /* 18 */
    {
      type: 'ORDERREVIEW',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>\nwe genuinely value your review. As part of our ongoing effort to provide better services and support, please dont hesitate to contact us and give your feedback.\n\nLeave your Review about the delivered order orderReviewLink</p>',
          title: 'Order Review'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.8651350431666005">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div>\n<div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.9244418995170585">نحن نقدر ارائكم&nbsp; . كجزء من جهودنا المستمرة لتقديم خدمات ودعم أفضل ، يرجى عدم التردد في الاتصال بنا وتقديم ملاحظاتك. اترك التقييم الخاص بك حول الطلب الذي قمت باستلامه&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">orderReviewLink</span></div>',
          title: 'تقييم الطلب'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>\nwe genuinely value your review. As part of our ongoing effort to provide better services and support, please dont hesitate to contact us and give your feedback.\n\nLeave your Review about the delivered order orderReviewLink</p>',
          title: 'Order Review'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.8651350431666005">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div>\n<div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.9244418995170585">نحن نقدر ارائكم&nbsp; . كجزء من جهودنا المستمرة لتقديم خدمات ودعم أفضل ، يرجى عدم التردد في الاتصال بنا وتقديم ملاحظاتك. اترك التقييم الخاص بك حول الطلب الذي قمت باستلامه&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">orderReviewLink</span></div>',
          title: 'تقييم الطلب'
        }
      },
      key: [
        '{{recipientName}}',
        '{{orderReviewLink}}'
      ]
    },

    /* 19 */
    {
      type: 'ORDERSTATUSREJECTION',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>Your order status orderId currently has been changed from prevStatus to currentStatus.</p><p>To follow up your orders:</p><p>orderPageUrl</p><p>Login: loginPageUrl</p><p>Rejection or Cancelation Reason: rejectionReason</p>',
          title: 'Order Status'
        },
        ar: {
          body: '<div paragraphname="\\&quot;paragraph0\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"=""><span id="\\&quot;noHighlight_0.1588095601770516\\&quot;">مرحبا&nbsp;</span><span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;\\"="">recipientName</span></div><div paragraphname="\\&quot;paragraph2\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"=""><span id="\\&quot;noHighlight_0.10860985027999082\\&quot;">حاليا تم تغيير حاله الطلب orderId من&nbsp;<span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;\\"="">prevStatus</span>&nbsp;إلى&nbsp;<span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;\\"="">currentStatus</span>. لمتابعة الطلبات الخاصة بك:&nbsp;</span><span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;\\"="">orderPageUrl</span></div><div paragraphname="\\&quot;paragraph2\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"=""><span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;\\"=""><br></span></div><div paragraphname="\\&quot;paragraph2\\&quot;" style="\\&quot;font-size:" 13px;="" letter-spacing:="" normal;\\"="">رابط الدخول: loginPageUrl</div><div paragraphname="\\&quot;paragraph2\\&quot;" style="\\&quot;font-size:" 13px;="" letter-spacing:="" normal;\\"=""><br></div><div paragraphname="\\&quot;paragraph2\\&quot;" style="\\&quot;font-size:" 13px;="" letter-spacing:="" normal;\\"="">سبب الرفض او الالغاء: rejectionReason</div>",',
          title: 'حالة الطلب'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>Your order status orderId currently has been changed from prevStatus to currentStatus.</p><p>To follow up your orders:</p><p>orderPageUrl</p><p>Login: loginPageUrl</p><p>Rejection or Cancelation Reason: rejectionReason</p>',
          title: 'Order Status'
        },
        ar: {
          body: '<div paragraphname="\\&quot;paragraph0\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"=""><span id="\\&quot;noHighlight_0.1588095601770516\\&quot;">مرحبا&nbsp;</span><span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;\\"="">recipientName</span></div><div paragraphname="\\&quot;paragraph2\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"=""><span id="\\&quot;noHighlight_0.10860985027999082\\&quot;">حاليا تم تغيير حاله الطلب orderId من&nbsp;<span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;\\"="">prevStatus</span>&nbsp;إلى&nbsp;<span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;\\"="">currentStatus</span>. لمتابعة الطلبات الخاصة بك:&nbsp;</span><span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;\\"="">orderPageUrl</span></div><div paragraphname="\\&quot;paragraph2\\&quot;" style="\\&quot;color:" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"=""><span style="\\&quot;color:" rgb(69,="" 97,="" 119);="" font-family:="" dubai-regular,="" &quot;segoe="" ui&quot;,="" &quot;helvetica="" neue&quot;,="" helvetica,="" arial,="" sans-serif;\\"=""><br></span></div><div paragraphname="\\&quot;paragraph2\\&quot;" style="\\&quot;font-size:" 13px;="" letter-spacing:="" normal;\\"="">رابط الدخول: loginPageUrl</div><div paragraphname="\\&quot;paragraph2\\&quot;" style="\\&quot;font-size:" 13px;="" letter-spacing:="" normal;\\"=""><br></div><div paragraphname="\\&quot;paragraph2\\&quot;" style="\\&quot;font-size:" 13px;="" letter-spacing:="" normal;\\"="">سبب الرفض او الالغاء: rejectionReason</div>",',
          title: 'حالة الطلب'
        }
      },
      key: [
        '{{recipientName}}',
        '{{orderId}}',
        '{{prevStatus}}',
        '{{currentStatus}}',
        '{{orderPageUrl}}',
        '{{loginPageUrl}}',
        '{{rejectionReason}}'
      ]
    },

    /* 20 */
    {
      type: 'ADDPAYMENT',
      original_template: {
        en: {
          body: '<p>Hello, recipientName</p><p>We kindly inform you that a payment has been added to your credit with amount SAR.</p>',
          title: 'Add Payment'
        },
        ar: {
          body: '<p>مرحبا recipientName</p><p> نحيط سيادتكم علما انه قد تم اضافة amount ريال الى رصيدك الحالي.</p>',
          title: 'إضافة مبلغ'
        }
      },
      template: {
        en: {
          body: '<p>Hello, recipientName</p><p>We kindly inform you that a payment has been added to your credit with amount SAR.</p>',
          title: 'Add Payment'
        },
        ar: {
          body: '<p>مرحبا recipientName</p><p> نحيط سيادتكم علما انه قد تم اضافة amount ريال الى رصيدك الحالي.</p>',
          title: 'إضافة مبلغ'
        }
      },
      key: [
        '{{recipientName}}',
        '{{amount}}'
      ]
    },

    /* 21 */
    {
      type: 'PAYMENTSTATUS',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>We kindly inform you that your payment paymentId changed status from prevStatus to currentStatus .</p>\n<p><br></p>',
          title: 'Payment Status'
        },
        ar: {
          body: '<p>مرحبا recipientName</p>\n<p>لقد تم نغيير حالة عملية الدفع paymentId من prevStatus الى currentStatus .&nbsp;</p>',
          title: 'حالة الدفع'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>We kindly inform you that your payment paymentId changed status from prevStatus to currentStatus .</p>\n<p><br></p>',
          title: 'Payment Status'
        },
        ar: {
          body: '<p>مرحبا recipientName</p>\n<p>لقد تم نغيير حالة عملية الدفع paymentId من prevStatus الى currentStatus .&nbsp;</p>',
          title: 'حالة الدفع'
        }
      },
      key: [
        '{{recipientName}}',
        '{{paymentId}}',
        '{{prevStatus}}',
        '{{currentStatus}}'
      ]
    },

    /* 22 */
    {
      type: 'RESETUSERPASSWORD',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>We kindly inform you that your password has been reset and your current password now is: newPassword</p>\n<p>Login Link: loginPageUrl</p>',
          title: 'Reset User Password'
        },
        ar: {
          body: '<p>مرحبا، recipientName</p>\n<p> لقد تم اعادة تعيين كلمة المرور الخاصة بك وكلمة مرورك الحالية هي : newPassword</p>\n<p>رابط الدخول: loginPageUrl</p>',
          title: 'اعادة تعيين كلمة المرور'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p>\n<p>We kindly inform you that your password has been reset and your current password now is: newPassword</p>\n<p>Login Link: loginPageUrl</p>',
          title: 'Reset User Password'
        },
        ar: {
          body: '<p>مرحبا، recipientName</p>\n<p> لقد تم اعادة تعيين كلمة المرور الخاصة بك وكلمة مرورك الحالية هي : newPassword</p>\n<p>رابط الدخول: loginPageUrl</p>',
          title: 'اعادة تعيين كلمة المرور'
        }
      },
      key: [
        '{{recipientName}}',
        '{{newPassword}}',
        '{{loginPageUrl}}'
      ]
    },

    /* 23 */
    {
      type: 'CHECKOUTCART',
      original_template: {
        en: {
          body: '<p>Hello {{recipientName}}</p>\n<p>You cart have been checked out successfully and your order {{orderId}} will take in queue..</p>\n<p>Order Page Link: {{orderPageUrl}}</p>\n<p>We appreciate being you one of our loyal customers, kindly enjoy our valuable products&nbsp; and thank you for trusting our service.</p>',
          title: 'Check out Cart'
        },
        ar: {
          body: '<p>مرحبا {{recipientName}}</p>\n<p>لقد تم تنفيذ طلب الشراء بنجاح وسيتحول طلبك {{orderId}} الى قائمة الانتظار.</p>\n<p>رابط الطلب: {{orderPageUrl}}</p>\n<p>نحن نقدر أنك أحد عملائنا المخلصين , نرجو الاستمتاع بمنتجاتنا القيمة وشكرا على ثقتكم بخدماتنا</p>',
          title: 'إرسال الطلب'
        }
      },
      template: {
        en: {
          body: '<p>Hello {{recipientName}}</p>\n<p>You cart have been checked out successfully and your order {{orderId}} will take in queue..</p>\n<p>Order Page Link: {{orderPageUrl}}</p>\n<p>We appreciate being you one of our loyal customers, kindly enjoy our valuable products&nbsp; and thank you for trusting our service.</p>',
          title: 'Check out Cart'
        },
        ar: {
          body: '<p>مرحبا {{recipientName}}</p>\n<p>لقد تم تنفيذ طلب الشراء بنجاح وسيتحول طلبك {{orderId}} الى قائمة الانتظار.</p>\n<p>رابط الطلب: {{orderPageUrl}}</p>\n<p>نحن نقدر أنك أحد عملائنا المخلصين , نرجو الاستمتاع بمنتجاتنا القيمة وشكرا على ثقتكم بخدماتنا</p>',
          title: 'إرسال الطلب'
        }
      },
      key: [
        '{{recipientName}}',
        '{{orderId}}',
        '{{orderPageUrl}}'
      ]
    },

    /* 24 */
    {
      type: 'REMOVEUSER',
      original_template: {
        en: {
          body: '<p>Hello, recipientName</p><p><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">Unfortunately, we are sorry to let you know that y</span>our account has been removed.</p><p><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">If there is an issue regarding this action. So kindly contact&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-decoration-line: underline;">SuppliesON.com</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">&nbsp;to solve it.</span><br></p>',
          title: 'Remove User'
        },
        ar: {
          body: '<p>مرحبا، recipientName</p><p>نعتذر لاعلامك انه تم حذف حسابك.</p><p><span id="noHighlight_0.8804627193496966" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">إذا كانت هناك مساله تتعلق بهذا الاجراء. لذا يرجى التواصل مع&nbsp;</span><span style="text-decoration-line: underline; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">SuppliesON.com</span><span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">&nbsp;لحلها.</span><br></p>',
          title: 'حذف مستخدم'
        }
      },
      template: {
        en: {
          body: '<p>Hello, recipientName</p><p><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">Unfortunately, we are sorry to let you know that y</span>our account has been removed.</p><p><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">If there is an issue regarding this action. So kindly contact&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-decoration-line: underline;">SuppliesON.com</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">&nbsp;to solve it.</span><br></p>',
          title: 'Remove User'
        },
        ar: {
          body: '<p>مرحبا، recipientName</p><p>نعتذر لاعلامك انه تم حذف حسابك.</p><p><span id="noHighlight_0.8804627193496966" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">إذا كانت هناك مساله تتعلق بهذا الاجراء. لذا يرجى التواصل مع&nbsp;</span><span style="text-decoration-line: underline; color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">SuppliesON.com</span><span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">&nbsp;لحلها.</span><br></p>',
          title: 'حذف مستخدم'
        }
      },
      key: [
        '{{recipientName}}'
      ]
    },

    /* 25 */
    {
      type: 'UNBLOCK',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>We kindly inform you that your account has been unblocked.</p><p>Welcome back on board&nbsp;<span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-decoration-line: underline;">SuppliesON.com</span></p>',
          title: 'Unblock Account'
        },
        ar: {
          body: '<p><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">مرحبا recipientName</span></p><p><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">لقد تم تفعيل حسابك من جديد.</span></p><p><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">مرحبا بك مرة اخرى في&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-decoration-line: underline;">SuppliesON.com.</span></p>',
          title: 'إلغاء حظر حسابك'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>We kindly inform you that your account has been unblocked.</p><p>Welcome back on board&nbsp;<span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-decoration-line: underline;">SuppliesON.com</span></p>',
          title: 'Unblock Account'
        },
        ar: {
          body: '<p><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">مرحبا recipientName</span></p><p><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">لقد تم تفعيل حسابك من جديد.</span></p><p><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px;">مرحبا بك مرة اخرى في&nbsp;</span><span style="color: rgb(51, 51, 51); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Noto Sans&quot;, Ubuntu, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 14px; text-decoration-line: underline;">SuppliesON.com.</span></p>',
          title: 'إلغاء حظر حسابك'
        }
      },
      key: [
        '{{recipientName}}'
      ]
    },

    /* 26 */
    {
      type: 'APPROVEUSER',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>Your account has been approved by <span style="text-decoration-line: underline;">SuppliesOn</span>. </p><p>You are most welcome to use it now with all its functions.</p>',
          title: 'Approve User'
        },
        ar: {
          body: '<p>مرحبا recipientName</p><p> لقد تم تاكيد حسابك من قبل <span style="text-decoration-line: underline;">SuppliesOn</span>،</p><p> مرحبا بك استمتع الان باستخدام كامل وظائف حسابك.</p>',
          title: 'تأكيد حساب'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>Your account has been approved by <span style="text-decoration-line: underline;">SuppliesOn</span>. </p><p>You are most welcome to use it now with all its functions.</p>',
          title: 'Approve User'
        },
        ar: {
          body: '<p>مرحبا recipientName</p><p> لقد تم تاكيد حسابك من قبل <span style="text-decoration-line: underline;">SuppliesOn</span>،</p><p> مرحبا بك استمتع الان باستخدام كامل وظائف حسابك.</p>',
          title: 'تأكيد حساب'
        }
      },
      key: [
        '{{recipientName}}'
      ]
    },

    /* 27 */
    {
      type: 'EMAILREPLY',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>Thank you for using SuppliesOn.com. we always like to reach out customers to gather some thoughts. we like to understand more about what is important to you to improve our services please dont hesitate to contact us and give your feedback.</p><p><span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">body</span><br></p>',
          title: 'Contact Us'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="letter-spacing: 0.14px;"><div paragraphname="paragraph0" style="letter-spacing: 0.14px;"><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; letter-spacing: normal;"><span id="noHighlight_0.18910399143297307">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span><br></div><span id="noHighlight_0.3457835290227931" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; letter-spacing: normal;">نشكركم علي تواصلك مع SuppliesOn.com. نحن دائما نرغب في التواصل مع العملاء لجمع بعض الأفكار لتحسين خدماتنا. نود ان نفهم أكثر حول ما هو مهم بالنسبة لك. الرجاء عدم التردد في الاتصال بنا وإعطاء&nbsp;<span id="noHighlight_0.6715854622660504">الا</span><span style="white-space: nowrap;">قتراحات</span>.&nbsp;</span></div><div paragraphname="paragraph0" style="letter-spacing: 0.14px;"><span id="noHighlight_0.3457835290227931" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; letter-spacing: normal;"><br></span></div><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">body&nbsp;<br></div></div><div><span style="font-size: 13px; letter-spacing: normal;"><br></span></div>',
          title: 'تواصل معنا'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>Thank you for using SuppliesOn.com. we always like to reach out customers to gather some thoughts. we like to understand more about what is important to you to improve our services please dont hesitate to contact us and give your feedback.</p><p><span style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif;">body</span><br></p>',
          title: 'Contact Us'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="letter-spacing: 0.14px;"><div paragraphname="paragraph0" style="letter-spacing: 0.14px;"><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; letter-spacing: normal;"><span id="noHighlight_0.18910399143297307">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span><br></div><span id="noHighlight_0.3457835290227931" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; letter-spacing: normal;">نشكركم علي تواصلك مع SuppliesOn.com. نحن دائما نرغب في التواصل مع العملاء لجمع بعض الأفكار لتحسين خدماتنا. نود ان نفهم أكثر حول ما هو مهم بالنسبة لك. الرجاء عدم التردد في الاتصال بنا وإعطاء&nbsp;<span id="noHighlight_0.6715854622660504">الا</span><span style="white-space: nowrap;">قتراحات</span>.&nbsp;</span></div><div paragraphname="paragraph0" style="letter-spacing: 0.14px;"><span id="noHighlight_0.3457835290227931" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; letter-spacing: normal;"><br></span></div><div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;">body&nbsp;<br></div></div><div><span style="font-size: 13px; letter-spacing: normal;"><br></span></div>',
          title: 'تواصل معنا'
        }
      },
      key: [
        '{{recipientName}}',
        '{{body}}'
      ]
    },

    /* 28 */
    {
      type: 'RECURRINGORDERREMINDER',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>You have recurring order request will be executed with a number&nbsp; orderId.</p><p>If you want to make adjustment to it, please follow the following link&nbsp; orderPageUrl</p>',
          title: 'Recurring Order Reminder'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.1895808826032197">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><div paragraphname="paragraph0" style="font-size: 13px; letter-spacing: normal;">لديك طلب متكرر برقم orderId سوف يتم تنفيذه.</div><div paragraphname="paragraph0" style="font-size: 13px; letter-spacing: normal;"><br></div><div paragraphname="paragraph0" style="font-size: 13px; letter-spacing: normal;">اذا كنت تريد اجراء تعديلات بشانه انقر على الرابط التالى orderPageUrl</div>',
          title: 'تذكير بطلب متكرر'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>You have recurring order request will be executed with a number&nbsp; orderId.</p><p>If you want to make adjustment to it, please follow the following link&nbsp; orderPageUrl</p>',
          title: 'Recurring Order Reminder'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.1895808826032197">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><div paragraphname="paragraph0" style="font-size: 13px; letter-spacing: normal;">لديك طلب متكرر برقم orderId سوف يتم تنفيذه.</div><div paragraphname="paragraph0" style="font-size: 13px; letter-spacing: normal;"><br></div><div paragraphname="paragraph0" style="font-size: 13px; letter-spacing: normal;">اذا كنت تريد اجراء تعديلات بشانه انقر على الرابط التالى orderPageUrl</div>',
          title: 'تذكير بطلب متكرر'
        }
      },
      key: [
        '{{recipientName}}',
        '{{orderId}}',
        '{{orderPageUrl}}'
      ]
    },

    /* 29 */
    {
      type: 'REQUESTSPECIALPRICE',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>You have a request for special price for productName from customerName.</p>',
          title: 'Request Special Price'
        },
        ar: {
          body: '<p><span id="\\&quot;noHighlight_0.4871362304448914\\&quot;" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">مرحبا recipientName</span></p><div><span rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">لديك طلب سعر خاص للمنتج productName من customerName</span></div>',
          title: 'طلب سعر خاص'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>You have a request for special price for productName from customerName.</p>',
          title: 'Request Special Price'
        },
        ar: {
          body: '<p><span id="\\&quot;noHighlight_0.4871362304448914\\&quot;" rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">مرحبا recipientName</span></p><div><span rgb(85,="" 85,="" 85);="" font-family:="" &quot;segoe="" ui&quot;,="" tahoma,="" helvetica,="" sans-serif;="" font-size:="" 13px;="" letter-spacing:="" normal;\\"="">لديك طلب سعر خاص للمنتج productName من customerName</span></div>',
          title: 'طلب سعر خاص'
        }
      },
      key: [
        '{{recipientName}}',
        '{{productName}}',
        '{{customerName}}'
      ]
    },

    /* 30 */
    {
      type: 'INVITATION',
      original_template: {
        en: {
          body: "<p>Hello recipientName</p><p>You have been invited to join supplier's store. Feel free to enjoy their valuable products and catch up the special prices they offer.</p><p>Login:&nbsp;</p><p>loginPageUrl</p>",
          title: 'Invite Existing Customer'
        },
        ar: {
          body: '<p>مرحبا recipientName</p><p>لقد تم دعوتك للانضمام الى supplier. استمتع بمنتجاته القيمة ولا يفوتك اسعارهم الخاصة على المنتجات.</p><p>رابط الدخول:</p><p>loginPageUrl</p>',
          title: 'دعوة عميل مسجل'
        }
      },
      template: {
        en: {
          body: "<p>Hello recipientName</p><p>You have been invited to join supplier's store. Feel free to enjoy their valuable products and catch up the special prices they offer.</p><p>Login:&nbsp;</p><p>loginPageUrl</p>",
          title: 'Invite Existing Customer'
        },
        ar: {
          body: '<p>مرحبا recipientName</p><p>لقد تم دعوتك للانضمام الى supplier. استمتع بمنتجاته القيمة ولا يفوتك اسعارهم الخاصة على المنتجات.</p><p>رابط الدخول:</p><p>loginPageUrl</p>',
          title: 'دعوة عميل مسجل'
        }
      },
      key: [
        '{{recipientName}}',
        '{{supplier}}',
        '{{loginPageUrl}}'
      ]
    },

    /* 31 */
    {
      type: 'ORDERSTATUS',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>\nYour order status orderId currently has been changed from prevStatus to currentStatus.\n\nTo follow up your orders: orderPageUrl</p><p>Login: loginPageUrl</p>',
          title: 'Order Status'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.1588095601770516">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div>\n<div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.10860985027999082">حاليا تم تغيير حاله الطلب orderId من&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">prevStatus</span>&nbsp;إلى&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">currentStatus</span>. لمتابعة الطلبات الخاصة بك:&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">orderPageUrl</span></div><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;"><br></span></div><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">رابط الدخول :&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">loginPageUrl</span></div>',
          title: 'حالة الطلب'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>\nYour order status orderId currently has been changed from prevStatus to currentStatus.\n\nTo follow up your orders: orderPageUrl</p><p>Login: loginPageUrl</p>',
          title: 'Order Status'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.1588095601770516">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div>\n<div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span id="noHighlight_0.10860985027999082">حاليا تم تغيير حاله الطلب orderId من&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">prevStatus</span>&nbsp;إلى&nbsp;<span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">currentStatus</span>. لمتابعة الطلبات الخاصة بك:&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">orderPageUrl</span></div><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;"><br></span></div><div paragraphname="paragraph2" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">رابط الدخول :&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">loginPageUrl</span></div>',
          title: 'حالة الطلب'
        }
      },
      key: [
        '{{recipientName}}',
        '{{orderId}}',
        '{{prevStatus}}',
        '{{currentStatus}}',
        '{{orderPageUrl}}',
        '{{loginPageUrl}}'
      ]
    },

    /* 32 */
    {
      type: 'NEWSUPPLIERORDER',
      original_template: {
        en: {
          body: '<p>Hello recipientName</p><p>\n\nYou have a new order orderId waiting for you to take in action.</p><p>To follow up your orders: orderPageUrl</p>',
          title: 'New Supplier Order'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph0"><span id="noHighlight_0.1895808826032197">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><div paragraphname="paragraph2">لديك طلب جديد orderId في انتظار اتخاذ اجراء منك.</div><div paragraphname="paragraph2"><span id="noHighlight_0.1311374920922841"><br></span></div><div paragraphname="paragraph2"><span id="noHighlight_0.1311374920922841">لمتابعه طلباتك:&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">orderPageUrl</span></div></div>',
          title: 'طلب جديد لمورد'
        }
      },
      template: {
        en: {
          body: '<p>Hello recipientName</p><p>\n\nYou have a new order orderId waiting for you to take in action.</p><p>To follow up your orders: orderPageUrl</p>',
          title: 'New Supplier Order'
        },
        ar: {
          body: '<div paragraphname="paragraph0" style="color: rgb(85, 85, 85); font-family: &quot;Segoe UI&quot;, Tahoma, Helvetica, sans-serif; font-size: 13px; letter-spacing: normal;"><div paragraphname="paragraph0"><span id="noHighlight_0.1895808826032197">مرحبا&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">recipientName</span></div><div paragraphname="paragraph2">لديك طلب جديد orderId في انتظار اتخاذ اجراء منك.</div><div paragraphname="paragraph2"><span id="noHighlight_0.1311374920922841"><br></span></div><div paragraphname="paragraph2"><span id="noHighlight_0.1311374920922841">لمتابعه طلباتك:&nbsp;</span><span style="color: rgb(69, 97, 119); font-family: Dubai-Regular, &quot;Segoe UI&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;">orderPageUrl</span></div></div>',
          title: 'طلب جديد لمورد'
        }
      },
      key: [
        '{{recipientName}}',
        '{{orderId}}',
        '{{orderPageUrl}}'
      ]
    }
  ]
};
