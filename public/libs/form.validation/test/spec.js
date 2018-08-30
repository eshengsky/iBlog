describe('api', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="apiForm">',
                '<div class="form-group">',
                    '<input type="text" name="username" data-fv-notempty data-fv-stringlength data-fv-stringlength-min="8" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-notempty data-fv-emailaddress />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="note"/>',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#apiForm').formValidation({
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            }
        });

        this.fv     = $('#apiForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
        this.$note  = $('#apiForm').find('input[name="note"]');
    });

    afterEach(function() {
        $('#apiForm').formValidation('destroy').remove();
    });

    it('revalidateField()', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect(this.fv.isValidField('email')).toBeTruthy();

        this.$email.val('invalid#email.address');
        this.fv.revalidateField('email');
        expect(this.fv.isValidField(this.$email)).toEqual(false);
    });

    it('destroy()', function() {
        this.fv.destroy();
        expect($('#apiForm').data('formValidation')).toBeUndefined();
        expect($('#apiForm').find('i[data-fv-icon-for]').length).toEqual(0);
        expect($('#apiForm').find('.help-block[data-fv-for]').length).toEqual(0);
        expect($('#apiForm').find('.has-feedback').length).toEqual(0);
        expect($('#apiForm').find('.has-success').length).toEqual(0);
        expect($('#apiForm').find('.has-error').length).toEqual(0);
        expect($('#apiForm').find('[data-fv-field]').length).toEqual(0);
    });

    it('getOptions()', function() {
        // Form options
        expect(this.fv.getOptions().icon.valid).toEqual('glyphicon glyphicon-ok');

        // Field options
        expect(this.fv.getOptions('username', 'stringlength')).toBeNull();
        expect(this.fv.getOptions('username', 'stringlength', 'min')).toBeNull();

        expect(this.fv.getOptions('username', 'stringLength')).toBeDefined();
        expect(this.fv.getOptions('username', 'stringLength', 'min')).toEqual('8');
        expect(this.fv.getOptions('username', 'stringlength', 'max')).toBeNull();
    });

    // #1014
    it('isValidField()', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect(this.fv.isValidField(this.$note)).toBeTruthy();
        expect(this.fv.isValidField(this.$email)).toBeTruthy();
    });

    // #1014
    it('validateField()', function() {
        this.$email.val('email@domain.com');
        this.fv.validateField(this.$email);
        this.fv.validateField(this.$note);
        expect(this.fv.isValidField(this.$email)).toBeTruthy();
        expect(this.fv.isValidField(this.$note)).toBeTruthy();
    });
});

describe('autoFocus', function() {
    // Use $element.is(document.activeElement) instead of $element.is(':focus')
    // to support running the test cases with PhantomJS
    // See https://github.com/ariya/phantomjs/issues/10427

    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="autoFocusForm">',
                '<div class="form-group">',
                    '<input type="text" name="username" required />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="email" required data-fv-emailaddress />',
                '</div>',
                '<div class="form-group">',
                    '<button type="submit" id="submitButton">Submit</button>',
                '</div>',
            '</form>'
        ].join('')).appendTo('body');

        this.fv        = $('#autoFocusForm')
                            .formValidation()
                            .submit(function(e) {
                                e.preventDefault();
                            })
                            .data('formValidation');
        this.$username = this.fv.getFieldElements('username');
        this.$email    = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#autoFocusForm').formValidation('destroy').remove();
    });

    it('default option (autoFocus=true)', function() {
        $('#submitButton').click();
        expect(this.$username.is(document.activeElement)).toBeTruthy();
        expect($(document.activeElement).attr('name')).toEqual('username');

        this.fv.resetForm();
        this.$username.val('user_name');
        this.$email.val('');
        $('#submitButton').click();
        expect(this.$email.is(document.activeElement)).toBeTruthy();
        expect($(document.activeElement).attr('name')).toEqual('email');
    });

    it('set autoFocus=false for form', function() {
        $('#autoFocusForm')
                .formValidation('destroy')
                .formValidation({
                    autoFocus: false
                });
        this.$username.val('');
        this.$email.val('invalid#email');
        $('#submitButton').click();

        expect(this.$username.is(document.activeElement)).toBeFalsy();
        expect(this.$email.is(document.activeElement)).toBeFalsy();
    });

    it('set autoFocus=false for all fields', function() {
        this.fv
            .addField('username', {
                autoFocus: false
            })
            .addField('email', {
                autoFocus: false
            });
        this.$username.val('user_name');
        this.$email.val('invalid#email');
        $('#submitButton').click();

        expect(this.$username.is(document.activeElement)).toBeFalsy();
        expect(this.$email.is(document.activeElement)).toBeFalsy();
    });

    it('set different autoFocus value for fields', function() {
        this.fv
            .addField('username', {
                autoFocus: false
            })
            .addField('email', {
                autoFocus: true
            });
        this.$username.val('');
        this.$email.val('invalid_email');
        $('#submitButton').click();

        expect(this.$username.is(document.activeElement)).toBeFalsy();
        expect(this.$email.is(document.activeElement)).toBeTruthy();
        expect($(document.activeElement).attr('name')).toEqual('email');
    });
});

describe('container form option', function() {
    beforeEach(function() {
        $([
            '<form id="containerForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="firstName" required placeholder="First name" data-fv-notempty-message="The first name is required" />',
                    '</div>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="lastName" required placeholder="Last name" data-fv-notempty-message="The last name is required" />',
                    '</div>',
                '</div>',
                '<div id="errors"></div>',
            '</form>'
        ].join('')).appendTo('body');
    });

    afterEach(function() {
        $('#containerForm').formValidation('destroy').remove();
    });

    it('form container declarative', function() {
        $('#containerForm')
            .attr('data-fv-container', '#errors')
            .formValidation();

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');

        expect($('#errors').find('.help-block').length).toBeGreaterThan(0);

        this.$firstName.val('First');
        this.$lastName.val('');
        this.fv.validate();
        expect($('#errors').find('.help-block:visible[data-fv-for="firstName"]').length).toEqual(0);
        expect($('#errors').find('.help-block:visible[data-fv-for="lastName"]').length).toBeGreaterThan(0);
    });

    it('form container programmatically', function() {
        $('#containerForm').formValidation({
            err: {
                container: '#errors'
            }
        });

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');

        expect($('#errors').find('.help-block').length).toBeGreaterThan(0);

        this.$firstName.val('');
        this.$lastName.val('Last');
        this.fv.validate();
        expect($('#errors').find('.help-block:visible[data-fv-for="firstName"]').length).toBeGreaterThan(0);
        expect($('#errors').find('.help-block:visible[data-fv-for="lastName"]').length).toEqual(0);

        this.fv.resetForm();
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.fv.validate();
        expect($('#errors').find('.help-block:visible').length).toEqual(0);
    });
});

describe('container field option', function() {
    beforeEach(function() {
        $([
            '<form id="containerForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="firstName" required placeholder="First name" data-fv-notempty-message="The first name is required" data-fv-container="#firstNameMessage" />',
                        '<span class="help-block" id="firstNameMessage" />',
                    '</div>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="lastName" required placeholder="Last name" data-fv-notempty-message="The last name is required" />',
                        '<span class="help-block lastNameMessage" />',
                    '</div>',
                '</div>',
            '</form>'
        ].join('')).appendTo('body');

        $('#containerForm').formValidation({
            fields: {
                lastName: {
                    err: '.lastNameMessage'
                }
            }
        });

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');
    });

    afterEach(function() {
        $('#containerForm').formValidation('destroy').remove();
    });

    it('field container declarative', function() {
        expect($.trim($('#firstNameMessage').text())).toEqual('The first name is required');
        expect($.trim($('.lastNameMessage').text())).toEqual('The last name is required');
    });

    it('field container programmatically', function() {
        this.$firstName.val('First');
        this.$lastName.val('');
        this.fv.validate();
        expect($('#firstNameMessage').find('.help-block:visible').length).toEqual(0);
        expect($('.lastNameMessage').find('.help-block:visible').length).toBeGreaterThan(0);

        this.fv.resetForm();
        this.$firstName.val('');
        this.$lastName.val('Last');
        this.fv.validate();
        expect($('#firstNameMessage').find('.help-block:visible').length).toBeGreaterThan(0);
        expect($('.lastNameMessage').find('.help-block:visible').length).toEqual(0);
    });
});

describe('container tooltip/popover', function() {
    beforeEach(function() {
        $([
            '<form id="containerForm" class="form-horizontal">',
                '<div class="form-group">',
                    '<label class="col-lg-3 control-label">Full name</label>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="firstName" required placeholder="First name" data-fv-notempty-message="The first name is required" />',
                    '</div>',
                    '<div class="col-lg-4">',
                        '<input type="text" class="form-control" name="lastName" required placeholder="Last name" data-fv-notempty-message="The last name is required" />',
                    '</div>',
                '</div>',
                '<div id="errors"></div>',
            '</form>'
        ].join('')).appendTo('body');
    });

    afterEach(function() {
        $('#containerForm').formValidation('destroy').remove();
    });

    it('container declarative', function() {
        $('#containerForm')
            .attr('data-fv-container', 'tooltip')
            .find('[name="lastName"]')
                .attr('data-fv-container', 'popover')
                .end()
            .formValidation({
                icon: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                }
            });

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');

        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeDefined();
        expect(this.$lastName.parent().find('i').data('bs.popover').type).toEqual('popover');

        this.fv.resetForm();
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeUndefined();
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeUndefined();
    });

    it('container programmatically', function() {
        $('#containerForm').formValidation({
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            err: {
                container: 'tooltip'
            },
            fields: {
                lastName: {
                    err: 'popover'
                }
            }
        });

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');

        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeDefined();
        expect(this.$lastName.parent().find('i').data('bs.popover').type).toEqual('popover');

        this.fv.resetForm();
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeUndefined();
        expect(this.$lastName.parent().find('i').data('bs.popover')).toBeUndefined();
    });

    // #991: Validate once when setting trigger: blur, container: tooltip
    it('trigger: blur, container: tooltip', function() {
        $('#containerForm').formValidation({
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            err: {
                container: 'tooltip'
            },
            trigger: 'blur',
            fields: {
                firstName: {
                    validators: {
                        stringLength: {
                            min: 5,
                            message: 'The first name must be more than 5 characters'
                        },
                        notEmpty: {
                            message: 'The first name is required'
                        },
                        regexp: {
                            regexp: /^[a-z]+$/i,
                            message: 'The first name must consist of a-z, A-Z characters only'
                        }
                    }
                },
                lastName: {
                    validators: {
                        stringLength: {
                            min: 5,
                            message: 'The last name must be more than 5 characters'
                        },
                        notEmpty: {
                            message: 'The last name is required'
                        },
                        regexp: {
                            regexp: /^[a-z]+$/i,
                            message: 'The last name must consist of a-z, A-Z characters only'
                        }
                    }
                }
            }
        });

        this.fv         = $('#containerForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');

        this.$firstName.val('').trigger('blur');
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$firstName.parent().find('i').data('bs.tooltip').getTitle()).toEqual('The first name is required');

        this.fv.resetForm();
        this.$firstName.val('@not#valid');
        this.$lastName.val('').focus();
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$firstName.parent().find('i').data('bs.tooltip').getTitle()).toEqual('The first name must consist of a-z, A-Z characters only');

        this.fv.resetForm();
        this.$firstName.val('Phuo');
        this.$lastName.val('').focus();
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeDefined();
        expect(this.$firstName.parent().find('i').data('bs.tooltip').type).toEqual('tooltip');
        expect(this.$firstName.parent().find('i').data('bs.tooltip').getTitle()).toEqual('The first name must be more than 5 characters');

        this.fv.resetForm();
        this.$firstName.val('Phuoc');
        this.$lastName.val('').focus();
        this.fv.validate();
        expect(this.$firstName.parent().find('i').data('bs.tooltip')).toBeUndefined();
    });
});

describe('dynamic fields', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="dynamicForm">',
                '<div class="form-group">',
                    '<input type="text" name="userName" class="form-control" required />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="fullName" class="form-control" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#dynamicForm').formValidation({
            fields: {
                userName: {
                    validators: {
                        notEmpty: {
                            message: 'The user name is required and cannot be empty'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z]+$/,
                            message: 'The user name can only consist of alphabetical, number'
                        }
                    }
                },
                // #725: Note that the email field isn't available in the form yet
                email: {
                    validators: {
                        emailAddress: {
                            message: 'The email address is not valid'
                        }
                    }
                }
            }
        });

        this.fv        = $('#dynamicForm').data('formValidation');
        this.$userName = this.fv.getFieldElements('userName');
    });

    afterEach(function() {
        $('#dynamicForm').formValidation('destroy').remove();
    });

    // https://github.com/formvalidation/formvalidation/pull/725
    it('adding field [does not exist but is already set in "fields" option]', function() {
        var $div   = $('<div/>').addClass('form-group').appendTo($('#dynamicForm'));
            $email = $('<input/>')
                        .attr('type', 'text')
                        .addClass('form-control')
                        .attr('name', 'email')
                        .appendTo($div);

        this.fv.addField('email');

        this.$userName.val('FormValidation');

        $email.val('not valid@email');
        this.fv.validate();
        expect(this.fv.isValidField('email')).toBeFalsy();
        expect(this.fv.isValid()).toBeFalsy();

        this.fv.resetForm();
        $email.val('valid@email.com');
        this.fv.validate();
        expect(this.fv.isValidField('email')).toBeTruthy();
        expect(this.fv.isValid()).toBeTruthy();
    });

    // support#48
    it('Override the options when adding field', function() {
        var options = {
            validators: {
                stringLength: {
                    min: 6,
                    max: 20
                }
            }
        };

        $('#dynamicForm')
            .formValidation('destroy')
            .formValidation()
            .formValidation('addField', 'userName', options);

        // The options shouldn't contain the notEmpty validator (userName field have required attribute)
        expect(options.validators.notEmpty).toBeUndefined();
    })
});

describe('enable validators', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="enableForm">',
                '<div class="form-group">',
                    '<input type="text" name="fullName" class="form-control" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#enableForm').formValidation({
            fields: {
                fullName: {
                    validators: {
                        notEmpty: {
                            message: 'The full name is required and cannot be empty'
                        },
                        stringLength: {
                            min: 8,
                            max: 40,
                            message: 'The full name must be more than %s and less than %s characters long'
                        },
                        regexp: {
                            enabled: false,
                            regexp: /^[a-zA-Z\s]+$/,
                            message: 'The full name can only consist of alphabetical, number, and space'
                        }
                    }
                }
            }
        });

        this.fv        = $('#enableForm').data('formValidation');
        this.$fullName = this.fv.getFieldElements('fullName');
    });

    afterEach(function() {
        $('#enableForm').formValidation('destroy').remove();
    });

    it('enable all validators', function() {
        this.$fullName.val('@ $full N@m3');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$fullName.val('Contain#$@');
        this.fv.enableFieldValidators('fullName', true);
        this.fv.validate();
        expect(this.fv.isValidField('fullName')).toEqual(false);
        expect(this.fv.isValid()).toEqual(false);
    });

    it('disable all validators', function() {
        this.fv.resetForm();
        this.fv.enableFieldValidators('fullName', false);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('enabled option particular validator', function() {
        this.$fullName.val('Contain@#$');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        var messages = this.fv.getMessages('fullName');
        expect(messages.length).toEqual(0);
    });

    it('enable particular validators', function() {
        // Enable stringLength validator
        this.fv.resetForm();
        this.fv.enableFieldValidators('fullName', true, 'stringLength');
        this.fv.enableFieldValidators('fullName', true, 'regexp');
        this.$fullName.val('Full@');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        var messages = this.fv.getMessages('fullName');
        expect($.inArray('The full name must be more than 8 and less than 40 characters long', messages)).toBeGreaterThan(-1);
        expect($.inArray('The full name can only consist of alphabetical, number, and space', messages)).toBeGreaterThan(-1);
    });

    it('disable particular validators', function() {
        // Disable stringLength validator
        this.fv.enableFieldValidators('fullName', false, 'stringLength');
        this.$fullName.val('Full');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        var messages = this.fv.getMessages('fullName');
        expect($.inArray('The full name must be more than 8 and less than 40 characters long', messages)).toEqual(-1);

        // Disable regexp validator
        this.fv.enableFieldValidators('fullName', false, 'regexp');
        this.$fullName.val('Special@#$');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        var messages = this.fv.getMessages('fullName');
        expect($.inArray('The full name can only consist of alphabetical, number, and space', messages)).toEqual(-1);
    });
});

TestSuite = $.extend({}, TestSuite, {
    Event: {
        onEmailValid: function(e, data) {
            $('#msg').html('TestSuite.Event.onEmailValid() called, ' + data.field + ' is valid');
        },

        onEmailInvalid: function(e, data) {
            $('#msg').html('TestSuite.Event.onEmailInvalid() called, ' + data.field + ' is invalid');
        },

        onEmailStatus: function(e, data) {
            $('#status').html('TestSuite.Event.onEmailStatus() called; status = ' + data.status);
        },

        onFormValid: function(e) {
            $('#msg').html('TestSuite.Event.onFormValid() called, form ' + $(e.target).attr('id') + ' is valid');
        },

        onFormInvalid: function(e) {
            $('#msg').html('TestSuite.Event.onFormInvalid() called, form ' + $(e.target).attr('id') + ' is invalid');
        }
    }
});

// ---
// Form events
// ---

function onFormValid(e) {
    $('#msg').html('form ' + $(e.target).attr('id') + ' is valid');
};

function onFormInvalid(e) {
    $('#msg').html('form ' + $(e.target).attr('id') + ' is invalid');
};

describe('event form attribute callback global', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm" data-fv-onsuccess="onFormValid" data-fv-onerror="onFormInvalid" >',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" required data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').formValidation();

        this.fv     = $('#eventForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').formValidation('destroy').remove();
    });

    it('call data-fv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm is valid');
    });

    it('call data-fv-onerror', function() {
        this.$email.val('a@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm is invalid');
    });
});

describe('event form attribute callback namespace', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm" data-fv-onsuccess="TestSuite.Event.onFormValid" data-fv-onerror="TestSuite.Event.onFormInvalid" >',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" required data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').formValidation();

        this.fv     = $('#eventForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').formValidation('destroy').remove();
    });

    it('call data-fv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.Event.onFormValid() called, form eventForm is valid');
    });

    it('call data-fv-onerror', function() {
        this.$email.val('just"not"right@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.Event.onFormInvalid() called, form eventForm is invalid');
    });
});

describe('event form trigger', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm')
            .formValidation()
            .on('success.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered success.form.fv event');
            })
            .on('err.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered err.form.fv event');
            });

        this.fv     = $('#eventForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').formValidation('destroy').remove();
    });

    it('trigger success.form.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm triggered success.form.fv event');
    });

    it('trigger err.form.fv', function() {
        this.$email.val('this is"not\\allowed@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm triggered err.form.fv event');
    });
});

describe('event form programmatically', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').formValidation({
            onSuccess: function(e) {
                $('#msg').html('onSuccess() called');
            },
            onError: function(e) {
                $('#msg').html('onError() called');
            }
        });

        this.fv     = $('#eventForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').formValidation('destroy').remove();
    });

    it('call onSuccess()', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('onSuccess() called');
    });

    it('call onError()', function() {
        this.$email.val('Abc.example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('onError() called');
    });
});

// ---
// Field events
// ---

function onEmailValid(e, data) {
    $('#msg').html(data.field + ' is valid');
};

function onEmailInvalid(e, data) {
    $('#msg').html(data.field + ' is invalid');
};

function onEmailStatus(e, data) {
    $('#status').html(data.status);
};

describe('event field attribute callback global', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div id="status"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress data-fv-onsuccess="onEmailValid" data-fv-onerror="onEmailInvalid" data-fv-onstatus="onEmailStatus" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').formValidation();

        this.fv     = $('#eventForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').formValidation('destroy').remove();
    });

    it('call data-fv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('email is valid');
        expect($('#status').html()).toEqual(this.fv.STATUS_VALID);
    });

    it('call data-fv-onerror', function() {
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('email is invalid');
        expect($('#status').html()).toEqual(this.fv.STATUS_INVALID);
    });
});

describe('event field attribute callback namespace', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div id="status"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress data-fv-onsuccess="TestSuite.Event.onEmailValid" data-fv-onerror="TestSuite.Event.onEmailInvalid" data-fv-onstatus="TestSuite.Event.onEmailStatus" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').formValidation();

        this.fv     = $('#eventForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').formValidation('destroy').remove();
    });

    it('call data-fv-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.Event.onEmailValid() called, email is valid');
        expect($('#status').html()).toEqual('TestSuite.Event.onEmailStatus() called; status = ' + this.fv.STATUS_VALID);
    });

    it('call data-fv-onerror', function() {
        this.$email.val('a"b(c)d,e:f;gi[j\\k]l@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.Event.onEmailInvalid() called, email is invalid');
        expect($('#status').html()).toEqual('TestSuite.Event.onEmailStatus() called; status = ' + this.fv.STATUS_INVALID);
    });
});

