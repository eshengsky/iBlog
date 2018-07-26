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
