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