describe('event field trigger', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm')
            .formValidation()
            .on('success.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered success.field.fv on ' + data.field);
            })
            .on('err.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered err.field.fv on ' + data.field);
            });

        this.fv     = $('#eventForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').formValidation('destroy').remove();
    });

    it('trigger success.field.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered success.field.fv on email');
    });

    it('trigger err.field.fv', function() {
        this.$email.val('just"not"right@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered err.field.fv on email');
    });
});

describe('event field programmatically', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').formValidation({
            fields: {
                email: {
                    onSuccess: function(e, data) {
                        $('#msg').html('onSuccess() called');
                    },
                    onError: function(e, data) {
                        $('#msg').html('onError() called');
                    }
                }
            }
        });

        this.fv     = $('#eventForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').formValidation('destroy').remove();
    });

    it('call onSuccess()', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('onSuccess() called');
    });

    it('call onError()', function() {
        this.$email.val('this is"not\\allowed@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('onError() called');
    });
});

// ---
// Modifying default events
// ---

describe('event form trigger with default events', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm1">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm1')
            .formValidation()
            .on('fv.form.success', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered fv.form.success event');
            })
            .on('success.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered success.form.fv event');
            })
            .on('fv.form.error', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered fv.form.error event');
            })
            .on('err.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered err.form.fv event');
            });

        this.fv     = $('#eventForm1').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm1').formValidation('destroy').remove();
    });

    it('does not trigger fv.form.success', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('form eventForm1 triggered fv.form.success event');
    });

    it('triggers success.form.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm1 triggered success.form.fv event');
    });

    it('does not trigger fv.form.error', function() {
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('form eventForm1 triggered fv.form.error event');
    });

    it('triggers err.form.fv', function() {
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm1 triggered err.form.fv event');
    });
});

describe('event field trigger with default events', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm3">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm3')
            .formValidation()
            .on('success.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered success.field.fv on ' + data.field);
            })
            .on('err.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered err.field.fv on ' + data.field);
            })
            .on('fv.field.success', '[name="email"]', function(e, data) {
                $('#msg').html('triggered fv.field.success on ' + data.field);
            })
            .on('fv.field.error', '[name="email"]', function(e, data) {
                $('#msg').html('triggered fv.field.error on ' + data.field);
            });

        this.fv     = $('#eventForm3').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm3').formValidation('destroy').remove();
    });

    it('triggers success.field.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered success.field.fv on email');
    });

    it('does not trigger fv.field.success', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('triggered fv.field.success on email');
    });

    it('does not trigger err.field.fv', function() {
        this.$email.val('just"not"right@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered err.field.fv on email');
    });

    it('triggers fv.field.error', function() {
        this.$email.val('just"not"right@example.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('triggered fv.field.error on email');
    });
});

describe('event form trigger with events changed', function() {
    var defaultOptions = $.fn.formValidation.DEFAULT_OPTIONS;

    beforeEach(function() {
        $.fn.formValidation.DEFAULT_OPTIONS = $.extend({}, $.fn.formValidation.DEFAULT_OPTIONS, {
            events: {
                formInit: 'init.form.fv',
                formError: 'fv.form.error',
                formSuccess: 'fv.form.success',
                fieldAdded: 'added.field.fv',
                fieldRemoved: 'removed.field.fv',
                fieldInit: 'init.field.fv',
                fieldError: 'fv.field.error',
                fieldSuccess: 'fv.field.success',
                fieldStatus: 'status.field.fv',
                validatorError: 'fv.validator.error',
                validatorSuccess: 'success.validator.fv'
            }
        });

        $([
            '<form class="form-horizontal" id="eventForm2">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm2')
            .formValidation()
            .on('fv.form.success', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered fv.form.success event');
            })
            .on('success.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered success.form.fv event');
            })
            .on('fv.form.error', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered fv.form.error event');
            })
            .on('err.form.fv', function(e) {
                $('#msg').html('form ' + $(e.target).attr('id') + ' triggered err.form.fv event');
            });

        this.fv     = $('#eventForm2').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm2').formValidation('destroy').remove();
        $.fn.formValidation.DEFAULT_OPTIONS = defaultOptions;
    });

    it('triggers fv.form.success', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm2 triggered fv.form.success event');
    });

    it('does not trigger success.form.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('form eventForm2 triggered success.form.fv event');
    });

    it('triggers fv.form.error', function() {
        spyOn(window, 'onerror');

        this.$email.val('this is"not\\allowed@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('form eventForm2 triggered fv.form.error event');

        expect(window.onerror).not.toHaveBeenCalled();
    });
});

describe('event field trigger with events changed', function() {
    var defaultOptions = $.fn.formValidation.DEFAULT_OPTIONS;

    beforeEach(function() {
        $.fn.formValidation.DEFAULT_OPTIONS = $.extend({}, $.fn.formValidation.DEFAULT_OPTIONS, {
            events: {
                formInit: 'init.form.fv',
                formError: 'fv.form.error',
                formSuccess: 'fv.form.success',
                fieldAdded: 'added.field.fv',
                fieldRemoved: 'removed.field.fv',
                fieldInit: 'init.field.fv',
                fieldError: 'fv.field.error',
                fieldSuccess: 'fv.field.success',
                fieldStatus: 'status.field.fv',
                validatorError: 'fv.validator.error',
                validatorSuccess: 'success.validator.fv'
            }
        });

        $([
            '<form class="form-horizontal" id="eventForm4">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm4')
            .formValidation()
            .on('success.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered success.field.fv on ' + data.field);
            })
            .on('err.field.fv', '[name="email"]', function(e, data) {
                $('#msg').html('triggered err.field.fv on ' + data.field);
            })
            .on('fv.field.success', '[name="email"]', function(e, data) {
                $('#msg').html('triggered fv.field.success on ' + data.field);
            })
            .on('fv.field.error', '[name="email"]', function(e, data) {
                $('#msg').html('triggered fv.field.error on ' + data.field);
            });

        this.fv     = $('#eventForm4').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm4').formValidation('destroy').remove();
        $.fn.formValidation.DEFAULT_OPTIONS = defaultOptions;
    });

    it('triggers success.field.fv', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('triggered success.field.fv on email');
    });

    it('does not trigger fv.field.success', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered fv.field.success on email');
    });

    it('does not trigger err.field.fv', function() {
        this.$email.val('Abc.example.com');
        this.fv.validate();
        expect($('#msg').html()).not.toEqual('triggered err.field.fv on email');
    });

    it('triggers fv.field.error', function() {
        spyOn(window, 'onerror');

        this.$email.val('Abc.example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('triggered fv.field.error on email');

        expect(window.onerror).not.toHaveBeenCalled();
    });
});

// ---
// Validator events
// ---

function onEmailAddressValidatorSuccess(e, data) {
    $('#msg').html(data.validator + ' validator passed');
};

function onEmailAddressValidatorError(e, data) {
    $('#msg').html(data.validator + ' validator did not pass');
};

describe('event validator declarative', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress data-fv-emailaddress-onsuccess="onEmailAddressValidatorSuccess" data-fv-emailaddress-onerror="onEmailAddressValidatorError" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').formValidation();

        this.fv     = $('#eventForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').formValidation('destroy').remove();
    });

    it('trigger data-fv-emailaddress-onsuccess', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('emailAddress validator passed');
    });

    it('trigger data-fv-emailaddress-onerror', function() {
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('emailAddress validator did not pass');
    });
});

describe('event validator programmatically', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="eventForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#eventForm').formValidation({
            fields: {
                email: {
                    validators: {
                        emailAddress: {
                            onSuccess: function(e, data) {
                                $('#msg').html('emailAddress validator: onSuccess() called');
                            },
                            onError: function(e, data) {
                                $('#msg').html('emailAddress validator: onError() called');
                            },
                            message: 'The email address is not valid'
                        }
                    }
                }
            }
        });

        this.fv     = $('#eventForm').data('formValidation');
        this.$email = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#eventForm').formValidation('destroy').remove();
    });

    it('call onSuccess()', function() {
        this.$email.val('email@domain.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('emailAddress validator: onSuccess() called');
    });

    it('call onError()', function() {
        this.$email.val('A@b@c@example.com');
        this.fv.validate();
        expect($('#msg').html()).toEqual('emailAddress validator: onError() called');
    });
});

function excludeField($field, validator) {
    return ($field.attr('name') === 'username')
                                ? false     // Don't exclude the username field
                                : true;     // Exclude the email field
}

describe('excluded', function() {
    beforeEach(function() {
        $([
            '<div class="container">',
                '<form class="form-horizontal" id="excludedForm" data-fv-excluded="[name=\'email\']">',
                    '<div class="form-group">',
                        '<input type="text" name="username" required />',
                    '</div>',
                    '<div class="form-group">',
                        '<input type="text" name="email" required data-fv-emailaddress />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('')).appendTo('body');

        $('#excludedForm').formValidation();

        this.fv        = $('#excludedForm').data('formValidation');
        this.$username = this.fv.getFieldElements('username');
        this.$email    = this.fv.getFieldElements('email');
    });

    afterEach(function() {
        $('#excludedForm').formValidation('destroy').parent().remove();
    });

    it('excluded form declarative', function() {
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$username.val('your_user_name');
        this.$email.val('');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('excluded form programmatically', function() {
        this.fv.destroy();
        $('#excludedForm').removeAttr('data-fv-excluded');

        $('#excludedForm').formValidation({
            excluded: '[name="username"]'
        });

        this.fv        = $('#excludedForm').data('formValidation');
        this.$username = this.fv.getFieldElements('username');
        this.$email    = this.fv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('invalid#email.com');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$email.val('valid@email.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('excluded field declarative', function() {
        this.fv.destroy();
        $('#excludedForm').removeAttr('data-fv-excluded');
        $('#excludedForm').find('[name="username"]').attr('data-fv-excluded', 'true');
        $('#excludedForm').find('[name="email"]').attr('data-fv-excluded', 'false');

        this.fv        = $('#excludedForm').formValidation().data('formValidation');
        this.$username = this.fv.getFieldElements('username');
        this.$email    = this.fv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$email.val('invalid#email.com');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$email.val('valid@email.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('excluded field programmatically true/false', function() {
        this.fv.destroy();
        $('#excludedForm').removeAttr('data-fv-excluded');

        $('#excludedForm').formValidation({
            fields: {
                username: {
                    excluded: true
                },
                email: {
                    excluded: false
                }
            }
        });

        this.fv        = $('#excludedForm').formValidation().data('formValidation');
        this.$username = this.fv.getFieldElements('username');
        this.$email    = this.fv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$email.val('invalid#email.com');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$email.val('valid@email.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('excluded field programmatically "true"/"false"', function() {
        this.fv.destroy();
        $('#excludedForm').removeAttr('data-fv-excluded');

        $('#excludedForm').formValidation({
            fields: {
                username: {
                    excluded: 'false'
                },
                email: {
                    excluded: 'true'
                }
            }
        });

        this.fv        = $('#excludedForm').formValidation().data('formValidation');
        this.$username = this.fv.getFieldElements('username');
        this.$email    = this.fv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('valid@email.com');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$username.val('your_user_name');
        this.$email.val('invalid#email.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('excluded field callback programmatically', function() {
        this.fv.destroy();
        $('#excludedForm').removeAttr('data-fv-excluded');

        $('#excludedForm').formValidation({
            fields: {
                username: {
                    excluded: function($field, validator) {
                        return true;
                    }
                }
            }
        });

        this.fv        = $('#excludedForm').formValidation().data('formValidation');
        this.$username = this.fv.getFieldElements('username');
        this.$email    = this.fv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('valid@email.com');
        this.fv.validate();
        expect(this.fv.isValidField('username')).toEqual(true);
    });

    it('excluded field callback as a string', function() {
        this.fv.destroy();
        $('#excludedForm').removeAttr('data-fv-excluded');

        $('#excludedForm').formValidation({
            fields: {
                username: {
                    excluded: 'excludeField'
                },
                email: {
                    excluded: 'excludeField'
                }
            }
        });

        this.fv        = $('#excludedForm').formValidation().data('formValidation');
        this.$username = this.fv.getFieldElements('username');
        this.$email    = this.fv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('invalid email address');
        this.fv.validate();
        expect(this.fv.isValidField('username')).toEqual(false);
        expect(this.fv.isValidField('email')).toEqual(true);
    });

    it('excluded field callback declarative', function() {
        this.fv.destroy();
        $('#excludedForm')
            .removeAttr('data-fv-excluded')
            .find('[name="username"], [name="email"]')
                .attr('data-fv-excluded', 'excludeField')
                .end()
            .formValidation();

        this.fv        = $('#excludedForm').formValidation().data('formValidation');
        this.$username = this.fv.getFieldElements('username');
        this.$email    = this.fv.getFieldElements('email');

        this.$username.val('');
        this.$email.val('invalid email address');
        this.fv.validate();
        expect(this.fv.isValidField('username')).toEqual(false);
        expect(this.fv.isValidField('email')).toEqual(true);
    });
});

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

describe('message', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="messageForm">',
                    '<div class="form-group">',
                        '<input type="password" class="form-control" name="password" placeholder="Enter secure password" />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#messageForm').formValidation({
            fields: {
                password: {
                    validators: {
                        notEmpty: {
                            message: 'The password is required'
                        },
                        callback: {
                            callback: function(value, validator) {
                                // Check the password strength
                                if (value.length < 6) {
                                    return {
                                        valid: false,
                                        message: 'The password must be more than 6 characters'
                                    }
                                }

                                if (value === value.toLowerCase()) {
                                    return {
                                        valid: false,
                                        message: 'The password must contain at least one upper case character'
                                    }
                                }
                                if (value === value.toUpperCase()) {
                                    return {
                                        valid: false,
                                        message: 'The password must contain at least one lower case character'
                                    }
                                }
                                if (value.search(/[0-9]/) < 0) {
                                    return {
                                        valid: false,
                                        message: 'The password must contain at least one digit'
                                    }
                                }

                                return true;
                            }
                        }
                    }
                }
            }
        });

        this.fv        = $('#messageForm').data('formValidation');
        this.$password = this.fv.getFieldElements('password');
    });

    afterEach(function() {
        $('#messageForm').formValidation('destroy').parent().remove();
    });

    it('update message from callback', function() {
        this.fv.resetForm();
        this.$password.val('123');
        this.fv.validate();
        expect(this.fv.getMessages('password', 'callback')[0]).toEqual('The password must be more than 6 characters');

        this.fv.resetForm();
        this.$password.val('no_upper_case!@#');
        this.fv.validate();
        expect(this.fv.getMessages('password', 'callback')[0]).toEqual('The password must contain at least one upper case character');

        this.fv.resetForm();
        this.$password.val('NO_LOWER_CASE123');
        this.fv.validate();
        expect(this.fv.getMessages('password', 'callback')[0]).toEqual('The password must contain at least one lower case character');

        this.fv.resetForm();
        this.$password.val('NoDigits!@#');
        this.fv.validate();
        expect(this.fv.getMessages('password', 'callback')[0]).toEqual('The password must contain at least one digit');
    });

    it('call updateMessage()', function() {
        this.fv.updateStatus('password', this.fv.STATUS_INVALID, 'callback');

        this.fv.updateMessage('password', 'callback', 'The password is weak');
        expect(this.fv.getMessages('password', 'callback')[0]).toEqual('The password is weak');

        this.fv.updateMessage(this.$password, 'callback', 'The password is not strong');
        expect(this.fv.getMessages(this.$password, 'callback')[0]).toEqual('The password is not strong');
    });
});

describe('row option', function() {
    beforeEach(function() {
        $([
            '<form id="groupForm" method="post" class="form-horizontal">',
                '<div class="form-group">',
                    '<div class="firstNameGroup">',
                        '<label class="col-sm-2 control-label">First name</label>',
                        '<div class="col-sm-4">',
                            '<input type="text" class="form-control" name="firstName" />',
                        '</div>',
                    '</div>',
                    '<div class="lastNameGroup">',
                        '<label class="col-sm-2 control-label">Last name</label>',
                        '<div class="col-sm-4">',
                            '<input type="text" class="form-control" name="lastName" data-fv-row=".lastNameGroup" />',
                        '</div>',
                    '</div>',
                '</div>',

                '<div class="form-group">',
                    '<label class="col-sm-2 control-label">Username</label>',
                    '<div class="col-sm-5">',
                        '<input type="text" class="form-control" name="username" />',
                    '</div>',
                '</div>',
            '</form>'
        ].join('')).appendTo('body');

        $('#groupForm').formValidation({
            fields: {
                firstName: {
                    row: '.firstNameGroup',
                    validators: {
                        notEmpty: {
                            message: 'The first name is required and cannot be empty'
                        }
                    }
                },
                lastName: {
                    validators: {
                        notEmpty: {
                            message: 'The last name is required and cannot be empty'
                        }
                    }
                },
                username: {
                    validators: {
                        notEmpty: {
                            message: 'The username is required and cannot be empty'
                        },
                        stringLength: {
                            min: 6,
                            max: 30,
                            message: 'The username must be more than 6 and less than 30 characters long'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/,
                            message: 'The username can only consist of alphabetical, number, dot and underscore'
                        }
                    }
                }
            }
        });

        this.fv         = $('#groupForm').data('formValidation');
        this.$firstName = this.fv.getFieldElements('firstName');
        this.$lastName  = this.fv.getFieldElements('lastName');
        this.$username  = this.fv.getFieldElements('username');
    });

    afterEach(function() {
        $('#groupForm').formValidation('destroy').remove();
    });

    it('default', function() {
        this.$username.val('123@#$');
        this.fv.validate();
        expect(this.$username.parents('.form-group').hasClass('has-error')).toBeTruthy();
        expect(this.$username.parents('.form-group').hasClass('has-success')).toEqual(false);

        this.fv.resetForm();
        this.$username.val('validUser.Name');
        this.fv.validate();
        expect(this.$username.parents('.form-group').hasClass('has-success')).toBeTruthy();
        expect(this.$username.parents('.form-group').hasClass('has-error')).toEqual(false);
    });

    it('programmatically usage', function() {
        this.$firstName.val('');
        this.fv.validate();
        expect(this.$firstName.parents('.firstNameGroup').hasClass('has-error')).toBeTruthy();
        expect(this.$firstName.parents('.firstNameGroup').hasClass('has-success')).toEqual(false);
        expect(this.$firstName.parents('.form-group').hasClass('has-error')).toEqual(false);
    });

    it('declarative usage', function() {
        this.$firstName.val('First');
        this.$lastName.val('Last');
        this.fv.validate();
        expect(this.$lastName.parents('.lastNameGroup').hasClass('has-success')).toBeTruthy();
        expect(this.$lastName.parents('.lastNameGroup').hasClass('has-error')).toEqual(false);
        expect(this.$lastName.parents('.form-group').hasClass('has-success')).toEqual(false);
        expect(this.$lastName.parents('.form-group').hasClass('has-error')).toEqual(false);
    });
});

describe('submit', function() {
    var submitted, originalTimeout;

    FormValidation.Validator.fakeRemote = {
        validate: function(validator, $field, options) {
            var dfd = new $.Deferred();
            setTimeout(function() {
                dfd.resolve($field, 'fakeRemote', { valid: options.valid });
            }, 0);
            return dfd;
        }
    };
    
    beforeEach(function() {
        $([
            '<form id="submitForm" class="form-horizontal" role="form">',
                '<div class="form-group">',
                    '<input name="username" type="text" class="form-control" value="me" required />',
                '</div>',
                '<button id="sendButton" type="submit" class="btn btn-default">Send</button>',
            '</form>'
        ].join('\n')).appendTo('body');

        this.$form = $('#submitForm');
        this.$form
            .formValidation()
            .on('success.form.fv', function(e) {
                e.preventDefault();
                ++submitted;
            })
            .submit(function(e) {
                e.preventDefault();
            });
            
        submitted      = 0;
        this.fv        = this.$form.data('formValidation');
        this.$username = this.fv.getFieldElements('username');

        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(function() {
        $('#submitForm').formValidation('destroy').remove();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    // #481
    it('without callback nor remote', function(done) {
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(1);
            done();
        }, 0);
    });

    // #481
    it('with callback returning true', function(done) {
        this.fv.addField('username', {
            validators: {
                callback: {
                    message: 'Please enter an username',
                    callback: function(value, validator, $field) {
                        return true;
                    }
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(1);
            done();
        }, 0);
    });

    // #481
    it('with callback returning false', function(done) {
        this.fv.addField('username', {
            validators: {
                callback: {
                    message: 'Please enter an username',
                    callback: function(value, validator, $field) {
                        return false;
                    }
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(0);
            done();
        }, 0);
    });

    // #481
    it('with remote returning true', function(done) {
        this.fv.addField('username', {
            validators: {
                remote: {
                    url: '/test/valid.json',
                    message: 'The username is not available'
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(1);
            done();
        }, 100);
    });

    // #481
    it('with remote returning false', function(done) {
        this.fv.addField('username', {
            validators: {
                remote: {
                    url: '/test/invalid.json',
                    message: 'The username is not available'
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(0);
            done();
        }, 100);
    });

    // #481
    it('with fake remote returning true', function(done) {
        this.fv.addField('username', {
            validators: {
                fakeRemote: {
                    message: 'The username is not available',
                    valid: true
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(1);
            done();
        }, 100);
    });

    // #481
    it('with fake remote returning false', function(done) {
        this.fv.addField('username', {
            validators: {
                fakeRemote: {
                    message: 'The username is not available',
                    valid: false
                }
            }
        });
        $('#sendButton').click();
        setTimeout(function() {
            expect(submitted).toBe(0);
            done();
        }, 100);
    });

    // #1344
    it('remote validator trigger err.form.fv event', function(done) {
        var errorTriggered = 0;

        this.$form
            .on('err.form.fv', function(e) {
                errorTriggered++;
            });

        this.fv.addField('username', {
            validators: {
                remote: {
                    url: '/test/valid.json'
                }
            }
        });

        $('#sendButton').click();
        setTimeout(function() {
            expect(errorTriggered).toBe(0);
            done();
        }, 100);
    });
});

TestSuite = $.extend({}, TestSuite, {
    Transformer: {
        uri: function($field, validator) {
            var value = $field.val();
            if (value && value.substr(0, 7) !== 'http://' && value.substr(0, 8) !== 'https://') {
                value = 'http://' + value;
            }
            return value;
        }
    }
});

describe('transformer', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="transformerForm">',
                '<div class="form-group">',
                    '<input type="text" name="website" data-fv-uri />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#transformerForm').formValidation();

        this.fv       = $('#transformerForm').data('formValidation');
        this.$website = this.fv.getFieldElements('website');
    });

    afterEach(function() {
        $('#transformerForm').formValidation('destroy').remove();
    });

    it('transformer not set', function() {
        this.$website.val('foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });

    it('programmatically usage', function() {
        this.fv = $('#transformerForm')
                    .formValidation('destroy')
                    .formValidation({
                        fields: {
                            website: {
                                validators: {
                                    uri: {
                                        transformer: function($field, validator) {
                                            var value = $field.val();
                                            if (value && value.substr(0, 7) !== 'http://' && value.substr(0, 8) !== 'https://') {
                                                value = 'http://' + value;
                                            }
                                            return value;
                                        }
                                    }
                                }
                            }
                        }
                    })
                    .data('formValidation');
        this.$website.val('foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('http://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('https://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('declarative usage', function() {
        this.$website.attr('data-fv-uri-transformer', 'TestSuite.Transformer.uri');

        this.fv = $('#transformerForm')
                    .formValidation('destroy')
                    .formValidation()
                    .data('formValidation');

        this.$website.val('foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('http://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('https://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('update via updateOption()', function() {
        this.fv.updateOption('website', 'uri', 'transformer', 'TestSuite.Transformer.uri');

        this.$website.val('foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('http://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$website.val('https://foo.com');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });
});
describe('verbose option', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="verboseForm">',
                '<div class="form-group">',
                    '<input type="text" name="fullName" class="form-control" ',
                        'required data-fv-notempty-message="The full name is required and cannot be empty" ',
                        'data-fv-regexp="true" data-fv-regexp-regexp="^[a-zA-Z\\s]+$" data-fv-regexp-message="The full name can only consist of alphabetical, number, and space" ',
                        'data-fv-stringlength="true" data-fv-stringlength-min="8" data-fv-stringlength-max="40" data-fv-stringlength-message="The full name must be more than 8 and less than 40 characters long" ',
                    '/>',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        // The order of validators are alphabetical:
        // - notEmpty
        // - regexp
        // - stringLength
    });

    afterEach(function() {
        $('#verboseForm').formValidation('destroy').remove();
    });

    it('set data-fv-verbose="false" for form', function() {
        var bv        = $('#verboseForm')
                            .attr('data-fv-verbose', 'false')
                            .formValidation('destroy')
                            .formValidation()
                            .data('formValidation'),
            $fullName = bv.getFieldElements('fullName'),
            messages;

        $fullName.val('');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-notempty-message'));

        bv.resetForm();
        $fullName.val('Spe@#$');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-regexp-message'));

        bv.resetForm();
        $fullName.val('Full');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-stringlength-message'));
    });

    it('set data-fv-verbose="false" for field', function() {
        var bv        = $('#verboseForm')
                            .attr('data-fv-verbose', 'true')
                            .find('[name="fullName"]')
                                .attr('data-fv-verbose', 'false')
                                .end()
                            .formValidation('destroy')
                            .formValidation()
                            .data('formValidation'),
            $fullName = bv.getFieldElements('fullName'),
            messages;

        $fullName.val('');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-notempty-message'));

        bv.resetForm();
        $fullName.val('Spe@#$');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-regexp-message'));

        bv.resetForm();
        $fullName.val('Full');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-stringlength-message'));
    });

    it('set verbose: "false" for form', function() {
        var bv        = $('#verboseForm')
                            .formValidation('destroy')
                            .formValidation({ verbose: false })
                            .data('formValidation'),
            $fullName = bv.getFieldElements('fullName'),
            messages;

        $fullName.val('');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-notempty-message'));

        bv.resetForm();
        $fullName.val('Spe@#$');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-regexp-message'));

        bv.resetForm();
        $fullName.val('Full');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-stringlength-message'));
    });

    // #1057
    it('set verbose: "false" for field', function() {
        var bv        = $('#verboseForm')
                            .attr('data-fv-verbose', 'true')
                            .formValidation('destroy')
                            .formValidation({
                                verbose: true,
                                fields: {
                                    fullName: {
                                        verbose: false
                                    }
                                }
                            })
                            .data('formValidation'),
            $fullName = bv.getFieldElements('fullName'),
            messages;

        $fullName.val('');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-notempty-message'));

        bv.resetForm();
        $fullName.val('Spe@#$');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-regexp-message'));

        bv.resetForm();
        $fullName.val('Full');
        bv.validate();
        messages = bv.getMessages('fullName');
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual($fullName.attr('data-fv-stringlength-message'));
    });

    // #1055
    it('trigger "err.field.fv" event', function() {
        var validators = [],    // Array of not passed validators
            bv         = $('#verboseForm')
                            .attr('data-fv-verbose', 'true')
                            .formValidation('destroy')
                            .formValidation({
                                verbose: true,
                                fields: {
                                    fullName: {
                                        verbose: false
                                    }
                                }
                            })
                            .on('err.field.fv', function(e, data) {
                                validators.push(data.validator);
                            })
                            .data('formValidation'),
            $fullName  = bv.getFieldElements('fullName');

        $fullName.val('');
        bv.validate();
        expect(validators.length).toEqual(1);
        expect(validators[0]).toEqual('notEmpty');

        validators = [];
        bv.resetForm();
        $fullName.val('Spe@#$');
        bv.validate();
        expect(validators.length).toEqual(1);
        expect(validators[0]).toEqual('regexp');

        validators = [];
        bv.resetForm();
        $fullName.val('Full');
        bv.validate();
        expect(validators.length).toEqual(1);
        expect(validators[0]).toEqual('stringLength');
    });
});

function betweenCompareMin() {
    var compareTo = $('#betweenForm').find('[name="minAge"]').val();
    $('#msgMin').html('betweenCompareMin() called; compare to ' + compareTo);
    return compareTo;
};

function betweenCompareMax() {
    var compareTo = $('#betweenForm').find('[name="maxAge"]').val();
    $('#msgMax').html('betweenCompareMax() called; compare to ' + compareTo);
    return compareTo;
};

TestSuite = $.extend({}, TestSuite, {
    between: {
        compareToMin: function(value, validator, $field) {
            var compareTo = $('#betweenForm').find('[name="minAge"]').val();
            $('#msgMin').html('TestSuite.between.compareToMin() called; compare to ' + compareTo);
            return compareTo;
        },

        compareToMax: function(value, validator, $field) {
            var compareTo = $('#betweenForm').find('[name="maxAge"]').val();
            $('#msgMax').html('TestSuite.between.compareToMax() called; compare to ' + compareTo);
            return compareTo;
        }
    }
});

describe('between', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="betweenForm">',
                '<div id="msgMin"></div>',
                '<div id="msgMax"></div>',
                '<div class="form-group">',
                    '<input type="text" name="minAge" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="maxAge" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="age" data-fv-between data-fv-between-min="18" data-fv-between-max="100" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#betweenForm').formValidation();

        this.fv      = $('#betweenForm').data('formValidation');
        this.$minAge = this.fv.getFieldElements('minAge');
        this.$maxAge = this.fv.getFieldElements('maxAge');
        this.$age    = this.fv.getFieldElements('age');
    });

    afterEach(function() {
        $('#betweenForm').formValidation('destroy').remove();
    });

    it('not a number', function() {
        this.$age.val('50abc');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('compare to value', function() {
        this.$age.val(10);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val(120);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val(30);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to other field', function() {
        this.fv.updateOption('age', 'between', 'min', 'minAge');
        this.fv.updateOption('age', 'between', 'max', 'maxAge');

        this.$minAge.val(2);
        this.$maxAge.val(10);
        this.$age.val(5);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$minAge.val(20);
        this.$maxAge.val(40);
        this.$age.val(50);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'between')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].between['default'], [this.$minAge.val(), this.$maxAge.val()]));
    });

    // #1048
    it('compare to other field that value has comma', function() {
        this.fv.updateOption('age', 'between', 'min', 'minAge');
        this.fv.updateOption('age', 'between', 'max', 'maxAge');

        this.$minAge.val('2,5');
        this.$maxAge.val('10,5');
        this.$age.val(5);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$minAge.val('20,5');
        this.$maxAge.val('40,5');
        this.$age.val(50);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'between')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].between['default'], [this.$minAge.val(), this.$maxAge.val()]));
    });

    it('compare to return value of a function', function() {
        this.fv.updateOption('age', 'between', 'min', 'betweenCompareMin');
        this.fv.updateOption('age', 'between', 'max', 'betweenCompareMax');

        this.$minAge.val(20);
        this.$maxAge.val(30);
        this.$age.val(18);
        this.fv.validate();
        expect($('#msgMin').html()).toEqual('betweenCompareMin() called; compare to 20');
        expect($('#msgMax').html()).toEqual('betweenCompareMax() called; compare to 30');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'between')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].between['default'], [this.$minAge.val(), this.$maxAge.val()]));

        this.fv.resetForm();
        this.$minAge.val(2);
        this.$maxAge.val(10);
        this.$age.val(6);
        this.fv.validate();
        expect($('#msgMin').html()).toEqual('betweenCompareMin() called; compare to 2');
        expect($('#msgMax').html()).toEqual('betweenCompareMax() called; compare to 10');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to return value of a namespace function', function() {
        this.fv.updateOption('age', 'between', 'min', 'TestSuite.between.compareToMin');
        this.fv.updateOption('age', 'between', 'max', 'TestSuite.between.compareToMax');

        this.$minAge.val(20);
        this.$maxAge.val(30);
        this.$age.val(40);
        this.fv.validate();
        expect($('#msgMin').html()).toEqual('TestSuite.between.compareToMin() called; compare to 20');
        expect($('#msgMax').html()).toEqual('TestSuite.between.compareToMax() called; compare to 30');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'between')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].between['default'], [this.$minAge.val(), this.$maxAge.val()]));

        this.fv.resetForm();
        this.$minAge.val(2);
        this.$maxAge.val(10);
        this.$age.val(5);
        this.fv.validate();
        expect($('#msgMin').html()).toEqual('TestSuite.between.compareToMin() called; compare to 2');
        expect($('#msgMax').html()).toEqual('TestSuite.between.compareToMax() called; compare to 10');
        expect(this.fv.isValid()).toBeTruthy();
    });
});

