describe('i18n', function() {
    beforeEach(function() {
        $([
            '<form id="i18nForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-5">',
                        '<input type="text" class="form-control" name="fullName" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Username</label>',
                    '<div class="col-lg-5">',
                        '<input type="text" class="form-control" name="username" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Email address</label>',
                    '<div class="col-lg-5">',
                        '<input type="text" class="form-control" name="email" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Password</label>',
                    '<div class="col-lg-5">',
                        '<input type="password" class="form-control" name="password" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Retype password</label>',
                    '<div class="col-lg-5">',
                        '<input type="password" class="form-control" name="confirmPassword" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Gender</label>',
                    '<div class="col-lg-5">',
                        '<div class="radio">',
                            '<label><input type="radio" name="gender" value="male" /> Male</label>',
                        '</div>',
                        '<div class="radio">',
                            '<label><input type="radio" name="gender" value="female" /> Female</label>',
                        '</div>',
                        '<div class="radio">',
                            '<label><input type="radio" name="gender" value="other" /> Other</label>',
                        '</div>',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Age</label>',
                    '<div class="col-lg-3">',
                        '<input type="text" class="form-control" name="age" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Website</label>',
                    '<div class="col-lg-5">',
                        '<input type="text" class="form-control" name="website" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Phone number</label>',
                    '<div class="col-lg-5">',
                        '<input type="text" class="form-control" name="phoneNumber" />',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Languages</label>',
                    '<div class="col-lg-5">',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="languages[]" value="english" /> English</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="languages[]" value="french" /> French</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="languages[]" value="german" /> German</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="languages[]" value="russian" /> Russian</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="languages[]" value="other" /> Other</label>',
                        '</div>',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Programming Languages</label>',
                    '<div class="col-lg-5">',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="net" /> .Net</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="java" /> Java</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="c" /> C/C++</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="php" /> PHP</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="perl" /> Perl</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="ruby" /> Ruby</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="python" /> Python</label>',
                        '</div>',
                        '<div class="checkbox">',
                            '<label><input type="checkbox" name="programs[]" value="javascript" /> Javascript</label>',
                        '</div>',
                    '</div>',
                '</div>',
            '</form>'
        ].join('')).appendTo('body');

        $('#i18nForm').formValidation({
            clazz: {
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                }
            },
            fields: {
                fullName: {
                    validators: {
                        notEmpty: {},
                        stringCase: {
                            'case': 'upper'
                        }
                    }
                },
                username: {
                    validators: {
                        notEmpty: {},
                        stringLength: {
                            min: 6,
                            max: 20
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/
                        },
                        different: {
                            field: 'password'
                        }
                    }
                },
                email: {
                    validators: {
                        emailAddress: {}
                    }
                },
                password: {
                    validators: {
                        notEmpty: {},
                        different: {
                            field: 'username'
                        }
                    }
                },
                confirmPassword: {
                    validators: {
                        notEmpty: {},
                        identical: {
                            field: 'password'
                        },
                        different: {
                            field: 'username'
                        }
                    }
                },
                age: {
                    validators: {
                        notEmpty: {},
                        digits: {},
                        greaterThan: {
                            value: 18
                        },
                        lessThan: {
                            value: 100
                        }
                    }
                },
                website: {
                    validators: {
                        notEmpty: {},
                        uri: {}
                    }
                },
                phoneNumber: {
                    validators: {
                        notEmpty: {},
                        digits: {},
                        phone: {
                            country: 'US'
                        }
                    }
                },
                gender: {
                    validators: {
                        notEmpty: {}
                    }
                },
                'languages[]': {
                    validators: {
                        notEmpty: {}
                    }
                },
                'programs[]': {
                    validators: {
                        choice: {
                            min: 2,
                            max: 4
                        }
                    }
                }
            }
        });

        this.fv        = $('#i18nForm').data('formValidation');
        this.$fullName = this.fv.getFieldElements('fullName');
        this.$email    = this.fv.getFieldElements('email');
        this.$userName = this.fv.getFieldElements('username');
        this.$password = this.fv.getFieldElements('password');
        this.$confirm  = this.fv.getFieldElements('confirmPassword');
        this.$age      = this.fv.getFieldElements('age');
        this.$website  = this.fv.getFieldElements('website');
        this.$phone    = this.fv.getFieldElements('phoneNumber');
        this.$program  = this.fv.getFieldElements('programs[]');
    });

    afterEach(function() {
        $('#i18nForm').formValidation('destroy').remove();
    });

    it('default message', function() {
        var format = FormValidation.Helper.format,
            i18n   = FormValidation.I18n[this.fv.getLocale()];

        this.fv.validate();
        expect(this.fv.getMessages(this.$fullName, 'notEmpty')[0]).toEqual(i18n.notEmpty['default']);

        this.$fullName.val('lowerName');
        this.fv.revalidateField('fullName');
        expect(this.fv.getMessages('fullName', 'stringCase')[0]).toEqual(i18n.stringCase.upper);

        this.fv.resetForm();
        this.$userName.val('123');
        this.fv.validate();
        expect(this.fv.getMessages('username', 'stringLength')[0]).toEqual(format(i18n.stringLength.between, [6, 20]));

        this.fv.resetForm();
        this.$userName.val('contain@#$');
        this.fv.validate();
        expect(this.fv.getMessages(this.$userName, 'regexp')[0]).toEqual(i18n.regexp['default']);

        this.fv.resetForm();
        this.$userName.val('validUserName');
        this.$password.val('validUserName');
        this.fv.validate();
        expect(this.fv.getMessages('username', 'different')[0]).toEqual(i18n.different['default']);

        this.fv.resetForm();
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect(this.fv.getMessages(this.$email, 'emailAddress')[0]).toEqual(i18n.emailAddress['default']);

        this.fv.resetForm();
        this.$password.val('@S3cur3P@@w0rd');
        this.$confirm.val('notMatch');
        this.fv.validate();
        expect(this.fv.getMessages('confirmPassword', 'identical')[0]).toEqual(i18n.identical['default']);

        this.fv.resetForm();
        this.$age.val('notDigit');
        this.fv.validate();
        expect(this.fv.getMessages('age', 'digits')[0]).toEqual(i18n.digits['default']);

        this.fv.resetForm();
        this.$age.val(10);
        this.fv.validate();
        expect(this.fv.getMessages(this.$age, 'greaterThan')[0]).toEqual(format(i18n.greaterThan['default'], 18));

        this.fv.resetForm();
        this.$age.val(120);
        this.fv.validate();
        expect(this.fv.getMessages('age', 'lessThan')[0]).toEqual(format(i18n.lessThan['default'], 100));

        this.fv.resetForm();
        this.$website.val('http://invalidWebsite');
        this.fv.validate();
        expect(this.fv.getMessages('website', 'uri')[0]).toEqual(i18n.uri['default']);

        this.fv.resetForm();
        this.$phone.val('123456');
        this.fv.validate();
        expect(this.fv.getMessages('phoneNumber', 'phone')[0]).toEqual(format(i18n.phone.country, i18n.phone.countries['US']));

        this.fv.resetForm();
        this.$program.eq(0).prop('checked', 'checked');
        this.fv.validate();
        expect(this.fv.getMessages(this.$program, 'choice')[0]).toEqual(format(i18n.choice.between, [2, 4]));

        this.fv.resetForm();
        this.$program.prop('checked', 'checked');
        this.fv.validate();
        expect(this.fv.getMessages('programs[]', 'choice')[0]).toEqual(format(i18n.choice.between, [2, 4]));
    });
});
