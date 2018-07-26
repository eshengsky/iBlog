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