describe('bic', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="bicForm">',
                '<div class="form-group">',
                    '<input type="text" name="bic" data-fv-bic />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#bicForm').formValidation();

        this.fv   = $('#bicForm').data('formValidation');
        this.$bic = this.fv.getFieldElements('bic');
    });

    afterEach(function() {
        $('#bicForm').formValidation('destroy').remove();
    });

    it('invalid bic', function() {
        // Test some invalid BICs
        var invalidSamples = [
            'ASPKAT2LXX', 'ASPKAT2LX', 'ASPKAT2LXXX1', 'DABADKK', 'RZ00AT2L303',
            // Invalid fist 6 characters
            '1SBACNBXSHA', 'D2BACNBXSHA', 'DS3ACNBXSHA', 'DSB4CNBXSHA', 'DSBA5NBXSHA', 'DSBAC6BXSHA', '1S3AC6BXSHA'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$bic.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('valid bic', function() {
        // Examples see http://en.wikipedia.org/wiki/ISO_9362
        var validSamples = ['ASPKAT2LXXX', 'ASPKAT2L', 'DSBACNBXSHA', 'UNCRIT2B912', 'DABADKKK', 'RZOOAT2L303'];
        for (i in validSamples) {
            this.fv.resetForm();
            this.$bic.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });
});

function validateCaptcha(value, validator, $field) {
    var items = $('#captchaOperation').html().split(' '), sum = parseInt(items[0]) + parseInt(items[2]);
    return value === sum + '';
};

describe('callback', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="callbackForm">',
                '<div class="form-group">',
                    '<label class="col-md-3 control-label" id="captchaOperation"></label>',
                    '<div class="col-md-2">',
                        '<input type="text" class="form-control" name="captcha" />',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<div class="col-md-2 col-md-offset-3">',
                        '<input type="text" class="form-control" name="declarativeCaptcha" data-fv-callback data-fv-callback-callback="validateCaptcha" />',
                    '</div>',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#callbackForm').formValidation({
            fields: {
                captcha: {
                    validators: {
                        callback: {
                            message: 'Wrong answer',
                            callback: function(value, validator, $field) {
                                return validateCaptcha(value, validator, $field);
                            }
                        }
                    }
                }
            }
        });

        this.fv                  = $('#callbackForm').data('formValidation');
        this.$captcha            = this.fv.getFieldElements('captcha');
        this.$declarativeCaptcha = this.fv.getFieldElements('declarativeCaptcha');
    });

    afterEach(function() {
        $('#callbackForm').formValidation('destroy').remove();
    });

    it('execute the callback', function() {
        $('#captchaOperation').html('1 + 2');

        this.$captcha.val('3');
        this.fv.validate();
        expect(this.fv.isValidField('captcha')).toBeTruthy();

        this.fv.resetForm();
        this.$captcha.val('5');
        this.fv.validate();
        expect(this.fv.isValidField('captcha')).toEqual(false);
    });

    it('callback declarative', function() {
        $('#captchaOperation').html('10 + 20');

        this.$declarativeCaptcha.val('40');
        this.fv.validate();
        expect(this.fv.isValidField('declarativeCaptcha')).toEqual(false);

        this.fv.resetForm();
        this.$declarativeCaptcha.val('30');
        this.fv.validate();
        expect(this.fv.isValidField('declarativeCaptcha')).toBeTruthy();
    });
});

describe('color', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="colorForm">',
                '<div class="form-group">',
                    '<input type="text" class="form-control" name="color" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" class="form-control" name="colorMultiple" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" class="form-control" name="colorHex" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" class="form-control" name="colorRgb" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" class="form-control" name="colorRgba" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" class="form-control" name="colorHsl" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" class="form-control" name="colorHsla" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" class="form-control" name="colorKeyword" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#colorForm').formValidation({
            fields: {
                color: {
                    validators: {
                        color: { }
                    }
                },
                colorMultiple: {
                    validators: {
                        color: {
                            type: [
                                'hex',
                                'rgb'
                            ]
                        }
                    }
                },
                colorHex: {
                    validators: {
                        color: {
                            type: ['hex']
                        }
                    }
                },
                colorRgb: {
                    validators: {
                        color: {
                            type: ['rgb']
                        }
                    }
                },
                colorRgba: {
                    validators: {
                        color: {
                            type: ['rgba']
                        }
                    }
                },
                colorHsl: {
                    validators: {
                        color: {
                            type: ['hsl']
                        }
                    }
                },
                colorHsla: {
                    validators: {
                        color: {
                            type: ['hsla']
                        }
                    }
                },
                colorKeyword: {
                    validators: {
                        color: {
                            type: ['keyword']
                        }
                    }
                }
            }
        });

        this.fv             = $('#colorForm').data('formValidation');
        this.$color         = this.fv.getFieldElements('color');
        this.$colorMultiple = this.fv.getFieldElements('colorMultiple');
        this.$colorHex      = this.fv.getFieldElements('colorHex');
        this.$colorRgb      = this.fv.getFieldElements('colorRgb');
        this.$colorRgba     = this.fv.getFieldElements('colorRgba');
        this.$colorHsl      = this.fv.getFieldElements('colorHsl');
        this.$colorHsla     = this.fv.getFieldElements('colorHsla');
        this.$colorKeyword  = this.fv.getFieldElements('colorKeyword');
    });

    afterEach(function() {
        $('#colorForm').formValidation('destroy').remove();
    });

    // Start hsla() tests
    it('Run hsla() test suite on hsla only field', function() {
        this.$colorHsla.val('hsla(120,50%,50%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsla.val('hsla( 120 , 50% , 50%, 1 )');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsla.val('hsla(  120,  50%,       50% ,   1  )');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsla.val('hsla(-120,50%,50%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsla.val('hsla(480,50%,50%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,0)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,0.5)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,.5)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,.524141)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,2)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,-1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,1.000000000001)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,-0.5)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,100%,2.3)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(10,-50%,50%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(10,50%,-50%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('120,50%,50%,1');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,100%,101%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla (120,50%,50%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val(' hsla(120,50%,50%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120,50%,50%,1) ');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(50%, 50%, 100%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120, 50, 100%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsla.val('hsla(120, 50%, 100,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);
    });

    // Start hsl() tests
    it('Run hsl() test suite on hsl only field', function() {
        this.$colorHsl.val('hsl(120,50%,50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsl.val('hsl( 120 , 50% , 50% )');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsl.val('hsl(  120,  50%,       50%  )');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsl.val('hsl(-120,50%,50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsl.val('hsl(480,50%,50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toBeTruthy();

        this.fv.resetForm();
        this.$colorHsl.val('hsl(10,-50%,50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsl.val('hsl(10,50%,-50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsl.val('120,50%,50%');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsl.val('hsl(120,100%,101%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsl.val('hsl (120,50%,50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsl.val(' hsl(120,50%,50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsl.val('hsl(120,50%,50%) ');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsl.val('hsl(50%, 50%, 100%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsl.val('hsl(120, 50, 100%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);

        this.fv.resetForm();
        this.$colorHsl.val('hsl(120, 50%, 100)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);
    });

    // Start keyword test
    it('Run keyword test suite on keyword only field', function() {
        this.$colorKeyword.val('transparent');
        this.fv.validate();
        expect(this.fv.isValidField('colorKeyword')).toBeTruthy();

        this.fv.resetForm();
        this.$colorKeyword.val('transparent');
        this.fv.validate();
        expect(this.fv.isValidField('colorKeyword')).toBeTruthy();

        this.fv.resetForm();
        this.$colorKeyword.val('blueviolet red');
        this.fv.validate();
        expect(this.fv.isValidField('colorKeyword')).toEqual(false);

        this.fv.resetForm();
        this.$colorKeyword.val('shady');
        this.fv.validate();
        expect(this.fv.isValidField('colorKeyword')).toEqual(false);

        this.fv.resetForm();
        this.$colorKeyword.val('blueish');
        this.fv.validate();
        expect(this.fv.isValidField('colorKeyword')).toEqual(false);
    });

    // Start rgba() test
    it('Run rgba() test suite on rgba only field', function() {
        this.$colorRgba.val('rgba(255,255,255,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba( 255 , 255 , 255 , 1 )');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(  255  ,  255    ,       255 ,  1     )');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(100%,100%,100%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,0)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,0.5)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,.5)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,.524141)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(100%,100%,100%,0)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(100%,100%,100%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(100%,100%,100%,0.5)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(100%,100%,100%,.5)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(100%,100%,100%,.524141)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgba.val('rgba(100%,100%,100%,50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,2)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,-1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,1.000000000001)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,-0.5)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,2.3)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,100%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(-10,255,255,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(-10%,100%,100%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('255,255,255,1');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,256),1');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(100%,100%,101%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba (255,255,255,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val(' rgba(255,255,255,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgba.val('rgba(255,255,255,1) ');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);
    });

    // Start rgb() test
    it('Run rgb() test suite on rgb only field', function() {
        this.$colorRgb.val('rgb(255,255,255)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgb.val('rgb( 255 , 255 , 255 )');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgb.val('rgb(  255,  255,       255  )');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgb.val('rgb(255,255,255)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgb.val('rgb(100%,100%,100%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toBeTruthy();

        this.fv.resetForm();
        this.$colorRgb.val('rgb(255,255,100%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgb.val('rgb(-10,255,255)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgb.val('rgb(-10%,100%,100%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgb.val('255,255,255');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgb.val('rgb(255,255,256)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgb.val('rgb(100%,100%,101%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgb.val('rgb (255,255,255)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgb.val(' rgb(255,255,255)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toEqual(false);

        this.fv.resetForm();
        this.$colorRgb.val('rgb(255,255,255) ');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toEqual(false);
    });

    /* Run individual tests */
    it('Individual field keyword: accept keyword', function() {
        this.$colorKeyword.val('blue');
        this.fv.validate();
        expect(this.fv.isValidField('colorKeyword')).toBeTruthy();
    });

    it('Individual field keyword: reject rgb', function() {
        this.$colorKeyword.val('rgb(255,255,255)');
        this.fv.validate();
        expect(this.fv.isValidField('colorKeyword')).toEqual(false);
    });

    it('Individual field hex: accept 6 char hex', function() {
        this.$colorHex.val('#0000FF');
        this.fv.validate();
        expect(this.fv.isValidField('colorHex')).toBeTruthy();
    });

    it('Individual field hex: accept 3 char hex', function() {
        this.$colorHex.val('#00F');
        this.fv.validate();
        expect(this.fv.isValidField('colorHex')).toBeTruthy();
    });
    it('Individual field hex: reject keyword', function() {
        this.$colorHex.val('blue');
        this.fv.validate();
        expect(this.fv.isValidField('colorHex')).toEqual(false);
    });

    it('Individual field rgb(): accept rgb()', function() {
        this.$colorRgb.val('rgb(255,255,255)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toBeTruthy();
    });

    it('Individual field rgb(): reject hex', function() {
        this.$colorRgb.val('#0000FF');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgb')).toEqual(false);
    });

    it('Individual field rgba(): accept rgba()', function() {
        this.$colorRgba.val('rgba(255,255,255,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toBeTruthy();
    });

    it('Individual field rgba(): reject rgb()', function() {
        this.$colorRgba.val('rgb(255,255,255)');
        this.fv.validate();
        expect(this.fv.isValidField('colorRgba')).toEqual(false);
    });

    it('Individual field hsl(): accept hsl()', function() {
        this.$colorHsl.val('hsl(120,50%,50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toBeTruthy();
    });

    it('Individual field hsl(): reject rgba()', function() {
        this.$colorHsl.val('rgba(255,255,255,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsl')).toEqual(false);
    });

    it('Individual field hsla(): accept hsla()', function() {
        this.$colorHsla.val('hsla(120,50%,50%,1)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toBeTruthy();
    });

    it('Individual field hsla(): reject hsl()', function() {
        this.$colorHsla.val('hsl(120,50%,50%)');
        this.fv.validate();
        expect(this.fv.isValidField('colorHsla')).toEqual(false);
    });

    /* Run validation message tests */
    it('Validation message tests', function() {
        this.$color.val('notacolor');
        this.fv.validate();
        expect(this.fv.isValidField('color')).toEqual(false);
        expect(this.fv.getMessages(this.$color, 'color')[0]).toEqual(FormValidation.I18n[this.fv.getLocale()].color.default);
    });
});

describe('creditCard', function() {
    // Get the fake credit card number at http://www.getcreditcardnumbers.com/

    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="ccForm">',
                    '<div class="form-group">',
                        '<input type="text" name="cc" data-fv-creditcard />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#ccForm').formValidation();

        this.fv          = $('#ccForm').data('formValidation');
        this.$creditCard = this.fv.getFieldElements('cc');
    });

    afterEach(function() {
        $('#ccForm').formValidation('destroy').parent().remove();
    });

    it('accept spaces', function() {
        this.$creditCard.val('5267 9789 9451 9654');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('accept dashes', function() {
        this.$creditCard.val('6011-2649-6840-4521');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('invalid format', function() {
        this.$creditCard.val('4539.1870.2954.3862');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toEqual(false);
    });

    it('American Express', function() {
        this.$creditCard.val('340653705597107');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('American Express invalid length', function() {
        this.$creditCard.val('3744148309166730');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toEqual(false);
    });

    it('American Express invalid prefix', function() {
        this.$creditCard.val('356120148436654');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toEqual(false);
    });

    it('Diners Club', function() {
        this.$creditCard.val('30130708434187');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Diners Club (US)', function() {
        this.$creditCard.val('5517479515603901');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Discover', function() {
        this.$creditCard.val('6011734674929094');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('JCB', function() {
        this.$creditCard.val('3566002020360505');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Laser', function() {
        this.$creditCard.val('6304 9000 1774 0292 441');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Maestro', function() {
        this.$creditCard.val('6762835098779303');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Mastercard', function() {
        this.$creditCard.val('5303765013600904');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Solo', function() {
        this.$creditCard.val('6334580500000000');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Visa', function() {
        this.$creditCard.val('4929248980295542');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toBeTruthy();
    });

    it('Visa invalid check digit', function() {
        this.$creditCard.val('4532599916257826');
        this.fv.validate();
        expect(this.fv.isValidField('cc')).toEqual(false);
    });
});

describe('cusip', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="cusipForm">',
                '<div class="form-group">',
                    '<input type="text" name="cusip" data-fv-cusip />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');
        $('#cusipForm').formValidation();

        this.fv     = $('#cusipForm').data('formValidation');
        this.$cusip = this.fv.getFieldElements('cusip');
    });

    afterEach(function() {
        $('#cusipForm').formValidation('destroy').remove();
    });

    it('valid', function() {
        var samples = ['037833100', '931142103', '14149YAR8', '126650BG6'];

        for (var i in samples) {
            this.fv.resetForm();
            this.$cusip.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('cusip')).toBeTruthy();
        }
    });

    it('invalid', function() {
        var samples = ['31430F200', '022615AC2'];

        for (var i in samples) {
            this.fv.resetForm();
            this.$cusip.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('cusip')).toEqual(false);
        }
    });
});

function getDate(value, validator, $field) {
    return validator.getFieldElements('date').val();
};

TestSuite = $.extend({}, TestSuite, {
    Date: {
        getDate: function(value, validator, $field) {
            return validator.getFieldElements('date').val();
        }
    }
});

describe('date', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="dateForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="date" data-fv-date />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="minDate" data-fv-date data-fv-date-min="" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="maxDate" data-fv-date data-fv-date-max="" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="range" data-fv-date data-fv-date-min="" data-fv-date-max="" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#dateForm').formValidation();

        this.fv       = $('#dateForm').data('formValidation');
        this.$date    = this.fv.getFieldElements('date');
        this.$minDate = this.fv.getFieldElements('minDate');
        this.$maxDate = this.fv.getFieldElements('maxDate');
        this.$range   = this.fv.getFieldElements('range');
    });

    afterEach(function() {
        $('#dateForm').formValidation('destroy').remove();
    });

    it('YYYY/MM/DD', function() {
        this.fv.updateOption('date', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2000/01/30');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        // Invalid year
        this.fv.resetForm();
        this.$date.val('100/10/20');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Invalid month
        this.fv.resetForm();
        this.$date.val('2000/00/10');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2000/15/10');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Invalid day
        this.fv.resetForm();
        this.$date.val('2000/03/00');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2000/10/32');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Negative number
        this.fv.resetForm();
        this.$date.val('-2000/10/20');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2000/-10/20');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2000/10/-20');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Consist invalid characters
        // Issue #310
        this.fv.resetForm();
        this.$date.val('aaaa/');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2004df/1dd1/5ffg');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Issue #475
        this.fv.resetForm();
        this.$date.val('2014/09');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2014/09/');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2014//15');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('/09/15');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('MM/DD/YYYY', function() {
        this.fv.updateOption('date', 'date', 'format', 'MM/DD/YYYY');

        this.$date.val('09/15/2020');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('09/15');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('09/15/');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    // #1102
    it('YYYY-MM-DD h:m', function() {
        this.fv.updateOption('date', 'date', 'format', 'YYYY-MM-DD h:m');

        this.$date.val('2014-11-1 23:10');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014-11-1 23:');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    // support#44
    // Support dot (.) as separator for European countries
    it('support dot separator', function() {
        this.fv.updateOption('date', 'date', 'format', 'DD.MM.YYYY');

        this.$date.val('05.11.2014');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('5.1.2014');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        // Invalid date
        this.fv.resetForm();
        this.$date.val('32.11.2014');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('29.02.2001');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Invalid month
        this.fv.resetForm();
        this.$date.val('5.14.2014');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        // Invalid year
        this.fv.resetForm();
        this.$date.val('05.11.14');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('number of days in February', function() {
        this.fv.updateOption('date', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2000/02/28');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2000/02/29');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2001/02/29');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    // Issue #681
    it('date, month, year are prefixed by zero', function() {
        this.fv.updateOption('date', 'date', 'format', 'MM/DD/YYYY');

        this.$date.val('0012/08/2014');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('12/0008/2014');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('12/08/002014');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('12/08/2014');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('hours, minutes, seconds are prefixed by zero', function() {
        this.fv.updateOption('date', 'date', 'format', 'YYYY/MM/DD h:m:s');

        this.$date.val('2014/08/17 0007:30:00');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2014/08/17 07:030:00');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2014/08/17 07:30:0000');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$date.val('2014/08/17 07:30:00');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    // min test suite
    it('min date format YYYY/MM/DD', function() {
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');
        this.fv.updateOption('minDate', 'date', 'min', '2010/01/01');

        this.$minDate.val('2010/01/02');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2010/01/002'); // day prefexid by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2009/12/31');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2000/01/01');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);
    });

    it('min date format YYYY-MM-DD', function() {
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY-MM-DD');
        this.fv.updateOption('minDate', 'date', 'min', '2010-01-01');

        this.$minDate.val('2010-01-02');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2010-001-02'); // month prefexid by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2014-08-17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2009-12-31');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2000-01-01');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);
    });

    it('min date format DD/MM/YYYY', function() {
        this.fv.updateOption('minDate', 'date', 'format', 'DD/MM/YYYY');
        this.fv.updateOption('minDate', 'date', 'min', '01/01/2010');

        this.$minDate.val('02/01/2010');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('17/08/2014');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('02/01/02010'); // year prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('31/12/2009');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('01/01/2000');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);
    });

    it('min date format YYYY-MM-DD h:m:s', function() {
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY-MM-DD h:m:s');
        this.fv.updateOption('minDate', 'date', 'min', '2010-01-01 01:00:00');

        this.fv.resetForm();
        this.$minDate.val('2010-01-01 01:00:01');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.$minDate.val('2010-01-02 01:00:01');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2014-08-17 12:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2009-12-31 00:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2009-12-31 010:00:00'); // hours prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2009-12-31 10:001:00'); // minutes prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2009-12-31 10:01:012'); // seconds prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2009-12-31 00:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);

        this.fv.resetForm();
        this.$minDate.val('2000-01-01 23:00:12');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toEqual(false);
    });

    // max test suite
    it('max date format YYYY/MM/DD', function() {
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');
        this.fv.updateOption('maxDate', 'date', 'max', '2014/09/10');

        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('02014/012/031'); // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2014/12/31');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2015/01/01');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);
    });

    it('max date format YYYY-MM-DD', function() {
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY-MM-DD');
        this.fv.updateOption('maxDate', 'date', 'max', '2014-09-10');

        this.$maxDate.val('2014-09-09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014-08-17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('02014-012-031');  // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2014-12-31');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2015-01-01');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);
    });

    it('max date format DD/MM/YYYY', function() {
        this.fv.updateOption('maxDate', 'date', 'format', 'DD/MM/YYYY');
        this.fv.updateOption('maxDate', 'date', 'max', '10/09/2014');

        this.$maxDate.val('09/09/2014');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('17/08/2014');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('031/012/02014'); // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('31/12/2014');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('01/01/2015');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);
    });

    it('max date format YYYY-MM-DD h:m:s', function() {
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY-MM-DD h:m:s');
        this.fv.updateOption('maxDate', 'date', 'max', '2014-09-10 01:00:00');

        this.$maxDate.val('2014-09-09 01:00:01');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014-08-17 12:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014-09-09 001:001:001'); // hours, minutes or seconds prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2014-12-31 00:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);

        this.fv.resetForm();
        this.$maxDate.val('2015-01-01 23:00:12');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toEqual(false);
    });

    // range test suite
    it('range format YYYY/MM/DD', function() {
        this.fv.updateOption('range', 'date', 'format', 'YYYY/MM/DD');
        this.fv.updateOption('range', 'date', 'min', '2010/09/10');
        this.fv.updateOption('range', 'date', 'max', '2014/09/10');

        this.$range.val('2011/01/01');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('02014/001/031'); // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2010/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2014/09/11');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);
    });

    it('range format YYYY-MM-DD', function() {
        this.fv.updateOption('range', 'date', 'format', 'YYYY-MM-DD');
        this.fv.updateOption('range', 'date', 'min', '2010-09-10');
        this.fv.updateOption('range', 'date', 'max', '2014-09-10');

        this.$range.val('2012-01-12');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2014-09-09');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('02014-003-031');  // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2009-12-31');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2015-01-01');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);
    });

    it('range format DD/MM/YYYY', function() {
        this.fv.updateOption('range', 'date', 'format', 'DD/MM/YYYY');
        this.fv.updateOption('range', 'date', 'min', '10/09/2010');
        this.fv.updateOption('range', 'date', 'max', '10/09/2014');

        this.$range.val('11/11/2011');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('17/08/2014');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('031/012/02013'); // year, month or day prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('31/01/2010');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('25/03/2015');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);
    });

    it('range format YYYY-MM-DD h:m:s', function() {
        this.fv.updateOption('range', 'date', 'format', 'YYYY-MM-DD h:m:s');
        this.fv.updateOption('range', 'date', 'min', '2010-05-15 22:00:00');
        this.fv.updateOption('range', 'date', 'max', '2015-05-15 22:00:00');

        this.$range.val('2012-07-17 01:00:01');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2013-08-17 12:00:00');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2011-06-19 001:001:001'); // hours, minutes or seconds prefixed by 0 not allowed
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2008-11-27 23:15:00');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);

        this.fv.resetForm();
        this.$range.val('2015-05-15 22:00:01');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toEqual(false);
    });

    // dynamic min option
    it('dynamic min: name of field', function() {
        this.$minDate.attr('data-fv-date-min', 'date');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/09/08');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('dynamic min: callback declarative function', function() {
        this.$minDate.attr('data-fv-date-min', 'getDate');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/10/01');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('dynamic min: callback declarative function()', function() {
        this.$minDate.attr('data-fv-date-min', 'getDate()');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/10/01');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('dynamic min: callback declarative A.B.C', function() {
        this.$minDate.attr('data-fv-date-min', 'TestSuite.Date.getDate');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/10/01');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('dynamic min: callback declarative A.B.C()', function() {
        this.$minDate.attr('data-fv-date-min', 'TestSuite.Date.getDate()');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/10/01');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('dynamic min: callback programmatically', function() {
        this.$minDate.removeAttr('data-fv-date-min');
        this.fv.destroy();
        this.fv = $('#dateForm')
                        .formValidation({
                            fields: {
                                minDate: {
                                    validators: {
                                        date: {
                                            min: function(value, validator, $field) {
                                                return getDate(value, validator, $field);
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        .data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2014/09/08');
        this.$minDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/10/01');
        this.$minDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    // dynamic max option
    it('dynamic max: name of field', function() {
        this.$maxDate.attr('data-fv-date-max', 'date');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    it('dynamic max: callback declarative function', function() {
        this.$maxDate.attr('data-fv-date-max', 'getDate');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    it('dynamic max: callback declarative function()', function() {
        this.$maxDate.attr('data-fv-date-max', 'getDate()');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    it('dynamic max: callback declarative A.B.C', function() {
        this.$maxDate.attr('data-fv-date-max', 'TestSuite.Date.getDate');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    it('dynamic max: callback declarative A.B.C()', function() {
        this.$maxDate.attr('data-fv-date-max', 'TestSuite.Date.getDate()');
        this.fv.destroy();
        this.fv = $('#dateForm').formValidation().data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    it('dynamic max: callback programmatically', function() {
        this.$maxDate.removeAttr('data-fv-date-max');
        this.fv.destroy();
        this.fv = $('#dateForm')
                        .formValidation({
                            fields: {
                                maxDate: {
                                    validators: {
                                        date: {
                                            max: function(value, validator, $field) {
                                                return getDate(value, validator, $field);
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        .data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$date.val('2015/01/01');
        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$date.val('2014/01/01');
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeFalsy();
    });

    // #1258: Using a Date object as value for the min or the max option
    // min
    it('min using a date object', function() {
        this.$minDate.removeAttr('data-fv-date-min');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    minDate: {
                        validators: {
                            date: {
                                min: new Date()
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$minDate.val('2018/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2019/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2011/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    it('min using a date object: callback programmatically', function() {
        this.$minDate.removeAttr('data-fv-date-min');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    minDate: {
                        validators: {
                            date: {
                                min: function(value, validator, $field) {
                                    return new Date();
                                }
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('minDate', 'date', 'format', 'YYYY/MM/DD');

        this.$minDate.val('2018/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2019/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeTruthy();

        this.fv.resetForm();
        this.$minDate.val('2011/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('minDate')).toBeFalsy();
    });

    // max
    it('max using a date object', function() {
        this.$maxDate.removeAttr('data-fv-date-max');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    maxDate: {
                        validators: {
                            date: {
                                max:  new Date()
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();
    });

    it('max using a date object: callback programmatically', function() {
        this.$maxDate.removeAttr('data-fv-date-max');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    maxDate: {
                        validators: {
                            date: {
                                max: function(value, validator, $field) {
                                    return new Date();
                                }
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('maxDate', 'date', 'format', 'YYYY/MM/DD');

        this.$maxDate.val('2014/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();

        this.fv.resetForm();
        this.$maxDate.val('2014/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('maxDate')).toBeTruthy();
    });

    // Range
    it('range using a date object', function() {
        this.$range.removeAttr('data-fv-date-min');
        this.$range.removeAttr('data-fv-date-max');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    range: {
                        validators: {
                            date: {
                                min: new Date(),
                                max: new Date(2015, 11, 31, 0, 0, 0, 0)
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('range', 'date', 'format', 'YYYY/MM/DD');

        this.$range.val('2015/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2015/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();
    });

    it('range using a date object: callback programmatically', function() {
        this.$range.removeAttr('data-fv-date-min');
        this.$range.removeAttr('data-fv-date-max');
        this.fv.destroy();
        this.fv = $('#dateForm')
            .formValidation({
                fields: {
                    range: {
                        validators: {
                            date: {
                                min: function(value, validator, $field) {
                                    return new Date();
                                },
                                max: function(value, validator, $field) {
                                    return new Date(2015, 11, 31, 0, 0, 0, 0);
                                }
                            }
                        }
                    }
                }
            })
            .data('formValidation');
        this.fv.updateOption('range', 'date', 'format', 'YYYY/MM/DD');

        this.$range.val('2015/09/09');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();

        this.fv.resetForm();
        this.$range.val('2015/08/17');
        this.fv.validate();
        expect(this.fv.isValidField('range')).toBeTruthy();
    });
});

describe('ean', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="eanForm">',
                    '<div class="form-group">',
                        '<input type="text" name="ean" data-fv-ean />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#eanForm').formValidation();

        this.fv   = $('#eanForm').data('formValidation');
        this.$ean = this.fv.getFieldElements('ean');
    });

    afterEach(function() {
        $('#eanForm').formValidation('destroy').parent().remove();
    });

    it('valid', function() {
        var samples = ['73513537', '9780471117094', '4006381333931'];

        for (var i in samples) {
            this.$ean.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('ean')).toBeTruthy();
        }
    });

    it('contains only digits', function() {
        this.$ean.val('123abcDEF!@#');
        this.fv.validate();
        expect(this.fv.isValidField('ean')).toEqual(false);
    });

    it('invalid length', function() {
        this.$ean.val('1234567');
        this.fv.validate();
        expect(this.fv.isValidField('ean')).toEqual(false);
    });

    it('invalid check digit', function() {
        this.$ean.val('73513536');
        this.fv.validate();
        expect(this.fv.isValidField('ean')).toEqual(false);
    });
});

describe('ein', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="einForm">',
                '<div class="form-group">',
                    '<input type="text" name="ein" data-fv-ein />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');
        $('#einForm').formValidation();

        this.fv   = $('#einForm').data('formValidation');
        this.$ein = this.fv.getFieldElements('ein');
    });

    afterEach(function() {
        $('#einForm').formValidation('destroy').remove();
    });

    it('valid', function() {
        var samples = ['01-1234567', '91-1144442', '011234567'];

        for (var i in samples) {
            this.fv.resetForm();
            this.$ein.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('invalid format', function() {
        var samples = ['123-45-6789'];

        for (var i in samples) {
            this.fv.resetForm();
            this.$ein.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('invalid campus', function() {
        var samples = ['00-1234567', '07-1144442', '49-1234567'];

        for (var i in samples) {
            this.fv.resetForm();
            this.$ein.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('campus', function() {
        $('#einForm').on('success.field.fv', function(e, data) {
            expect(data.result.campus).toEqual(data.element.attr('data-campus'));
        });

        var samples = {
            AUSTIN: '50-1234567',
            BROOKHAVEN: '04-2103594',
            SMALL_BUSINESS_ADMINISTRATION: '31-1234567'
        };

        for (var i in samples) {
            this.fv.resetForm();
            this.$ein.val(samples[i]).attr('data-campus', i);
            this.fv.validate();
        }
    });
});

describe('emailAddress', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="emailAddressForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="email-address-or-addresses" data-fv-emailaddress />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#emailAddressForm').formValidation();

        this.fv = $('#emailAddressForm').data('formValidation');
        this.$emailAddressOrAddresses = this.fv.getFieldElements('email-address-or-addresses');
    });

    afterEach(function() {
        $('#emailAddressForm').formValidation('destroy').remove();
    });

    var validEmailAddresses = [
        'admin@mailserver1',
        'niceandsimple@example.com',
        'very.common@example.com',
        'a.little.lengthy.but.fine@dept.example.com',
        'disposable.style.email.with+symbol@example.com',
        'other.email-with-dash@example.com',
        '"much.more unusual"@example.com',
        '"very.unusual.@.unusual.com"@example.com',
        '"very.(),:;<>[]\".VERY.\"very@\\ \"very\".unusual"@strange.example.com',
        '" "@example.org',
        'üñîçøðé@example.com'
    ];

    var invalidEmailAddresses = [
        // "!#$%&'*+-/=?^_`{}|~@example.org",   // This is actually passing validation; see https://github.com/formvalidation/formvalidation/issues/673
        'üñîçøðé@üñîçøðé.com',
        'Abc.example.com',
        'A@b@c@example.com',
        'a"b(c)d,e:f;gi[j\k]l@example.com',
        'just"not"right@example.com',
        'this is"not\allowed@example.com',
        'this\ still\"not\\allowed@example.com'
    ];

    var validMultipleEmailAddressesForDefaultSeparators = [
        'niceandsimple@example.com,very.common@example.com',
        'niceandsimple@example.com;very.common@example.com',
        'niceandsimple@example.com;very.common@example.com,a.little.lengthy.but.fine@dept.example.com'
    ];

    var invalidMultipleEmailAddressesForDefaultSeparators = [
        'niceandsimple@example.com+very.common@example.com',
        'niceandsimple@example.com|very.common@example.com'
    ];

    var validMultipleEmailAddressesForCommaOrDollarSignSeparators = [
        'niceandsimple@example.com,very.common@example.com',
        'niceandsimple@example.com$very.common@example.com',
        'niceandsimple@example.com,very.common@example.com$a.little.lengthy.but.fine@dept.example.com'
    ];

    var invalidMultipleEmailAddressesForCommaOrDollarSignSeparators = [
        'niceandsimple@example.com;very.common@example.com',
        'niceandsimple@example.com;very.common@example.com,a.little.lengthy.but.fine@dept.example.com'
    ];

    it('Valid email addresses (multiple=false)', function() {
        var that = this;
        $.each(validEmailAddresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid email addresses (multiple=false)', function() {
        var that = this;

        var addresses = invalidEmailAddresses
                            .concat(validMultipleEmailAddressesForDefaultSeparators)
                            .concat(invalidMultipleEmailAddressesForDefaultSeparators)
                            .concat(validMultipleEmailAddressesForCommaOrDollarSignSeparators)
                            .concat(invalidMultipleEmailAddressesForCommaOrDollarSignSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });

    it('Invalid email addresses (multiple=false,separator=/[,\$]/)', function() {
        var that = this;
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'separator', /[,;]/);

        var addresses = invalidEmailAddresses
                            .concat(validMultipleEmailAddressesForDefaultSeparators)
                            .concat(invalidMultipleEmailAddressesForDefaultSeparators)
                            .concat(validMultipleEmailAddressesForCommaOrDollarSignSeparators)
                            .concat(invalidMultipleEmailAddressesForCommaOrDollarSignSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });

    it('Valid email addresses (multiple=true)', function() {
        var that = this;
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'multiple', true);

        var addresses = validEmailAddresses
                            .concat(validMultipleEmailAddressesForDefaultSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid email addresses (multiple=true)', function() {
        var that = this;
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'multiple', true);

        var addresses = invalidEmailAddresses
                            .concat(invalidMultipleEmailAddressesForDefaultSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });

    it('Valid email addresses (multiple=true,separator=/[,\$]/)', function() {
        var that = this;
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'multiple', true);
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'separator', /[,\$]/);

        var addresses = validEmailAddresses
                            .concat(validMultipleEmailAddressesForCommaOrDollarSignSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid email addresses (multiple=true,separator=/[,\$]/)', function() {
        var that = this;
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'multiple', true);
        that.fv.updateOption('email-address-or-addresses', 'emailAddress', 'separator', /[,\$]/);

        var addresses = invalidEmailAddresses
                            .concat(invalidMultipleEmailAddressesForCommaOrDollarSignSeparators);

        $.each(addresses, function(index, emailAddress) {
            that.fv.resetForm();
            that.$emailAddressOrAddresses.val(emailAddress);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });
});

function greaterThanCompare() {
    var compareTo = $('#greaterThanForm').find('[name="minAge"]').val();
    $('#msg').html('greaterThanCompare() called; compare to ' + compareTo);
    return compareTo;
};

TestSuite = $.extend({}, TestSuite, {
    greaterThan: {
        compareTo: function(value, validator, $field) {
            var compareTo = $('#greaterThanForm').find('[name="minAge"]').val();
            $('#msg').html('TestSuite.greaterThan.compareTo() called; compare to ' + compareTo);
            return compareTo;
        }
    }
});

describe('greaterThan', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="greaterThanForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="minAge" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="age" data-fv-greaterthan data-fv-greaterthan-value="18" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#greaterThanForm').formValidation();

        this.fv      = $('#greaterThanForm').data('formValidation');
        this.$minAge = this.fv.getFieldElements('minAge');
        this.$age    = this.fv.getFieldElements('age');
    });

    afterEach(function() {
        $('#greaterThanForm').formValidation('destroy').remove();
    });

    it('not a number', function() {
        this.$age.val('20abc');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('compare to value', function() {
        this.$age.val(10);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val(20);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('value with comma separator', function() {
        this.$age.val('10,4');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val('18,678');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to other field', function() {
        this.fv.updateOption('age', 'greaterThan', 'value', 'minAge');

        this.$minAge.val(10);
        this.$age.val(20);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$minAge.val(20);
        this.$age.val(10);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'greaterThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].greaterThan['default'], this.$minAge.val()));
    });

    // #1048
    it('compare to other field that value has comma', function() {
        this.fv.updateOption('age', 'greaterThan', 'value', 'minAge');
        this.$minAge.val('10,5');
        this.$age.val(20);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$minAge.val('20,5');
        this.$age.val(10);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'greaterThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].greaterThan['default'], this.$minAge.val()));
    });

    it('compare to return value of a function', function() {
        this.fv.updateOption('age', 'greaterThan', 'value', 'greaterThanCompare');

        this.$minAge.val(20);
        this.$age.val(18);
        this.fv.validate();
        expect($('#msg').html()).toEqual('greaterThanCompare() called; compare to 20');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'greaterThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].greaterThan['default'], this.$minAge.val()));

        this.fv.resetForm();
        this.$minAge.val(18);
        this.$age.val(20);
        this.fv.validate();
        expect($('#msg').html()).toEqual('greaterThanCompare() called; compare to 18');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to return value of a namespace function', function() {
        this.fv.updateOption('age', 'greaterThan', 'value', 'TestSuite.greaterThan.compareTo');

        this.$minAge.val(20);
        this.$age.val(18);
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.greaterThan.compareTo() called; compare to 20');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'greaterThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].greaterThan['default'], this.$minAge.val()));

        this.fv.resetForm();
        this.$minAge.val(18);
        this.$age.val(20);
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.greaterThan.compareTo() called; compare to 18');
        expect(this.fv.isValid()).toBeTruthy();
    });
});

describe('iban', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="ibanForm">',
                '<div class="form-group">',
                    '<select class="form-control" name="country">',
                        '<option value="AD">Andorra</option>',
                        '<option value="AE">United Arab Emirates</option>',
                        '<option value="AL">Albania</option>',
                        '<option value="AO">Angola</option>',
                        '<option value="AT">Austria</option>',
                        '<option value="AZ">Azerbaijan</option>',
                        '<option value="BA">Bosnia and Herzegovina</option>',
                        '<option value="BE">Belgium</option>',
                        '<option value="BF">Burkina Faso</option>',
                        '<option value="BG">Bulgaria</option>',
                        '<option value="BH">Bahrain</option>',
                        '<option value="BI">Burundi</option>',
                        '<option value="BJ">Benin</option>',
                        '<option value="BR">Brazil</option>',
                        '<option value="CH">Switzerland</option>',
                        '<option value="CM">Cameroon</option>',
                        '<option value="CR">Costa Rica</option>',
                        '<option value="CV">Cape Verde</option>',
                        '<option value="CY">Cyprus</option>',
                        '<option value="CZ">Czech Republic</option>',
                        '<option value="DE">Germany</option>',
                        '<option value="DK">Denmark</option>',
                        '<option value="DO">Dominican Republic</option>',
                        '<option value="DZ">Algeria</option>',
                        '<option value="EE">Estonia</option>',
                        '<option value="ES">Spain</option>',
                        '<option value="FI">Finland</option>',
                        '<option value="FO">Faroe Islands</option>',
                        '<option value="FR">France</option>',
                        '<option value="GB">United Kingdom</option>',
                        '<option value="GE">Georgia</option>',
                        '<option value="GI">Gibraltar</option>',
                        '<option value="GL">Greenland</option>',
                        '<option value="GR">Greece</option>',
                        '<option value="GT">Guatemala</option>',
                        '<option value="HR">Croatia</option>',
                        '<option value="HU">Hungary</option>',
                        '<option value="IE">Ireland</option>',
                        '<option value="IL">Israel</option>',
                        '<option value="IR">Iran</option>',
                        '<option value="IS">Iceland</option>',
                        '<option value="IT">Italy</option>',
                        '<option value="JO">Jordan</option>',
                        '<option value="KW">Kuwait</option>',
                        '<option value="KZ">Kazakhstan</option>',
                        '<option value="LB">Lebanon</option>',
                        '<option value="LI">Liechtenstein</option>',
                        '<option value="LT">Lithuania</option>',
                        '<option value="LU">Luxembourg</option>',
                        '<option value="LV">Latvia</option>',
                        '<option value="MC">Monaco</option>',
                        '<option value="MD">Moldova</option>',
                        '<option value="ME">Montenegro</option>',
                        '<option value="MG">Madagascar</option>',
                        '<option value="MK">Macedonia</option>',
                        '<option value="ML">Mali</option>',
                        '<option value="MR">Mauritania</option>',
                        '<option value="MT">Malta</option>',
                        '<option value="MU">Mauritius</option>',
                        '<option value="MZ">Mozambique</option>',
                        '<option value="NL">Netherlands</option>',
                        '<option value="NO">Norway</option>',
                        '<option value="PK">Pakistan</option>',
                        '<option value="PL">Poland</option>',
                        '<option value="PS">Palestinian</option>',
                        '<option value="PT">Portugal</option>',
                        '<option value="QA">Qatar</option>',
                        '<option value="RO">Romania</option>',
                        '<option value="RS">Serbia</option>',
                        '<option value="SA">Saudi Arabia</option>',
                        '<option value="SE">Sweden</option>',
                        '<option value="SE">Slovenia</option>',
                        '<option value="SK">Slovakia</option>',
                        '<option value="SM">San Marino</option>',
                        '<option value="SN">Senegal</option>',
                        '<option value="TN">Tunisia</option>',
                        '<option value="TR">Turkey</option>',
                        '<option value="VG">Virgin Islands, British</option>',
                    '</select>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="iban" data-fv-iban />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#ibanForm').formValidation();

        this.fv       = $('#ibanForm').data('formValidation');
        this.$country = this.fv.getFieldElements('country');
        this.$iban    = this.fv.getFieldElements('iban');
    });

    afterEach(function() {
        $('#ibanForm').formValidation('destroy').remove();
    });

    it('not supported country', function() {
        this.$iban.val('US123456789');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('dynamic country', function() {
        this.$iban.attr('data-fv-iban-country', 'country');
        this.fv.destroy();
        this.fv = $('#ibanForm').formValidation().data('formValidation');

        this.$country.val('AT');
        this.$iban.val('AT611904300234573201');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$country.val('BG');
        this.$iban.val('HR1210010051863000160');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Albania', function() {
        this.$iban.val('AL47212110090000000235698741');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Algeria', function() {
        this.$iban.val('DZ4000400174401001050486');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Andorra', function() {
        this.$iban.val('AD1200012030200359100100');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Angola', function() {
        this.$iban.val('AO06000600000100037131174');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Austria', function() {
        this.$iban.val('AT611904300234573201');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Azerbaijan', function() {
        this.$iban.val('AZ21NABZ00000000137010001944');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Bahrain', function() {
        this.$iban.val('BH29BMAG1299123456BH00');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Belgium', function() {
        this.$iban.val('BE68539007547034');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Benin', function() {
        this.$iban.val('BJ11B00610100400271101192591');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Brazil', function() {
        this.$iban.val('BR9700360305000010009795493P1');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Bulgaria', function() {
        this.$iban.val('BG80BNBG96611020345678');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Burkina Faso', function() {
        this.$iban.val('BF1030134020015400945000643');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });
    it('Burundi', function() {
        this.$iban.val('BI43201011067444');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Cameroon', function() {
        this.$iban.val('CM2110003001000500000605306');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Cape Verde', function() {
        this.$iban.val('CV64000300004547069110176');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Costa Rica', function() {
        this.$iban.val('CR0515202001026284066');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Croatia', function() {
        this.$iban.val('HR1210010051863000160');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });
    it('Cyprus', function() {
        this.$iban.val('CY17002001280000001200527600');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Czech Republic', function() {
        this.$iban.val('CZ6508000000192000145399');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Denmark', function() {
        this.$iban.val('DK5000400440116243');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Dominican Republic', function() {
        this.$iban.val('DO28BAGR00000001212453611324');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Estonia', function() {
        this.$iban.val('EE382200221020145685');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });
    it('Faroe Islands', function() {
        this.$iban.val('FO1464600009692713');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Finland', function() {
        this.$iban.val('FI2112345600000785');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('France', function() {
        this.$iban.val('FR1420041010050500013M02606');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Guatemala', function() {
        this.$iban.val('GT82TRAJ01020000001210029690');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Georgia', function() {
        this.$iban.val('GE29NB0000000101904917');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Germany', function() {
        this.$iban.val('DE89370400440532013000');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Gibraltar', function() {
        this.$iban.val('GI75NWBK000000007099453');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Greece', function() {
        this.$iban.val('GR1601101250000000012300695');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Greenland', function() {
        this.$iban.val('GL8964710001000206');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Hungary', function() {
        this.$iban.val('HU42117730161111101800000000');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Iceland', function() {
        this.$iban.val('IS140159260076545510730339');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Iran', function() {
        this.$iban.val('IR580540105180021273113007');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Ireland', function() {
        this.$iban.val('IE29AIBK93115212345678');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Israel', function() {
        this.$iban.val('IL620108000000099999999');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Italy', function() {
        this.$iban.val('IT60X0542811101000000123456');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Ivory Coast', function() {
        this.$iban.val('CI05A00060174100178530011852');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Jordan', function() {
        this.$iban.val('JO94CBJO0010000000000131000302');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Kazakhstan', function() {
        this.$iban.val('KZ176010251000042993');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Kuwait', function() {
        this.$iban.val('KW74NBOK0000000000001000372151');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Latvia', function() {
        this.$iban.val('LV80BANK0000435195001');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Lebanon', function() {
        this.$iban.val('LB30099900000001001925579115');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Liechtenstein', function() {
        this.$iban.val('LI21088100002324013AA');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Lithuania', function() {
        this.$iban.val('LT121000011101001000');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Luxembourg', function() {
        this.$iban.val('LU280019400644750000');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Macedonia', function() {
        this.$iban.val('MK07300000000042425');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Madagascar', function() {
        this.$iban.val('MG4600005030010101914016056');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Malta', function() {
        this.$iban.val('MT84MALT011000012345MTLCAST001S');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Mauritania', function() {
        this.$iban.val('MR1300012000010000002037372');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Mauritius', function() {
        this.$iban.val('MU17BOMM0101101030300200000MUR');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Mali', function() {
        this.$iban.val('ML03D00890170001002120000447');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Moldova', function() {
        this.$iban.val('MD24AG000225100013104168');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Monaco', function() {
        this.$iban.val('MC5813488000010051108001292');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Montenegro', function() {
        this.$iban.val('ME25505000012345678951');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Mozambique', function() {
        this.$iban.val('MZ59000100000011834194157');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Netherlands', function() {
        this.$iban.val('NL91ABNA0417164300');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Norway', function() {
        this.$iban.val('NO9386011117947');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Pakistan', function() {
        this.$iban.val('PK24SCBL0000001171495101');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Palestine', function() {
        this.$iban.val('PS92PALS000000000400123456702');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Poland', function() {
        this.$iban.val('PL27114020040000300201355387');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Portugal', function() {
        this.$iban.val('PT50000201231234567890154');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Qatar', function() {
        this.$iban.val('QA58DOHB00001234567890ABCDEFG');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Romania', function() {
        this.$iban.val('RO49AAAA1B31007593840000');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('San Marino', function() {
        this.$iban.val('SM86U0322509800000000270100');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Saudi Arabia', function() {
        this.$iban.val('SA0380000000608010167519');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Senegal', function() {
        this.$iban.val('SN12K00100152000025690007542');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Serbia', function() {
        this.$iban.val('RS35260005601001611379');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Slovakia', function() {
        this.$iban.val('SK3112000000198742637541');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Slovenia', function() {
        this.$iban.val('SI56191000000123438');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Spain', function() {
        this.$iban.val('ES9121000418450200051332');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Sweden', function() {
        this.$iban.val('SE3550000000054910000003');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Switzerland', function() {
        this.$iban.val('CH9300762011623852957');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Tunisia', function() {
        this.$iban.val('TN5914207207100707129648');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Turkey', function() {
        this.$iban.val('TR330006100519786457841326');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('United Arab Emirates', function() {
        this.$iban.val('AE260211000000230064016');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('United Kingdom', function() {
        this.$iban.val('GB29NWBK60161331926819');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('Virgin Islands, British', function() {
        this.$iban.val('VG96VPVG0000012345678901');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toBeTruthy();
    });

    it('invalid checksum', function() {
        this.$iban.val('TR330006100519786457841325');
        this.fv.validate();
        expect(this.fv.isValidField('iban')).toEqual(false);
    });
});

describe('id', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="idForm">',
                '<div class="form-group">',
                    '<select class="form-control" name="country">',
                        '<option value="BA">Bosnia and Herzegovina</option>',
                        '<option value="BG">Bulgaria</option>',
                        '<option value="BR">Brazil</option>',
                        '<option value="CH">Switzerland</option>',
                        '<option value="CL">Chile</option>',
                        '<option value="CN">China</option>',
                        '<option value="CZ">Czech</option>',
                        '<option value="DK">Denmark</option>',
                        '<option value="EE">Estonia</option>',
                        '<option value="ES">Spain</option>',
                        '<option value="FI">Finland</option>',
                        '<option value="HR">Croatia</option>',
                        '<option value="IE">Ireland</option>',
                        '<option value="IS">Iceland</option>',
                        '<option value="LT">Lithuania</option>',
                        '<option value="LV">Latvia</option>',
                        '<option value="ME">Montenegro</option>',
                        '<option value="MK">Macedonia</option>',
                        '<option value="NL">Netherlands</option>',
                        '<option value="PL">Poland</option>',
                        '<option value="RO">Romania</option>',
                        '<option value="RS">Serbia</option>',
                        '<option value="SE">Sweden</option>',
                        '<option value="SI">Slovenia</option>',
                        '<option value="SK">Slovakia</option>',
                        '<option value="SM">San Marino</option>',
                        '<option value="TH">Thailand</option>',
                        '<option value="ZA">South Africa</option>',
                    '</select>',
                '</div>',
                '<div class="form-group">',
                    '<input class="form-control" type="text" name="id" data-fv-id />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#idForm').formValidation();

        /**
         * @type {FormValidation.Base}
         */
        this.fv       = $('#idForm').data('formValidation');
        this.$country = this.fv.getFieldElements('country');
        this.$id      = this.fv.getFieldElements('id');
    });

    afterEach(function() {
        $('#idForm').formValidation('destroy').remove();
    });

    it('dynamic country', function() {
        this.$id.attr('data-fv-id-country', 'country');
        this.fv.destroy();
        this.fv = $('#idForm').formValidation().data('formValidation');

        this.$country.val('BG');
        this.$id.val('7552010005');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$country.val('BR');
        this.$id.val('231.002.999-00');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Bulgarian national identification number (EGN)', function() {
        this.fv.updateOption('id', 'id', 'country', 'BG');

        // Valid samples
        var validSamples = ['7523169263', '8032056031', '803205 603 1', '8001010008', '7501020018', '7552010005', '7542011030'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['8019010008'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Brazilian national identification number (CPF)', function() {
        this.fv.updateOption('id', 'id', 'country', 'BR');

        // Valid samples
        var validSamples = ['39053344705', '11144477735', '390.533.447-05', '111.444.777-35'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '39053344705000', '390533447050000', '1114447773500000000',  // support#50
            '231.002.999-00', '000.000.000-00', '111.111.111-11', '23100299900', '00000000000', '11111111111'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Swiss Social Security Number (AHV-Nr/No AVS)', function() {
        this.fv.updateOption('id', 'id', 'country', 'CH');

        // Valid samples
        var validSamples = ['756.1234.5678.95', '7561234567895'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Chilean national identification number (RUN/RUT)', function() {
        this.fv.updateOption('id', 'id', 'country', 'CL');

        // Valid samples
        var validSamples = ['76086428-5', '22060449-7', '12531909-2','12937893-K','12937893-k'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    // #793
    it('Chinese citizen identification number', function() {
        this.fv.updateOption('id', 'id', 'country', 'CN');

        // Valid samples
        var validSamples = ['450202201409072332', '22011219930407001X', '110108601017023'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['999999199304070016', '220112190002290016', '220112199304070019', '999999601017023', '110108999999023'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Czech national identification number (RC)', function() {
        this.fv.updateOption('id', 'id', 'country', 'CZ');

        // Valid samples
        var validSamples = ['7103192745', '991231123'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['1103492745', '590312123'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Danish Personal Identification number (CPR)', function() {
        this.fv.updateOption('id', 'id', 'country', 'DK');

        // Valid samples
        var validSamples = ['2110625629', '211062-5629'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['511062-5629'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Estonian Personal Identification Code (isikukood)', function() {
        this.fv.updateOption('id', 'id', 'country', 'EE');

        // Valid samples
        var validSamples = ['37605030299'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Spanish personal identity code (DNI/NIE/CIF)', function() {
        this.fv.updateOption('id', 'id', 'country', 'ES');

        // Valid samples
        var validSamples = ['54362315K', '54362315-K', 'X2482300W', 'X-2482300W', 'X-2482300-W', 'A58818501', 'A-58818501'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['54362315Z', 'X-2482300A', 'A5881850A', 'K58818501', 'G58818507'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Finnish Personal Identity Code (HETU)', function() {
        this.fv.updateOption('id', 'id', 'country', 'FI');

        // Valid samples
        var validSamples = ['311280-888Y', '131052-308T'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['131052-308U', '310252-308Y'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Croatian personal identification number (OIB)', function() {
        this.fv.updateOption('id', 'id', 'country', 'HR');

        // Valid samples
        var validSamples = ['33392005961'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['33392005962'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Irish Personal Public Service Number (PPS)', function() {
        this.fv.updateOption('id', 'id', 'country', 'IE');

        // Valid samples
        var validSamples = ['6433435F', '6433435FT', '6433435FW', '6433435OA', '6433435IH', '1234567TW', '1234567FA'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['6433435E', '6433435VH'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Iceland national identification number (Kennitala)', function() {
        this.fv.updateOption('id', 'id', 'country', 'IS');

        // Valid samples
        var validSamples = ['120174-3399', '1201743399', '0902862349'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Lithuanian Personal Code (Asmens kodas)', function() {
        this.fv.updateOption('id', 'id', 'country', 'LT');

        // Valid samples
        var validSamples = ['38703181745'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['38703181746', '78703181745', '38703421745'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Latvian Personal Code (Personas kods)', function() {
        this.fv.updateOption('id', 'id', 'country', 'LV');

        // Valid samples
        var validSamples = ['161175-19997', '16117519997'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['161375-19997'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Dutch national identification number (BSN)', function() {
        this.fv.updateOption('id', 'id', 'country', 'NL');

        // Valid samples
        var validSamples = ['111222333', '941331490', '9413.31.490'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['111252333'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
    
    it('Polish citizen number (PESEL)', function() {
        this.fv.updateOption('id', 'id', 'country', 'PL');

        // Valid samples
        var validSamples = ['83010411457', '87123116221'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['39100413824', '36032806768', '04271113861'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Romanian numerical personal code (CNP)', function() {
        this.fv.updateOption('id', 'id', 'country', 'RO');

        // Valid samples
        var validSamples = ['1630615123457', '1800101221144'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['8800101221144', '1632215123457', '1630615123458'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Swedish personal identity number (personnummer)', function() {
        this.fv.updateOption('id', 'id', 'country', 'SE');

        // Valid samples
        var validSamples = ['8112289874', '811228-9874', '811228+9874'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['811228-9873'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Slovak national identifier number (RC)', function() {
        this.fv.updateOption('id', 'id', 'country', 'SK');

        // Valid samples
        var validSamples = ['7103192745', '991231123'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['7103192746', '1103492745'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('South African ID', function() {
        this.fv.updateOption('id', 'id', 'country', 'ZA');

        // Valid samples
        var validSamples = ['8001015009087'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['8001015009287', '8001015009086'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Thailand citizen number', function() {
        this.fv.updateOption('id', 'id', 'country', 'TH');

        // Valid samples
        var validSamples = ['7145620509547', '3688699975685', '2368719339716'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$id.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['1100800092310'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$id.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
});

describe('identical', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="identicalForm">',
                '<div class="form-group">',
                    '<input type="hidden" name="hiddenField" value="abcdef" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="a" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="b" data-fv-identical="true" data-fv-identical-field="a" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#identicalForm').formValidation();

        this.fv = $('#identicalForm').data('formValidation');
        this.$a = this.fv.getFieldElements('a');
        this.$b = this.fv.getFieldElements('b');
    });

    afterEach(function () {
        $('#identicalForm').formValidation('destroy').remove();
    });

    // #1267
    it('compare to field which does not use any validators', function() {
        this.$a.val('123');
        this.$b.val('123abc');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$a.val('123456');
        this.$b.val('123456');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);
    });

    it('compare to hidden field', function() {
        this.$b.attr('data-fv-identical-field', 'hiddenField');

        this.fv = $('#identicalForm').formValidation('destroy').formValidation().data('formValidation');
        this.$b.val('123abc');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$b.val('abcdef');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);
    });
});
describe('imo', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="imoForm">',
                '<div class="form-group">',
                    '<input type="text" name="imo" data-fv-imo />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#imoForm').formValidation();

        this.fv   = $('#imoForm').data('formValidation');
        this.$imo = this.fv.getFieldElements('imo');
    });

    afterEach(function() {
        $('#imoForm').formValidation('destroy').remove();
    });

    it('Valid IMO (upper)', function() {
        this.fv.resetForm();
        this.$imo.val('IMO 9074729');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid IMO (lower)', function() {
        this.fv.resetForm();
        this.$imo.val('imo 9074729');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Invalid IMO (bad format)', function() {
        this.fv.resetForm();
        this.$imo.val('9074729');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });

    it('Invalid IMO (bad check digit)', function() {
        this.fv.resetForm();
        this.$imo.val('IMO 9074728');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });
});

describe('ip', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="ipForm">',
                '<div class="form-group">',
                    '<input type="text" name="ipv4" data-fv-ip data-fv-ip-ipv6="false" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="ipv6" data-fv-ip data-fv-ip-ipv4="false" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="both" data-fv-ip />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#ipForm').formValidation();

        this.fv    = $('#ipForm').data('formValidation');
        this.$ipv4 = this.fv.getFieldElements('ipv4');
        this.$ipv6 = this.fv.getFieldElements('ipv6');
        this.$both = this.fv.getFieldElements('both');
    });

    afterEach(function() {
        $('#ipForm').formValidation('destroy').remove();
    });

    it('Valid ipv4', function() {
        this.$ipv4.val('0.0.0.0');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
        
        this.fv.resetForm();
        this.$ipv4.val('192.168.1.1');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
        
        this.fv.resetForm();
        this.$ipv4.val('255.255.255.255');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });
    
    it('Invalid ipv4', function() {
        this.$ipv4.val('10.168.0001.100');         // extra 0 not allowed
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv4.val('0.0.0.256');               // 256 not allowed, max is 255
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv4.val('256.255.255.255');         // max is 255.255.255.255
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv4.val('192.168. 224.0');          // internal space
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv4.val('192.168.224.0 1');         // junk after valid address
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Valid ipv6', function() {
        this.$ipv6.val('0000:0000:0000:0000:0000:0000:0000:0000');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
        
        this.fv.resetForm();
        this.$ipv6.val('fe00::1');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
        
        this.fv.resetForm();
        this.$ipv6.val('fe80::217:f2ff:fe07:ed62');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
        
        this.fv.resetForm();
        this.$ipv6.val('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });
    
    it('Invalid ipv6', function() {
        this.$ipv6.val('02001:0000:1234:0000:0000:C1C0:ABCD:0876');     // extra 0 not allowed
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv6.val('2001:0000:1234:0000:00001:C1C0:ABCD:0876');     // extra 0 not allowed
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv6.val('2001:0000:1234: 0000:0000:C1C0:ABCD:0876');    // internal space
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv6.val('2001:0000:1234:0000:0000:C1C0:ABCD:0876 0');    // junk after valid address
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv6.val('3ffe:0b00:0000:0001:0000:0000:000a');           // seven segment
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv6.val('FF02:0000:0000:0000:0000:0000:0000:0000:0001'); // nine segment
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv6.val('::1111:2222:3333:4444:5555:6666::');            // double "::"
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        
        this.fv.resetForm();
        this.$ipv6.val('3ffe:b00::1::a');                               // double "::"
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Both', function() {
        this.$both.val('255.255.255.255');                            // valid
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
        
        this.fv.resetForm();
        this.$both.val('256.0.0.0');                                  // 256 not allowed, max is 255
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$both.val('2001:0db8:0000:85a3:0000:0000:ac1f:8001');    // valid
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
        
        this.fv.resetForm();
        this.$both.val('2001:0000:1234:0000:0000:C1C0:ABCD:0876 0');  // junk after valid address
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

});
describe('isbn', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="isbnForm">',
                    '<div class="form-group">',
                        '<input type="text" name="isbn" data-fv-isbn />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#isbnForm').formValidation();

        this.fv    = $('#isbnForm').data('formValidation');
        this.$isbn = this.fv.getFieldElements('isbn');
    });

    afterEach(function() {
        $('#isbnForm').formValidation('destroy').parent().remove();
    });

    it('isbn10 hyphen', function() {
        var samples = ['99921-58-10-7', '9971-5-0210-0', '960-425-059-0', '80-902734-1-6'];

        for (var i in samples) {
            this.$isbn.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('isbn')).toBeTruthy();
        }
    });

    it('isbn10 space', function() {
        var samples = ['85 359 0277 5', '1 84356 028 3', '0 684 84328 5', '0 85131 041 9', '0 943396 04 2'];

        for (var i in samples) {
            this.$isbn.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('isbn')).toBeTruthy();
        }
    });

    it('isbn10 hyphen with X', function() {
        var samples = ['0-8044-2957-X', '0-9752298-0-X'];
        for (var i in samples) {
            this.$isbn.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('isbn')).toBeTruthy();
        }
    });

    it('isbn10 invalid check digit', function() {
        this.$isbn.val('99921-58-10-6');
        this.fv.validate();
        expect(this.fv.isValidField('isbn')).toEqual(false);
    });

    it('isbn13', function() {
        this.$isbn.val('978-0-306-40615-7');
        this.fv.validate();
        expect(this.fv.isValidField('isbn')).toBeTruthy();
    });

    it('isbn13 invalid check digit', function() {
        this.$isbn.val('978-0-306-40615-6');
        this.fv.validate();
        expect(this.fv.isValidField('isbn')).toEqual(false);
    });
});

describe('isin', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="isinForm">',
                    '<div class="form-group">',
                        '<input type="text" name="isin" data-fv-isin />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#isinForm').formValidation();

        this.fv    = $('#isinForm').data('formValidation');
        this.$isin = this.fv.getFieldElements('isin');
    });

    afterEach(function() {
        $('#isinForm').formValidation('destroy').parent().remove();
    });

    it('valid', function() {
        var samples = ['US0378331005', 'AU0000XVGZA3', 'GB0002634946'];

        for (var i in samples) {
            this.$isin.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('isin')).toBeTruthy();
        }
    });

    it('invalid country code', function() {
        this.$isin.val('AA0000XVGZA3');
        this.fv.validate();
        expect(this.fv.isValidField('isin')).toEqual(false);
    });

    it('contains only digits and alphabet', function() {
        this.$isin.val('US12345ABC@#$');
        this.fv.validate();
        expect(this.fv.isValidField('isin')).toEqual(false);
    });

    it('invalid length', function() {
        this.$isin.val('US1234567');
        this.fv.validate();
        expect(this.fv.isValidField('isin')).toEqual(false);
    });

    it('invalid check digit', function() {
        this.$isin.val('US0378331004');
        this.fv.validate();
        expect(this.fv.isValidField('isin')).toEqual(false);
    });
});

describe('ismn', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="ismnForm">',
                    '<div class="form-group">',
                        '<input type="text" name="ismn" data-fv-ismn />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#ismnForm').formValidation();

        this.fv    = $('#ismnForm').data('formValidation');
        this.$ismn = this.fv.getFieldElements('ismn');
    });

    afterEach(function() {
        $('#ismnForm').formValidation('destroy').parent().remove();
    });

    it('valid start with M', function() {
        this.$ismn.val('M230671187');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toBeTruthy();
    });

    it('valid start with 979', function() {
        this.$ismn.val('9790060115615');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toBeTruthy();
    });

    it('valid contains spaces', function() {
        this.$ismn.val('979 0 3452 4680 5');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toBeTruthy();
    });

    it('valid contains dashes', function() {
        this.$ismn.val('979-0-0601-1561-5');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toBeTruthy();
    });

    it('invalid format', function() {
        this.$ismn.val('N123456789');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toEqual(false);
    });

    it('invalid check digit', function() {
        this.$ismn.val('9790060115614');
        this.fv.validate();
        expect(this.fv.isValidField('ismn')).toEqual(false);
    });
});

describe('issn', function() {
    beforeEach(function() {
        var html = [
            '<div class="container">',
                '<form class="form-horizontal" id="issnForm">',
                    '<div class="form-group">',
                        '<input type="text" name="issn" data-fv-issn />',
                    '</div>',
                '</form>',
            '</div>'
        ].join('\n');

        $(html).appendTo('body');
        $('#issnForm').formValidation();

        this.fv    = $('#issnForm').data('formValidation');
        this.$issn = this.fv.getFieldElements('issn');
    });

    afterEach(function() {
        $('#issnForm').formValidation('destroy').parent().remove();
    });

    it('valid', function() {
        var samples = ['0378-5955', '0024-9319', '0032-1478'];

        for (var i in samples) {
            this.$issn.val(samples[i]);
            this.fv.validate();
            expect(this.fv.isValidField('issn')).toBeTruthy();
        }
    });

    it('not contains hyphen', function() {
        this.$issn.val('03785955');
        this.fv.validate();
        expect(this.fv.isValidField('issn')).toEqual(false);
    });

    it('contains only digits, X', function() {
        this.$issn.val('1234-566A');
        this.fv.validate();
        expect(this.fv.isValidField('issn')).toEqual(false);
    });

    it('invalid check sum', function() {
        this.$issn.val('0032-147X');
        this.fv.validate();
        expect(this.fv.isValidField('issn')).toEqual(false);
    });
});

function lessThanCompare() {
    var compareTo = $('#lessThanForm').find('[name="maxAge"]').val();
    $('#msg').html('lessThanCompare() called; compare to ' + compareTo);
    return compareTo;
};

TestSuite = $.extend({}, TestSuite, {
    lessThan: {
        compareTo: function(value, validator, $field) {
            var compareTo = $('#lessThanForm').find('[name="maxAge"]').val();
            $('#msg').html('TestSuite.lessThan.compareTo() called; compare to ' + compareTo);
            return compareTo;
        }
    }
});

describe('lessThan', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="lessThanForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="maxAge" />',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="age" data-fv-lessthan data-fv-lessthan-value="100" />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#lessThanForm').formValidation();

        this.fv      = $('#lessThanForm').data('formValidation');
        this.$maxAge = this.fv.getFieldElements('maxAge');
        this.$age    = this.fv.getFieldElements('age');
    });

    afterEach(function() {
        $('#lessThanForm').formValidation('destroy').remove();
    });

    it('not a number', function() {
        this.$age.val('20abc');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('value with comma separator', function() {
        this.$age.val('120,2234');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val('30,2234');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to value', function() {
        this.$age.val(120);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$age.val(30);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to other field', function() {
        this.fv.updateOption('age', 'lessThan', 'value', 'maxAge');

        this.$maxAge.val(40);
        this.$age.val(20);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$maxAge.val(20);
        this.$age.val(30);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'lessThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].lessThan['default'], this.$maxAge.val()));
    });

    // #1048
    it('compare to other field that value has comma', function() {
        this.fv.updateOption('age', 'lessThan', 'value', 'maxAge');
        this.$maxAge.val('30,5');
        this.$age.val(20);
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$maxAge.val('20,5');
        this.$age.val(30);
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'lessThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].lessThan['default'], this.$maxAge.val()));
    });

    it('compare to return value of a function', function() {
        this.fv.updateOption('age', 'lessThan', 'value', 'lessThanCompare');

        this.$maxAge.val(50);
        this.$age.val(60);
        this.fv.validate();
        expect($('#msg').html()).toEqual('lessThanCompare() called; compare to 50');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'lessThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].lessThan['default'], this.$maxAge.val()));

        this.fv.resetForm();
        this.$maxAge.val(60);
        this.$age.val(30);
        this.fv.validate();
        expect($('#msg').html()).toEqual('lessThanCompare() called; compare to 60');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('compare to return value of a namespace function', function() {
        this.fv.updateOption('age', 'lessThan', 'value', 'TestSuite.lessThan.compareTo');

        this.$maxAge.val(50);
        this.$age.val(60);
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.lessThan.compareTo() called; compare to 50');
        expect(this.fv.isValid()).toEqual(false);
        expect(this.fv.getMessages('age', 'lessThan')[0]).toEqual(FormValidation.Helper.format(FormValidation.I18n[this.fv.getLocale()].lessThan['default'], this.$maxAge.val()));

        this.fv.resetForm();
        this.$maxAge.val(60);
        this.$age.val(30);
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.lessThan.compareTo() called; compare to 60');
        expect(this.fv.isValid()).toBeTruthy();
    });
});

describe('meid', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="meidForm">',
                '<div class="form-group">',
                    '<input type="text" name="meid" data-fv-meid />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#meidForm').formValidation();

        this.fv    = $('#meidForm').data('formValidation');
        this.$meid = this.fv.getFieldElements('meid');
    });

    afterEach(function() {
        $('#meidForm').formValidation('destroy').remove();
    });

    it('Valid MEID (14 hex, check digit)', function() {
        this.fv.resetForm();
        this.$meid.val('A00000049259B16');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (14 hex, dashes, check digit)', function() {
        this.fv.resetForm();
        this.$meid.val('A0-000004-9259B1-6');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (14 hex, spaces, check digit)', function() {
        this.fv.resetForm();
        this.$meid.val('A0 000004 9259B1 6');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (18 dec, check digit)', function() {
        this.fv.resetForm();
        this.$meid.val('2936087365007037100');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (18 dec, dashes, check digit)', function() {
        this.fv.resetForm();
        this.$meid.val('29360-87365-0070-3710-0');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (18 dec, spaces, check digit)', function() {
        this.fv.resetForm();
        this.$meid.val('29360 87365 0070 3710 0');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (14 hex)', function() {
        this.fv.resetForm();
        this.$meid.val('AF0123450ABCDE');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (14 hex, dashes)', function() {
        this.fv.resetForm();
        this.$meid.val('AF-012345-0ABCDE');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (14 hex, spaces)', function() {
        this.fv.resetForm();
        this.$meid.val('AF 012345 0ABCDE');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (18 dec)', function() {
        this.fv.resetForm();
        this.$meid.val('293608736500703710');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (18 dec, dashes)', function() {
        this.fv.resetForm();
        this.$meid.val('29360-87365-0070-3710');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid MEID (18 dec, spaces)', function() {
        this.fv.resetForm();
        this.$meid.val('29360 87365 0070 3710');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Invalid MEID (14 hex, bad check digit)', function() {
        this.fv.resetForm();
        this.$meid.val('A00000049259B15');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });

    it('Invalid MEID (13 hex)', function() {
        this.fv.resetForm();
        this.$meid.val('A00000049259B');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });

    it('Invalid MEID (18 dec, bad check digit)', function() {
        this.fv.resetForm();
        this.$meid.val('2936087365007037101');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });

    it('Invalid MEID (17 dec)', function() {
        this.fv.resetForm();
        this.$meid.val('29360873650070371');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });
});

describe('phone', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="phoneForm">',
                '<div class="form-group">',
                    '<select class="form-control" name="country">',
                        '<option value="AE">United Arab Emirates</option>',
                        '<option value="BG">Bulgaria</option>',
                        '<option value="BR">Brazil</option>',
                        '<option value="CN">China</option>',
                        '<option value="CZ">Czech Republic</option>',
                        '<option value="DE">Germany</option>',
                        '<option value="DK">Denmark</option>',
                        '<option value="ES">Spain</option>',
                        '<option value="FR">France</option>',
                        '<option value="GB">United Kingdom</option>',
                        '<option value="IN">India</option>',
                        '<option value="MA">Morocco</option>',
                        '<option value="NL">Netherlands</option>',
                        '<option value="PK">Pakistan</option>',
                        '<option value="RO">Romania</option>',
                        '<option value="RU">Russia</option>',
                        '<option value="SK">Slovakia</option>',
                        '<option value="TH">Thailand</option>',
                        '<option value="US">USA</option>',
                        '<option value="VE">Venezuela</option>',
                    '</select>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="phone" data-fv-phone />',
                '</div>',
            '</form>',
        ].join('\n')).appendTo('body');

        $('#phoneForm').formValidation();

        /**
         * @type {FormValidation.Base}
         */
        this.fv       = $('#phoneForm').data('formValidation');
        this.$country = this.fv.getFieldElements('country');
        this.$phone   = this.fv.getFieldElements('phone');
    });

    afterEach(function() {
        $('#phoneForm').formValidation('destroy').remove();
    });

    it('dynamic country', function() {
        this.$phone.attr('data-fv-phone-country', 'country');
        this.fv.destroy();
        this.fv = $('#phoneForm').formValidation().data('formValidation');

        this.$country.val('BR');
        this.$phone.val('16920894635');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$country.val('FR');
        this.$phone.val('0644444444');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$country.val('GB');
        this.$phone.val('012345678900');
        this.fv.validate();
        expect(this.fv.isValid()).toBeFalsy();
    });

    it('United Arab Emirates phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'AE');

        // Valid samples
        var validSamples = [
            '00971501234567',
            '+971521234567',
            '971551234567',
            '971 56 123 4567',
            '971-50-123-4567',
            '971.4.123.4567',
            '+971 (0) 4 1234567',
            '971 (56) 1234567',
            '0551234567',
            '021234567',
            '600-540-000'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Bulgaria phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'BG');

        // Valid samples
        var validSamples = [
            '359895123456', '0898111222', '0886111222', '0875111222', '0899555555', '359898111222',
            // double 0
            '00898111222',
            // + and without + at the beginning
            '+35998111222', '098111222',
            '090012900',
            '070010007', '070043256', '35970045045', '35970045666',
            '08000700', '080088001', '080015333',
            '028700000', '030100000', '03010070', '03656745'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '01211212'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Brazil phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'BR');

        // Valid samples
        var validSamples = [
            '0800.000.00.00', '0800-000-00-00', '0800 000 00 00', '0800-00-00-00', '0800.00.00.00', '0800 00 00 00',
            '0800-000-0000', '0800 000 0000', '0800.000.0000', '08000000000',
            '1692089-4635', '16920894635', '16992089-4635', '16 99202-4635', '(16)99202-4635', '(16)92089-4635',
            '(16) 92089-4635', '(15) 4343-4343', '+55 15 3702-7523', '(+55) 15 3702-7523', '(+55)1537027523',
            '(+55)(15)3702-7523', '(+55) 15 3702-7523', '(+55) 15 99202-7523', '99202-4635', '(16) 9208-4635'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('China phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'CN');

        // Valid samples
        var validSamples = [
            '18911111111', '189 1111 1111', '189-1111-1111', '0086-18911111111', '+86-18911111111',
            '86-18911111111', '0086 18911111111', '+86 18911111111', '86 18911111111', '0086 189-1111-1111',
            '+86 189-1111-1111', '86 189-1111-1111', '02011111111', '020-11111111', '020 11111111',
            '020 1111 1111', '020-1111-1111', '0086 020 82803159', '0086-020-82803159', '0086-020-82803159',
            '+86 20 61302222-8866', '+86 20 6130-2222-8866', '+86 10 59081185'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Czech Republic phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'CZ');

        // Valid samples
        var validSamples = [
            '00420123456789', '00420 123456789', '00420 123 456 789', '00 420 123 456 789',
            '+420123456789', '+420 123456789', '+420 123 456 789', '123456789', '123 456 789'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '420123456789', '420 123456789', '420 123 456 789', '00421123456789', '00421 123456789',
            '00421 123 456 789', '00 421 123 456 789', '+421123456789', '+421 123456789',
            '+421 123 456 789'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('France phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'FR');

        // Valid samples
        var validSamples = [
            // National formats
            '0644444444', '06 44 44 44 44', '06-44-44-44-44', '06.44.44.44.44',
            // International formats
            '+33644444444', '+336.44.44.44.44', '+33 6.44.44.44.44', '0033644444444', '00336.44.44.44.44',
            '0033 6.44.44.44.44',
            // Some times
            '+33(0)644444444', '+33 (0) 644444444'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            // The separator between pairs of digits is not the same
            '06 44.44-44.44', '06 44 44-44.44', '06 44 44-4444', '06 44 44-4444',
            // Too many digits
            '06444444444444',
            // Missing leading 0
            '6644444444',
            // Too much non-numeric characters
            '06  44.44-44.44', '+33 (0)  644444444',
            // Bad parenthesis
            '(0)644444444',
            // Bad separator after the international prefix
            '+33-(0)-644444444', '+33 (0)-644444444', '+33-(0) 644444444',
            // Trailing separator
            '06.44.44.44.44.'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Germany phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'DE');

        // Valid samples
        var validSamples = ['+49(89)123456', '089-1234567', '0891234567', '0049-89-123456', '089 123456-78'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('India phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'IN');

        // Valid samples
        var validSamples = [
            '9999114011', '+919911112341', '+91 9415007327', '03598245785', '+911204312280', '1302231221'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });
    
    it('United Kingdom phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'GB');

        // Valid samples
        var validSamples = [
            // National formats
            '01611234567', '0161 123 4567', '(0161) 123 4567', '0161-123-4567',
            // International formats
            '+44 161 123 4567', '+441611234567', '+44(0)161234567', '00 44 161 1234567', '(011) 44 161 234567', '0161-158-5587',
            // Extensions
            '0161 123 4567 ext. 123', '01611234567x123', '+44161234567x123', '+44 (0) 161 1234567 ext 123'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '012345678900', // Too many digits
            '1611234567',   // Missing trunk
            '012345678',    // Not enough digits
            '123 4567',     // Missing area code
            '061 123 4567'  // Invalid area code
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Morocco phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'MA');

        // Valid samples
        var validSamples = [
            // National formats
            '0644444444', '0610245896', '0630548564', '06 44 44 44 44', '06-44-44-44-44', '06.44.44.44.44', '06 44.44-44.44',
            '0528254856', '0535484541', '05 28 44 44 44', '05-28-44.44.44', '05.28.44.44.44', '05 28.44-44.44',
            // International formats
            '+212644444444', '+2126.44.44.44.44', '+212 6.44.44.44.44', '00212644444444', '002126.44.44.44.44', '00212 6.44.44.44.44',
            // Some times
            '+212(0)644444444', '+212 (0) 644444444'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '0625468961', '0512548632', '0542564896',   // Not a valid phone numbers
            '06444444444444',                           // Too many digits
            '6644444444',                               // Missing leading 0
            '06  44.44-44.44', '+212 (0)  644444444',   // Too much non-numeric characters
            '(0)644444444'                              // Bad parenthesis
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Netherlands phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'NL');

        // Valid samples
        var validSamples = [
            // Popular formats
            '0101234567',
            '010-1234567',
            '010 - 123 45 67',
            '010 1234 567',
            '06-12345678',
            '06 123 456 78',
            '0111-123456',
            '0111 123456',

            // International notation
            '+31101234567',
            '0031101234567',
            '+31(0) 10123 4567',
            '+3110-1234567',
            '003110 1234567',
            '+316 123 456 78',
            '+31(0)6 123 45678',
            '+31111-123456',
            '0031111-123456'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '06-1234-5678',         // An extra dash is not allowed
            '06 123456789',         // Too long
            '06 1234567',           // Too short
            '+31(06) 123 45678',    // Invalid optional declaration
            '1234567'               // Without regional number
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Pakistan phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'PK');

        // Valid samples
        var validSamples = ['03336527366'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Romania phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'RO');

        // Valid samples
        var validSamples = [
            '+40213-564-864', '+40213.564.864', '+40213 564 864', '0213-564-864',
            '0213564864', '0313564864',
            '0720512346', '0730512346', '0740512346', '0750512346', '+40750512346', '+40750.512.346',
            '0760512346', '0770512346', '0780512346'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '0213/564/864', // Invalid separator
            '0413564864',   // Invalid land line number (The valid one should be +402, +403 or inside country 02 - 03)
            '0790512346'    // Invalid mobile phone number (The valid one is 072xxxxxxx - 078xxxxxxx)
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Russia phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'RU');

        // Valid samples
        var validSamples = ['+7(911)976-91-04'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('Slovakia phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'SK');

        // Valid samples
        var validSamples = [
            '00421123456789', '00421 123456789', '00421 123 456 789', '00 421 123 456 789',
            '+421123456789', '+421 123456789', '+421 123 456 789', '123456789', '123 456 789'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '421123456789', '421 123456789', '421 123 456 789', '00420123456789', '00420 123456789',
            '00420 123 456 789', '00 420 123 456 789', '+420123456789', '+420 123456789', '+420 123 456 789'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Spanish phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'ES');

        // Valid samples
        var validSamples = [
            // Landline numbers
            '912345678',
            // Special prefixes
            '900900900', '902902902',
            // Mobile numbers
            '611222333', '744555666',
            // VoIP lines
            '538564738',
            // Premium-rate services
            '806396847',

            // International versions
            '0034912345678', '0034900900900',
            '0034902902902', '0034611222333',
            '0034744555666', '0034538564738',
            '0034806396847',
            '+34912345678', '+34900900900',
            '+34902902902', '+34611222333',
            '+34744555666', '+34538564738',
            '+34806396847'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '472849284',    // Invalid prefix
            '938191230420', // Too many digits
            '938191',       // Too few digits
            '00952345754',  // Lacks international prefix
            '+745295738'    // Lacks international prefix
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('US phone number', function() {
        this.fv.updateOption('phone', 'phone', 'country', 'US');

        // Valid samples
        var validSamples = [
            '1444-555-1234', '246.555.8888', '1235554567', '(123)456-7890', '123)456.0987', '1-444-555-1234',
            '14325678901', '1(123)456-7890', '+1 246.555-8888', '+1 (123)456-7890', '+1(123)456-7890'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$phone.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = [
            '7334-12.111', 'v123.11.1111', '(23)440.4448', '123(456)7890', '0800 333333 abcdef'
        ];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$phone.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
});

describe('stringLength', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="stringLengthForm">',
                '<div class="form-group">',
                    '<input type="text" name="textCharMaxLength" data-fv-stringlength data-fv-stringlength-max="10" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaCharMaxLength" data-fv-stringlength data-fv-stringlength-max="10"></textarea>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="textUTF8BytesMaxLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-max="10" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaUTF8BytesMaxLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-max="10"></textarea>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="textCharMinLength" data-fv-stringlength data-fv-stringlength-min="5" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaCharMinLength" data-fv-stringlength data-fv-stringlength-min="5"></textarea>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="textUTF8BytesMinLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-min="5" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaUTF8BytesMinLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-min="5"></textarea>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="textCharMinMaxLength" data-fv-stringlength data-fv-stringlength-min="5" data-fv-stringlength-max="10" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaCharMinMaxLength" data-fv-stringlength data-fv-stringlength-min="5" data-fv-stringlength-max="10"></textarea>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="textUTF8BytesMinMaxLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-min="5" data-fv-stringlength-max="10" />',
                '</div>',
                '<div class="form-group">',
                    '<textarea name="textareaUTF8BytesMinMaxLength" data-fv-stringlength data-fv-stringlength-utf8bytes="true" data-fv-stringlength-min="5" data-fv-stringlength-max="10"></textarea>',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#stringLengthForm').formValidation();

        this.fv                             = $('#stringLengthForm').data('formValidation');
        this.$textCharMaxLength             = this.fv.getFieldElements('textCharMaxLength');
        this.$textareaCharMaxLength         = this.fv.getFieldElements('textareaCharMaxLength');
        this.$textUTF8BytesMaxLength        = this.fv.getFieldElements('textUTF8BytesMaxLength');
        this.$textareaUTF8BytesMaxLength    = this.fv.getFieldElements('textareaUTF8BytesMaxLength');
        this.$textCharMinLength             = this.fv.getFieldElements('textCharMinLength');
        this.$textareaCharMinLength         = this.fv.getFieldElements('textareaCharMinLength');
        this.$textUTF8BytesMinLength        = this.fv.getFieldElements('textUTF8BytesMinLength');
        this.$textareaUTF8BytesMinLength    = this.fv.getFieldElements('textareaUTF8BytesMinLength');
        this.$textCharMinMaxLength          = this.fv.getFieldElements('textCharMinMaxLength');
        this.$textareaCharMinMaxLength      = this.fv.getFieldElements('textareaCharMinMaxLength');
        this.$textUTF8BytesMinMaxLength     = this.fv.getFieldElements('textUTF8BytesMinMaxLength');
        this.$textareaUTF8BytesMinMaxLength = this.fv.getFieldElements('textareaUTF8BytesMinMaxLength');
    });

    afterEach(function() {
        $('#stringLengthForm').formValidation('destroy').remove();
    });

    it('Valid max lengths', function() {
        this.$textCharMaxLength.val('123456789♥');
        this.$textareaCharMaxLength.val('123456789♥');
        this.$textUTF8BytesMaxLength.val('1234567♥');
        this.$textareaUTF8BytesMaxLength.val('1234567♥');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid min lengths', function() {
        this.$textCharMinLength.val('1234♥');
        this.$textareaCharMinLength.val('1234♥');
        this.$textUTF8BytesMinLength.val('12♥');
        this.$textareaUTF8BytesMinLength.val('12♥');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Valid min and max lengths', function() {
        this.$textCharMinMaxLength.val('1234♥');
        this.$textareaCharMinMaxLength.val('1234♥');
        this.$textUTF8BytesMinMaxLength.val('12♥');
        this.$textareaUTF8BytesMinMaxLength.val('12♥');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$textCharMinMaxLength.val('123456789♥');
        this.$textareaCharMinMaxLength.val('123456789♥');
        this.$textUTF8BytesMinMaxLength.val('1234567♥');
        this.$textareaUTF8BytesMinMaxLength.val('1234567♥');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('Invalid max lengths', function() {
        this.$textCharMaxLength.val('1234567890♥');           // 11 chars when max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaCharMaxLength.val('1234567890♥');       // 11 chars when max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textUTF8BytesMaxLength.val('12345678♥');        // 11 UTF-8 bytes when max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaUTF8BytesMaxLength.val('12345678♥');    // 11 UTF-8 bytes when max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Invalid min lengths', function() {
        this.$textCharMinLength.val('123♥');                  // 4 chars when min is 5
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaCharMinLength.val('123♥');              // 4 chars when min is 5
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textUTF8BytesMinLength.val('1♥');               // 4 UTF-8 bytes when min is 5
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaUTF8BytesMinLength.val('1♥');           // 4 UTF-8 bytes when min is 5
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Invalid min and max lengths', function() {
        this.$textCharMinMaxLength.val('123♥');               // 4 chars when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaCharMinMaxLength.val('123♥');           // 4 chars when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textUTF8BytesMinMaxLength.val('1♥');            // 4 UTF-8 bytes when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaUTF8BytesMinMaxLength.val('1♥');        // 4 UTF-8 bytes when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textCharMinMaxLength.val('1234567890♥');        // 11 chars when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaCharMinMaxLength.val('1234567890♥');    // 11 chars when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textUTF8BytesMinMaxLength.val('12345678♥');     // 11 UTF-8 bytes when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textareaUTF8BytesMinMaxLength.val('12345678♥'); // 11 UTF-8 bytes when min is 5 and max is 10
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('trim option', function() {
        this.fv.updateOption('textCharMaxLength', 'stringLength', 'trim', false);
        this.$textCharMaxLength.val('');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);

        this.fv.resetForm();
        this.$textCharMaxLength.val('           ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$textCharMaxLength.val('1234567890   ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.updateOption('textCharMaxLength', 'stringLength', 'trim', true);
        this.fv.resetForm();
        this.$textCharMaxLength.val('   ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);

        this.fv.resetForm();
        this.$textCharMaxLength.val('                ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);

        this.fv.resetForm();
        this.$textCharMaxLength.val('  0123456789   ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(true);

        this.fv.resetForm();
        this.$textCharMaxLength.val('  01234567890  ');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });
});

describe('uri', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="uriForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<input type="text" name="uri" data-fv-uri />',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#uriForm').formValidation();

        this.fv   = $('#uriForm').data('formValidation');
        this.$uri = this.fv.getFieldElements('uri');
    });

    afterEach(function() {
        $('#uriForm').formValidation('destroy').remove();
    });

    var validGlobalURIs = [
        'http://foo.com/blah_blah',
        'http://foo.com/blah_blah',
        'http://foo.com/blah_blah/',
        'http://foo.com/blah_blah_(wikipedia)',
        'http://foo.com/blah_blah_(wikipedia)_(again)',
        'http://www.example.com/wpstyle/?p=364',
        'https://www.example.com/foo/?bar=baz&inga=42&quux',
        'http://✪df.ws/123',
        'http://userid:password@example.com:8080',
        'http://userid:password@example.com:8080/',
        'http://userid@example.com',
        'http://userid@example.com/',
        'http://userid@example.com:8080',
        'http://userid@example.com:8080/',
        'http://userid:password@example.com',
        'http://userid:password@example.com/',
        'http://142.42.1.1/',
        'http://142.42.1.1:8080/',
        'http://➡.ws/䨹',
        'http://⌘.ws',
        'http://⌘.ws/',
        'http://foo.com/blah_(wikipedia)#cite-1',
        'http://foo.com/blah_(wikipedia)_blah#cite-1',
        'http://foo.com/unicode_(✪)_in_parens',
        'http://foo.com/(something)?after=parens',
        'http://☺.damowmow.com/',
        'http://code.google.com/events/#&product=browser',
        'http://j.mp',
        'ftp://foo.bar/baz',
        'http://foo.bar/?q=Test%20URL-encoded%20stuff',
        'http://مثال.إختبار',
        'http://例子.测试',
        'http://उदाहरण.परीक्षा',
        "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
        'http://1337.net',
        'http://a.b-c.de',
        'http://223.255.255.254'
    ];

    var validEmptyProtocolURIs = [
        'foo.com/blah_blah',
        'foo.com/blah_blah',
        'foo.com/blah_blah/',
        'foo.com/blah_blah_(wikipedia)',
        'foo.com/blah_blah_(wikipedia)_(again)',
        'www.example.com/wpstyle/?p=364',
        'www.example.com/foo/?bar=baz&inga=42&quux',
        '✪df.ws/123',
        'userid:password@example.com:8080',
        'userid:password@example.com:8080/',
        'userid@example.com',
        'userid@example.com/',
        'userid@example.com:8080',
        'userid@example.com:8080/',
        'userid:password@example.com',
        'userid:password@example.com/',
        '142.42.1.1/',
        '142.42.1.1:8080/',
        '➡.ws/䨹',
        '⌘.ws',
        '⌘.ws/',
        'foo.com/blah_(wikipedia)#cite-1',
        'foo.com/blah_(wikipedia)_blah#cite-1',
        'foo.com/unicode_(✪)_in_parens',
        'foo.com/(something)?after=parens',
        '☺.damowmow.com/',
        'code.google.com/events/#&product=browser',
        'j.mp',
        'foo.bar/baz',
        'foo.bar/?q=Test%20URL-encoded%20stuff',
        '例子.测试',
        'उदाहरण.परीक्षा',
        "-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
        '1337.net',
        'a.b-c.de',
        '223.255.255.254'
    ];

    var invalidEmptyProtocolURIs = [
        'gopher://foo.com/blah_blah',
        'news://foo.com/blah_blah',
        'http:/foo.com/blah_blah/',
        '://foo.com/blah_blah_(wikipedia)',
        'http://http://foo.com/blah_blah_(wikipedia)_(again)'
    ];

    var invalidGlobalURIs = [
        'http://',
        'http://.',
        'http://..',
        'http://../',
        'http://?',
        'http://??',
        'http://??/',
        'http://#',
        'http://##',
        'http://##/',
        'http://foo.bar?q=Spaces should be encoded',
        '//',
        '//a',
        '///a',
        '///',
        'http:///a',
        'foo.com',
        'rdar://1234',
        'h://test',
        'http:// shouldfail.com',
        ':// should fail',
        'http://foo.bar/foo(bar)baz quux',
        'ftps://foo.bar/',
        'http://-error-.invalid/',
        'http://a.b--c.de/',
        'http://-a.b.co',
        'http://a.b-.co',
        'http://.www.foo.bar/',
        'http://www.foo.bar./',
        'http://.www.foo.bar./'
    ];

    var localURIs = [
        'http://intranetsite',
        'http://intranetsite/test',
        'http://intranetsite:80',
        'http://intranetsite:80/test',
        'http://user:pass@intranetsite',
        'http://user:pass@intranetsite/test',
        'http://user:pass@intranetsite:80',
        'http://user:pass@intranetsite:80/test',
        'http://10.1.1.0',
        'http://10.1.1.255',
        'http://10.1.1.1',
        'http://10.1.1.254',
        'http://127.0.0.1',
        'http://192.168.0.1',
        'http://0.0.0.0',
        'http://224.1.1.1',
        'http://1.1.1.1.1',
        'http://123.123.123',
        'http://3628126748'
    ];

    it('Valid URIs (allowLocal=false)', function() {
        var that = this;
        $.each(validGlobalURIs, function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid URIs (allowLocal=false)', function() {
        var that = this;
        $.each(invalidGlobalURIs.concat(localURIs), function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });

    it('Valid URIs (allowLocal=true)', function() {
        var that = this;
        this.fv.updateOption('uri', 'uri', 'allowLocal', true);
        $.each(validGlobalURIs.concat(localURIs), function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid URIs (allowLocal=true)', function() {
        var that = this;
        this.fv.updateOption('uri', 'uri', 'allowLocal', true);
        $.each(invalidGlobalURIs, function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toEqual(false);
        });
    });

    it('Valid URIs (allowEmptyProtocol=true)', function() {
        var that = this;
        this.fv.updateOption('uri', 'uri', 'allowEmptyProtocol', true);
        $.each(validGlobalURIs.concat(validEmptyProtocolURIs), function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toBeTruthy();
        });
    });

    it('Invalid URIs (allowEmptyProtocol=true)', function() {
        var that = this;
        this.fv.updateOption('uri', 'uri', 'allowEmptyProtocol', true);
        $.each(invalidEmptyProtocolURIs, function(index, uri) {
            that.fv.resetForm();
            that.$uri.val(uri);
            that.fv.validate();
            expect(that.fv.isValid()).toBeFalsy();
        });
    });
});

describe('vat', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="vatForm">',
                '<div class="form-group">',
                    '<select class="form-control" name="country">',
                        '<option value="AT">Austria</option>',
                        '<option value="BE">Belgium</option>',
                        '<option value="BG">Bulgaria</option>',
                        '<option value="HR">Croatia</option>',
                        '<option value="CY">Cyprus</option>',
                        '<option value="CZ">Czech Republic</option>',
                        '<option value="DK">Denmark</option>',
                        '<option value="EE">Estonia</option>',
                        '<option value="FI">Finland</option>',
                        '<option value="FR">France</option>',
                        '<option value="DE">Germany</option>',
                        '<option value="GR">Greece</option>',
                        '<option value="HU">Hungary</option>',
                        '<option value="IE">Ireland</option>',
                        '<option value="IS">Iceland</option>',
                        '<option value="IT">Italy</option>',
                        '<option value="LV">Latvia</option>',
                        '<option value="LT">Lithuania</option>',
                        '<option value="LU">Luxembourg</option>',
                        '<option value="MT">Malta</option>',
                        '<option value="NL">Netherlands</option>',
                        '<option value="NO">Norway</option>',
                        '<option value="PL">Poland</option>',
                        '<option value="PT">Portugal</option>',
                        '<option value="RO">Romania</option>',
                        '<option value="RU">Russia</option>',
                        '<option value="RS">Serbia</option>',
                        '<option value="SK">Slovakia</option>',
                        '<option value="SI">Slovenia</option>',
                        '<option value="ES">Spain</option>',
                        '<option value="SE">Sweden</option>',
                        '<option value="CH">Switzerland</option>',
                        '<option value="GB">United Kingdom</option>',
                        '<option value="VE">Venezuela</option>',
                        '<option value="ZA">South Africa</option>',
                    '</select>',
                '</div>',
                '<div class="form-group">',
                    '<input type="text" name="vat" data-fv-vat />',
                '</div>',
            '</form>',
        ].join('\n')).appendTo('body');

        $('#vatForm').formValidation();

        /**
         * @type {BootstrapValidator}
         */
        this.fv       = $('#vatForm').data('formValidation');
        this.$country = this.fv.getFieldElements('country');
        this.$vat     = this.fv.getFieldElements('vat');
    });

    afterEach(function() {
        $('#vatForm').formValidation('destroy').remove();
    });

    it('dynamic country', function() {
        this.$vat.attr('data-fv-vat-country', 'country');
        this.fv.destroy();
        this.fv = $('#vatForm').formValidation().data('formValidation');

        this.$country.val('AT');
        this.$vat.val('ATU13585627');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$country.val('BG');
        this.$vat.val('BE0428759497');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$country.val('BE');
        this.$vat.val('BE431150351');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Austrian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'AT');

        // Valid samples
        var validSamples = ['ATU13585627', 'U13585627'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['ATU13585626', 'U13585626'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Belgian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'BE');

        // Valid samples
        var validSamples = ['BE0428759497', '0428759497'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['BE431150351', '431150351'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Bulgarian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'BG');

        // Valid samples
        var validSamples = ['BG175074752', 'BG7523169263', 'BG8032056031', 'BG7542011030', 'BG7111042925', '175074752', '7523169263', '8032056031'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['BG175074753', 'BG7552A10004', 'BG7111042922', '175074753', '7552A10004'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Cypriot VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'CY');

        // Valid samples
        var validSamples = ['CY10259033P', '10259033P'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['CY10259033Z', '10259033Z'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Czech Republic VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'CZ');

        // Valid samples
        var validSamples = ['CZ25123891', 'CZ7103192745', 'CZ991231123', 'CZ640903926', '25123891', '7103192745'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['CZ25123890', 'CZ1103492745', 'CZ590312123', '25123890', '1103492745'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('German VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'DE');

        // Valid samples
        var validSamples = ['DE136695976', '136695976'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['DE136695978', '136695978'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Danish VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'DK');

        // Valid samples
        var validSamples = ['DK13585628', '13585628'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['DK13585627', '13585627'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Estonian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'EE');

        // Valid samples
        var validSamples = ['EE100931558', 'EE100594102', '100931558', '100594102'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['EE100594103', '100594103'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Spanish VAT number (NIF)', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'ES');

        // Valid samples
        var validSamples = [
            'ES54362315K', 'ESX2482300W', 'ESX5253868R', 'ESM1234567L', 'ESJ99216582', 'ESB58378431',
            'ESB64717838', '54362315K', 'X2482300W', 'X5253868R', 'M1234567L', 'J99216582',
            'ESR5000274J', 'ESQ5000274J', 'ESB78640570', 'ES50222711A'
        ];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['ES54362315Z', 'ESX2482300A', 'ESJ99216583', '54362315Z', 'X2482300A'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Finnish VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'FI');

        // Valid samples
        var validSamples = ['FI20774740', '20774740'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['FI20774741', '20774741'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('French VAT number (TVA)', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'FR');

        // Valid samples
        var validSamples = ['FR40303265045', 'FR23334175221', 'FRK7399859412', 'FR4Z123456782', '40303265045', '23334175221', 'K7399859412'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['FR84323140391', '84323140391'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('United Kingdom VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'GB');

        // Valid samples
        var validSamples = ['GB980780684', '980780684'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['GB802311781', '802311781'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Greek VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'GR');

        // Valid samples
        var validSamples = ['GR023456780', 'EL094259216', '023456780', '094259216'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['GR123456781', '123456781'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Hungarian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'HU');

        // Valid samples
        var validSamples = ['HU12892312', '12892312'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['HU12892313', '12892313'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Croatian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'HR');

        // Valid samples
        var validSamples = ['HR33392005961', '33392005961'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['HR33392005962', '33392005962'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Irish VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'IE');

        // Valid samples
        var validSamples = ['IE6433435F', 'IE6433435OA', 'IE8D79739I', '6433435F', '6433435OA', '8D79739I'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['IE8D79738J', '8D79738J'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Iceland VAT (VSK) number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'IS');

        // Valid samples
        var validSamples = ['IS11111', 'IS111111', '11111', '111111'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['IS1234567', 'IS123456ABC', '1234567', '123456ABC'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Italian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'IT');

        // Valid samples
        var validSamples = ['IT00743110157', '00743110157'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['IT00743110158', '00743110158'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Lithuanian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'LT');

        // Valid samples
        var validSamples = ['LT119511515', 'LT100001919017', 'LT100004801610', '119511515', '100001919017', '100004801610'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['LT100001919018', '100001919018'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Luxembourg VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'LU');

        // Valid samples
        var validSamples = ['LU15027442', '15027442'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['LU15027443', '15027443'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Latvian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'LV');

        // Valid samples
        var validSamples = ['LV40003521600', 'LV16117519997', '40003521600', '16117519997'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['LV40003521601', 'LV16137519997', '40003521601', '16137519997'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Maltese VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'MT');

        // Valid samples
        var validSamples = ['MT11679112', '11679112'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['MT11679113', '11679113'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Dutch VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'NL');

        // Valid samples
        var validSamples = ['NL004495445B01', '004495445B01'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['NL123456789B90', '123456789B90'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Polish VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'PL');

        // Valid samples
        var validSamples = ['PL8567346215', '8567346215'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['PL8567346216', '8567346216'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Portuguese VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'PT');

        // Valid samples
        var validSamples = ['PT501964843', '501964843'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['PT501964842', '501964842'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Romanian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'RO');

        // Valid samples
        var validSamples = ['RO18547290', '18547290'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['RO18547291', '18547291'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Russian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'RU');

        // Valid samples
        var validSamples = ['RU7805145876', 'RU781300557475', '7805145876', '781300557475'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['RU7805145877', 'RU781300557474', '7805145877', '781300557474'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Swedish VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'SE');

        // Valid samples
        var validSamples = ['SE123456789701', '123456789701'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['SE123456789101', '123456789101'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Slovenian VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'SI');

        // Valid samples
        var validSamples = ['SI50223054', '50223054'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['SI50223055', '50223055', 'SI09999990', '09999990'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Slovak VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'SK');

        // Valid samples
        var validSamples = ['SK2022749619', '2022749619'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['SK2022749618', '2022749618'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('South African VAT number', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'ZA');

        // Valid samples
        var validSamples = ['ZA4012345678', '4012345678'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['ZA40123456789', 'ZA0123456789', '40123456789', '0123456789'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Venezuelan VAT number (RIF)', function() {
        this.fv.updateOption('vat', 'vat', 'country', 'VE');

        // Valid samples
        var validSamples = ['VEJ309272292', 'VEV242818101', 'VEJ000126518', 'VEJ000458324', 'J309272292', 'V242818101', 'J000126518', 'J000458324'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$vat.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['VEJ309272293', 'VEV242818100', 'J000126519', 'J000458323'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$vat.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
});

function getCountryCode(value, validator, $field) {
    $('#msg').html('getCountryCode() called');
    return validator.getFieldElements('country').val();
};

TestSuite = $.extend({}, TestSuite, {
    ZipCode: {
        getCountryCode: function(value, validator, $field) {
            $('#msg').html('TestSuite.ZipCode.getCountryCode() called');
            return validator.getFieldElements('country').val();
        }
    }
});

describe('zipCode', function() {
    beforeEach(function() {
        $([
            '<form class="form-horizontal" id="zipCodeForm">',
                '<div id="msg"></div>',
                '<div class="form-group">',
                    '<label class="col-md-3 control-label">Country:</label>',
                    '<div class="col-md-2">',
                        '<select class="form-control" name="country">',
                            '<option value="">Select a country</option>',
                            '<option value="CA">Canada</option>',
                            '<option value="CZ">Czech Republic</option>',
                            '<option value="DK">Denmark</option>',
                            '<option value="ES">Spain</option>',
                            '<option value="FR">France</option>',
                            '<option value="GB">United Kingdom</option>',
                            '<option value="IE">Ireland</option>',
                            '<option value="IN">India</option>',
                            '<option value="IT">Italy</option>',
                            '<option value="NL">Netherlands</option>',
                            '<option value="PL">Poland</option>',
                            '<option value="PT">Portugal</option>',
                            '<option value="SE">Sweden</option>',
                            '<option value="SK">Slovakia</option>',
                            '<option value="US">United States</option>',
                        '</select>',
                    '</div>',
                '</div>',
                '<div class="form-group">',
                    '<label class="col-md-3 control-label">Zipcode</label>',
                    '<div class="col-md-2">',
                        '<input type="text" class="form-control" name="zc" data-fv-zipcode data-fv-zipcode-country="US" />',
                    '</div>',
                '</div>',
            '</form>'
        ].join('\n')).appendTo('body');

        $('#zipCodeForm').formValidation();

        /**
         * @type {BootstrapValidator}
         */
        this.fv       = $('#zipCodeForm').data('formValidation');

        this.$country = this.fv.getFieldElements('country');
        this.$zipCode = this.fv.getFieldElements('zc');
    });

    afterEach(function() {
        $('#zipCodeForm').formValidation('destroy').remove();
    });

    it('country code updateOption()', function() {
        // Check IT postal code
        this.fv.updateOption('zc', 'zipCode', 'country', 'IT');
        this.$zipCode.val('1234');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$zipCode.val('IT-12345');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        // Check United Kingdom postal code
        this.fv.updateOption('zc', 'zipCode', 'country', 'GB');
        var validUkSamples = ['EC1A 1BB', 'W1A 1HQ', 'M1 1AA', 'B33 8TH', 'CR2 6XH', 'DN55 1PT', 'AI-2640', 'ASCN 1ZZ', 'GIR 0AA'];

        for (var i in validUkSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validUkSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
    });

    it('country code other field declarative', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'country');

        // Need to destroy the plugin instance ...
        $('#zipCodeForm').formValidation('destroy');

        // ... and re-create it
        this.fv = $('#zipCodeForm').formValidation().data('formValidation');
        this.$country.val('IT');

        this.fv.resetForm();
        this.$zipCode.val('1234');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$zipCode.val('I-12345');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('country code callback declarative function', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'getCountryCode');
        $('#zipCodeForm').formValidation('destroy');
        this.fv = $('#zipCodeForm').formValidation().data('formValidation');
        this.$country.val('NL');
        this.$zipCode.val('0123');
        this.fv.validate();
        expect($('#msg').html()).toEqual('getCountryCode() called');
        expect(this.fv.isValid()).toEqual(false);
    });

    it('country code callback declarative function()', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'getCountryCode()');
        $('#zipCodeForm').formValidation('destroy');
        this.fv = $('#zipCodeForm').formValidation().data('formValidation');
        this.$country.val('NL');
        this.$zipCode.val('1234 ab');
        this.fv.validate();
        expect($('#msg').html()).toEqual('getCountryCode() called');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('country code callback declarative A.B.C', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'TestSuite.ZipCode.getCountryCode');
        $('#zipCodeForm').formValidation('destroy');
        this.fv = $('#zipCodeForm').formValidation().data('formValidation');
        this.$country.val('DK');
        this.$zipCode.val('DK 123');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.ZipCode.getCountryCode() called');
        expect(this.fv.isValid()).toEqual(false);
    });

    it('country code callback declarative A.B.C()', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'TestSuite.ZipCode.getCountryCode()');
        $('#zipCodeForm').formValidation('destroy');
        this.fv = $('#zipCodeForm').formValidation().data('formValidation');
        this.$country.val('DK');
        this.$zipCode.val('DK-1234');
        this.fv.validate();
        expect($('#msg').html()).toEqual('TestSuite.ZipCode.getCountryCode() called');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('country code callback programmatically', function() {
        this.$zipCode.removeAttr('data-fv-zipcode-country');
        $('#zipCodeForm').formValidation('destroy');
        this.fv = $('#zipCodeForm')
                        .formValidation({
                            fields: {
                                zc: {
                                    validators: {
                                        zipCode: {
                                            country: function(value, validator, $field) {
                                                return getCountryCode(value, validator, $field);
                                            }
                                        }
                                    }
                                }
                            }
                        })
                        .data('formValidation');
        this.$country.val('SE');

        this.fv.resetForm();
        this.$zipCode.val('S-567 8');
        this.fv.validate();
        expect($('#msg').html()).toEqual('getCountryCode() called');
        expect(this.fv.isValid()).toEqual(false);

        this.fv.resetForm();
        this.$zipCode.val('S-12345');
        this.fv.validate();
        expect($('#msg').html()).toEqual('getCountryCode() called');
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('not supported country code', function() {
        this.$zipCode.attr('data-fv-zipcode-country', 'NOT_SUPPORTED');

        $('#zipCodeForm').formValidation('destroy');

        this.fv = $('#zipCodeForm').formValidation().data('formValidation');

        this.fv.resetForm();
        this.$zipCode.val('1234');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();
    });

    it('US zipcode', function() {
        this.$zipCode.val('12345');
        this.fv.validate();
        expect(this.fv.isValid()).toBeTruthy();

        this.fv.resetForm();
        this.$zipCode.val('123');
        this.fv.validate();
        expect(this.fv.isValid()).toEqual(false);
    });

    it('Czech Republic postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'CZ');

        // Valid samples
        var validSamples = ['12345', '123 45'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['12 345', '123456', '1 2345', '1234 5', '12 3 45'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Slovakia postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'SK');

        // Valid samples
        var validSamples = ['12345', '123 45'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['12 345', '123456', '1 2345', '1234 5', '12 3 45'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('France postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'FR');

        // Valid samples
        var validSamples = ['12340', '01230', '75116'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['123 45', '12 345', '123456', '1 2345', '1234 5', '12 3 45', '1234A'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Eircode (Ireland postal code)', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'IE');

        // Valid samples
        var validSamples = ['A65 F4E2', 'D6W FNT4', 'T37 F8HK'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['a65 f4e2', 'D6W FNTO', 'T37F8HK'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
    
    it('Poland postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'PL');

        // Valid samples
        var validSamples = ['02-920', '00-002', '77-400'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['03456', '000-02', 'AB-002', '12 345'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Portugal postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'PT');

        // Valid samples
        var validSamples = ['2435-459', '1000-000', '1234-456'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['0123-456', '1234456', '1234-ABC', '1234 456'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Austria postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'AT');

        // Valid samples
        var validSamples = ['6020', '1010', '4853'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['0020', '12345', '102', '12AB', 'AT 6020 XY'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Germany postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'DE');

        // Valid samples
        var validSamples = ['52238', '01001', '09107'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['01000', '99999', '102', 'ABCDE', 'DE 52240 XY'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('India postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'IN');

        // Valid samples
        var validSamples = ['226024', '456001', '571 120'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }
        
        // Invalid samples
        var invalidSamples = ['01000', '99999', '226-024', 'A226021'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
    
    it('Switzerland postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'CH');

        // Valid samples
        var validSamples = ['8280', '8090', '8238', '9490'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['0123', '99999', '102', 'ABCD', 'CH-5224 XY'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });

    it('Spain postal code', function() {
        this.fv.updateOption('zc', 'zipCode', 'country', 'ES');

        // Valid samples
        var validSamples = ['01234', '28080', '29004', '41023'];
        for (var i in validSamples) {
            this.fv.resetForm();
            this.$zipCode.val(validSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toBeTruthy();
        }

        // Invalid samples
        var invalidSamples = ['0123', '99999', '102', 'ABCD', '00000'];
        for (i in invalidSamples) {
            this.fv.resetForm();
            this.$zipCode.val(invalidSamples[i]);
            this.fv.validate();
            expect(this.fv.isValid()).toEqual(false);
        }
    });
});
